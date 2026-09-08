import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { UserRoleName } from '@hospital/shared-types';
import { prisma } from '../lib/prisma.js';
import { httpError } from '../lib/http-error.js';
import { writeAudit } from './audit.service.js';
import type { LoginInput, RefreshInput, RegisterInput } from '../schemas/auth.schemas.ts';

// TTL tính bằng giây (tránh lỗi type của jsonwebtoken khi dùng chuỗi '15m' qua biến env)
const ACCESS_TTL = Number(process.env.JWT_ACCESS_TTL ?? 900); // 15 phút
const REFRESH_TTL = Number(process.env.JWT_REFRESH_TTL ?? 604800); // 7 ngày

function requireSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw httpError(500, 'Missing JWT secret in environment variables');
  return secret;
}

function signPair(user: { id: string; email: string; roles: UserRoleName[] }) {
  const secret = requireSecret();
  const accessToken = jwt.sign({ ...user, sub: user.id, tokenType: 'access' }, secret, {
    expiresIn: ACCESS_TTL,
  });
  const refreshToken = jwt.sign({ ...user, sub: user.id, tokenType: 'refresh' }, secret, {
    expiresIn: REFRESH_TTL,
  });
  return { accessToken, refreshToken };
}

export async function register(input: RegisterInput) {
  const existed = await prisma.user.findUnique({ where: { email: input.email } });
  if (existed) throw httpError(409, 'Email has already been registered. Please use a different email.');

  let role = await prisma.role.findFirst({ where: { name: 'PATIENT' } });
  if (!role) role = await prisma.role.create({ data: { name: 'PATIENT' } });

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash: await bcrypt.hash(input.password, 10),
      roles: { create: [{ roleId: role.id }] },
    },
  });

  await writeAudit({ userId: user.id, action: 'CREATE', resourceType: 'USER', resourceId: user.id });

  const roles: UserRoleName[] = ['PATIENT'];
  return { user: { id: user.id, email: user.email, roles }, ...signPair({ id: user.id, email: user.email, roles }) };
}

export async function login(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
    include: { roles: { include: { role: true } } },
  });
  if (!user) throw httpError(401, 'Email or password is incorrect. Please check your credentials and try again.');
  if (user.status !== 'ACTIVE') throw httpError(403, 'Account is locked. Please contact administrator.');
  if (!user.passwordHash)
    throw httpError(401, 'This account is registered via Google/Facebook. Please use the corresponding login button.');

  if (!(await bcrypt.compare(input.password, user.passwordHash)))
    throw httpError(401, 'Email or password is incorrect. Please check your credentials and try again.');

  const roles = user.roles.map((ur) => ur.role.name as UserRoleName);
  await writeAudit({ userId: user.id, action: 'LOGIN', resourceType: 'USER', resourceId: user.id });
  return { user: { id: user.id, email: user.email, roles }, ...signPair({ id: user.id, email: user.email, roles }) };
}

export async function refresh(input: RefreshInput) {
  let payload: any;
  try {
    payload = jwt.verify(input.refreshToken, requireSecret());
  } catch {
    throw httpError(401, 'Refresh token is expired or invalid. Please log in again.');
  }
  if (payload?.tokenType !== 'refresh' || !payload?.sub)
    throw httpError(401, 'Token is not a valid refresh token. Please log in again.');

  const user = await prisma.user.findUnique({
    where: { id: payload.sub },
    include: { roles: { include: { role: true } } },
  });
  if (!user || user.status !== 'ACTIVE')
    throw httpError(401, 'Account is no longer valid. Please log in again.');

  const roles = user.roles.map((ur) => ur.role.name as UserRoleName);
  return { user: { id: user.id, email: user.email, roles }, ...signPair({ id: user.id, email: user.email, roles }) };
}
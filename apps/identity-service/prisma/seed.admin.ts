/// <reference types="node" />

import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma.js';

const ADMIN_EMAIL = 'admin@hospital.local';
const ADMIN_PASSWORD = 'Admin@123';
const ROLES = ['PATIENT', 'DOCTOR', 'NURSE', 'PHARMACIST', 'ADMIN'];

async function main() {
  for (const name of ROLES) {
    await prisma.role.upsert({ where: { name }, update: {}, create: { name } });
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 10);
  const admin = await prisma.user.upsert({
    where: { email: ADMIN_EMAIL },
    update: { passwordHash, status: 'ACTIVE' },
    create: { email: ADMIN_EMAIL, passwordHash, status: 'ACTIVE' },
  });

  // Reset roles về đúng [ADMIN] (chạy lại cũng không phình thêm)
  const adminRole = await prisma.role.findUniqueOrThrow({ where: { name: 'ADMIN' } });
  await prisma.userRole.deleteMany({ where: { userId: admin.id } });
  await prisma.userRole.create({ data: { userId: admin.id, roleId: adminRole.id } });

  console.log(`Admin seed xong — đăng nhập: ${ADMIN_EMAIL} / ${ADMIN_PASSWORD}`);
}

main()
  .catch((e) => {
    console.error(e);
    throw e;
  })
  .finally(() => prisma.$disconnect());
import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '@hospital/shared-types';

interface AccessTokenPayload extends JwtPayload {
    tokenType?: string;
};

function unauthorized(res: Response, message: string): void {
    res.status(401).json({ 
        type: 'about:blank',
        title: 'Unauthorized',
        status: 401,
        detail: message,
    });
}

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        unauthorized(res, 'Missing or invalid Authorization header');
        return;
    }
    try {
        const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET as string) as AccessTokenPayload;
        if (payload.tokenType !== 'access' || !payload.sub) {
            unauthorized(res, 'Invalid token type or missing user information');
            return;
        }
        req.user = { 
            id: payload.sub,
            email: payload.email,
            roles: payload.roles,
        };
        next();
    } catch (error) {
        unauthorized(res, 'Invalid or expired token');
    }
}
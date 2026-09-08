import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { JwtPayload } from '@hospital/shared-types';

export function authMiddleware(req: Request, res: Response, next: NextFunction): void {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        res.status(401).json({ 
            type: 'about:blank',
            title: 'Unauthorized',
            status: 401,
            detail: 'Missing or invalid Authorization header',
        });
        return;
    }
    try {
        const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET as string) as JwtPayload;
        req.user = { 
            id: payload.sub,
            email: payload.email,
            roles: payload.roles,
        };
        next();
    } catch (error) {
        res.status(401).json({ 
            type: 'about:blank',
            title: 'Unauthorized',
            status: 401,
            detail: 'Invalid or expired token',
        });
    }
}
import type { UserRoleName } from "@hospital/shared-types";

declare global {
    namespace Express {
        interface Request {
            user?: {
                id: string;
                email: string;
                roles: UserRoleName[];
            };
        }
    }
}
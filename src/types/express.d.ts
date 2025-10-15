import { UserDocument } from "../models/user";

declare global {
    namespace Express {
        interface Request {
            user?: UserDocument; // Example: adding a 'user' property
        }
    }
}
import brcypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { type UserDocument } from "../models/user.ts";
import { inngest } from "../inngest/client.ts";
import type { Request, Response } from 'express';

export class UserController {
    public async signup(req: Request, res: Response): Promise<void> {

    }
}
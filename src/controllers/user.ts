import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User, { type UserDocument } from "../models/user.ts";
import { inngest } from "../inngest/client.ts";
import type { Request, Response } from 'express';

export class UserController {

    //Create the User -> trigger any sign up events -> get the JWT token for on going com's 
    public async signup(req: Request, res: Response) {
        const { email, password, skills = [] } = req.body;

        try {
            const hashed = bcrypt.hash(password, 10);
            const user = await User.create({ email, password: hashed, skills });

            await inngest.send({
                name: "user/signup",
                data: { email }
            });

            const token = jwt.sign({ _id: user.email, role: user.role }, process.env.JWT_SECRET!);

            res.json({ user, token });

        } catch (error) {
            res.status(500).json({
                error: "Signup Failed!",
                details: error
            });
        }
    }

    //Get the user info -> compare credentials -> get JWT token based on user info. 
    public async login(req: Request, res: Response) {
        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email }) as UserDocument;
            if (!user)
                return res.status(404).json({ error: "User Not Found!" });

            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid Credential!" });
            }

            const token = jwt.sign({ _id: user.email, role: user.role }, process.env.JWT_SECRET!);

            res.json({ user, token });

        } catch (error) {
            res.status(500).json({
                error: "Login Failed!",
                details: error
            });
        }
    }

    //Get the user token -> check validity -> remove from DB.
    public async logout(req: Request, res: Response) {
        try {
            const token = req.headers.authorization?.split(" ")[1];

            if (!token)
                return res.status(401).json({ error: "Un-Authorized!" });

            jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
                if (err)
                    return res.status(401).json({ error: "Un-Authorized!" });
            });

            //Revoke or remove from DB.

            res.json({ message: "Logged out!" });
        } catch (error) {
            res.status(500).json({
                error: "Log out Failed!",
                details: error
            });
        }
    }

    public async updateUser(req: Request, res: Response) {
        const { skills = [], role, email } = req.body;

        try {
            if (role !== 'admin')
                return res.status(403).json({ error: "Forbidden!" });

            const user = await User.findOne({ email });
            if (!user)
                return res.status(404).json({ error: "User Not Found!" });

            await User.updateOne(
                { email },
                { skills: skills.length ? skills : user.skills, role },
            );

            return res.json({ message: "User Updated Successfully!" });

        } catch (error) {
            res.status(500).json({
                error: "User Update Failed!",
                details: error
            });
        }
    }

    public async getUsers(req: Request, res: Response) {
        const { role } = req.body;

        try {
            if (role !== 'admin')
                return res.status(403).json({ error: "Forbidden!" });

            const users = await User.find().select("-password");
            return res.json(users);

        } catch (error) {
            res.status(500).json({
                error: "Get Users Failed!",
                details: error
            });
        }
    }
}
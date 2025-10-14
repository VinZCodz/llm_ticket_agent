import mongoose, { type InferSchemaType } from "mongoose"

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: "user", enum: ["user", "admin", "moderator"] },
    skills: [String],
    createdAt: { type: Date, default: Date.now }
})
export type UserDocument = InferSchemaType<typeof userSchema>;

export default mongoose.model<UserDocument>("User", userSchema)
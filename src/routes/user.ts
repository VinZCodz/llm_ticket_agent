import express from 'express';
import {UserController} from "../controllers/user.ts"
import {authenticate} from "../middlewares/auth.ts"

const router=express.Router();

const userController=new UserController();

router.post("/signup", userController.signup);
router.post("/login", userController.login);
router.post("/logout", userController.logout);

router.post("/getUsers", authenticate, userController.getUsers);
router.post("/updateUser", authenticate, userController.updateUser);

export default router;
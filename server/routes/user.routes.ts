import express from 'express'
import { activationUser, loginuUser, logoutUser, registrationUser } from '../controller/user.controller'
const userRouter = express.Router();

userRouter.post('/registration',registrationUser);
userRouter.post('/activate-user',activationUser);
userRouter.post('/login',loginuUser);
userRouter.post('/logout',logoutUser);

export default userRouter;
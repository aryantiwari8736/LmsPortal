import express from 'express'
import { activationUser, getUserInfo, loginuUser, logoutUser, registrationUser, socialAuth, updateAccessToken, updateUserInfo } from '../controller/user.controller'
import { isAuthenticated } from '../middlewares/auth';
const userRouter = express.Router();
//routes  - 
userRouter.post('/registration',registrationUser);
userRouter.post('/activate-user',activationUser);
userRouter.post('/login',loginuUser);
userRouter.get('/logout',isAuthenticated,logoutUser);
userRouter.post('/refresh',updateAccessToken);
userRouter.post('/me',isAuthenticated,getUserInfo);
userRouter.post('/socailauth',socialAuth);
userRouter.post('/userinfo',updateUserInfo);

export default userRouter;
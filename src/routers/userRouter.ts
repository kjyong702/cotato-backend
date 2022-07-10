import express from 'express';
import { login, signup, findName, initPassword } from '@controllers/userController';
import { publicOnlyMiddleware } from 'middlewares';

const userRouter = express.Router();

userRouter.route('/signup').all(publicOnlyMiddleware).post(signup); // 회원가입
userRouter.route('/login').all(publicOnlyMiddleware).post(login); // 로그인
userRouter.route('/findID').all(publicOnlyMiddleware).get(findName);//아이디찾기
userRouter.route('/initPassword').all(publicOnlyMiddleware).patch(initPassword);//비밀번호 초기화

export default userRouter;

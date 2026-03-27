import { Router } from "express";
import authRouter from "../module/auth/auth.routes";
import MoodRouter from "../module/Mood/Mood.routes";
import CommunityRouter from "../module/Community/Community.routes";
import userRouter from "../module/User/User.routes";
import settingsRouter from "../module/Settings/Settings.routes";
import ExpertRouter from "../module/Expert/Expert.routes";
import ChatRouter from "../module/Chat/Chat.routes";

const allRouter = Router();


const moduleRoutes = [
    {
        path: '/auth',
        router: authRouter,
    },
    {
        path: '/profile',
        router: userRouter,
    },
    {
        path: '/mood',
        router: MoodRouter,
    },
    {
        path: '/community',
        router: CommunityRouter,
    },
    {
        path: '/expert',
        router: ExpertRouter,
    },
    {
        path: '/settings',
        router: settingsRouter,
    },
    {
        path: '/chat',
        router: ChatRouter,
    },
    
];

moduleRoutes.forEach((route) => allRouter.use(route.path, route.router));

export default allRouter;
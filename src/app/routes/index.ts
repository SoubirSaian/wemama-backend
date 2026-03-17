import { Router } from "express";
import authRouter from "../module/auth/auth.routes";
import MoodRouter from "../module/Mood/Mood.routes";
import CommunityRouter from "../module/Community/Community.routes";
import userRouter from "../module/User/User.routes";
import settingsRouter from "../module/Settings/Settings.routes";

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
        path: '/settings',
        router: settingsRouter,
    },
    
];

moduleRoutes.forEach((route) => allRouter.use(route.path, route.router));

export default allRouter;
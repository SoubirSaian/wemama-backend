import { Router } from "express";
import authRouter from "../module/auth/auth.routes";
import MoodRouter from "../module/Mood/Mood.routes";
import CommunityRouter from "../module/Community/Community.routes";

const allRouter = Router();


const moduleRoutes = [
    {
        path: '/auth',
        router: authRouter,
    },
    {
        path: '/mood',
        router: MoodRouter,
    },
    {
        path: '/community',
        router: CommunityRouter,
    },
    
];

moduleRoutes.forEach((route) => allRouter.use(route.path, route.router));

export default allRouter;
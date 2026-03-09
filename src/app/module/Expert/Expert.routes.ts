import express from "express";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import ExpertValidations from "./Expert.validation";
import ExpertController from "./Expert.controller";


const ExpertRouter = express.Router();



export default ExpertRouter;
import { Router } from "express";
import authRouter from "../modules/auth/auth.routes";
import tasksRouter from "../modules/tasks/tasks.routes";

const v1Router = Router();

v1Router.use("/auth", authRouter);
v1Router.use("/tasks", tasksRouter);

export default v1Router;

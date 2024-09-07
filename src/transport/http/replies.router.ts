import { Router } from "express";
import { replies as controller } from "../../controllers";
import { jwtMiddleware } from "../../middleware/jwt-auth.middleware";

export const repliesRouter = Router();

repliesRouter.get("/:threadId", controller.list);
repliesRouter.post("/", jwtMiddleware, controller.create);
repliesRouter.patch("/:id", jwtMiddleware, controller.update);

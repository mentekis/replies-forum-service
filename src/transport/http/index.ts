import { Router, Application } from "express";
import { repliesRouter } from "./replies.router";

export function newRouter(app: Application) {
    // Define all route for v1
    const superGroup = Router();

    // Bind versioning to global path
    // This will resulted "baseURL/api/v1/path"
    app.use(createBasePath("v1"), superGroup);

    // Bind all handler to superGroup
    superGroup.use("/", repliesRouter)
}

// ==== Helper Function ====== //
function createBasePath(version: string): string {
    return `/api/${version}`;
}
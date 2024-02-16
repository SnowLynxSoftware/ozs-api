import { Router } from "express";

export class BaseRouter {
    public BasePath: string;

    public Router: Router;

    constructor(basePath: string) {
        this.BasePath = basePath;
        this.Router = Router();
    }
}

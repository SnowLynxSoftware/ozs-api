import express from "express";
import { singleton } from "tsyringe";
import { InitService } from "./services/init.service";

@singleton()
export class AppServer {
    private readonly _app: express.Application;

    constructor(private readonly _initService: InitService) {
        this._app = express();
        this._initService.PreInit(this._app);
    }

    public async Start() {
        await this._initService.Init(this._app);
        return this._app.listen(3000);
    }
}

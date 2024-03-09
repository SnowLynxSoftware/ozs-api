import express from "express";
import { singleton } from "tsyringe";
import { InitService } from "./services/init.service";
import { NodeEnv } from "./models/enums/node-env.enum";

@singleton()
export class AppServer {
    private readonly _app: express.Application;

    constructor(private readonly _initService: InitService) {
        this._app = express();
        this._initService.PreInit(this._app);
    }

    public async Start(nodeEnv: NodeEnv) {
        await this._initService.Init(this._app);
        console.log(nodeEnv);
        return this._app.listen(nodeEnv === NodeEnv.TESTS ? Math.floor(Math.random() * (4000 - 3000) + 3000) : 3000);
    }
}

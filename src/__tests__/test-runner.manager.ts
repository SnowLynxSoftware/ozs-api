import * as http from "http";
import { HealthRouterSpec } from "./specs/health-router.spec";
import { AuthRouterSpec } from "./specs/auth-router.spec";

export class TestRunnerManager {

     private _httpServer: http.Server;

     constructor(httpServer: http.Server) {
         this._httpServer = httpServer;
     }

     public async RunTests(): Promise<void> {
         await HealthRouterSpec.RunTests(this._httpServer);
         const accessToken = await AuthRouterSpec.RunTests(this._httpServer);
         console.log(accessToken ? "" : "");
     }


}
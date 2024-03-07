import request from "supertest";
import * as http from "http";
import assert from "node:assert";

export class AuthRouterSpec {

    public static async RunTests(httpServer: http.Server): Promise<string> {

        console.log("[SPEC] Testing AuthRouter...");
        const accessToken = await AuthRouterSpec._testUserLogin(httpServer);
        await AuthRouterSpec._getUserTokenInfo(httpServer, accessToken);

        return accessToken;
    }

    private static async _testUserLogin(httpServer: http.Server) {
        let accessToken = "";
        await request(httpServer)
            .post('/auth/login')
            .set('Authorization', 'Basic xxx')
            .then(response => {
                const data = response.body;
                assert.notEqual(data.accessToken, "");
                assert.notEqual(data.accessToken, undefined);
                assert.notEqual(data.accessToken, null);
                accessToken = data.accessToken;
            });
        return accessToken;
    }

    private static async _getUserTokenInfo(httpServer: http.Server, accessToken: string) {
        await request(httpServer)
            .get('/auth/token')
            .set('Authorization', 'Bearer ' + accessToken)
            .then(response => {
                const data = response.body;
                assert.equal(data.email, "xxx");
            });
    }

}
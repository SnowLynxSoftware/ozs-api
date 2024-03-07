import request from "supertest";
import * as http from "http";
import assert from "node:assert";

export class HealthRouterSpec {

    public static async RunTests(httpServer: http.Server): Promise<void> {

        console.log("[SPEC] Testing HealthRouter...");
        await HealthRouterSpec._testHealthCheck(httpServer);

    }

    private static async _testHealthCheck(httpServer: http.Server) {
        request(httpServer, {})
            .get('/health')
            .then(response => {
                assert.equal(response.text, "ok");
            });
    }

}
import { afterAll, beforeAll, describe, expect, test } from '@jest/globals';
import request from "supertest";
import * as http from "http";
import { setup, tearDown } from "../setup";

describe('Auth Router', () => {

    let _app: http.Server;
    let _testDBName: string;

    beforeAll(() => {
        return new Promise(async (resolve: any, _reject: any) => {
            const _setupOptions = await setup();
            _app = _setupOptions.httpServer;
            _testDBName = _setupOptions.testDBName;
            resolve();
        });
    });

    afterAll(() => {
        _app.closeAllConnections();
        _app.close();
        return tearDown(_testDBName);
    });

    test('User Login Test', async () => {
        const response = await request(_app)
            .post('/auth/login')
            .set('Authorization', 'Basic xxx');

        const accessToken = response.body.accessToken;

        expect(accessToken).not.toBeNull();

        const tokenResponse = await request(_app)
            .get('/auth/token')
            .set('Authorization', 'Bearer ' + accessToken)

        expect(tokenResponse.body.id).not.toBeNull();
    });
});
import { GetUserResponseBody } from '../model/get/GetUserResponseBody';
import { MetergramClient } from "../http/MetergramClient";
import {describe, expect, test} from '@jest/globals';
import {GetListUsersResponseBody} from "../model/get/GetListUsersResponseBody";
import {CreateUserRequest} from "../model/post/CreateUserRequest";


describe('TestCasesTests', () => {
    let metergramClient: MetergramClient;

    beforeEach(() => {
        metergramClient = new MetergramClient();
    });


    test('GetUserByID', async () => {
        const responseEntity = await metergramClient.getUserById(3);
        const user: GetUserResponseBody = responseEntity.data;
        expect(user.data.id).toEqual(3)
        expect(user.data.email).toEqual("emma.wong@reqres.in")
    });

    test ('GetUserByIDFail', async () => {
        const responseEntity = await metergramClient.getUserById(1);
        const user: GetUserResponseBody = responseEntity.data;
        expect(user.data.id).toEqual(1)
        expect(user.data.email).toEqual("george.bluth@reqres.in")
    });

    test('NotFoundError', async () => {
        const responseEntity = await metergramClient.getUserById(23);
        const status: GetUserResponseBody = responseEntity.status;
        const statusText: GetUserResponseBody = responseEntity.statusText
        expect(statusText).toEqual('Not Found');
        expect(status).toEqual(404)
    });

    test('Get List Users', async () => {
        const responseEntity = await metergramClient.getListUsers(1, 10);
        const userList: GetListUsersResponseBody = responseEntity.data;

        expect(responseEntity.status).toEqual(200);
        expect(userList.page).toEqual(1);
        expect(userList.per_page).toEqual(10);
        expect(userList.total).toBeGreaterThanOrEqual(10);
        expect(userList.total_pages).toBeGreaterThanOrEqual(1);
    });

    test('Get Users Page 0 Per Page 0', async () => {
        const responseEntity = await metergramClient.getListUsers(0, 0);
        const userList: GetListUsersResponseBody = responseEntity.data;

        expect(responseEntity.status).toEqual(200);
        expect(userList.page).toEqual(1);
        expect(userList.per_page).toEqual(6);
        expect(userList.total).toEqual(12);
        expect(userList.total_pages).toEqual(2);

        const firstUser = userList.data[0];
        expect(firstUser.id).toEqual(1);
        expect(firstUser.email).toEqual('george.bluth@reqres.in');
        expect(firstUser.first_name).toEqual('George');
        expect(firstUser.last_name).toEqual('Bluth');
    });

    test('Pagination Test - Page 2, Per Page 10', async () => {
        const page = 2;
        const perPage = 10;
        const responseEntity = await metergramClient.getListUsers(page, perPage);
        const userList: GetListUsersResponseBody = responseEntity.data;

        expect(responseEntity.status).toEqual(200);
        expect(userList.page).toEqual(page);
        expect(userList.per_page).toEqual(perPage);
        expect(userList.total).toBeGreaterThanOrEqual(perPage);
        expect(userList.total_pages).toBeGreaterThanOrEqual(page);
        expect(userList.data.length).toBe(2);
    });

    test('Create User', async () => {
        const userRequest: CreateUserRequest = {
            name: "morpheus",
            job: "leader"
        };

        const responseEntity = await metergramClient.createUser(userRequest);
        expect(responseEntity.status).toEqual(201);
        expect(responseEntity.data.name).toEqual(userRequest.name);
        expect(responseEntity.data.job).toEqual(userRequest.job);
    });

    test('Delete user', async () => {
        const responseEntity = await metergramClient.deleteUser(10);
        expect(responseEntity.status).toEqual(204);
    });

    test('Delete non-existent user', async () => {
        const responseEntity = await metergramClient.deleteUser(13);
        expect(responseEntity.data).toEqual("");
    });


    test('Register successful', async () => {
        const mockResponse = {
            status: 200,
            data: {
                id: 4,
                token: "QpwL5tke4Pnpja7X4"
            }
        };

        metergramClient.post = jest.fn().mockResolvedValue(mockResponse);

        const registerRequest = {
            email: "eve.holt@reqres.in",
            password: "pistol"
        };
        const responseEntity = await metergramClient.authenticateOnTheSite(registerRequest);
        console.log(responseEntity.data.token);
        expect(responseEntity.status).toEqual(200);
        expect(responseEntity.data.token).toEqual("QpwL5tke4Pnpja7X4");
    });
});

import BaseClient from "./BaseClient"
import {ResponseEntity} from "express"; // Assuming ResponseEntity is similar to express's Response
import {HOSTNAME} from "../util/HostnameConfig";
import {GetUserResponseBody} from "../model/get/GetUserResponseBody";
import {GetListUsersResponseBody} from '../model/get/GetListUsersResponseBody';
import {CreateUserRequest} from "../model/post/CreateUserRequest";
import {CreateUserResponse} from "../model/post/CreateUserResponse";
import {AxiosResponse} from "axios";
import {PostAuthRequestBody} from "../model/post/PostAuthRequestBody";
import {PostAuthResponseBody} from "../model/post/PostAuthResponseBody";

export class MetergramClient extends BaseClient {
    // private static readonly authenticate = "/login";
    private Token: string = '';

    private postAuthRequestBody: PostAuthRequestBody = {
        email: "nikola_nikolik@hotmail.com",
        password: ""
    };

    constructor() {
        super();
        this.baseUrl = HOSTNAME;
        const responseEntity: ResponseEntity<PostAuthResponseBody> = this.authenticateOnTheSite(this.postAuthRequestBody);
        this.Token = responseEntity.token;
        this.addHeader("Content-Type", "application/json");
        // this.addHeader("Authorization", `Bearer ${this.Token}`);
    }


    // public async authenticateOnTheSite(postAuthRequestBody: PostAuthRequestBody): Promise<AxiosResponse<PostAuthResponseBody>> {
    //     return this.post<PostAuthResponseBody>("/register", postAuthRequestBody);
    // }

    public async authenticateOnTheSite(postAuthRequestBody: PostAuthRequestBody): Promise<AxiosResponse<PostAuthResponseBody>> {
        return await this.post<PostAuthResponseBody>("/api/register", postAuthRequestBody);
    }

    public getUserById(id: number): ResponseEntity<GetUserResponseBody> {
        return this.get( "users/" + id);
    }

    public getListUsers(page: number, per_page: number): ResponseEntity<GetListUsersResponseBody> {
        return this.get("users?page=" + page+"&per_page="+per_page);
    }

    public createUser(user: CreateUserRequest): ResponseEntity<CreateUserResponse>{
        return this.post("users", user)
    }

    public async deleteUser(userId: number): Promise<AxiosResponse<void>>{
        return await this.delete('users/'+ userId);
    }
}

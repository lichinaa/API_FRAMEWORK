import { UserData } from './GetUserData';

export interface GetListUsersResponseBody {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    data: UserData[];
}
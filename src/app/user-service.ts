import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from './user';
import {Observable} from 'rxjs';

@Injectable()
export class UserService {

    private url: string = 'http://localhost:8080/api/users';
    constructor(private http: HttpClient) { }

    getUsers() : Observable<User[]> {
        return this.http.get<User []>(this.url);
    }
}

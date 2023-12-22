import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from './user';
import {catchError, Observable, retry, throwError} from 'rxjs';
import {MessageService} from 'primeng/api';

@Injectable()
export class UserService {

    private url: string = 'http://localhost:8080/api/users';

    httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    }),
   };

    constructor(private http: HttpClient,private messageService: MessageService) { }

    getUsers() : Observable<User[]> {
        return this.http.get<User []>(this.url);
    }

   updateUser(user: User): Observable<User> {
    return this.http
      .put<User>(this.url,
        JSON.stringify(user),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  deleteUser(id: any): Observable<any> {
    return this.http
      .delete(this.url +'/'+ id)
      .pipe(retry(1), catchError(this.handleError));
  }

  createUser(user: User): Observable<User> {
    return this.http
      .put<User>(
        this.url,
        JSON.stringify(user),
        this.httpOptions
      )
      .pipe(retry(1), catchError(this.handleError));
  }

  handleError(error: any) {
    return throwError(() => {
      return error.error;
    });
  }
}

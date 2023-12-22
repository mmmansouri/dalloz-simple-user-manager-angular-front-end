import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Injectable } from '@angular/core';

import { User } from './user';
import {catchError, Observable, retry, throwError} from 'rxjs';

@Injectable()
export class UserService {

    private url: string = 'http://localhost:8080/api/users';

    httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin' : 'http://localhost'
    }),
   };

    constructor(private http: HttpClient) { }

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

  handleError(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}

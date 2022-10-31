import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Login } from './loginInterface';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  validateLogin(data: Login) {
    return this.http.post<Login>('https://serene-hollows-11661.herokuapp.com/api/v1/signin', data);
  }
  createUser(data: Login) {
    return this.http.post<Login>('https://serene-hollows-11661.herokuapp.com/api/v1/signup', data);
  }
}

import { Injectable } from '@angular/core';
import {Credentials} from "../models/Credentials";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";
import {map, tap} from "rxjs/operators";

const authCheckInterval = 60000; //in milliseconds

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean = false;
  lastAuthCheck: Date;

  constructor(private http: HttpClient) { }

  isLoggedIn(): boolean{
    return this.loggedIn;
  }

  checkLogin():Observable<HttpResponse<any>>{
    this.updateAuthCheckDate();
    return this.http.get('/api/login', {observe: 'response'});
  }

  updateAuthCheckDate(){
    this.lastAuthCheck = new Date();
  }

  login(credentials: Credentials):Observable<HttpResponse<any>>{
    return this.http.post('/api/login', credentials, {observe: 'response', responseType: 'text'})
      .pipe(
        tap(response => {
          if(response.status === 200){
            this.loggedIn = true;
            this.updateAuthCheckDate();
          }
        })
      );
  }

  logout():Observable<HttpResponse<any>>{
    return this.http.delete('/api/login', {observe: 'response', responseType: 'text'}).pipe(
      tap(response => {
        if(response.status === 200){
          this.loggedIn = false;
          this.updateAuthCheckDate();
        }
      })
    );
  }
}

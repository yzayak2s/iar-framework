import { Injectable } from '@angular/core';
import {Credentials} from "../models/Credentials";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable, Observer} from "rxjs";
import {map, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  loggedIn: boolean = false;
  authPreCheck: boolean = false;
  listeners: ((boolean)=>void)[] = [];

  constructor(private http: HttpClient) { }

  isLoggedIn(): Observable<boolean>{
    if(!this.authPreCheck){
      return this.checkLogin()
        .pipe(
          map((response: HttpResponse<{loggedIn: boolean}>) => {
            this.emitLoginChange(response.body.loggedIn);
            return response.body.loggedIn;
          })
        );
    }
    return new Observable((observer: Observer<boolean>) => {
      observer.next(this.loggedIn);
      observer.complete();
    });
  }

  subscribeLoginChange(callback: (boolean)=>void){
    this.listeners.push(callback);
  }

  emitLoginChange(newState: boolean){
    this.listeners.forEach(callback => {callback(newState)});
  }

  checkLogin():Observable<HttpResponse<{loggedIn: boolean}>>{
    return this.http.get<{loggedIn: boolean}>('/api/login', {observe: 'response'});
  }

  login(credentials: Credentials):Observable<HttpResponse<any>>{
    return this.http.post('/api/login', credentials, {observe: 'response', responseType: 'text'})
      .pipe(
        tap(response => {
          if(response.status === 200){
            this.loggedIn = true;
            this.emitLoginChange(true);
          }
        })
      );
  }

  logout():Observable<HttpResponse<any>>{
    return this.http.delete('/api/login', {observe: 'response', responseType: 'text'}).pipe(
      tap(response => {
        if(response.status === 200){
          this.loggedIn = false;
          this.emitLoginChange(false);
        }
      })
    );
  }
}

import { Injectable } from '@angular/core';
import {Credentials} from "../models/Credentials";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(credentials: Credentials):Observable<HttpResponse<any>>{
    return this.http.post('/api/login', credentials, {observe: 'response'});
  }

  logout():Observable<HttpResponse<any>>{
    return this.http.delete('/api/login', {observe: 'response'});
  }
}

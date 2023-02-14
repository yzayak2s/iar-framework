import { Injectable } from '@angular/core';
import {Observable} from 'rxjs';
import {User} from '../models/User';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {Photo} from '../interfaces/Photo';

/**
 * handles backend communication regarding user accounts
 */
@Injectable({
    providedIn: 'root'
})
export class UserService {
    private userUrl = `${environment.apiEndpoint}/api/employees`;

    constructor(private http: HttpClient) { }

    /**
     * retrieves userdata of currently authenticated user
     */
    getOwnUser(): Observable<User>{
        // use angular's integrated HTTP-client to make a get request; handle the response as a User object :
        return this.http.get<User>(environment.apiEndpoint + '/api/user', {withCredentials: true});
    }

    getUserPhoto(id: string): Observable<HttpResponse<Photo>> {
        const url = `${this.userUrl}/read/id/${id}/photo`;
        return this.http.get<Photo>(url, {
            observe: 'response',
            withCredentials: true
        });
    }
}

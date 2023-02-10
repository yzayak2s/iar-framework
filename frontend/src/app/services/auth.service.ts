import {Injectable} from '@angular/core';
import {Credentials} from '../models/Credentials';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable, Observer} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {environment} from '../../../environments/environment';
import {UserService} from '../services/user.service';

/**
 * Services specify logic, which is instantiated singularly -> it is shared between components
 * This service handles authorization with the backend
 */
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    loggedIn = false;
    authPreCheck = false;
    role: string;
    listeners: ((param: boolean) => void)[] = [];

    constructor(private http: HttpClient, private userService: UserService) {
    }

    /**
     * returns the current login state
     */
    isLoggedIn(): Observable<boolean> {
        if (!this.authPreCheck) {
            return this.checkLogin()
                .pipe(
                    map((response: HttpResponse<{ loggedIn: boolean }>): boolean => {
                        this.emitLoginChange(response.body.loggedIn);
                        return response.body.loggedIn;
                    })
                );
        }
        return new Observable((observer: Observer<boolean>): void => {
            observer.next(this.loggedIn);
            observer.complete();
        });
    }

    /**
     * subscribe to changes of the login state
     *
     * @param callback
     */
    subscribeLoginChange(callback: (param: boolean) => void): void {
        this.listeners.push(callback);
    }

    /**
     * notifies all listeners with a new login state
     *
     * @param newState
     */
    emitLoginChange(newState: boolean): void {
        this.listeners.forEach((callback): void => {
            callback(newState);
        });
    }

    /**
     * retrieves the login state from backend
     */
    checkLogin(): Observable<HttpResponse<{ loggedIn: boolean }>> {
        return this.http.get<{ loggedIn: boolean }>(environment.apiEndpoint + '/api/login', {
            withCredentials: true,
            observe: 'response'
        });
    }

    /**
     * authenticates a user with credentials against backend
     *
     * @param credentials consisting of username and password
     */
    login(credentials: Credentials): Observable<HttpResponse<any>> {
        return this.http.post(environment.apiEndpoint + '/api/login', credentials, {
            withCredentials: true,
            observe: 'response',
            responseType: 'text'
        })
            .pipe(
                tap((response): void => {
                    if (response.status === 200) { // if request was successful
                        this.userService.getOwnUser().subscribe((user): void => {
                            if (user.isAdmin) {
                                this.role = 'ADMIN';
                                localStorage.setItem('role', this.role);
                            }
                            else {
                                this.role = user.role;
                                localStorage.setItem('role', this.role);
                            }
                        });

                        this.loggedIn = true; // set new stat
                        this.emitLoginChange(true); // notify listeners
                    }
                })
            );
    }

    /**
     *
     */
    logout(): Observable<HttpResponse<any>> {
        return this.http.delete(environment.apiEndpoint + '/api/login',
            {withCredentials: true, observe: 'response', responseType: 'text'}
        ).pipe(
            tap((response): void => {
                if (response.status === 200) {
                    this.loggedIn = false;
                    this.role = '';
                    localStorage.removeItem('role');
                    this.emitLoginChange(false);
                }
            })
        );
    }

    getRole(): string {
        this.role = localStorage.getItem('role');
        return this.role;
    }
}

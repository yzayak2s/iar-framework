import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router} from '@angular/router';
import {AuthService} from './auth.service';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

/**
 * this service implements the CanActivate interface
 * it enables angular router, to check whether a user is allowed to access a page or not
 */
@Injectable({
    providedIn: 'root'
})
export class AuthGuardService implements CanActivate{

    constructor(private authService: AuthService, private router: Router) { }

    canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    // mapping isLoggedIn():Observable to this function:
        return this.authService.isLoggedIn()
            .pipe(
                map((state): boolean => {
                    if (!state) { // go back to login, if user is not allowed to enter
                        void this.router.navigate(['login']);
                    }

                    // Check if role is allowed
                    const userRole = this.authService.getRole();

                    // Admin always allowed
                    if (userRole === 'ADMIN') {
                        return state;
                    }

                    const allowedRoles: Array<string> = route.data.roles;

                    if(!allowedRoles.includes(userRole)){
                        console.log("Not allowed")
                        void this.router.navigate(['login']);   // If not allowed back to login. Dashboard would create infinite loop here
                    }

                    return state;
                })
            );
    }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { UserService } from './user.service';

@Injectable({
    providedIn: 'root'
})

export class AuthGuard implements CanActivate {

    constructor(private userService: UserService, private router: Router) {}

    canActivate( 
        route: ActivatedRouteSnapshot,
         state: RouterStateSnapshot
         ): 
          | boolean
          | UrlTree 
          | Promise<boolean | UrlTree>
          | Observable<boolean | UrlTree> {
            return this.userService.user.pipe(
                take(1), // take only the last value and unsubscribe!
                map(user => {
                const isAuth = !!user
                if (isAuth) {
                    return true
                }
                return this.router.createUrlTree(['/user/login']);
            }));
         }
}
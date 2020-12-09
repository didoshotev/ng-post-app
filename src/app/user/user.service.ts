import { HttpClient, HttpErrorResponse, HttpHeaders, } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import Backendless from 'backendless';
import { BehaviorSubject } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    userToken;

    user = new BehaviorSubject<any>(null);
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient,
         private router: Router,
         ) { }

    register(email: string, password: string, username: string) {
        return this.http.post<any>(
            'https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/users/register',
            {
                'email': email,
                'password': password,
                'name': username,
                'postsLiked': [],
                'postsCreated': [],

            },
        ).pipe(
            catchError(this.handleError),
            tap(response => {
                console.log('Registered Successfully');
                this.handleAuthentication(
                    response.email,
                    response.name,
                    response.objectId,
                    response['user-token'],
                    response.postsCreated,
                    response.postsLiked,
                    response.savedPosts,
                )
            })
        )
    }

    login(email: string, password: string) {
        return this.http.post<any>(
            'https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/users/login',
            {
                'login': email,
                password
            }
        ).pipe(
            catchError(this.handleError),
            tap(response => {
                console.log('Logged Successfully');
                this.handleAuthentication(
                    response.email,
                    response.name,
                    response.objectId,
                    response['user-token'],
                    response.postsCreated,
                    response.postsLiked,
                    response.savedPosts,
                )
            })
        )
    }

    autoLogin() {
        const userData = JSON.parse(localStorage.getItem('userData'));

        if (!userData) {
            return;
        }
        const loadedUser = new User(
            userData.email,
            userData.name,
            userData.objectId,
            userData.token,
            userData.createdPosts,
            userData.postsLiked,
            userData.savedPosts,
        )
        if (loadedUser.token) {
            this.user.next(loadedUser);
            //   const expirationDuration = new Date(userData._tokenExperationDate)
            //   .getTime() - new Date().getTime();
            this.autoLogout(300000);
        }
    }

    logout() {
        this.user.next(null);
        this.router.navigate(['/user/login']);
        localStorage.removeItem('userData');
        if (this.tokenExpirationTimer) {
            clearTimeout(this.tokenExpirationTimer);
        }
        this.tokenExpirationTimer = null;
    }


    autoLogout(expirationDuration: number) {
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    updateUserLikedPosts(userId, post) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        if (!currentUser.token) {
            return
        }
        this.userToken = currentUser.token;
        let headers = new HttpHeaders();
        this.headerToAppend(headers)

        let newObj = [];
        let postsLiked = currentUser.postsLiked
        postsLiked.map(item => newObj.push(item))
        newObj.push({ postId: post.objectId, title: post.title });

        let newUserData = {
            email: currentUser.email,
            name: currentUser.name,
            objectId: currentUser.objectId,
            token: currentUser.token,
            createdPosts: currentUser.createdPosts,
            postsLiked: newObj
        }
        localStorage.setItem('userData', JSON.stringify(newUserData));

        return this.http.put(
            `https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/users/${userId}`,
            {
                'postsLiked': newObj
            },
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
        )
    }


    private handleAuthentication(email: string, name: string, objectId: string, token: string, postsCreated, postsLiked, savedPosts) {
        let currentUser;
        // const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        currentUser = new User(
            email,
            name,
            objectId,
            token,
            postsCreated,
            postsLiked,
            savedPosts,
        )
        
        this.user.next(currentUser);
        this.autoLogout(3600 * 1000);
        localStorage.setItem('userData', JSON.stringify(currentUser));
        this.router.navigate(['/home']);
    }


    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        return throwError(errorMessage);
    }

    headerToAppend(headers: HttpHeaders) {
        headers.append('Content-Type', 'application/json')
    }

}
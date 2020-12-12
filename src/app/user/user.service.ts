import { HttpClient, HttpErrorResponse, HttpHeaders, } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { environment } from '../../environments/environment'

@Injectable({
    providedIn: 'root'
})
export class UserService {
    userToken;
    private BASE_URL = environment.backendless.BASE_URL;

    user = new BehaviorSubject<any>(null);
    private tokenExpirationTimer: any;

    constructor(
        private http: HttpClient,
        private router: Router,
    ) { }

    register(email: string, password: string, username: string) {
        return this.http.post<any>(
            `${this.BASE_URL}/users/register`,
            {
                'email': email,
                'password': password,
                'name': username,
                'postsLiked': [],
                'createdPosts': [],

            },
        ).pipe(
            catchError(this.handleError),
            tap(response => {
                console.log('Registered Successfully');
                console.log(response);
                this.handleAuthentication(
                    response.email,
                    response.name,
                    response.objectId,
                    response['user-token'],
                    response.createdPosts,
                    response.postsLiked,
                )
            })
        )
    }

    login(email: string, password: string) {
        return this.http.post<any>(
            `${this.BASE_URL}/users/login`,
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
                    response.createdPosts,
                    response.postsLiked,
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
            userData._token,
            new Date(userData._tokenExperationDate),
            userData.createdPosts,
            userData.postsLiked,
        )
        if (loadedUser.token) {
            this.user.next(loadedUser);
            const expirationDuration = new Date(userData._tokenExperationDate)
            .getTime() - new Date().getTime();
            this.autoLogout(expirationDuration);
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
        //console.log(expirationDuration);
        this.tokenExpirationTimer = setTimeout(() => {
            this.logout();
        }, expirationDuration)
    }

    updateUserCreatedPosts(userId, post, objectId) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        let headers = this.setTokenHeaders(currentUser);

        let newObj = [];
        let createdPosts = currentUser.createdPosts
        createdPosts.map(item => newObj.push(item))
        newObj.push({ postId: objectId, title: post.title });

        let newUserData = {
            email: currentUser.email,
            name: currentUser.name,
            objectId: currentUser.objectId,
            token: currentUser.token,
            createdPosts: newObj,
            postsLiked: currentUser.postsLiked
        }
        localStorage.setItem('userData', JSON.stringify(newUserData));

        return this.http.put<any>(
            `${this.BASE_URL}/users/${userId}`,
            {
                'createdPosts': newObj
            },
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
            tap(data => {
                this.user.next(newUserData);
                this.router.navigate(['/posts'])
            })
        )
    }

    updateUserLikedPosts(userId, post) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        let headers = this.setTokenHeaders(currentUser);

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
            `${this.BASE_URL}/users/${userId}`,
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

    updateUserEditedPosts(userId, post, objectId) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        let headers = this.setTokenHeaders(currentUser);

        let newObj = [];
        let createdPosts = currentUser.createdPosts
        createdPosts.map(item => {
            if (item.postId !== objectId) {
                newObj.push(item)
            }
        })
        newObj.push({ postId: objectId, title: post.title });

        let newUserData = {
            email: currentUser.email,
            name: currentUser.name,
            objectId: currentUser.objectId,
            token: currentUser.token,
            createdPosts: newObj,
            postsLiked: currentUser.postsLiked
        }
        localStorage.setItem('userData', JSON.stringify(newUserData));

        return this.http.put(
            `${this.BASE_URL}/users/${userId}`,
            {
                'createdPosts': newObj
            },
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
            tap(data => {
                this.user.next(newUserData)
                this.router.navigate(['/posts']);
            })
        )
    }

    updateUserDeletedPost(userId, post, objectId) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        let headers = this.setTokenHeaders(currentUser);

        let newObj = [];
        let createdPosts = currentUser.createdPosts
        createdPosts.map(item => {
            if (item.postId !== objectId) {
                newObj.push(item)
            }
        })

        let newUserData = {
            email: currentUser.email,
            name: currentUser.name,
            objectId: currentUser.objectId,
            token: currentUser.token,
            createdPosts: newObj,
            postsLiked: currentUser.postsLiked
        }
        localStorage.setItem('userData', JSON.stringify(newUserData));

        return this.http.put(
            `${this.BASE_URL}/users/${userId}`,
            {
                'createdPosts': newObj
            },
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
            tap(data => {
                this.user.next(newUserData);
                this.router.navigate(['/']);
            })
        )
    }

    private handleAuthentication(email: string, name: string, objectId: string, token: string, createdPosts, postsLiked) {
        let currentUser;
        const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
        currentUser = new User(
            email,
            name,
            objectId,
            token,
            expirationDate,
            createdPosts,
            postsLiked,
        )

        this.user.next(currentUser);
        this.autoLogout(3600 * 1000);
        localStorage.setItem('userData', JSON.stringify(currentUser));
        this.router.navigate(['/home']);
    }

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (errorRes.error.code === 3003 || errorRes.error.code === 3002 || errorRes.error.code === 3011) {
            errorMessage = errorRes.error.message;
        }
        return throwError(errorMessage);
    }

    headerToAppend(headers: HttpHeaders) {
        headers.append('Content-Type', 'application/json')
    }

    private setTokenHeaders(currentUser) {
        if (!currentUser.token) {
            return
        }
        this.userToken = currentUser.token;
        let headers = new HttpHeaders();
        this.headerToAppend(headers)
        return headers
    }
}
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Subject, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
    providedIn: 'root'
})

export class PostService {
    userToken;
    private BASE_URL = environment.backendless.BASE_URL;
    postsChanged = new Subject<any>();

    constructor(private http: HttpClient) { }


    createPost(data) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        let headers = this.setTokenHeaders(currentUser);
        
        return this.http.post<any>(
            `${this.BASE_URL}/data/post`,
            {
                ...data,
                'ownerId': currentUser.objectId,
                'ownerName': currentUser.name,
                'likes': 0
            },
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
        )
    }

    getAllPosts() {
        return this.http.get(
            `${this.BASE_URL}/data/post`
        ).pipe(
            catchError(this.handleError)
        )
    }

    getPostById(id) {
        return this.http.get(
            `${this.BASE_URL}/data/post/${id}`
        ).pipe(
            catchError(this.handleError)
        )
    }

    editPostById(id, newData) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        let headers = this.setTokenHeaders(currentUser);
        
        return this.http.put(
            `${this.BASE_URL}/data/post/${id}`,
            newData,
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
        ).subscribe()
    }

    deletePostById(id) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        let headers = this.setTokenHeaders(currentUser);

        return this.http.delete(
            `${this.BASE_URL}/data/post/${id}`,
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
        ).subscribe()
    }


    headerToAppend(headers: HttpHeaders) {   // must add user token from login
        headers.append('user-token', this.userToken);
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

    private handleError(errorRes: HttpErrorResponse) {
        let errorMessage = 'An unknown error occurred!';
        if (errorRes.error.code === 1001 || errorRes.error.code === 1009 || errorRes.error.code === 1011) {
            errorMessage = errorRes.error.message;
        }
        return throwError(errorMessage);
    }
}
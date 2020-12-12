import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable, OnInit } from "@angular/core";
import { Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})

export class PostService {
    userToken;

    postsChanged = new Subject<any>();
    private posts = [];

    constructor(private http: HttpClient) { }


    createPost(data) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        if (!currentUser.token) {
            return
        }
        this.userToken = currentUser.token;
        let headers = new HttpHeaders();
        this.headerToAppend(headers)
        return this.http.post<any>(
            'https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/data/post',
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
            tap(response => {
                console.log('Post successsfully created!');
            })
        )
    }

    getAllPosts() {
        return this.http.get(
            'https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/data/post'
        ).pipe(
            catchError(this.handleError)
        )
    }

    getPostById(id) {
        return this.http.get(
            `https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/data/post/${id}`
        ).pipe(
            catchError(this.handleError)
        )
    }

    editPostById(id, newData) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        if (!currentUser.token) {
            return
        }
        this.userToken = currentUser.token;
        let headers = new HttpHeaders();
        this.headerToAppend(headers)
        return this.http.put(
            `https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/data/post/${id}`,
            newData,
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
            tap(newObj => {
                console.log('Object edited');

            })
        ).subscribe()
    }

    deletePostById(id) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        if (!currentUser.token) {
            return
        }
        this.userToken = currentUser.token;
        let headers = new HttpHeaders();
        this.headerToAppend(headers)

        return this.http.delete(
            `https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/data/post/${id}`,
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
            tap(response => {
                console.log('Post is deleted!');
            })
        ).subscribe()
    }


    headerToAppend(headers: HttpHeaders) {   // must add user token from login
        headers.append('user-token', this.userToken);
    }

    private handleError(errorRes: HttpErrorResponse) {
        console.log(errorRes);
        let errorMessage = 'An unknown error occurred!';
        if (!errorRes.error || !errorRes.error.error) {
            return throwError(errorMessage);
        }
        return throwError(errorMessage);
    }
}
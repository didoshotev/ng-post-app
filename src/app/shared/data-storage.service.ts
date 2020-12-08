import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { Subscription, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { PostService } from '../post/post.service';
import { UserService } from '../user/user.service';

@Injectable({
    providedIn: 'root'
})

export class DataStorageService {
    userToken;
    currentPostSubscription: Subscription;
    isPostLiked;

    constructor(
        private postService: PostService,
        private http: HttpClient,
        private userService: UserService
    ) { }

    fetchPosts() {
        return this.http.get(
            'https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/data/post'
        ).pipe(
            catchError(this.handleError),
            tap(posts => {
                this.postService.setPosts(posts);
            })
        )
    }

    createPost(data) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        if (!currentUser.token) {
            return
        }
        this.userToken = currentUser.token;
        let headers = new HttpHeaders();
        this.headerToAppend(headers)
        return this.http.post(
            'https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/data/post',
            {
                ...data,
                'ownerId': currentUser.objectId,
                'likes': 0
            },
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
            tap(response => {
                this.fetchPosts();
                console.log('Post successfully created!');
            })
        ).subscribe()
    }

    editPostById(postObjectId, newData) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        if (!currentUser.token) {
            return
        }
        
        let {title, likes, ownerId, textContent, type} = newData;
        
        // objectId is undefined!

        this.userToken = currentUser.token;
        let headers = new HttpHeaders();
        this.headerToAppend(headers)

        return this.http.put(
            `https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/data/post/${postObjectId}`,
            newData,
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
            tap(newObj => {
                this.fetchPosts();
            })
        ).subscribe()

    }

    getPostById(id) {
        return this.http.get(
            `https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/data/post/${id}`
        ).pipe(
            catchError(this.handleError)
        )
    }

    deletePost(objectId) {
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        if (!currentUser.token) {
            return
        }
        this.userToken = currentUser.token;
        let headers = new HttpHeaders();
        this.headerToAppend(headers)

        return this.http.delete(
            `https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/data/post/${objectId}`,
            {
                headers: headers
            }
        ).pipe(
            catchError(this.handleError),
            tap(response => {
                this.fetchPosts();
                console.log('Post is deleted!');
            })
        ).subscribe()
    }

    updateUserObject(userId, newData) { // edit
        const currentUser = JSON.parse(localStorage.getItem('userData'));
        if (!currentUser.token) {
            return
        }
        this.userToken = currentUser.token;
        let headers = new HttpHeaders();
        this.headerToAppend(headers)

        return this.http.put(
            `https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/users/${userId}`,
            newData,
            {
                headers
            }
        ).pipe(
            catchError(this.handleError),
            tap(reponse => {
                this.fetchPosts();
                console.log('Post successfully edited!');
            })
        ).subscribe()
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
        let likedPosts = currentUser.likedPosts
        likedPosts.map(item => newObj.push(item))
        newObj.push({ postId: post.objectId, title: post.title });

        let newUserData = {
            email: currentUser.email,
            name: currentUser.name,
            objectId: currentUser.objectId,
            token: currentUser.token,
            createdPosts: currentUser.createdPosts,
            likedPosts: newObj
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
            tap(newUserObj => {
                this.userService.user.next(currentUser); // !!!
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





    // getAllPosts() {
    //     return this.http.get(
    //         'https://api.backendless.com/66BE35C3-B35F-ED2B-FFA7-FC85EE5A8E00/5F613093-6F99-4008-AAB6-9B36E5199013/data/post'
    //     ).pipe(
    //         catchError(this.handleError)
    //     )
    // }




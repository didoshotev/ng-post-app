import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { PostService } from '../post/post.service';
import { IPost } from '../shared/interfaces/post';

@Injectable({
    providedIn: 'root'
})

export class PostDataResolver implements Resolve<IPost> {

    constructor(private postService: PostService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,

    ): Observable<any>|Promise<any>|any {
       // let id = route.params['id']
        let postId = route.paramMap.get('id');

        return this.postService.getPostById(postId).pipe(catchError(error => {
                return EMPTY
            }), mergeMap(data => {
                if (data) {
                    return of(data)
                } else {
                    return EMPTY
                }
            })
            )
    }
}




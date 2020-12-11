import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable, of } from 'rxjs';
import { catchError, mergeMap } from 'rxjs/operators';
import { IPost } from 'src/app/shared/interfaces';
import { PostService } from '../post.service';


@Injectable({
    providedIn: 'root'
})

export class PostListResolver implements Resolve<IPost> {

    constructor(private postService: PostService) { }

    resolve(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,

    ): Observable<any>|Promise<any>|any {

        return this.postService.getAllPosts().pipe(catchError(error => {
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




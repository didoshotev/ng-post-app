import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription, zip } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserService } from 'src/app/user/user.service';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-detail',
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit, OnDestroy {
  currentUser;
  currentPost;
  currentPostId;
  currPostSubscription: Subscription;
  isCreator;
  isLiked;

  constructor(
    private currentRoute: ActivatedRoute,
    private postService: PostService,
    private userService: UserService,
    ) { }

  ngOnInit(): void {
    let user = JSON.parse(localStorage.getItem('userData'));
    this.currentUser = user;

    this.currPostSubscription = this.currentRoute.params
    .subscribe(
      (data: Params) => {
        this.currentPostId = data['id'];
        this.currentPost = this.postService.getPostById(this.currentPostId)
        .subscribe(post => {
          this.currentPost = post;
          if(user.objectId === this.currentPost.ownerId) {
            this.isCreator = true;
          } else {
            this.isCreator = false
          }
          let isLikedCheck = user.likedPosts.filter(item => item.postId === this.currentPost.objectId).length;
          if (isLikedCheck == !0) {
            this.isLiked = true;
            return
          } else {
            this.isLiked = false
          }
        })
      }
    )
  }

  onLike() {
    let likes = +this.currentPost.likes;
    likes++
    this.isLiked = true;
    this.postService.editPostById(this.currentPost.objectId, {likes}).subscribe();
    this.userService.updateUserLikedPosts(this.currentUser.objectId, this.currentPost);
  }

  ngOnDestroy() {
    this.currPostSubscription.unsubscribe();
  }
}
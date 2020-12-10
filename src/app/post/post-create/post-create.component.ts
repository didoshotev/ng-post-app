import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { title } from 'process';
import { stringify } from 'querystring';
import { Subscribable, Subscription } from 'rxjs';
import { filter, tap } from 'rxjs/operators';
import { UserService } from 'src/app/user/user.service';

import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit, OnDestroy {
  postForm: FormGroup;
  currentId;
  currentPost;
  editMode = false;
  paramsId;

  postResolveData;

  user;
  userSubscription: Subscription;

  constructor(
    private postService: PostService,
    private router: Router,
    private currRoute: ActivatedRoute,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.currRoute.params.subscribe(
      (params: Params) => {
        this.currentId = params['id'];
        this.editMode = params['id'] != null;
        if(this.editMode) {
          this.currentPost = this.postService.getPostById(this.currentId);
        }
      }
    )
    this.userSubscription = this.userService.user.subscribe(user => {
      this.user = user;
    })
    this.postResolveData = this.currRoute.snapshot.data.postData;
    this.initForm();
  }

  onSubmit() {
    let { title, type, imageUrl, textContent } = this.postForm.value;
    let currentOwner = JSON.parse(localStorage.getItem('userData'));
    title = title.charAt(0).toUpperCase() + title.slice(1);

    if (this.editMode === true) { 
      this.postService.editPostById(
        this.currentId, {
          title, type, imageUrl, textContent, ownerId: currentOwner.objectId, likes: this.currentPost.likes
      }).subscribe()
    } else {
      this.postService.createPost({ title, type, imageUrl, textContent});
      this.userService.updateUserCreatedPosts(currentOwner.objectId, { title, type, imageUrl, textContent})
      .subscribe(newData => {
        this.userService.user.next(newData);
      });
    }
    this.onDiscard();
  }

  onDiscard() {
    this.router.navigate(['/posts']);
  }

  initForm(): void {
    let title = "";
    let type = "";
    let imageUrl = "";
    let textContent = "";

    if (this.editMode === true) {
      title = this.postResolveData.title;
      title = title.charAt(0).toUpperCase() + title.slice(1);

      type = this.postResolveData.type;
      imageUrl = this.postResolveData.imageUrl;
      textContent = this.postResolveData.textContent;
    }

    this.postForm = new FormGroup({
      'title': new FormControl(title, [Validators.required]),
      'type': new FormControl(type, [Validators.required]),
      'imageUrl': new FormControl(imageUrl, [Validators.required]),
      'textContent': new FormControl(textContent, [Validators.required]),
    })
  }

  ngOnDestroy() {
    this.userSubscription.unsubscribe();
  }
}

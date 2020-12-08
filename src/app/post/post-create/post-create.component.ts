import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { title } from 'process';
import { stringify } from 'querystring';
import { Subscribable, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  postForm: FormGroup;
  currentId;
  currentPost;
  editMode = false;
  paramsId;
  postSubscription: Subscription;

  constructor(
    private postService: PostService,
    private router: Router,
    private currRoute: ActivatedRoute,
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
    this.initForm();
  }

  onSubmit() {
    let { title, type, imageUrl, textContent } = this.postForm.value;
    let currentOwner = JSON.parse(localStorage.getItem('userData'));
    title = title.charAt(0).toUpperCase() + title.slice(1);

    if (this.editMode === true) { // get likes first
      let newData = {
        title,
        type,
        imageUrl,
        textContent,
        likes: this.currentPost.likes,
        ownerId: this.currentPost.ownerId
      }

      //this.dataStorage.editPostById(this.currentPost.objectId, newData);
      this.postService.editPostById(
        this.currentId, {
          title, type, imageUrl, textContent, ownerId: currentOwner.objectId, likes: this.currentPost.likes
      }).subscribe(data => {
        
      })
    } else {
      this.postService.createPost({ title, type, imageUrl, textContent});
      //this.postService.addPostI({ title, type, imageUrl, textContent, ownerId: currentOwner.objectId, likes: 0 });
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



    // if (this.editMode === true) {
    //   const post = this.postService.getPostById(this.currentId);
    //   //const post = this.postService.getPostByIndex(this.currentId);
    //   this.currentPost = post;

    //   title = post.title;
    //   title = title.charAt(0).toUpperCase() + title.slice(1);

    //   type = post.type;
    //   imageUrl = post.imageUrl;
    //   textContent = post.textContent;
    // }

    this.postForm = new FormGroup({
      'title': new FormControl(title, [Validators.required]),
      'type': new FormControl(type, [Validators.required]),
      'imageUrl': new FormControl(imageUrl, [Validators.required]),
      'textContent': new FormControl(textContent, [Validators.required]),
    })
  }
}

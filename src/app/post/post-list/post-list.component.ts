import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPost } from '../../shared/interfaces/index'

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  post;
  allPosts: IPost[];

  postsListResolvedData
  constructor(
    private currRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    //this.allPosts = this.postService.getAllPosts().pipe(shareReplay(1))
    this.allPosts = this.currRoute.snapshot.data.postsList;
  }

}

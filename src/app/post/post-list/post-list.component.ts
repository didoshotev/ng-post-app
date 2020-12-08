import { Component,  OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {
  post;
  allPosts: Observable<any>;

  data
  constructor(private postService: PostService) { }

  ngOnInit(): void {
    this.allPosts = this.postService.getAllPosts().pipe(shareReplay(1))
    
    this.data = this.postService.getAllPosts().subscribe(data => {
    })
  }

}

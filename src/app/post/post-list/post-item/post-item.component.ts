import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Input } from '@angular/core'
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-post-item',
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent implements OnInit {
  isLogged;
  @Input() postItem; 
  @Input() index;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.user.subscribe(data => {
      this.isLogged = !!data;
    })
  }

  onReadMore(){
    
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user;
  constructor(
    private userService: UserService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.userService.user.subscribe(userObj => {
      this.user = userObj;
    })  
  }

  onItem(post){
    this.router.navigate(['posts/:id', post.objectId]);
  }

}

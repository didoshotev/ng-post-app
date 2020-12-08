import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuth = false;
  private userSub: Subscription;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userSub = this.userService.user.subscribe(user => {
      this.isAuth = !user? false : true;
      
    })
  }

  onLogout():void {
    this.userService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }
 
}

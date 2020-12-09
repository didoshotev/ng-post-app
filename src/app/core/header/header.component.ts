import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
  user;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit(): void {
    this.userSub = this.userService.user.subscribe(user => {
      this.isAuth = !user ? false : true;
      this.user = user;
    })
  }

  // [routerLink]="['/user/profile']"
  onProfile() {
    this.router.navigate(['/user/profile']);
  }

  onLogout(): void {
    this.userService.logout();
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
  }

}

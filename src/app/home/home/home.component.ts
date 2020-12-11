import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/user/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private userService: UserService,
    private router: Router
    ) {
    
  }

  ngOnInit(): void {
  }

  onView() {
    this.router.navigate(['/posts'])
  }

}

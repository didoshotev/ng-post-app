import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { catchError, tap } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loginError: string = null;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    })
  }

  onSubmit() {
    let { email, password } = this.loginForm.value;
    this.userService.login(email, password)
      .subscribe(
        res => this.userService.user.next(res),  // passing initial user state
        err => this.loginError = err,
      )
  }
}

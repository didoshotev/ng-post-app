import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { tap } from 'rxjs/operators';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required])
    })
  }

  onSubmit() {
    let {email, password} = this.loginForm.value;
<<<<<<< HEAD
      this.userService.login(email, password).pipe(
        tap(response => {
          console.log(response);
  
        })
      )
      .subscribe(userObj => {
=======
    this.userService.login(email, password).pipe(
      tap(response => {
        console.log(response);
        
      })
    )
    .subscribe(userObj => {
>>>>>>> eb52c9df40334add5289f8c04ae574c2654b8856
      this.userService.user.next(userObj);  // passing initial user state
    })
  }

}

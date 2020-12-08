import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { UserService } from '../user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  isLogged;
  mainForm: FormGroup;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.mainForm = new FormGroup({
      'email': new FormControl(null),
      'username': new FormControl(null),
      'password': new FormControl(null),
      'repeatPassword': new FormControl(null),
    })
  }

  onSubmit() {
    let {email, username, password, repeatPassword} = this.mainForm.value;
    this.userService.register(email, password, username)
    .subscribe(response => {
    })
      

    //this.userService.register()
  }

}

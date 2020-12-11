import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { mergeMap } from 'rxjs/operators';
import { UserService } from '../user.service';
import { CustomValidators } from './custom-validators'

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
    this.onInitForm();
  }
  onSubmit() {
    let email = this.mainForm.value.email;
    let username = this.mainForm.value.username;
    let password = this.mainForm.value.passwords.password;
    this.userService.register(email, password, username).pipe(
      mergeMap(data => {
        return this.userService.login(email, password);
      })
    ).subscribe();
  }

  private onInitForm(): void {
    this.mainForm = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.minLength(4), Validators.email]),
      'username': new FormControl(null, [Validators.required, Validators.minLength(2)]),
      'passwords': new FormGroup({
        'password': new FormControl(null, [Validators.required, Validators.minLength(6)]),
        'repeatPassword': new FormControl(null, [Validators.required], [CustomValidators.passwordConforming.bind(this)]),
      }),
    })
  }
}

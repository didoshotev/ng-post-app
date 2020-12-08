import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { ProfileComponent } from './profile/profile.component';
import { RegisterComponent } from './register/register.component';

const routes: Routes = [
    {
        path: 'user',children: [
            {
                path: 'profile', canActivate: [AuthGuard], component: ProfileComponent
            },
            {
                path: 'login', component: LoginComponent 
            },
            {
                path: 'register', component: RegisterComponent
            }
        ]
    }

];

export const UserRoutingModule = RouterModule.forChild(routes);


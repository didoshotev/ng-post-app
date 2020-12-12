import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home/home.component';
import { NotFoundComponent } from './not-found/not-found.component';

const routes: Routes = [
  {
    path: '', pathMatch: 'full', redirectTo: '/home'
  },
  {
      path: 'home', component: HomeComponent
  },
  {
    path: '**',
    component: NotFoundComponent
  }
];


export const AppRoutingModule = RouterModule.forRoot(routes);

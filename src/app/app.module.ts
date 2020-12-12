import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import Backendless from 'backendless';
import { environment } from '../environments/environment'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserModule } from './user/user.module';
import { CoreModule } from './core/core.module';
import { HomeModule } from './home/home.module';
import { PostModule } from './post/post.module';
import { NotFoundComponent } from './not-found/not-found.component';

Backendless.initApp(environment.backendless.APP_ID, environment.backendless.API_KEY);


@NgModule({
  declarations: [
    AppComponent,
    NotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserModule,
    CoreModule,
    HomeModule,
    PostModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

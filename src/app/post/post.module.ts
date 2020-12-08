import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostListComponent } from './post-list/post-list.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostItemComponent } from './post-list/post-item/post-item.component';
import { PostRoutingModule } from './post-routing.module';
import { PostCreateComponent } from './post-create/post-create.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



@NgModule({
  declarations: [ PostListComponent, PostDetailComponent, PostItemComponent, PostCreateComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    PostRoutingModule,
    ReactiveFormsModule,
  ],
  
})
export class PostModule { }

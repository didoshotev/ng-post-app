import { RouterModule, Routes } from '@angular/router';
import { PostDataResolver } from './postData-resolver.service';
import { AuthGuard } from '../user/auth.guard';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostListComponent } from './post-list/post-list.component';
import { PostListResolver } from './post-list/postList-resolver';


const routes: Routes = [
    {
        path: 'posts', component: PostListComponent,
        resolve: {
            postsList: PostListResolver
        }
    },
    {
        path: 'posts/create', canActivate: [AuthGuard], component: PostCreateComponent
    },
    {
        path: 'posts/edit/:id', canActivate: [AuthGuard], pathMatch: 'full', component: PostCreateComponent,
        resolve: {
            postData: PostDataResolver
        }
    },
    {
        path: 'posts/:id', canActivate: [AuthGuard], component: PostDetailComponent,
    }
];

export const PostRoutingModule = RouterModule.forChild(routes);
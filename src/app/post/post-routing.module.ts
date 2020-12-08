import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../user/auth.guard';
import { PostCreateComponent } from './post-create/post-create.component';
import { PostDetailComponent } from './post-detail/post-detail.component';
import { PostListComponent } from './post-list/post-list.component';


const routes: Routes = [
    {
        path: 'posts', component: PostListComponent
    },
    {
        path: 'posts/create', canActivate: [AuthGuard], component: PostCreateComponent
    },
    {
        path: 'posts/edit/:id', canActivate: [AuthGuard], pathMatch: 'full', component: PostCreateComponent
    },
    {
        path: 'posts/:id', canActivate: [AuthGuard], component: PostDetailComponent
    }
];

export const PostRoutingModule = RouterModule.forChild(routes);
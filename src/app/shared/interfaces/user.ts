<<<<<<< HEAD
import { IPostInfo } from 'src/app/user/user.model'
=======
import { IPostInfo } from 'src/app/user/user.model';
import { IBase } from './base';
import { IPost } from './post';
>>>>>>> eb52c9df40334add5289f8c04ae574c2654b8856

export interface IUser{
  email: string;
  name: string;
  objectId: string;
  postsLiked: IPostInfo[];
  createdPosts: IPostInfo[];
}

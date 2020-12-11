import { IPostInfo } from 'src/app/user/user.model';
import { IBase } from './base';
import { IPost } from './post';

export interface IUser{
  email: string;
  name: string;
  objectId: string;
  postsLiked: IPostInfo[];
  createdPosts: IPostInfo[];
}

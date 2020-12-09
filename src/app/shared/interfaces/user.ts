import { IBase } from './base';
import { IPost } from './post';

export interface IUser{
  createdPosts: {};
  email: string;
  name: string;
  objectId: string;
  postsLiked: [];
  savedPosts: [];
}

import { IPostInfo } from 'src/app/user/user.model'

export interface IUser{
  email: string;
  name: string;
  objectId: string;
  postsLiked: IPostInfo[];
  createdPosts: IPostInfo[];
}

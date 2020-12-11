import { IPost, IUser } from '../shared/interfaces';

export interface IPostInfo {
    title: string;
    objectId: string;
}

export class User implements IUser {
    constructor(
        public email: string,
        public name: string,
        public objectId: string,
        public token: string,
        public createdPosts: IPostInfo[],
        public postsLiked: IPostInfo[],
    ) { }
}
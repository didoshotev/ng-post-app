import { IPost, IUser } from '../shared/interfaces';

export class User implements IUser {
    constructor(
        public email: string,
        public name: string,
        public objectId: string,
        public token: string,
        public createdPosts: {},
        public likedPosts: {},
        public savedPosts: {},
    ) { }
}
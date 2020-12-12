import { IUser } from '../shared/interfaces';

export interface IPostInfo {
    title: string;
    objectId: string;
}

export class User implements IUser {
    constructor(
        public email: string,
        public name: string,
        public objectId: string,
        private _token: string,
        private _tokenExperationDate: Date,
        public createdPosts: IPostInfo[],
        public postsLiked: IPostInfo[],
    ) { }

    get token() {
        if (!this._tokenExperationDate || new Date() > this._tokenExperationDate) {
            return null;
        }
        return this._token;
    }
}
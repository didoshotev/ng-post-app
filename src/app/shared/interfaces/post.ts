import { IBase } from './base';
import { IUser } from './user';


export interface IPost extends IBase {
    likes: number,
    title: string,
    type: string,
    textContent: string,
    creatorId: string,
}
import {IUser} from 'src/entity/user'

declare global {
    declare namespace Express {
        export interface Request {
            user: IUser;
        }
    }
}

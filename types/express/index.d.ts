import { UserDocument } from 'src/entity/user'

declare global {
  declare namespace Express {
    export interface Request {
      user: UserDocument
    }
  }
}

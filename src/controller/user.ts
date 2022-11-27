import { Request, Response } from 'express'
import { UserDocument } from '../entity/user'

class UserController {
  getMe(req: Request, res: Response) {
    const user: UserDocument = req.user
    return res.status(200).json({
      id: user.id,
      name: user.name,
      email: user.email,
    })
  }
}

export default UserController

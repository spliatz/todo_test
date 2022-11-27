import JwtHelper from '../../pkg/auth/jwt'
import { NextFunction, Request, Response } from 'express'
import { UserDocument } from '../../entity/user'
import { RefreshDocument } from '../../entity/refresh'
import { getErrorMessage } from '../../pkg/errors/exceptions'
import { Types } from 'mongoose'

abstract class IUserService {
  abstract getOneById(s: string): Promise<UserDocument | null>
}

abstract class IAuthService {
  abstract getRefreshByUserId(
    id: Types.ObjectId
  ): Promise<RefreshDocument | null>
}

class AuthMiddleware {
  constructor(
    private readonly userService: IUserService,
    private readonly authService: IAuthService
  ) {
    this.checkAccessToken = this.checkAccessToken.bind(this)
    this.checkRefreshToken = this.checkRefreshToken.bind(this)
  }

  async checkAccessToken(req: Request, res: Response, next: NextFunction) {
    const token = AuthMiddleware.getBearerToken(req)
    if (!token) {
      return res.status(401).json({ message: 'invalid access token' })
    }

    try {
      const payload = JwtHelper.parseAccess(token)
      const user = await this.userService.getOneById(payload!.id)
      if (!user) {
        return res.status(401).json({ message: 'invalid access token' })
      }
      req.user = user
      next()
    } catch (e) {
      console.log(getErrorMessage(e))
      return res.status(401).json({ message: 'invalid access token' })
    }
  }

  async checkRefreshToken(req: Request, res: Response, next: NextFunction) {
    const token = AuthMiddleware.getBearerToken(req)
    if (!token) {
      return res.status(401).json({ message: 'invalid refresh token' })
    }

    try {
      const payload = JwtHelper.parseRefresh(token)
      const user = await this.userService.getOneById(payload!.id)
      if (!user) {
        return res.status(401).json({ message: 'invalid refresh token' })
      }
      const refresh = await this.authService.getRefreshByUserId(user._id)
      if (!refresh || token !== refresh.token) {
        return res.status(401).json({ message: 'invalid access token' })
      }
      req.user = user
      next()
    } catch (e) {
      console.log(getErrorMessage(e))
      return res.status(401).json({ message: 'invalid refresh token' })
    }
  }

  private static getBearerToken(req: Request): string {
    if (!req.headers.authorization) {
      return ''
    }

    const authorization = req.headers.authorization.split(' ')
    if (authorization.length !== 2) {
      return ''
    }

    const type = authorization[0]
    const token = authorization[1]

    if (!token || type !== 'Bearer') {
      return ''
    }

    return token
  }
}

export default AuthMiddleware

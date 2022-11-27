import { Router, IRouter, Request, Response, NextFunction } from 'express'
import { param } from 'express-validator'

abstract class IUserController {
  abstract getMe(req: Request, res: Response): void
}

abstract class ITodoController {
  abstract getAllByUserId(req: Request, res: Response): void
}

abstract class IAuthMiddleware {
  abstract checkAccessToken(
    req: Request,
    res: Response,
    next: NextFunction
  ): void
}

class UserRouter {
  constructor(
    private readonly userController: IUserController,
    private readonly todoController: ITodoController,
    private readonly authMiddleware: IAuthMiddleware,
    private readonly router: IRouter = Router()
  ) {
    this.registerRoutes()
  }

  private registerRoutes() {
    this.router.get(
      '/',
      this.authMiddleware.checkAccessToken,
      this.userController.getMe
    )
    this.router.get(
      '/:userId/todos',
      param('userId').isString(),
      this.authMiddleware.checkAccessToken,
      this.todoController.getAllByUserId
    )
  }

  get Router() {
    return this.router
  }
}

export default UserRouter

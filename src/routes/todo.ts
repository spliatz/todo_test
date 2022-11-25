import {IRouter, NextFunction, Request, Response, Router} from "express";
import {body} from "express-validator";

abstract class IAuthMiddleware {
    abstract checkAccessToken(req: Request, res: Response, next: NextFunction): void;
}

abstract class IUserController {
    abstract create(req: Request, res: Response): void;
    abstract getOne(req: Request, res: Response): void;
    abstract editOne(req: Request, res: Response): void;
    abstract deleteOne(req: Request, res: Response): void;
}

class TodoRouter {

    constructor(
        private readonly userController: IUserController,
        private readonly authMiddleware: IAuthMiddleware,
        private readonly router: IRouter = Router()
    ) {
        this.registerRoutes()
    }

    private registerRoutes() {
        this.router.post(
            '/',
            this.authMiddleware.checkAccessToken,
            body('title').isString(),
            body('description').isString(),
            this.userController.create)

        this.router.get(
            '/:id',
            this.authMiddleware.checkAccessToken,
            this.userController.getOne
        )

        this.router.put(
            '/:id',
            this.authMiddleware.checkAccessToken,
            body('title').isString(),
            body('description').isString(),
            this.userController.editOne,
        )

        this.router.delete(
            '/:id',
            this.authMiddleware.checkAccessToken,
            this.userController.deleteOne,
        )
    }

    get Router() {
        return this.router;
    }
}

export default TodoRouter;

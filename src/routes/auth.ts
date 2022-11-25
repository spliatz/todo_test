import {IRouter, NextFunction, Request, Response, Router} from "express";
import {body} from "express-validator";

abstract class IAuthController {
    abstract signUp(req: Request, res: Response): void;

    abstract signIn(req: Request, res: Response): void;

    abstract refresh(req: Request, res: Response): void;

    abstract logout(req: Request, res: Response): void;
}

abstract class IAuthMiddleware {
    abstract checkRefreshToken(req: Request, res: Response, next: NextFunction): void;
}

class AuthRouter {

    constructor(
        private readonly authController: IAuthController,
        private readonly authMiddleware: IAuthMiddleware,
        private readonly router: IRouter = Router()) {

        this.registerRoutes()
    }

    private registerRoutes() {
        this.router.post('/sign-up',
            body('name',).isLength({min: 2, max: 30}),
            body('password').isLength({min: 8, max: 64}),
            body('email').isEmail(),
            this.authController.signUp)

        this.router.post(
            '/sign-in',
            body('email').isEmail(),
            body('password').isString().isLength({min: 8, max: 64}),
            this.authController.signIn)

        this.router.post(
            '/refresh',
            this.authMiddleware.checkRefreshToken,
            this.authController.refresh
        )

        this.router.delete(
            '/logout',
            this.authMiddleware.checkRefreshToken,
            this.authController.logout
        )
    }

    get Router() {
        return this.router;
    }
}

export default AuthRouter;
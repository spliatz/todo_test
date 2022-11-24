import {Router} from "express";
import {body} from "express-validator";

class AuthRouter {
    #router;
    #authController;
    #authMiddleware;

    constructor(authController, authMiddleware) {
        this.#router = Router();
        this.#authController = authController;
        this.#authMiddleware = authMiddleware;
    }

    RegisterRoutes() {
        this.#router.post('/sign-up',
            body('name',).isLength({min: 2, max: 30}),
            body('password').isLength({min: 8, max: 64}),
            body('email').isEmail(),
            this.#authController.signUp)

        this.#router.post(
            '/sign-in',
            body('email').isEmail(),
            body('password').isString().isLength({min: 8, max: 64}),
            this.#authController.signIn)

        this.#router.post(
            '/refresh',
            this.#authMiddleware.checkRefreshToken,
            this.#authController.refresh

        )

        this.#router.delete(
            '/logout',
            this.#authMiddleware.checkRefreshToken,
            this.#authController.logout
        )
    }

    get router() {
        return this.#router;
    }
}

export default AuthRouter;
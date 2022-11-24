import {Router} from 'express';

class UserRouter {
    #router;
    #userController;
    #authMiddleware;

    constructor(userController, authMiddleware) {
        this.#router = Router();
        this.#authMiddleware = authMiddleware;
        this.#userController = userController;
    }

    RegisterRoutes() {
        this.#router.get('/', this.#authMiddleware.checkAccessToken, this.#userController.getMe);
    }

    get router() {
        return this.#router;
    }
}

export default UserRouter;
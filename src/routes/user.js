import {Router} from 'express';
import {param} from "express-validator";

class UserRouter {
    #router;
    #userController;
    #todoController;
    #authMiddleware;

    constructor(userController, todoController, authMiddleware) {
        this.#router = Router();
        this.#authMiddleware = authMiddleware;
        this.#userController = userController;
        this.#todoController = todoController;
    }

    RegisterRoutes() {
        this.#router.get('/', this.#authMiddleware.checkAccessToken, this.#userController.getMe);
        this.#router.get(
            '/:userId/todos',
            param('userId').isString(),
            this.#authMiddleware.checkAccessToken,
            this.#todoController.getAllByUserId)
    }

    get router() {
        return this.#router;
    }
}

export default UserRouter;
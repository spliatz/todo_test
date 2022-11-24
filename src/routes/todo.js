import {Router} from "express";
import {body} from "express-validator";

class TodoRouter {
    #router;
    #userController;
    #authMiddleware;

    constructor(userController, authMiddleware) {
        this.#router = Router();
        this.#userController = userController;
        this.#authMiddleware = authMiddleware;
    }

    RegisterRoutes() {
        this.#router.post(
            '/',
            this.#authMiddleware.checkAccessToken,
            body('title').isString(),
            body('description').isString(),
            this.#userController.create)

        this.#router.get(
            '/:id',
            this.#authMiddleware.checkAccessToken,
            this.#userController.getOne
        )

        this.#router.put(
            '/:id',
            this.#authMiddleware.checkAccessToken,
            body('title').isString(),
            body('description').isString(),
            this.#userController.editOne,
        )

        this.#router.delete(
            '/:id',
            this.#authMiddleware.checkAccessToken,
            this.#userController.deleteOne,
        )
    }

    get router() {
        return this.#router;
    }
}

export default TodoRouter;

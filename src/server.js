import cors  from "cors";
import express  from "express";
import bodyParser  from 'body-parser';

class Server {
    #app;
    #port;

    // routes
    #userRouter;
    #todoRouter;
    #authRouter;

    constructor(app, port, userRouter, todoRouter, authRouter) {
        this.#app = app;
        this.#port = port;
        this.#userRouter = userRouter;
        this.#todoRouter = todoRouter;
        this.#authRouter = authRouter
    }

    Run() {
        this.#run();
    }

    InitServer() {
        this.#initServer();
    }

    InitRoutes() {
        this.#initRoutes();
    }

    #run() {
        this.#app.listen(this.#port, () => console.log(`SERVER IS LISTENING...\nPORT: ${this.#port}`));
    }

    #initServer() {
        this.#app.use(cors()); // cors allow
        this.#app.use(bodyParser.urlencoded({extended: true}));
        this.#app.use(express.json());
    }

    #initRoutes() {
        {
            this.#userRouter.RegisterRoutes()
            this.#app.use('/user', this.#userRouter.router);
        }
        {
            this.#todoRouter.RegisterRoutes()
            this.#app.use('/todo', this.#todoRouter.router)
        }
        {
            this.#authRouter.RegisterRoutes()
            this.#app.use('/auth', this.#authRouter.router)
        }
    }
}

export default Server;
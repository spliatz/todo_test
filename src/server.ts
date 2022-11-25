import cors  from "cors";
import express, {Express, IRouter as ExpressRouter}  from "express";
import bodyParser  from 'body-parser';

abstract class IRouter {
    abstract get Router(): ExpressRouter;
}

class Server {
    
    constructor(
        private readonly app: Express, 
        private readonly port: number, 
        private readonly userRouter: IRouter, 
        private readonly todoRouter: IRouter, 
        private readonly authRouter: IRouter) {
        
    }

    public Run() {
        this.run();
    }

    public InitServer() {
        this.initServer();
    }

    public InitRoutes() {
        this.initRoutes();
    }

    private run() {
        this.app.listen(this.port, () => console.log(`SERVER IS LISTENING...\nPORT: ${this.port}`));
    }

    private initServer() {
        this.app.use(cors()); // cors allow
        this.app.use(bodyParser.urlencoded({extended: true}));
        this.app.use(express.json());
    }

    private initRoutes() {
            this.app.use('/user', this.userRouter.Router);
            this.app.use('/todo', this.todoRouter.Router)
            this.app.use('/auth', this.authRouter.Router)
    }
}

export default Server;
import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
import Server from "./src/server";

// models
import userModel from './src/entity/user'
import todoModel from './src/entity/todo'
import refreshModel from './src/entity/refresh'

// routes
import UserRouter from './src/routes/user';
import TodoRouter from "./src/routes/todo";
import AuthRouter from "./src/routes/auth";

// controllers
import UserController from './src/controller/user';
import TodoController from './src/controller/todo';
import AuthController from './src/controller/auth';

// middlewares
import AuthMiddleware from "./src/controller/middleware/auth";

// services
import UserService from "./src/service/user";
import TodoService from "./src/service/todo";
import AuthService from "./src/service/auth";

dotenv.config()

const app = express();

const port = Number(process.env.PORT) || 8000;
const mongoConnectionString = process.env.IS_ATLAS as string === 'true' ?
    process.env.MONGO_ATLAS as string : process.env.MONGO_LOCAL as string;

const connectDB = async () => {
    return mongoose.connect(mongoConnectionString);
}

const bootstrap = async () => {

    const userService = new UserService(userModel);
    const todoService = new TodoService(todoModel);
    const authService = new AuthService(refreshModel)

    const userController = new UserController();
    const todoController = new TodoController(todoService);
    const authController = new AuthController(authService, userService);
    const authMiddleware = new AuthMiddleware(userService, authService);

    const userRouter = new UserRouter(userController, todoController, authMiddleware);
    const todoRouter = new TodoRouter(todoController, authMiddleware);
    const authRouter = new AuthRouter(authController, authMiddleware);

    const server = new Server(app, port, userRouter, todoRouter, authRouter);

    try {
        await connectDB();
        server.InitServer();
        server.InitRoutes();
        server.Run();
    } catch (e) {
        console.log(`ERROR: ${e}`);
        process.exit(1);
    }
}

bootstrap();

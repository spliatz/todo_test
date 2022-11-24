import express from 'express';
import mongoose from 'mongoose';
import * as dotenv from 'dotenv'
dotenv.config()

const app = express();

import Server from "./src/server.js";

// models
import userModel from './src/entity/user.js'
import todoModel from './src/entity/todo.js'
import refreshModel from  './src/entity/refresh.js'

// routes
import UserRouter from './src/routes/user.js';
import TodoRouter from "./src/routes/todo.js";
import AuthRouter from "./src/routes/auth.js";

// controllers
import UserController from './src/controller/user.js';
import TodoController from './src/controller/todo.js';
import AuthController from './src/controller/auth.js';

// middlewares
import AuthMiddleware from "./src/controller/middleware/auth.js";

// services
import UserService from "./src/service/user.js";
import TodoService from "./src/service/todo.js";
import AuthService from "./src/service/auth.js";

const port = Number(process.env.PORT) || 8000;
const mongoConnectionString = process.env.IS_ATLAS === 'true' ?  process.env.MONGO_ATLAS : process.env.MONGO_LOCAL;

const connectDB = async () => {
    return mongoose.connect(mongoConnectionString);
}

const bootstrap = async () => {

    const userService = new UserService(userModel);
    const todoService = new TodoService(todoModel);
    const authService = new AuthService(refreshModel)

    const userController = new UserController(userService);
    const todoController = new TodoController(todoService);
    const authController = new AuthController(authService, userService);
    const authMiddleware = new AuthMiddleware(userService, authService);

    const userRouter = new UserRouter(userController, authMiddleware);
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

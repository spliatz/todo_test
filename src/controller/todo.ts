import {Request, Response} from "express";
import {validationResult} from "express-validator";
import {getErrorMessage} from "../pkg/errors/exceptions";
import {Types} from "mongoose";
import {ITodo} from "../entity/todo";

abstract class ITodoService {
    abstract create(userId: Types.ObjectId, title: string, description: string): Promise<string>;

    abstract editOne(id: string, title: string, description: string): Promise<ITodo | null>;

    abstract getOne(id: string): Promise<ITodo | null>

    abstract deleteOne(id: string): Promise<void>;

    abstract getAllByUserId(userId: Types.ObjectId, page: number, limit: number): Promise<ITodo[]>;
}

class TodoController {

    constructor(private readonly todoService: ITodoService) {
        this.create = this.create.bind(this);
        this.getOne = this.getOne.bind(this);
        this.getAllByUserId = this.getAllByUserId.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.editOne = this.editOne.bind(this);
    }

    async create(req: Request, res: Response) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {title, description} = req.body
        const user = req.user
        try {
            const id = await this.todoService.create(user._id, title, description)
            res.status(201).json({id})
        } catch (e) {
            return res.status(500).json({message: getErrorMessage(e)})
        }

    }

    async deleteOne(req: Request, res: Response) {
        const {id} = req.params;
        const user = req.user;
        try {
            const todoItem = await this.todoService.getOne(id);
            if (!todoItem) {
                return res.status(403).json({message: "todo item does not exist"});
            }
            if (!todoItem.author.equals(user._id)) {
                return res.status(401).json({message: "only author can delete todo-item"});
            }
            await this.todoService.deleteOne(id)
            return res.sendStatus(200)
        } catch (e) {
            return res.status(500).json({message: getErrorMessage(e)})
        }
    }

    async getOne(req: Request, res: Response) {
        const {id} = req.params
        try {
            const todoItem = await this.todoService.getOne(id)
            return res.status(200).json(todoItem)
        } catch (e) {
            return res.status(500).json({message: getErrorMessage(e)})
        }
    }

    async getAllByUserId(req: Request, res: Response) {
        const {userId} = req.params;
        const user = req.user;
        if (user.id !== userId) {
            return res.status(401).json({message: "нет доступа"})
        }

        const {page, limit} = req.query
        if (
            (page || limit) &&
            (page && isNaN(Number(page)) || limit && isNaN(Number(limit)))
        ) {
            return res.status(400).json({message: 'некорректные значения page или limit'})
        }
        try {
            const todos = await this.todoService.getAllByUserId(user._id, Number(page), Number(limit))
            return res.status(200).json(todos)
        } catch (e) {
            return res.status(500).json({message: getErrorMessage(e)})
        }
    }

    async editOne(req: Request, res: Response) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {title, description} = req.body;
        const {id} = req.params;
        const user = req.user;

        try {
            const todoItem = await this.todoService.getOne(id);
            if (!todoItem) {
                return res.status(403).json({message: "todo item does not exist"});
            }
            if (!todoItem.author.equals(user._id)) {
                return res.status(401).json({message: "only author can edit todo-item"});
            }
            const updatedTodoItem = await this.todoService.editOne(id, title, description);
            return res.status(200).json(updatedTodoItem);
        } catch (e) {
            return res.status(500).json({message: getErrorMessage(e)})
        }
    }

}

export default TodoController;

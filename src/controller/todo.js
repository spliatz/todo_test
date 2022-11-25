import {validationResult} from "express-validator";

class TodoController {
    #service;

    constructor(service) {
        this.#service = service;

        this.create = this.create.bind(this);
        this.getOne = this.getOne.bind(this);
        this.getAllByUserId = this.getAllByUserId.bind(this);
        this.deleteOne = this.deleteOne.bind(this);
        this.editOne = this.editOne.bind(this);
    }

    async create(req, res) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {title, description} = req.body
        const user = req.user
        try {
            const id = await this.#service.create(user._id, title, description)
            res.status(201).json({id})
        } catch (e) {
            return res.status(500).json({message: e.message})
        }

    }

    async deleteOne(req, res) {
        const {id} = req.params;
        const user = req.user;
        try {
            const todoItem = await this.#service.getOne(id);
            if (!todoItem) {
                return res.status(403).json({message: "todo item does not exist"});
            }
            if (!todoItem.author.equals(user._id)) {
                return res.status(401).json({message: "only author can delete todo-item"});
            }
            await this.#service.deleteOne(id)
            return res.sendStatus(200)
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }

    async getOne(req, res) {
        const {id} = req.params
        try {
            const todoItem = await this.#service.getOne(id)
            return res.status(200).json(todoItem)
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }

    async getAllByUserId(req, res) {
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
            const todos = await this.#service.getAllByUserId(user._id, Number(page), Number(limit))
            return res.status(200).json(todos)
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }

    async editOne(req, res) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {title, description} = req.body;
        const {id} = req.params;
        const user = req.user;

        try {
            const todoItem = await this.#service.getOne(id);
            if (!todoItem) {
                return res.status(403).json({message: "todo item does not exist"});
            }
            if (!todoItem.author.equals(user._id)) {
                return res.status(401).json({message: "only author can edit todo-item"});
            }
            const updatedTodoItem = await this.#service.editOne(id, title, description);
            return res.status(200).json(updatedTodoItem);
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }

}

export default TodoController;

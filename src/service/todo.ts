import {ITodo, TodoModelType} from "../entity/todo";
import {Types} from "mongoose";

class TodoService {

    constructor(private readonly todoModel: TodoModelType) {
    }

    /**
     * Метод создает пользователя
     * @param {Types.ObjectId} userId
     * @param {string} title
     * @param {string} description
     * @returns {Promise<string>}
     */
    public async create(userId: Types.ObjectId, title: string, description: string): Promise<string> {
        const todoItem = new this.todoModel({
            title,
            description,
            author: userId,
            created_at: Date.now(),
            updated_at: Date.now(),
        })
        await todoItem.save();
        return todoItem.id;
    }

    /**
     * Метод удаляет todo-item по id
     * @param {string} todoId
     * @returns {Promise<void>}
     */
    public async deleteOne(todoId: string) {
        const todoItem = await this.getOne(todoId)
        if (!todoItem) throw new Error("todo-item does not exist")
        this.todoModel.deleteOne({id: todoId})
    }

    /**
     * Метод находит todo-item по id
     * @param {string} todoId
     * @returns {Promise<ITodo | null>}
     */
    async getOne(todoId: string): Promise<ITodo | null> {
        return this.todoModel.findOne({id: todoId})
    }

    /**
     * Метод находит все todo-item пользователя по id пользователя
     * @param {Types.ObjectId} userId
     * @param {number} page
     * @param {number} limit
     * @returns {Promise<ITodo[]>}
     */
    public async getAllByUserId(userId: Types.ObjectId, page: number, limit: number): Promise<ITodo[]> {
        page = page && page < 1 ? 1 : page
        limit = page && limit < 1 ? 10 : limit

        if (!page && limit) {
            page = 1
        } else if (!limit && page) {
            limit = 10
        }

        if (!page && !limit) {
            return this.todoModel.find({author: userId})
        }

        page = page === 1 ? 0 : page - 1

        return this.todoModel.find({author: userId}).skip(page * limit).limit(limit)
    }

    /**
     * Метод редактирует todo-item по id
     * @param {string} todoId
     * @param {string} title
     * @param {string} description
     * @returns {Promise<ITodo | null>}
     */
    public async editOne(todoId: string, title: string, description: string): Promise<ITodo | null> {
        const todoItem = await this.getOne(todoId)
        if (!todoItem) throw new Error("todo-item does not exist")

        return this.todoModel.findOneAndUpdate(
            {_id: todoItem._id},
            {
                title: title,
                description: description,
                author: todoItem.author,
                created_at: todoItem.created_at,
                updated_at: Date.now(),
            },
            {new: true})
    }
}

export default TodoService;

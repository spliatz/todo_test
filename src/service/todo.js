import Todo from "../entity/todo.js";

class TodoService {
    #model; // Todo model

    constructor(model) {
        this.#model = model
    }

    /**
     * Метод создает пользователя
     * @param {string} userId
     * @param {string} title
     * @param {string} description
     * @returns {Promise<string>}
     */
    async create(userId, title, description) {
        const todoItem = new this.#model({
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
     * @returns {Promise<Todo>}
     */
    async deleteOne(todoId) {
        const todoItem = await this.getOne(todoId)
        if (!todoItem) throw new Error("todo-item does not exist")

        return this.#model.deleteOne({_id: todoId})
    }

    /**
     * Метод находит todo-item по id
     * @param {string} todoId
     * @returns {Promise<Todo>}
     */
    async getOne(todoId) {
        return this.#model.findOne({_id: todoId})
    }

    /**
     * Метод находит все todo-item пользователя по id пользователя
     * @param {string} userId
     * @param {number} page
     * @param {number} limit
     * @returns {Promise<Todo[]>}
     */
    async getAllByUserId(userId, page, limit ) {
        page = page && page < 1 ? 1 : page
        limit = page && limit < 1 ? 10 : limit

        if (!page && limit) {
            page = 1
        } else if (!limit && page) {
            limit = 10
        }

        if (!page && !limit) {
            return this.#model.find({author: userId})
        }

        page = page === 1 ? 0 : page - 1

        return this.#model.find({author: userId}).skip(page*limit).limit(limit)
    }

    /**
     * Метод редактирует todo-item по id
     * @param {string} todoId
     * @param {string} title
     * @param {string} description
     * @returns {Promise<Todo>}
     */
    async editOne(todoId, title, description) {
        const todoItem = await this.getOne(todoId)
        if (!todoItem) throw new Error("todo-item does not exist")

        return this.#model.findOneAndUpdate(
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

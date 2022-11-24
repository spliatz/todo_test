class TodoService {
    #model;
    constructor(model) {
        this.#model = model
    }

    async create(userId, title, description) {
        const todoItem = new this.#model({
            title,
            description,
            author: userId,
            created_at: Date.now(),
            updated_at: Date.now(),
        })
        await todoItem.save();

        return todoItem._id;
    }

    async deleteOne(todoId) {
        const todoItem = await this.getOne(todoId)
        if (!todoItem) throw new Error("todo-item does not exist")

        return this.#model.deleteOne({_id: todoId})
    }

    async getOne(todoId) {
        return await this.#model.findOne({_id: todoId})
    }

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

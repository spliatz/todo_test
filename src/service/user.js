import Hasher from "../pkg/hash/hasher.js";

class UserService {
    #model;

    constructor(model) {
        this.#model = model;
    }

    async create(name, email, password) {
        const hash = Hasher.hashPassword(password)
        const user = new this.#model({name: name, email: email, password: hash});
        await user.save();
        return user.id;
    }

    async checkUserPassword(password, hashedPassword) {
        return Hasher.isHashedPasswordCompare(password, hashedPassword)
    }

    async getOneByEmail(email) {
        return this.#model.findOne({email: email})
    }

    async getOneById(id) {
        return this.#model.findOne({_id: id})
    }

}

export default UserService;
import Hasher from "../pkg/hash/hasher.js";
import User from "../entity/user.js";

class UserService {
    #model; // User model

    constructor(model) {
        this.#model = model;
    }

    /**
     *
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @returns {Promise<string>}
     */
    async create(name, email, password) {
        const hash = Hasher.hashPassword(password)
        const user = new this.#model({name: name, email: email, password: hash});
        await user.save();
        return user.id;
    }

    /**
     *
     * @param {string} password
     * @param {string} hashedPassword
     * @returns {Promise<boolean>}
     */
    async checkUserPassword(password, hashedPassword) {
        return Hasher.isHashedPasswordCompare(password, hashedPassword)
    }

    /**
     *
     * @param {string} email
     * @returns {Promise<User>}
     */
    async getOneByEmail(email) {
        return this.#model.findOne({email: email})
    }

    /**
     *
     * @param {string} id
     * @returns {Promise<User>}
     */
    async getOneById(id) {
        return this.#model.findOne({_id: id})
    }

}

export default UserService;
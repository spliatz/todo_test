import {IUser, UserModelType} from "../entity/user";
import Hasher from "../pkg/hash/hasher";

class UserService {

    constructor(private readonly userModel: UserModelType) {}

    /**
     *
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @returns {Promise<string>}
     */
    public async create(name: string, email: string, password: string): Promise<string> {
        const hash = Hasher.hashPassword(password)
        const user = new this.userModel({name: name, email: email, password: hash});
        await user.save();
        return user.id;
    }

    /**
     *
     * @param {string} password
     * @param {string} hashedPassword
     * @returns {boolean}
     */
    public checkUserPassword(password: string, hashedPassword: string): boolean {
        return Hasher.isHashedPasswordCompare(password, hashedPassword)
    }

    /**
     *
     * @param {string} email
     * @returns {Promise<IUser | null>}
     */
    public async getOneByEmail(email: string): Promise<IUser | null> {
        return this.userModel.findOne({email: email})
    }

    /**
     *
     * @param {string} id
     * @returns {Promise<User>}
     */
    public async getOneById(id: string): Promise<IUser | null> {
        return this.userModel.findOne({_id: id})
    }

}

export default UserService;
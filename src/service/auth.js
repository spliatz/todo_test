import JwtHelper from "../pkg/auth/jwt.js";
import Refresh from "../entity/refresh.js";
import { Types } from "mongoose";

class AuthService {
    #refreshModel; // Refresh model

    constructor(refreshModel) {
        this.#refreshModel = refreshModel;
    }

    /**
     * Генерирует связку из двух токенов - Access и Refresh
     * @param {string} id id пользователя
     * @returns {{access: {token: (string)}, refresh: {token: (string)}}}
     */
    generateTokens(id) {
        const accessToken = JwtHelper.generateAccess(id)
        const refreshToken = JwtHelper.generateRefresh(id)
        return {
            access: {token: accessToken},
            refresh: {token: refreshToken}
        }
    }

    /**
     * Метод получения refresh токена по ID пользователя
     * @param {string} token
     * @param {string} userId
     * @returns {void}
     */
    async saveRefresh(token, userId) {
        const now = new Date()
        const refresh = new this.#refreshModel({
            token: token,
            created_at: now.getTime(),
            expires_at: now.getTime() + (86400000 * 30),
            user: userId,
        })
        await refresh.save()
    }

    /**
     * Метод получения refresh токена по ID пользователя
     * @param {Types.ObjectId} userId
     * @returns {Promise}
     */
    async getRefreshByUserId(userId) {
        return this.#refreshModel.findOne({user: userId});
    }

    /**
     * Метод удаления refresh токена по ID пользователя
     * @param {string} userId
     * @returns {Promise}
     */
    async deleteRefreshByUserId(userId) {
        return this.#refreshModel.deleteOne({user: userId});
    }

}

export default AuthService;
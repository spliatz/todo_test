import JwtHelper from "../pkg/auth/jwt.js";

class AuthService {
    #refreshModel;

    constructor(refreshModel) {
        this.#refreshModel = refreshModel;
    }

    generateTokens(id) {
        const accessToken = JwtHelper.generateAccess(id)
        const refreshToken = JwtHelper.generateRefresh(id)
        return {
            access: {token: accessToken},
            refresh: {token: refreshToken}
        }
    }

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

    async getRefreshByUserId(userId) {
        return this.#refreshModel.findOne({user: userId});
    }

    async deleteRefreshByUserId(userId) {
        return this.#refreshModel.deleteOne({user: userId});
    }

}

export default AuthService;
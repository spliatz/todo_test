import JwtHelper from "../../pkg/auth/jwt.js";

class AuthMiddleware {
    #userService;
    #authService;

    constructor(userService, authService) {
        this.#userService = userService;
        this.#authService = authService;

        this.checkAccessToken = this.checkAccessToken.bind(this);
        this.checkRefreshToken = this.checkRefreshToken.bind(this);
    }

    async checkAccessToken(req, res, next) {
        const token = AuthMiddleware.#getBearerToken(req)
        if (!token) {
            return res.status(401).json({message: 'invalid access token'})
        }

        try {
            const payload = JwtHelper.parseAccess(token)
            const user = await this.#userService.getOneById(payload.id)
            if (!user) {
                return res.status(401).json({message: 'invalid access token'})
            }
            req.user = user
            next();
        } catch (e) {
            return res.status(401).json({message: 'invalid access token'})
        }
    }

    async checkRefreshToken(req, res, next) {
        const token = AuthMiddleware.#getBearerToken(req)
        if (!token) {
            return res.status(401).json({message: 'invalid refresh token'})
        }

        try {
            const payload = JwtHelper.parseRefresh(token)
            const user = await this.#userService.getOneById(payload.id)
            if (!user) {
                return res.status(401).json({message: 'invalid refresh token'})
            }
            const refresh = await this.#authService.getRefreshByUserId(user._id)
            if (!refresh || token !== refresh.token) {
                return res.status(401).json({message: 'invalid access token'})
            }
            req.user = user
            next();
        } catch (e) {
            console.log(e.message)
            return res.status(401).json({message: 'invalid refresh token'})
        }
    }

    static #getBearerToken(req) {
        if (!req.headers.authorization) {
            return null;
        }

        const authorization = req.headers.authorization.split(' ');
        if (authorization.length !== 2) {
            return null;
        }

        const type = authorization[0]
        const token = authorization[1]

        if (!token || type !== 'Bearer') {
            return null
        }

        return token
    }

}

export default AuthMiddleware;
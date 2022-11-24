import {validationResult} from "express-validator";

class AuthController {
    #authService;
    #userService;

    constructor(authService, userService) {
        this.#authService = authService;
        this.#userService = userService;

        this.signUp = this.signUp.bind(this)
        this.signIn = this.signIn.bind(this)
        this.refresh = this.refresh.bind(this)
        this.logout = this.logout.bind(this)
    }

    async signUp(req, res) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {name, email, password} = req.body

        try {
            const candidate = await this.#userService.getOneByEmail(email)
            if (candidate) {
                return res.status(400).json({message: "user already exists"})
            }
            const id = await this.#userService.create(name, email, password)
            return res.status(200).json({id})
        } catch (e) {
            console.log(e)
            res.status(500).json(e)
        }
    }

    async signIn(req, res) {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {email, password} = req.body

        try {
            const user = await this.#userService.getOneByEmail(email)
            if (!user) {
                return res.status(400).json({message: 'incorrect email or password'});
            }

            const verifyPassword = this.#userService.checkUserPassword(password, user.password)
            if (!verifyPassword) {
                return res.status(400).json({message: 'incorrect email or password'});
            }

            const tokens = this.#authService.generateTokens(user._id)
            const refresh = await this.#authService.getRefreshByUserId(user._id)
            if (refresh) {
                await this.#authService.deleteRefreshByUserId(user._id)
            }
            await this.#authService.saveRefresh(tokens.refresh.token, user._id);
            return res.status(201).json(tokens)

        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }

    async refresh(req, res) {
        const user = req.user
        try {
            const refresh = await this.#authService.getRefreshByUserId(user._id)
            if (refresh) {
                await this.#authService.deleteRefreshByUserId(user._id)
            }
            const tokens = this.#authService.generateTokens(user._id)
            await this.#authService.saveRefresh(tokens.refresh.token, user._id)
            res.status(201).json(tokens);
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }

    async logout(req, res) {
        const user = req.user
        try {
            await this.#authService.deleteRefreshByUserId(user._id)
            res.sendStatus(200);
        } catch (e) {
            return res.status(500).json({message: e.message})
        }
    }

}

export default AuthController;
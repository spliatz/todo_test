import {Request, Response} from "express";
import {validationResult} from "express-validator";
import {IUser} from "../entity/user";
import {Types} from "mongoose";
import {IRefresh} from "../entity/refresh";
import {getErrorMessage} from "../pkg/errors/exceptions";
import {ITokens} from "../types/auth";

abstract class IAuthService {
    abstract generateTokens(id: string): ITokens;

    abstract saveRefresh(refreshToken: string, userId: Types.ObjectId): Promise<void>;

    abstract deleteRefreshByUserId(id: Types.ObjectId): Promise<void>;

    abstract getRefreshByUserId(id: Types.ObjectId): Promise<IRefresh | null>
}

abstract class IUserService {
    abstract getOneByEmail(email: string): Promise<IUser | null>;

    abstract create(name: string, email: string, password: string): Promise<string>;

    abstract checkUserPassword(password: string, hashPassword: string): boolean;
}

class AuthController {

    constructor(
        private readonly authService: IAuthService,
        private readonly userService: IUserService) {

        this.signUp = this.signUp.bind(this)
        this.signIn = this.signIn.bind(this)
        this.refresh = this.refresh.bind(this)
        this.logout = this.logout.bind(this)
    }

    async signUp(req: Request, res: Response) {
        const errors = validationResult(req)

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {name, email, password} = req.body

        try {
            const candidate = await this.userService.getOneByEmail(email)
            if (candidate) {
                return res.status(400).json({message: "user already exists"})
            }
            const id = await this.userService.create(name, email, password)
            return res.status(200).json({id})
        } catch (e) {
            console.log(e)
            return res.status(500).json({message: getErrorMessage(e)})
        }
    }

    async signIn(req: Request, res: Response) {

        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {email, password} = req.body

        try {
            const user = await this.userService.getOneByEmail(email)
            if (!user) {
                return res.status(400).json({message: 'incorrect email or password'});
            }

            const verifyPassword = this.userService.checkUserPassword(password, user.password)
            if (!verifyPassword) {
                return res.status(400).json({message: 'incorrect email or password'});
            }

            const tokens = this.authService.generateTokens(user.id)
            const refresh = await this.authService.getRefreshByUserId(user._id)
            if (refresh) {
                await this.authService.deleteRefreshByUserId(user._id)
            }
            await this.authService.saveRefresh(tokens.refresh.token, user._id);
            return res.status(201).json(tokens)

        } catch (e) {
            return res.status(500).json({message: getErrorMessage(e)})
        }
    }

    async refresh(req: Request, res: Response) {
        const user = req.user
        try {
            const refresh = await this.authService.getRefreshByUserId(user._id)
            if (refresh) {
                await this.authService.deleteRefreshByUserId(user._id)
            }
            const tokens = this.authService.generateTokens(user._id)
            await this.authService.saveRefresh(tokens.refresh.token, user._id)
            res.status(201).json(tokens);
        } catch (e) {
            return res.status(500).json({message: getErrorMessage(e)})
        }
    }

    async logout(req: Request, res: Response) {
        const user = req.user
        try {
            await this.authService.deleteRefreshByUserId(user._id)
            res.sendStatus(200);
        } catch (e) {
            return res.status(500).json({message: getErrorMessage(e)})
        }
    }

}

export default AuthController;
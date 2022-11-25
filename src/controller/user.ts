import {Request, Response} from "express";

class UserController {

    getMe(req: Request, res: Response) {
        return res.status(200).json(req.user);
    }

}

export default UserController;
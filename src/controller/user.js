class UserController {
    #service;

    constructor(service) {
        this.#service = service;
    }

    getMe(req, res) {
        return res.status(200).json(req.user);
    }

}

export default UserController;
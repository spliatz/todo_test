import bcrypt from 'bcrypt'

class Hasher {
    hashPassword(password) {
        return bcrypt.hashSync(password, process.env.HASH_SALT)
    }

    isHashedPasswordCompare (password, hashedPassword) {
        return bcrypt.compareSync(password, hashedPassword)
    }
}

export default new Hasher();
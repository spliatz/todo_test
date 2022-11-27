import bcrypt from 'bcrypt'

class Hasher {
  hashPassword(password: string): string {
    return bcrypt.hashSync(password, process.env.HASH_SALT as string)
  }

  isHashedPasswordCompare(password: string, hashedPassword: string): boolean {
    return bcrypt.compareSync(password, hashedPassword)
  }
}

export default new Hasher()

import { RefreshDocument, RefreshModelType } from '../entity/refresh'
import { ITokens } from '../types/auth'
import { Types } from 'mongoose'
import JwtHelper from '../pkg/auth/jwt'

class AuthService {
  constructor(private readonly refreshModel: RefreshModelType) {}

  /**
   * Генерирует связку из двух токенов - Access и Refresh
   * @param {string} id id пользователя
   * @returns {ITokens}
   */
  public generateTokens(id: string): ITokens {
    const accessToken = JwtHelper.generateAccess(id)
    const refreshToken = JwtHelper.generateRefresh(id)
    return {
      access: { token: accessToken },
      refresh: { token: refreshToken },
    }
  }

  /**
   * Метод получения refresh токена по ID пользователя
   * @param {string} token
   * @param {Types.ObjectId} userId
   * @returns {Promise<void>}
   */
  public async saveRefresh(
    token: string,
    userId: Types.ObjectId
  ): Promise<void> {
    const now = new Date()
    const refresh = new this.refreshModel({
      token: token,
      created_at: now.getTime(),
      expires_at: now.getTime() + 86400000 * 30,
      user: userId,
    })
    await refresh.save()
  }

  /**
   * Метод получения refresh токена по ID пользователя
   * @param {Types.ObjectId} userId
   * @returns {Promise<RefreshDocument | null>}
   */
  public async getRefreshByUserId(
    userId: Types.ObjectId
  ): Promise<RefreshDocument | null> {
    return this.refreshModel.findOne({ user: userId })
  }

  /**
   * Метод удаления refresh токена по ID пользователя
   * @param {Types.ObjectId} userId
   * @returns {Promise<void>}
   */
  public async deleteRefreshByUserId(userId: Types.ObjectId): Promise<void> {
    await this.refreshModel.deleteOne({ user: userId })
  }
}

export default AuthService

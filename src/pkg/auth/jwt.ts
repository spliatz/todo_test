import jwt from 'jsonwebtoken';

interface IPayload {
    id: string
}

class JwtHelper {

    generateAccess(userId: string): string {
        const payload: IPayload = {id: userId}
        return jwt.sign(payload, process.env.JWT_ACCESS_KEY as string, {expiresIn: '15m'})
    }

    generateRefresh(userId: string): string {
        const payload: IPayload = {id: userId}
        return jwt.sign(payload, process.env.JWT_REFRESH_KEY as string, {expiresIn: '30d'})
    }

    parseAccess(token: string): IPayload | null {
        let decode: IPayload | null = null;
        jwt.verify(token, process.env.JWT_ACCESS_KEY as string, (err, dec) => {
            decode = <IPayload>dec
        });
        return decode;
    }

    parseRefresh(token: string): IPayload | null {
        let decode: IPayload | null = null
        jwt.verify(token, process.env.JWT_REFRESH_KEY as string, (err, dec) => {
            decode = <IPayload>dec
        });
        return decode;
    }
}

export default new JwtHelper();
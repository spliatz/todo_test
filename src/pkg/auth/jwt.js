import jwt from 'jsonwebtoken';

class JwtHelper {

    generateAccess(userId) {
        return jwt.sign({id: userId}, process.env.JWT_ACCESS_KEY, {expiresIn: '15m'})
    }

    generateRefresh(userId) {
        return jwt.sign( {id: userId}, process.env.JWT_REFRESH_KEY, {expiresIn: '30d'})
    }

    parseAccess(token) {
        let decode;
        jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, dec) => {
            decode = dec
        });

        return decode;
    }

    parseRefresh(token) {
        let decode;
        jwt.verify(token, process.env.JWT_REFRESH_KEY, (err, dec) => {
            decode = dec
        });

        return decode;
    }
}

export default new JwtHelper();
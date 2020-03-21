import crypto from 'crypto';
import config from 'config';
import jwt from 'jsonwebtoken';

const {
  secret, ttl, algorithm, inputEncoding, outputEncoding,
} = config.get('auth.resetPassword');

export class CipherHelper {
   genRandomString(length: number | undefined) {
    // @ts-ignore
     return crypto.randomBytes(Math.ceil(length / 2))
      .toString('hex')
      .slice(0, length);
  }

   getStringValue(data: any) {
    if (typeof data === 'number' || data instanceof Number) {
      return data.toString();
    }
    if (!Buffer.isBuffer(data) && typeof data !== 'string') {
      throw new TypeError('Data for password or salt must be a string or a buffer');
    }
    return data;
  }

   sha512(password: any, salt: any) {
     const hash = crypto.createHmac('sha512', this.getStringValue(salt));
    hash.update(this.getStringValue(password));
    const passwordHash = hash.digest('hex');

    return {
      salt,
      passwordHash,
    };
  }

   saltHashPassword(password: string) {
    const salt = this.genRandomString(16);
    return this.sha512(this.getStringValue(password), salt);
  }

   generateResetPasswordToken(userId: any) {
    const text = JSON.stringify({ userId, valid: new Date().getTime() + ttl });

    const cipher = crypto.createCipher(algorithm, secret);
    let ciphered = cipher.update(text, inputEncoding, outputEncoding);
    ciphered += cipher.final(outputEncoding);

    return ciphered;
  }

   decipherResetPasswordToken(ciphered: any) {
    const decipher = crypto.createDecipher(algorithm, secret);
    let deciphered = decipher.update(ciphered, outputEncoding, inputEncoding);
    deciphered += decipher.final(inputEncoding);

    return JSON.parse(deciphered);
  }

   generateResponseTokens(user: any) {
    const normalizedUser = { id: user.id, role: user.role, email: user.email };
    const accessToken = jwt.sign(
      normalizedUser,
      config.get('auth.jwt.accessTokenSecret'),
      { expiresIn: config.get('auth.jwt.accessTokenLife') },
    );
    const refreshToken = jwt.sign(
      normalizedUser,
      config.get('auth.jwt.refreshTokenSecret'),
      { expiresIn: config.get('auth.jwt.refreshTokenLife') },
    );

    return {
      expires_in: config.get('auth.jwt.accessTokenLife'),
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }
}

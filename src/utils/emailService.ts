// TODO Write
const config = require('config');
import {logger} from '../utils/logger';

const { domain } = config.get('frontEnd');

export class EmailService {
  doSend(email: string, text: string) {
    logger.info(text);
    return Promise.resolve(true);
  }

   sendResetPasswordEmail(email: string, fullName: string, token: string) {
    const text = `Hello ${fullName},`
      + '\nWe have received password reset request. '
      + `To do this, please proceed at ${domain}/#/auth/reset-password?reset_password_token=${token}`
      + '\nIf it wasn\'t you, take no action or contact support.'
      + '\n\nThank you,'
      + '\nSupport team.';

    return this.doSend(email, text);
  }
}

const express = require('express');
const passport = require('passport');

const cipher = require('../auth/cipherHelper');
const AuthService = require('./authService');

const router = express.Router();
const authService = new AuthService();
const auth = passport.authenticate('jwt', { session: false });

router.post('/login', (req: any, res: any) => {
  passport.authenticate('local', { session: false }, (err: any, user: any) => {
    if (err || !user) {
      return res.status(401).send({
        error: err ? err.message : 'Login or password is wrong',
      });
    }
    req.login(user, { session: false }, (error: any) => {
      if (error) {
        res.send(error);
      }

      const response = { token: cipher.generateResponseTokens(user) };
      res.send(response);
    });
  })(req, res);
});

router.post('/sign-up', (req: any, res: any) => {
  authService
    .register(req.body)
    .then((user: any) => {
      const response = { token: cipher.generateResponseTokens(user) };

      res.send(response);
    })
    .catch((err: any) => res.status(400).send({ error: err.message }));
});

router.post('/reset-pass', auth, (req: any, res: any) => {
  const { id } = req.user;
  const { password, confirmPassword, resetPasswordToken } = req.body;

  authService
    .resetPassword(password, confirmPassword, id, resetPasswordToken)
    .then(() => res.send({ message: 'ok' }))
    .catch((err: any) => {
      res.status(400).send({ error: err.message });
    });
});

router.post('/request-pass', (req: any, res: any) => {
  const { email } = req.body;
  authService
    .requestPassword(email)
    .then(() => res.send({ message: `Email with reset password instructions was sent to email ${email}.` }))
    .catch((error: any) => {
      res.status(400).send({ data: { errors: error.message } });
    });
});

router.post('/sign-out', (req: any, res: any) => {
  res.send({ message: 'ok' });
});

router.post('/refresh-token', (req: any, res: any) => {
  const token = req.body;
  authService
    .refreshToken(token)
    .then((tokens: any) => res.send(tokens))
    .catch((err: any) => res.status(400).send({ error: err.message }));
});

module.exports = router;

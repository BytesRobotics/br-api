import jwt from "jsonwebtoken";
import config from "config";

import { UserService } from "../user/userService";
import { CipherHelper } from "./cipherHelper";
import { EmailService } from "../../../utils/emailService";

const emailService = new EmailService();
const cipherHelper = new CipherHelper();

class AuthService {
  userService: any;

  constructor() {
    this.userService = new UserService();
  }

  register(user: any) {
    const { email } = user;

    return this.userService
      .findByEmail(email)
      .then((existingUser: any) => {
        if (existingUser) {
          throw new Error("User already exists");
        }

        const { salt, passwordHash } = cipherHelper.saltHashPassword(
          user.password
        );
        const newUser = {
          email: user.email,
          fullName: user.fullName,
          role: "user",
          age: 18,
          salt,
          passwordHash
        };

        return this.userService.addUser(newUser);
      })
      .then((response: any) => {
        if (response.result.ok === 1) {
          return this.userService.findByEmail(email);
        }
      });
  }

  resetPassword(
    password: any,
    confirmPassword: any,
    userId: any,
    resetPasswordToken: any
  ) {
    let currentUserId = userId;

    if (password.length < 4) {
      return Promise.reject(
        new Error("Password should be longer than 4 characters")
      );
    }

    if (password !== confirmPassword) {
      return Promise.reject(
        new Error("Password and its confirmation do not match.")
      );
    }

    if (resetPasswordToken) {
      const tokenContent = cipherHelper.decipherResetPasswordToken(
        resetPasswordToken
      );
      currentUserId = tokenContent.userId;

      if (new Date().getTime() > tokenContent.valid) {
        return Promise.reject(new Error("Reset password token has expired."));
      }
    }

    const { salt, passwordHash } = cipherHelper.saltHashPassword(password);

    return this.userService.changePassword(currentUserId, salt, passwordHash);
  }

  refreshToken(token: any) {
    if (!token.access_token || !token.refresh_token) {
      throw new Error("Invalid token format");
    }

    const tokenContent = jwt.decode(
      token.refresh_token,
      config.get("auth.jwt.refreshTokenSecret"),
      // @ts-ignore
      { expiresIn: config.get("auth.jwt.refreshTokenLife") }
    );

    return this.userService.findById(tokenContent.id).then((user: any) => {
      return cipherHelper.generateResponseTokens(user);
    });
  }

  requestPassword(email: string) {
    return this.userService
      .findByEmail(email)
      .then((user: any) => {
        if (user) {
          const token = cipherHelper.generateResetPasswordToken(user._id);

          return emailService.sendResetPasswordEmail(
            email,
            user.fullName,
            token
          );
        }

        throw new Error("There is no defined email in the system.");
      })
      .catch((error: any) => {
        throw error;
      });
  }
}

module.exports = AuthService;

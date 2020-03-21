import jwt from 'jsonwebtoken';
import config from 'config';

import {UserRepository} from './userRepository';
import {SettingsService} from '../settings/settingsService';

const cipher = require('../auth/cipherHelper');
const CustomErrorService = require('../../../utils/customErrorService');

const settingService = new SettingsService();

export class UserService {
  repository: any;

  constructor() {
    this.repository = new UserRepository();
  }

  getCount() {
    return this.repository.getCount();
  }

  findByEmail(email: string) {
    return this.repository.findByEmail(email);
  }

  findById(id: string) {
    return this.repository.findById(id)
      .then((user: any) => this.mapUserToDto(user));
  }

  addUser(user: any) {
    return this.repository.findByEmail(user.email).then((existingUser: any) => {
      if (existingUser) {
        throw new Error('User already exists');
      }
      return this.repository.add(user);
    })
  }

  addMany(users: any) {
    return this.repository.addMany(users);
  }

  editUser(dto: any, userId: string) {
    const user = this.mapDtoToUser(dto);

    return this.repository.findAllUsersByEmail(user.email)
      .then((users: any) => {
        if (this._isDuplicateEmail(users, userId)) {
          const errorData = {
            error: {
              code: 409,
              field: 'email',
              type: 'exist',
            },
          };

          throw new CustomErrorService('Email error', errorData);
        }

        return this.repository.edit(userId, user);
      })
      .then(() => this.findById(userId))
      .catch((error: any) => {
        throw error;
      });
  }

  editCurrentUser(dto: object, userId: string) {
    return this.editUser(dto, userId)
      .then((user: any) => {
        return cipher.generateResponseTokens(user);
      })
      .catch((error: any) => {
        throw error;
      });
  }

  deleteUser(id: string) {
    return this.repository.delete(id);
  }

  changePassword(id: string, salt: any, passwordHash: any) {
    return this.repository.changePassword(id, salt, passwordHash);
  }

  getPhoto(token: string) {
    let decoded;

    try {
      decoded = jwt.verify(token, config.get('auth.jwt.accessTokenSecret'));
    } catch (err) {
      Promise.reject(new Error('invalid token'));
    }

    // @ts-ignore
    return this.repository.getPhoto(decoded.id);
  }

  list(filter: any) {
    return Promise.all([
      this.repository.listFiltered(filter),
      this.repository.getCountFiltered(filter),
    ])
      .then(([data, count]) => {
        return {
          items: data.map((item: any) => this.mapUserToDto(item)),
          totalCount: count,
        };
      });
  }

  mapUserToDto(user: any) {
    return user ? {
      id: user._id,
      email: user.email,
      role: user.role,
      age: user.age,
      login: user.fullName,
      firstName: user.firstName,
      lastName: user.lastName,
      address: user.address || {},
      settings: settingService.mapSettingsToDto(this.getSettings(user.settings)),
    } : {};
  }

  getSettings(settings: any) {
    return settings && settings.length ? settings[0] : settings;
  }

  mapDtoToUser(dto: any) {
    return dto ? {
      email: dto.email,
      age: dto.age,
      role: dto.role,
      fullName: dto.login,
      firstName: dto.firstName,
      lastName: dto.lastName,
      address: dto.address,
    } : {};
  }

  _isDuplicateEmail(users: any, userId: string) {
    if (users && users.length === 0) {
      return false;
    }

    if (users.length > 1) {
      return true;
    }

    return users.some((user: any) => user._id.toString() !== userId.toString());
  }
}

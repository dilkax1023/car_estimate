import { UsersService } from './users.service';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { randomBytes, scrypt as _scrypt } from 'crypto';
import { promisify } from 'util';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signUp(email: string, password: string) {
    const users = await this.usersService.findAll(email);
    if (users.length) {
      throw new BadRequestException('Email in use');
    }

    // generate random string as salt values
    const salt = randomBytes(8).toString('hex');

    // hash the password: string
    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const hashedPassword = salt + '.' + hash.toString('hex');
    // save the user

    const user = await this.usersService.create(email, hashedPassword);

    return user;
  }

  async signIn(email: string, password: string) {
    const [user] = await this.usersService.findAll(email);

    if (!user) {
      throw new NotFoundException('User not found!');
    }

    const [salt, storedPassword] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    if (storedPassword !== hash.toString('hex')) {
      throw new BadRequestException();
    }

    return user;
  }
}

import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
  ) {}

  create(email: string, password: string) {
    const user = this.repo.create({ email, password });

    //we save a user after created it, this way all the listeners and subscribers
    //will be applied to User Entity.Alternatively we can pass a plain object to
    // save method to save a user, but in this way all the methods tied to User
    // Entity will be ignored
    return this.repo.save(user);
  }

  async findOne(id: number) {
    if (!id) {
      return null;
    }

    const user = await this.repo.findOne(id);

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  findAll(email: string) {
    return this.repo.find({ email });
  }

  async update(id: number, attrs: Partial<User>) {
    const user = await this.findOne(id);

    Object.assign(user, attrs);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    return this.repo.remove(user);
    // Alternatively we can use delete method but this dosnt trigger Entity listeners
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './user.entity';

@Injectable()
export class UserService {
    private saltRounds = 10;

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async create(user: User): Promise<any> {
        user.password = await this.salting(user.password);

        return this.userRepository.save(user);
    }

    async findOneByEmail(email: string): Promise<User> {
        return this.userRepository.findOne({ email });
    }

    async findAll(): Promise<User[]> {
        return this.userRepository.find();
    }

    async verifySalting(plainText: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plainText, hash);
    }

    async salting(stringToBeSalt: string): Promise<string> {
        return bcrypt.hash(stringToBeSalt, this.saltRounds);
    }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './create-user.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(user: CreateUserDto): Promise<User> {
        const userEntity = this.userRepository.create({
        name: user.name,
        server: user.server,
        displayName: user.displayName,
        summary: user.summary,
        icon: user.iconUrl
    });

        return await this.userRepository.save(userEntity);
    }

    async delete(name: string): Promise<User> {
        const user = await this.userRepository.findOne({ name: name });

        return await this.userRepository.remove(user);
    }

    async findAll(): Promise<User[]> {
        return await this.userRepository.find();
    }

    async find(id: number): Promise<User> {
        return await this.userRepository.findOne(id);
    }

    async findByName(name: string): Promise<User> {
        return await this.userRepository.findOne({ name: name });
    }
}

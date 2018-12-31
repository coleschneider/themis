import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Group } from './group.entity';
import { CreateGroupDto } from './create-group.dto';

@Injectable()
export class GroupService {
    constructor(
        @InjectRepository(Group)
        private readonly groupRepository: Repository<Group>
    ) {}

    async create(group: CreateGroupDto): Promise<Group> {
        const groupEntity = this.groupRepository.create({
            name: group.name,
            server: group.server,
            displayName: group.displayName,
            summary: group.summary
        });

        return await this.groupRepository.save(groupEntity);
    }

    async delete(name: string): Promise<Group> {
        const group = await this.groupRepository.findOne({ name: name });

        return await this.groupRepository.remove(group);
    }

    async findAll(): Promise<Group[]> {
        return this.groupRepository.find();
    }

    async find(id: number): Promise<Group> {
        return await this.groupRepository.findOne(id);
    }

    async findByName(name: string): Promise<Group> {
        const response = await this.groupRepository.findOne({ name: name });

        return response;
    }

    async findByIds(ids: number[]): Promise<Group[]> {
        return this.groupRepository.findByIds(ids);
    }
}

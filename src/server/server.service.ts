import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Server } from '../entities/server.entity';
import { ConfigService } from '../config/config.service';
import { Repository } from 'typeorm';
import * as URI from 'uri-js';
import { CreateServerDto } from '../dtos/create-server.dto';

/**
 * Despite the dumb name, this service allows us to work
 * with Themis servers as they are stored in the database.
 * 
 * There aren't too many operations we need to worry about
 * with this one, but it does have the added wrinkle of
 * storing the *local* server in the DB on first run.
 *
 * @export
 * @class ServerService
 */
@Injectable()
export class ServerService {
    constructor(
        @InjectRepository(Server)
        private readonly serverRepository: Repository<Server>,
        private readonly configService: ConfigService
    ) {
        const local = serverRepository.create({
            host: configService.serverAddress,
            port: configService.serverPort,
            scheme: configService.isHttps ? 'https': 'http'
        });

        serverRepository.findOneOrFail(local)
            .then(_ => true)
            .catch(_ => serverRepository.save(local))
    }

    async find(server: Partial<Server>): Promise<Server> {
        return this.serverRepository.findOneOrFail(server);
    }

    async findByHost(host: string): Promise<Server[]> {
        return this.serverRepository.find({host});
    }

    async findOrCreate(server: CreateServerDto): Promise<Server> {
        if (server.host == undefined) {
            return Promise.reject('No host given');
        } else {
            const result = await this.find({
                host: server.host,
                port: server.port,
                scheme: server.scheme
            });

            if (result != undefined) {
                return result;
            } else {
                return this.insert(server);
            }
        }
    }

    async local(): Promise<Server> {
        return this.serverRepository.findOne({
            host: this.configService.serverAddress,
            port: this.configService.serverPort
        });
    }

    isLocal(server: Server): boolean {
        return (
            server.host == this.configService.serverAddress &&
            server.port == this.configService.serverPort &&
            server.scheme === (this.configService.isHttps ? 'https' : 'http')
        );
    }

    localHostname(): string {
        const parts = {
            host: this.configService.serverAddress,
            port: this.configService.serverPort,
            scheme: (this.configService.isHttps ? 'https' : 'http')
        };

        return URI.normalize(URI.serialize(parts));
    }

    async insert(server: CreateServerDto): Promise<Server> {
        const serverEntity = this.serverRepository.create({
            host: server.host,
            port: server.port,
            scheme: server.scheme
        })
        return this.serverRepository.save(serverEntity);
    }

    async update(server: Partial<Server>): Promise<Server> {
        const newEntity = Object.assign(await this.find(server), server);

        return this.serverRepository.save(server);
    }

    async delete(server: Partial<Server>): Promise<Server[]> {
        const entityToDelete = await this.find(server);

        return this.serverRepository.remove([entityToDelete]);
    }

    parseHostname(host: string): CreateServerDto {
        // We may be passed bare host names, which technically *aren't*
        // URIs. Adding the double-slash to the start, however, works
        // to transform it into one.
        const hostAsUri = (host.includes('//') ? host : '//' + host);
        const parsed = URI.parse(hostAsUri);
        return {
            host: parsed.host || this.configService.serverAddress,
            scheme: parsed.scheme || 'http',
            port: +parsed.port || this.configService.serverPort
        }
    }
}

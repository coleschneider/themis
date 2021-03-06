import { Controller, Get, NotImplementedException, Post as HttpPost, Body, Param, MethodNotAllowedException, UseGuards, HttpCode, UseInterceptors, Query, BadRequestException, HttpException } from '@nestjs/common';
import { ApGroupService } from './ap-group.service';
import { Collection } from '../definitions/activities/collection-object';
import { AP } from '../definitions/constants';
import { ConfigService } from '../../config/config.service';
import { GroupActor } from '../definitions/actors/group.actor';
import { FederationGuard } from '../federation.guard';
import { LocationInterceptor } from '../location.interceptor';

@Controller('group')
export class ApGroupController {
    constructor(
        private readonly apGroupService: ApGroupService,
        private readonly configService: ConfigService
    ) {}

    @Get('/:name')
    async getGroupActor(@Param('name') name: string): Promise<GroupActor> {
        return this.apGroupService.getActorForGroup(name);
    }

    @Get('/:name/inbox')
    // TODO Auth guards, etc.
    async getInbox(@Param('name') name: string, @Query('page') page: number) {
        return this.apGroupService.getInbox(name, page);
    }

    @UseGuards(FederationGuard)
    @HttpPost('/:name/inbox')
    async postToInbox(@Param('name') name: string, @Body() body) {
        return this.apGroupService.handleIncoming(name, body);
    }

    @Get('/:name/outbox')
    async getOutbox(@Param('name') name: string, @Query('page') page: number) {
        return this.apGroupService.getOutbox(name, page);
    }

    @HttpPost('/:name/outbox')
    @HttpCode(201)
    @UseInterceptors(new LocationInterceptor)
    // TODO: How do we do auth guards? Groups are automatic.
    async postToOutbox(@Param('name') name: string, @Body() body) {
        return this.apGroupService.acceptPostRequest(name, body);
    }

    @Get('/:name/followers')
    async getFollowers(@Param('name') name: string) {
        return this.apGroupService.getFollowers(name);
    }

    /**
     * Retrieve a group's following list. Since groups, as a rule, don't
     * follow anyone, we can just send an empty OrderedCollection
     *
     * @param name The name of the group
     * @returns An empty OrderedCollection object
     * @memberof ApGroupController
     */
    @Get('/:name/following')
    async getFollowing(@Param('name') name: string): Promise<Collection> {
        return {
            '@context': AP.Context,
            type: 'OrderedCollection',
            totalItems: 0,
            orderedItems: []
        }
    }
}

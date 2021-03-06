import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { PostModule } from './post/post.module';
import { ActivityPubModule } from './activitypub/activitypub.module';
import { ConfigModule } from './config/config.module';
import { MetaModule } from './meta/meta.module';
import { FilterModule } from './filter/filter.module';
import { ServerModule } from './server/server.module';

@Module({
  imports: [TypeOrmModule.forRoot(), UserModule, GroupModule, PostModule, ActivityPubModule, ConfigModule, MetaModule, FilterModule, ServerModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private readonly connection: Connection) {}
}

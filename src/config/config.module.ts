import { Module, Global } from '@nestjs/common';
import { ConfigService } from './config.service';
import { join } from 'path';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(join(__dirname, '..', '..', 'config.env'))
    },
  ],
  exports: [ConfigService]
})
export class ConfigModule {}

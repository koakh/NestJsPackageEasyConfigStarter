import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EasyconfigModule, JsonWebTokenService } from 'nestjs-easyconfig';

@Module({
  imports: [
    EasyconfigModule.register({ path: './config/.env' }),
    JsonWebTokenService,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }

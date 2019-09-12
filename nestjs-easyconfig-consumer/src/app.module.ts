import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EasyconfigModule, JsonWebTokenService, JsonWebTokenModule } from 'nestjs-easyconfig';

@Module({
  imports: [
    EasyconfigModule.register({ path: './config/.env' }),
    // the trick is import the module, not the service here
    JsonWebTokenModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})

export class AppModule { }

import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JsonWebTokenModule } from 'nestjs-easyconfig';

@Module({
  imports: [
    // the trick is import the module, not the service here
    JsonWebTokenModule,
  ],
  providers: [AuthService],
  controllers: [AuthController],
})

export class AuthModule {}

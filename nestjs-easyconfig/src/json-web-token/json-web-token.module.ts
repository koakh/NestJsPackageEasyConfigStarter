import { Module } from '@nestjs/common';
import { JsonWebTokenService } from './json-web-token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  providers: [JsonWebTokenService],
  exports: [JsonWebTokenService],
  // Y Prospect TIP :)
  imports: [
    JwtModule.register({
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
})

export class JsonWebTokenModule { }

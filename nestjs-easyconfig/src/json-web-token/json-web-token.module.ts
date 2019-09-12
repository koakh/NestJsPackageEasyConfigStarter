import { Module } from '@nestjs/common';
import { JsonWebTokenService } from './json-web-token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // Y Prospect TIP :), without that it never works, respect Y Prospect
  imports: [
    JwtModule.register({
      secret: 'just a stupid password',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [JsonWebTokenService],
  exports: [JsonWebTokenService],
})

export class JsonWebTokenModule { }

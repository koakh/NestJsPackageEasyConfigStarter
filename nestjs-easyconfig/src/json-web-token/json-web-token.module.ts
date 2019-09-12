import { Module, DynamicModule } from '@nestjs/common';
import { JsonWebTokenService } from './json-web-token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  // Y Prospect TIP :)
  imports: [
    JwtModule.register({
      secret: 'jwtConstants.secret',
      signOptions: { expiresIn: '60s' },
    }),
  ],
  providers: [JsonWebTokenService],
  exports: [JsonWebTokenService],
})

// export class JsonWebTokenModule { }

@Module({})
export class JsonWebTokenModule {
  static register(): DynamicModule {
    return {
      module: JsonWebTokenModule,
      providers: [JsonWebTokenService],
      exports: [JsonWebTokenService],
    };
  }
}
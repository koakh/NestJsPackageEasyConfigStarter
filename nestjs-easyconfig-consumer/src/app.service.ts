import { Injectable } from '@nestjs/common';
import { EasyconfigService, JsonWebTokenService } from 'nestjs-easyconfig';

@Injectable()
export class AppService {
  constructor(
    private readonly easyconfigService: EasyconfigService,
    private readonly jsonWebTokenService: JsonWebTokenService,
    ) { }

  getHello(): string {
    const envVar = this.easyconfigService.get('ENV_VAR1');
    const token = this.jsonWebTokenService.getToken({ username: 'koakh', sub: 28 });
    return `Hello World! ${envVar} ${token}`;
  }
}

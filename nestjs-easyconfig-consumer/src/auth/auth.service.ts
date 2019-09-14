import { Injectable } from '@nestjs/common';
import { JsonWebTokenService } from 'nestjs-easyconfig';

@Injectable()
export class AuthService {
  constructor(
    private readonly jsonWebTokenService: JsonWebTokenService,
  ) { }

  getHello(): string {
    const token = this.jsonWebTokenService.getToken({ username: 'koakh', sub: 28 });
    return `Hello World from AuthModule! ${token}`;
  }
}

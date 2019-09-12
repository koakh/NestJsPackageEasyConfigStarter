import { JwtService } from '@nestjs/jwt';
export declare class JsonWebTokenService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    getToken(user: any): string;
}

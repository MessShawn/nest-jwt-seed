import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { JwtPayload } from './interfaces/jwt-payload.interface';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ) { }

    async signIn(userEmail: string): Promise<string> {
        const user: JwtPayload = { email: userEmail };

        return this.jwtService.sign(user);
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.userService.findOneByEmail(payload.email);
    }
}

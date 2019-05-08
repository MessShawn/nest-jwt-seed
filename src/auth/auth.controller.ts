import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { User } from 'src/user/user.entity';

@Controller()
export class AuthController {
    constructor(
        private readonly userService: UserService,
        private readonly authService: AuthService,
    ) { }

    @Post('login')
    async login(@Body() body, @Res() res) {
        if (!body || !body.email || !body.password) {
            return res.status(HttpStatus.FORBIDDEN).json({
                message: 'Email and password are required!',
            });
        }

        const user = await this.userService.findOneByEmail(body.email);

        if (user && this.userService.verifySalting(body.password, user.password)) {
            return res
                .status(HttpStatus.ACCEPTED)
                .json(await this.authService.signIn(user.email));
        }

        return res.status(HttpStatus.FORBIDDEN).json({
            message: 'Email or password wrong!',
        });
    }

    @Post('register')
    async registerUser(@Body() body: User, @Res() res: any) {
        if (!(body && body.email && body.password && body.firstName)) {
            return res
                .status(HttpStatus.FORBIDDEN)
                .json({ message: 'Username and password are required!' });
        }

        const user = await this.userService.findOneByEmail(body.email);
        if (user) {
            return res.status(HttpStatus.FORBIDDEN).json({
                message: 'Email exists',
            });
        } else {
            const persistedUser = await this.userService.create(body);
            if (persistedUser) {
                persistedUser.password = undefined;
            }

            return res.status(HttpStatus.OK).json(persistedUser);
        }
    }
}

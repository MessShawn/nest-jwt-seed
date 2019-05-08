import { Controller, Res, HttpStatus, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { UserService } from '../user/user.service';
import { User } from 'src/user/user.entity';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Get()
    @UseGuards(AuthGuard('jwt'))
    async findAll(@Res() res: any): Promise<User[]> {
        return res.status(HttpStatus.OK).json(this.userService.findAll());
    }
}

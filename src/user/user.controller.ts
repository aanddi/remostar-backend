import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { EditUserDto } from './dto';
import { Auth } from 'src/auth/decorators/auth.deorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Auth()
  @Get('/:id')
  async getUser(@Param('id') userId: string) {
    return this.userService.getUser(userId);
  }

  @Auth()
  @Put('/edit/:id')
  async editUser(@Param('id') userId: string, @Body() dto: EditUserDto) {
    return this.userService.editUser(userId, dto);
  }
}

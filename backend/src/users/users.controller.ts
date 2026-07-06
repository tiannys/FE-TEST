import { Controller, Get, Patch, Body, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('profile')
  async getProfile(@Request() req) {
    return this.usersService.findById(req.user.userId);
  }

  @Patch('profile')
  async updateProfile(
    @Request() req,
    @Body() body: { firstName?: string; lastName?: string; profileImage?: string },
  ) {
    return this.usersService.updateProfile(req.user.userId, body);
  }
}

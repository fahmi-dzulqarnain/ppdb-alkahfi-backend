import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './model/dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('register')
    async register(@Body() dto: RegisterDTO) {
        return await this.authService.registerAccount(dto)
    }

    @Post('signIn')
    async signIn(@Body() dto: LoginDTO) {
        return await this.authService.signIn(dto)
    }
}

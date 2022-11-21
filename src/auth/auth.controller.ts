import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { GetAkun } from './get-akun.decorator';
import { Akun } from './model';
import { LoginDTO, RegisterDTO } from './model/dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    async register(@Body() dto: RegisterDTO) {
        return await this.authService.registerAccount(dto)
    }

    @Post('signIn')
    async signIn(@Body() dto: LoginDTO) {
        return await this.authService.signIn(dto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('sudo')
    async deleteAccount(
        @GetAkun() akun: Akun,
        @Body('registrationID') registrationID: string
    ) {
        return await this.authService.deleteAccount(registrationID, akun)
    }
}

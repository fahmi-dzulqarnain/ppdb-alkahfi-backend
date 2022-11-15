import { Controller, Get, ParseUUIDPipe, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAkun } from 'src/auth/get-akun.decorator';
import { Akun } from 'src/auth/model';
import { SiswaService } from './siswa.service';

@Controller('siswa')
@UseGuards(AuthGuard('jwt'))
export class SiswaController {
    constructor(private siswaService: SiswaService) { }

    @Get()
    async getSiswa(
        @GetAkun() akun: Akun
    ) {
        return await this.siswaService.getSiswaByAkun(akun)
    }

    @Get('byID')
    async getSiswaByID(
        @Query('id', ParseUUIDPipe) id: string,
        @GetAkun() akun: Akun
    ) {
        return await this.siswaService.getSiswaByID(id, akun)
    }

    @Get('admin')
    async getSiswaByIdSekolah(
        @GetAkun() akun: Akun
    ) {
        return await this.siswaService.getAllSiswaByAdmin(akun)
    }
}

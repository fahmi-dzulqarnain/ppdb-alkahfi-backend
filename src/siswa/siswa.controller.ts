import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAkun } from 'src/auth/get-akun.decorator';
import { Akun } from 'src/auth/model';
import { SiswaService } from './siswa.service';

@Controller('siswa')
@UseGuards(AuthGuard('jwt'))
export class SiswaController {
    constructor(private siswaService: SiswaService) {}

    @Get()
    async getSiswa(
        @GetAkun() akun: Akun
    ) {
        return await this.siswaService.getSiswaByAkun(akun)
    }

    @Get('admin')
    async getSiswaByIdSekolah(
        @GetAkun() akun: Akun,
        @Query('idSekolah') idSekolah: number,
    ) {
        return await this.siswaService.getAllSiswaBySekolahID(idSekolah, akun)
    }
}

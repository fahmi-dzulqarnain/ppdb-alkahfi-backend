import { Body, Controller, Get, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAkun } from 'src/auth/get-akun.decorator';
import { Akun } from 'src/auth/model';
import { SekolahDTO } from './model';
import { TipeSekolahDTO } from './model/dto';
import { SekolahUpdateDTO } from './model/dto/sekolah-update.dto';
import { TipeSekolahUpdateDTO } from './model/dto/tipe-sekolah-update.dto';
import { SekolahService } from './sekolah.service';

@Controller('sekolah')
export class SekolahController {
    constructor(private sekolahService: SekolahService) { }

    @Post()
    async createSekolah(@Body() dto: SekolahDTO) {
        return await this.sekolahService.createNewSekolah(dto)
    }

    @Post('tipeSekolah')
    async createTipeSekolah(@Body() dto: TipeSekolahDTO) {
        return await this.sekolahService.createNewTipeSekolah(dto)
    }

    @Get()
    async getAllSekolah() {
        return await this.sekolahService.getAll()
    }

    @Get('byID')
    async getSekolahByID(@Query('id', ParseIntPipe) id: number) {
        return await this.sekolahService.getByID(id)
    }

    @Get('tipeSekolah')
    async getTipeSekolahBySekolahID(@Query('idSekolah', ParseIntPipe) idSekolah: number) {
        return await this.sekolahService.getTipeSekolahBySekolahID(idSekolah)
    }

    @Patch('tipeSekolah')
    async updateTipeSekolahByID(
        @Query('id', ParseUUIDPipe) id: string,
        @Body() dto: Partial<TipeSekolahUpdateDTO>
    ) {
        return await this.sekolahService.updateTipeSekolahByID(id, dto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('byID')
    async updateSekolahByID(
        @GetAkun() akun: Akun,
        @Body() updateDTO: Partial<SekolahUpdateDTO>
    ) {
        return this.sekolahService.updateSekolahByID(akun, updateDTO)
    }
}

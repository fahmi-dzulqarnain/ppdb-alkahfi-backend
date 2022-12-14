import { Body, Controller, Delete, Get, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GetAkun } from 'src/auth/get-akun.decorator';
import { Akun } from 'src/auth/model';
import { SekolahDTO } from './model';
import { TipeSekolahDTO } from './model/dto';
import { LiniMasaDTO } from './model/dto/lini-masa.dto';
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

    @UseGuards(AuthGuard('jwt'))
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
        return await this.sekolahService.updateSekolahByID(akun, updateDTO)
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('liniMasa')
    async createLiniMasa(
        @GetAkun() akun: Akun,
        @Body() dto: LiniMasaDTO
    ) {
        return await this.sekolahService.createLiniMasa(akun, dto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Patch('liniMasa')
    async updateLiniMasaByID(
        @GetAkun() akun: Akun,
        @Query('id', ParseUUIDPipe) id: string,
        @Body() dto: LiniMasaDTO
    ) {
        return await this.sekolahService.updateLiniMasa(akun, id, dto)
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('liniMasa')
    async deleteLiniMasaByID(
        @GetAkun() akun: Akun,
        @Body('id', ParseUUIDPipe) id: string
    ) {
        return await this.sekolahService.deleteLiniMasa(akun, id)
    }

    @Get('liniMasa')
    async getLiniMasaBySekolahID(
        @Query('idSekolah', ParseIntPipe) idSekolah: number
    ) {
        return await this.sekolahService.getLiniMasa(idSekolah)
    }
}

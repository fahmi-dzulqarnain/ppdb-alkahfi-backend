import { Body, Controller, Get, ParseIntPipe, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { SekolahDTO } from './model';
import { TipeSekolahDTO } from './model/dto';
import { TipeSekolahUpdateDTO } from './model/dto/tipe-sekolah-update.dto';
import { SekolahService } from './sekolah.service';

@Controller('sekolah')
export class SekolahController {
    constructor(private sekolahService: SekolahService) {}

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
    async updateTipeSekolahByID(@Query('id', ParseUUIDPipe) id: string, @Body() dto: Partial<TipeSekolahUpdateDTO>) {
        return await this.sekolahService.updateTipeSekolahByID(id, dto)
    }
}
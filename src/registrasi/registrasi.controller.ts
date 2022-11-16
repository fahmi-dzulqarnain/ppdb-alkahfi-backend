import { Body, Controller, Delete, Get, NotFoundException, ParseUUIDPipe, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { GetAkun } from 'src/auth/get-akun.decorator';
import { Akun } from 'src/auth/model';
import { UpdateOneStatusDTO } from './model/dto/update-one-status.dto';
import { UpdateStatusDTO } from './model/dto/update-status.dto';
import { RegistrasiService } from './registrasi.service';
import { editFileName } from './upload-image.helper';

@Controller('registrasi')
@UseGuards(AuthGuard('jwt'))
export class RegistrasiController {
    constructor(private registrasiService: RegistrasiService) { }

    @Patch('statusRegistrasi')
    async updateStatusByIDs(
        @Body() dto: UpdateStatusDTO,
        @GetAkun() akun: Akun
    ) {
        return this.registrasiService.updateStatusByIDs(dto, akun)
    }

    @Patch('siswa/status')
    async updateStatusByID(
        @Body() dto: UpdateOneStatusDTO,
        @GetAkun() akun: Akun
    ) {
        return this.registrasiService.updateStatusByID(dto, akun)
    }

    @Post('receipt')
    @UseInterceptors(
        FileInterceptor('receipt', {
            storage: diskStorage({
                destination: './receipts',
                filename: editFileName,
            })
        })
    )
    async uploadReceipt(
        @UploadedFile() receiptImage: Express.Multer.File,
        @Query('id', ParseUUIDPipe) id: string,
        @GetAkun() akun: Akun
    ) {
        return await this.registrasiService.uploadReceipt(id, receiptImage, akun)
    }

    @Get('receipt')
    async getImage(
        @Query('id', ParseUUIDPipe) id: string,
        @GetAkun() akun: Akun,
        @Res() response
    ) {
        const receipt = await this.registrasiService.getReceipt(id, akun)

        if (receipt == '-') {
            throw new NotFoundException(
                'Bukti pembayaran tidak ditemukan!'
            )
        }

        return response.sendFile(receipt, { root: './receipts' })
    }

    @Delete('receipt')
    async deleteImage(
        @Query('id', ParseUUIDPipe) id: string,
        @GetAkun() akun: Akun
    ) {
        return await this.registrasiService.cancelUpload(id, akun)
    }

    @Get('statusCount')
    async getStatusCount(
        @GetAkun() akun: Akun
    ) {
        return this.registrasiService.getAllStatusCount(akun)
    }
}

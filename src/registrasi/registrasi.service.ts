import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Akun } from 'src/auth/model';
import { TipeAkun } from 'src/auth/model/enum/tipe-akun.enum';
import { UpdateOneStatusDTO } from './model/dto/update-one-status.dto';
import { UpdateStatusDTO } from './model/dto/update-status.dto';
import { RegistrasiRepository } from './registrasi.repository';
import * as fs from 'fs'
import { TipeSekolahRepository } from 'src/sekolah/tipe-sekolah.repository';
import { AkunRepository } from 'src/auth/akun.repository';
import { In } from 'typeorm';
import { Registrasi } from './model';
import { StatusRegistrasi } from './model/enum/status-registrasi.enum';
import { TipeSekolah } from 'src/sekolah/model';

@Injectable()
export class RegistrasiService {
    constructor(
        @InjectRepository(RegistrasiRepository)
        private registrasiRepository: RegistrasiRepository,
        @InjectRepository(TipeSekolahRepository)
        private tipeSekolahRepository: TipeSekolahRepository,
        @InjectRepository(AkunRepository)
        private akunRepository: AkunRepository
    ) { }

    async updateStatusByIDs(dto: UpdateStatusDTO, akun: Akun) {
        if (akun.tipeAkun != TipeAkun.adminSekolah) {
            throw new UnauthorizedException(
                'Jalur ini hanya untuk admin sekolah'
            )
        }

        const { ids, statusRegistrasi } = dto

        if (ids.length < 1) {
            throw new BadRequestException('ID perlu diisi')
        }

        return this.registrasiRepository.updateStatusByIDs(ids, statusRegistrasi)
    }

    async updateStatusByID(dto: UpdateOneStatusDTO, akun: Akun) {
        if (akun.tipeAkun != TipeAkun.pendaftar) {
            throw new UnauthorizedException(
                'Jalur ini hanya untuk pendaftar'
            )
        }

        const { id, statusRegistrasi } = dto

        return this.registrasiRepository.updateStatusByID(id, statusRegistrasi)
    }

    async uploadReceipt(id: string, receipt: Express.Multer.File, akun: Akun) {
        if (akun.tipeAkun != TipeAkun.pendaftar) {
            throw new UnauthorizedException(
                'Jalur ini hanya untuk pendaftar'
            )
        }

        if (!receipt) {
            throw new BadRequestException('File tidak boleh kosong')
        }

        const halfMb = 2000 * 1000
        const fileType = receipt.mimetype
        const fileSize = receipt.size
        const receiptName = receipt.filename
        const permittedFiles = [
            "image/png",
            "image/jpeg",
            "image/jpg"
        ]

        if (fileSize > halfMb) {
            this.deletePicture(receiptName)
            throw new BadRequestException('Ukuran foto receipt maksimal 2 MB')
        }

        if (!permittedFiles.includes(fileType)) {
            this.deletePicture(receiptName)
            throw new BadRequestException('Jenis foto receipt harus PNG/JPEG/JPG')
        }

        const registrasi = await this.registrasiRepository.getByID(id)

        if (registrasi.buktiTransaksi != '-') {
            this.deletePicture(registrasi.buktiTransaksi)
        }

        const updateResult = this.registrasiRepository.updateReceipt(id, receiptName)

        return {
            statusCode: 200,
            message: 'Receipt Uploaded Successfully',
            updateResult
        }
    }

    async getReceipt(idRegistrasi: string, akun: Akun) {
        const isExists = this.akunRepository.findOneBy({ id: akun.id })

        if (!isExists) {
            throw new NotFoundException(
                'Tidak dapat menemukan akun'
            )
        }

        return await this.registrasiRepository.getReceipt(idRegistrasi)
    }

    async cancelUpload(id: string, akun: Akun) {
        if (akun.tipeAkun != TipeAkun.pendaftar) {
            throw new UnauthorizedException(
                'Jalur ini hanya untuk pendaftar'
            )
        }

        const registrasi = await this.registrasiRepository.getByID(id)

        if (registrasi.buktiTransaksi != '-') {
            this.deletePicture(registrasi.buktiTransaksi)
        }

        const receiptName = '-'
        return this.registrasiRepository.updateReceipt(id, receiptName)
    }

    async deletePicture(fileName: string) {
        fs.unlink(`./receipts/${fileName}`, (err) => {
            if (err) {
                console.error(err);
                return err;
            }
        });
    }

    async getAllStatusCount(akun: Akun) {
        if (akun.tipeAkun != TipeAkun.adminSekolah) {
            throw new UnauthorizedException(
                'Jalur ini hanya untuk admin sekolah'
            )
        }

        const tipeSekolahRaw: unknown = akun.idTipeSekolah
        const getTipeSekolah: TipeSekolah = <TipeSekolah>tipeSekolahRaw
        const id = getTipeSekolah.id
        const tipeSekolah = await this.tipeSekolahRepository.findOneBy({ id })

        if (!tipeSekolah) {
            throw new NotFoundException(
                `Tidak ada sekolah ditemukan dengan tipe sekolah ${id}`
            )
        }

        const idSekolah = tipeSekolah.idSekolah
        console.log(idSekolah)
        const tipeSekolahArray = await this.tipeSekolahRepository.find({
            where: {
                idSekolah
            }
        })

        const noPendaftaranArray: number[] = []

        for (let i = 0; i < tipeSekolahArray.length; i++) {
            const idTipeSekolah = tipeSekolahArray[i].id
            const akuns = await this.akunRepository.find({
                where: {
                    idTipeSekolah,
                    tipeAkun: TipeAkun.pendaftar
                }
            })

            akuns.forEach((akun) => {
                noPendaftaranArray.push(akun.noPendaftaran)
            })
        }

        const registrasiArray: Registrasi[] = await this.registrasiRepository.find({
            where: {
                noPendaftaran: In(noPendaftaranArray)
            }
        })

        const menungguPembayaran = this.getCountStatus(registrasiArray, StatusRegistrasi.menunggu_pembayaran)
        const menungguKonfirmasi = this.getCountStatus(registrasiArray, StatusRegistrasi.menunggu_konfirmasi)
        const buktiBayarDitolak = this.getCountStatus(registrasiArray, StatusRegistrasi.bukti_bayar_ditolak)
        const pendaftaranBatal = this.getCountStatus(registrasiArray, StatusRegistrasi.pendaftaran_batal)
        const dibayar = this.getCountStatus(registrasiArray, StatusRegistrasi.dibayar)
        const lulus = this.getCountStatus(registrasiArray, StatusRegistrasi.lulus)
        const lulusTesAkademik = this.getCountStatus(registrasiArray, StatusRegistrasi.lulus_tes_akademik)
        const lulusBersyarat = this.getCountStatus(registrasiArray, StatusRegistrasi.lulus_bersyarat)
        const cadangan = this.getCountStatus(registrasiArray, StatusRegistrasi.cadangan)
        const belumDiterima = this.getCountStatus(registrasiArray, StatusRegistrasi.belum_diterima)

        return {
            statusCode: 200,
            message: "Sukses mengambil data jumlah pendaftar",
            data: {
                pendaftar: registrasiArray.length,
                menungguPembayaran,
                menungguKonfirmasi,
                buktiBayarDitolak,
                pendaftaranBatal,
                dibayar,
                lulus,
                lulusTesAkademik,
                lulusBersyarat,
                cadangan,
                belumDiterima
            }
        }
    }

    getCountStatus(registrasiArray: Registrasi[], status: StatusRegistrasi) {
        return registrasiArray.filter(registrasi =>
            registrasi.status == status
        ).length
    }
}

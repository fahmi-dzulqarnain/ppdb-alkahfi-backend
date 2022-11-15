import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AkunRepository } from 'src/auth/akun.repository';
import { Akun } from 'src/auth/model';
import { TipeAkun } from 'src/auth/model/enum/tipe-akun.enum';
import { RegistrasiRepository } from 'src/registrasi/registrasi.repository';
import { TipeSekolah } from 'src/sekolah/model';
import { SekolahRepository } from 'src/sekolah/sekolah.repository';
import { TipeSekolahRepository } from 'src/sekolah/tipe-sekolah.repository';
import { In } from 'typeorm';
import { SiswaRepository } from './siswa.repository';

@Injectable()
export class SiswaService {
    constructor(
        @InjectRepository(SiswaRepository)
        private siswaRepository: SiswaRepository,
        @InjectRepository(RegistrasiRepository)
        private registrasiRepository: RegistrasiRepository,
        @InjectRepository(TipeSekolahRepository)
        private tipeSekolahRepository: TipeSekolahRepository,
        @InjectRepository(AkunRepository)
        private akunRepository: AkunRepository,
        @InjectRepository(SekolahRepository)
        private sekolahRepository: SekolahRepository
    ) { }

    async getSiswaByAkun(akun: Akun) {
        if (akun.tipeAkun != TipeAkun.pendaftar) {
            throw new UnauthorizedException(
                'Akun Anda tidak dapat mengakses jalur ini, ini adalah jalur pendaftar'
            )
        }

        const noPendaftaran = akun.noPendaftaran
        const registrasi = await this.registrasiRepository.getRegistrasiByNoPendaftaran(noPendaftaran)
        const idRegistrasi = registrasi.id

        const tipeSekolah: unknown = akun.idTipeSekolah
        const idTipeSekolah = tipeSekolah as TipeSekolah
        const sekolah = await this.sekolahRepository.findOneBy({ idSekolah: idTipeSekolah.idSekolah })
        const siswa = await this.siswaRepository.findOneBy({ idRegistrasi })

        if (!siswa) {
            throw new NotFoundException(
                `Siswa dengan nomor pendaftaran ${noPendaftaran} tidak ditemukan`
            )
        }

        return {
            statusCode: 200,
            message: "success",
            sekolah,
            siswa
        }
    }

    async getSiswaByID(id: string, akun: Akun) {
        if (akun.tipeAkun != TipeAkun.adminSekolah) {
            throw new UnauthorizedException(
                'Akun Anda tidak dapat mengakses jalur ini, ini adalah jalur admin'
            )
        }

        const siswa = await this.siswaRepository.findOneBy({ id })

        if (!siswa) {
            throw new NotFoundException(
                `Siswa dengan id ${id} tidak ditemukan`
            )
        }

        return {
            statusCode: 200,
            message: "success",
            siswa
        }
    }

    async getAllSiswaByAdmin(akun: Akun) {
        if (akun.tipeAkun != TipeAkun.adminSekolah) {
            throw new UnauthorizedException(
                'Akun Anda tidak dapat mengakses jalur ini, ini adalah jalur admin sekolah'
            )
        }

        const tipeSekolahRaw: unknown = akun.id
        const getTipeSekolah: TipeSekolah = <TipeSekolah>tipeSekolahRaw
        const id = getTipeSekolah.id
        const tipeSekolah = await this.tipeSekolahRepository.findOneBy({ id })

        if (!tipeSekolah) {
            throw new NotFoundException(
                `Tidak ada sekolah ditemukan dengan tipe sekolah ${id}`
            )
        }

        const idSekolah = tipeSekolah.idSekolah
        const tipeAkun = TipeAkun.pendaftar
        const tipeSekolahArray = await this.tipeSekolahRepository.findBy({
            idSekolah
        })

        if (!tipeSekolahArray) {
            throw new NotFoundException(
                `Tidak dapat mendapatkan tipeSekolah dari idSekolah ${idSekolah}`
            )
        }

        var finalResponse = []

        for (let index = 0; index < tipeSekolahArray.length; index++) {
            const tipeSekolah = tipeSekolahArray[index]
            const idTipeSekolah = tipeSekolah.id
            const akunArray = await this.akunRepository.find({
                where: {
                    tipeAkun,
                    idTipeSekolah
                }
            })

            var response = {
                tipeSekolah,
                siswa: []
            }

            const noPendaftaranData = []

            for (let i = 0; i < akunArray.length; i++) {
                const akun = akunArray[i]
                const noPendaftaran = akun.noPendaftaran
                noPendaftaranData.push(noPendaftaran)

                const idRegistrasiData = []
                const registrasiData = await this.registrasiRepository.find({
                    where: {
                        noPendaftaran: In(noPendaftaranData)
                    }
                })

                registrasiData.forEach((registrasi) => {
                    const idRegistrasi = registrasi.id
                    idRegistrasiData.push(idRegistrasi)
                })

                const siswaData = await this.siswaRepository.find({
                    where: {
                        idRegistrasi: In(idRegistrasiData)
                    }
                })

                if (siswaData) {
                    response = { ...response, siswa: siswaData }
                }
            }

            finalResponse.push(response)
        }

        return {
            statusCode: 200,
            message: "Sukses mengambil data siswa",
            data: finalResponse
        }
    }
}
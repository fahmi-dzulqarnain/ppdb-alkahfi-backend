import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { RegistrasiRepository } from 'src/registrasi/registrasi.repository';
import { WaliSiswaRepository } from 'src/siswa/wali-siswa.repository';
import { SiswaRepository } from 'src/siswa/siswa.repository';
import { AkunRepository } from './akun.repository';
import { LoginDTO, RegisterDTO } from './model/dto';
import { TipeSekolahRepository } from 'src/sekolah/tipe-sekolah.repository';
import * as bcrypt from 'bcrypt'
import { SekolahRepository } from 'src/sekolah/sekolah.repository';
import { Akun } from './model';
import { TipeAkun } from './model/enum/tipe-akun.enum';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(AkunRepository)
        private akunRepository: AkunRepository,
        @InjectRepository(RegistrasiRepository)
        private registerRepository: RegistrasiRepository,
        @InjectRepository(SiswaRepository)
        private siswaRepository: SiswaRepository,
        @InjectRepository(WaliSiswaRepository)
        private waliSiswaRepository: WaliSiswaRepository,
        @InjectRepository(SekolahRepository)
        private sekolahRepository: SekolahRepository,
        @InjectRepository(TipeSekolahRepository)
        private tipeSekolahRepository: TipeSekolahRepository,
        private jwtService: JwtService
    ) { }

    async registerAccount(dto: RegisterDTO) {
        const createAccount = await this.akunRepository.createAccount(dto)
        const akun = createAccount.akun
        const idTipeSekolah = akun.idTipeSekolah
        const tipeSekolah = await this.tipeSekolahRepository.findOneBy({ id: idTipeSekolah })
        const idSekolah = tipeSekolah.idSekolah
        const sekolah = await this.sekolahRepository.findOneBy({ idSekolah })
        const register = await this.registerRepository.createRegistration(akun.noPendaftaran, sekolah.biayaPendaftaran)
        const idRegistrasi = register.idRegistrasi
        const waliSiswa = await this.waliSiswaRepository.createWaliSiswa(dto)
        const idOrangTua = waliSiswa.idOrangTua
        const siswa = await this.siswaRepository.createSiswa(dto, idRegistrasi, idOrangTua)

        if (siswa) {
            await this.tipeSekolahRepository.substractSisaKuota(idTipeSekolah)
        }

        return {
            statusCode: 200,
            title: "Pendaftaran Berhasil",
            message: "Silakan masuk menggunakan Akun Anda!"
        }
    }

    async signIn(dto: LoginDTO) {
        const { noHP, tanggalLahir } = dto
        const akun = await this.akunRepository.findOneBy({ username: noHP })

        if (!akun) {
            throw new NotFoundException('Akun tidak ditemukan')
        }

        if (!await bcrypt.compare(tanggalLahir, akun.sandi)) {
            throw new ForbiddenException('Kata sandi yang dimasukkan tidak sesuai')
        }

        const tipeAkun = akun.tipeAkun
        const username = akun.username
        const payload = { username, tipeAkun }
        const accessToken = await this.jwtService.signAsync(payload)

        return {
            statusCode: 200,
            message: "Sukses masuk ke dalam akun",
            tipeAkun,
            accessToken
        }
    }

    async deleteAccount(registrasionID: string, akunValidation: Akun) {
        if (akunValidation.tipeAkun != TipeAkun.adminSekolah) {
            throw new ForbiddenException('Rute ini tidak diizinkan untuk Anda!')
        }

        var result = []
        const registrasionData = await this.registerRepository.findOneBy({
            id: registrasionID
        })

        if (!registrasionData) {
            throw new NotFoundException(
                `Data registrasi dengan id ${registrasionID} tidak ditemukan`
            )
        }

        const noPendaftaran = registrasionData.noPendaftaran
        const akun = await this.akunRepository.findOneBy({ noPendaftaran })

        if (!akun) {
            throw new NotFoundException(
                `Data akun dengan no pendaftaran ${noPendaftaran} tidak ditemukan`
            )
        }

        const waliSiswa = await this.waliSiswaRepository.findOneBy({
            hpAyah: akun.username
        })

        if (waliSiswa) {
            const idOrangTua = waliSiswa.id
            const siswa = await this.siswaRepository.findOneBy({
                idOrangTua
            })

            if (siswa) {
                result.push(await this.siswaRepository.delete({ idOrangTua }))
            }

            result.push(await this.waliSiswaRepository.delete({ id: idOrangTua }))
        }

        const siswa = await this.siswaRepository.findOneBy({
            nisn: akun.username
        })

        if (siswa) {
            const idOrangTua = siswa.idOrangTua
            const orangTua = await this.siswaRepository.findOneBy({
                idOrangTua
            })

            result.push(await this.siswaRepository.delete({ idOrangTua }))

            if (orangTua) {
                result.push(await this.waliSiswaRepository.delete({ id: idOrangTua }))
            }
        }

        result.push(await this.akunRepository.delete({ noPendaftaran }))
        result.push(await this.registerRepository.delete({ id: registrasionData.id }))

        return result
    }
}

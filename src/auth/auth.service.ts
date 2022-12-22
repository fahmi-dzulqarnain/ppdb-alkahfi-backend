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
import { WaliSiswa } from 'src/siswa/model';
import { TipeSekolah } from 'src/sekolah/model';

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
        const idTipeSekolah = dto.idTipeSekolah
        const isAvailable = await this.tipeSekolahRepository.checkAvailability(idTipeSekolah)

        if (isAvailable) {
            const tipeSekolah = await this.tipeSekolahRepository.findTipeSekolahByID(idTipeSekolah)
            const idSekolah = tipeSekolah.idSekolah
            const sekolah = await this.sekolahRepository.findOneBy({ idSekolah })
            const namaSekolah = sekolah.namaSekolah.toLowerCase()
            const minimumDateString = "2023-07-01"

            if (namaSekolah.includes("tk")) {
                if (tipeSekolah.namaTipe.toLowerCase() == "tk a") {
                    const minimumAge = 4

                    if (!this.isAgeQualified(dto.tanggalLahir, minimumDateString, minimumAge)) {
                        return this.minimumAgeError(minimumAge)
                    }
                } else if (tipeSekolah.namaTipe.toLowerCase() == "tk b") {
                    const minimumAge = 5

                    if (!this.isAgeQualified(dto.tanggalLahir, minimumDateString, minimumAge)) {
                        return this.minimumAgeError(minimumAge)
                    }
                }
            } else if (namaSekolah.includes("sd")) {
                const minimumAge = 6

                if (!this.isAgeQualified(dto.tanggalLahir, minimumDateString, minimumAge)) {
                    return this.minimumAgeError(minimumAge)
                }
            }

            const createAccount = await this.akunRepository.createAccount(dto)
            const akun = createAccount.akun
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

        return {
            statusCode: 406,
            title: "Kuota Habis!",
            message: "Mohon maaf, saat ini kuota pendaftaran telah habis"
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

        const tipeSekolahRaw: unknown = akunValidation.idTipeSekolah
        const tipeSekolah = tipeSekolahRaw as TipeSekolah
        const idTipeSekolah = tipeSekolah.id

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
            const waliSiswaRaw: unknown = siswa.idOrangTua
            const waliSiswa = waliSiswaRaw as WaliSiswa
            const idOrangTua = waliSiswa.id
            
            console.log(idOrangTua)
            console.log(waliSiswa)
            result.push(await this.siswaRepository.delete({ id: siswa.id }))
            console.log("Deleting Wali Siswa")
            result.push(await this.waliSiswaRepository.delete({ id: idOrangTua }))
            console.log("Success Delete Orang Tua")
        }
        console.log(registrasionData)
        console.log(registrasionData.id)
        result.push(await this.akunRepository.delete({ noPendaftaran }))
        result.push(await this.registerRepository.delete({ id: registrasionData.id }))

        await this.tipeSekolahRepository.returnSisaKuota(idTipeSekolah)

        return result
    }

    isAgeQualified(birthDateStr: string, minimumDateString: string, minimumAge: number) {
        var isQualified = false
        
        const birthDateArray = birthDateStr.split("-")
        const birthDateString = `${birthDateArray[2]}-${birthDateArray[1]}-${birthDateArray[0]}`
        const birthDate = Date.parse(birthDateString)
        
        const minDateArray = minimumDateString.split("-")
        
        const minimumDate = Date.parse(minimumDateString)
        const minimumDateMonth = new Date()
        const birthDateMonth = new Date()

        minimumDateMonth.setTime(minimumDate)
        birthDateMonth.setTime(birthDate)

        const ageYear = parseInt(minDateArray[0]) - parseInt(birthDateArray[2])

        if (ageYear > minimumAge) {
            isQualified = true
        } else if (ageYear == minimumAge) {
            if (birthDateMonth.getMonth() <= minimumDateMonth.getMonth()) {
                isQualified = true
            }
        }

        return isQualified
    }

    minimumAgeError(minimumAge: number) {
        return {
            statusCode: 406,
            error: "Usia Belum Mencukupi",
            message: `Mohon maaf usia ananda belum cukup, minimal usia adalah ${minimumAge} tahun pada Juli 2023`
        }
    }
}

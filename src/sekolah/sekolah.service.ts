import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Akun } from 'src/auth/model';
import { TipeAkun } from 'src/auth/model/enum/tipe-akun.enum';
import { LiniMasaRepository } from './lini-masa.repository';
import { DetailSekolahModel, Sekolah, SekolahDTO, SekolahModel, TipeSekolah } from './model';
import { TipeSekolahDTO } from './model/dto';
import { LiniMasaDTO } from './model/dto/lini-masa.dto';
import { SekolahUpdateDTO } from './model/dto/sekolah-update.dto';
import { TipeSekolahUpdateDTO } from './model/dto/tipe-sekolah-update.dto';
import { SekolahRepository } from './sekolah.repository';
import { TipeSekolahRepository } from './tipe-sekolah.repository';

@Injectable()
export class SekolahService {
    constructor(
        @InjectRepository(SekolahRepository)
        private sekolahRepository: SekolahRepository,
        @InjectRepository(TipeSekolahRepository)
        private tipeSekolahRepository: TipeSekolahRepository,
        @InjectRepository(LiniMasaRepository)
        private liniMasaRepository: LiniMasaRepository
    ) { }

    async getAll() {
        var sekolahData = await this.sekolahRepository.find()
        sekolahData = sekolahData.sort((firstSchool, secondSchool) =>
            firstSchool.orderNumber - secondSchool.orderNumber
        )

        const result: SekolahModel[] = []

        sekolahData.forEach((sekolah) => {
            var existingSekolah = result.find(school => school.namaSekolah == sekolah.namaSekolah)

            const detailSekolah: DetailSekolahModel = {
                idSekolah: sekolah.idSekolah,
                alamat: sekolah.alamat,
                kontak: sekolah.kontak,
                namaRekening: sekolah.namaRekening,
                noRekening: sekolah.noRekening,
                syarat: sekolah.syarat,
                linkWAGroup: sekolah.linkWAGroup,
                biayaPendaftaran: sekolah.biayaPendaftaran,
                biayaAwal: sekolah.biayaAwal,
                biayaSPP: sekolah.biayaSPP,
                tipeSekolah: sekolah.tipeSekolah,
                isRegistrationOpen: sekolah.isRegistrationOpen
            }

            if (existingSekolah) {
                existingSekolah.detail.push(detailSekolah)
            } else {
                const sekolahData: SekolahModel = {
                    orderNumber: sekolah.orderNumber,
                    namaSekolah: sekolah.namaSekolah,
                    logo: sekolah.logo,
                    detail: [detailSekolah]
                }

                result.push(sekolahData)
            }
        })

        return result
    }

    async getByID(idSekolah: number) {
        if (idSekolah) {
            const sekolah = await this.sekolahRepository.findOneBy({
                idSekolah
            })

            if (!sekolah) {
                throw new NotFoundException(
                    `Sekolah dengan id ${idSekolah} tidak ditemukan.`
                )
            }

            return sekolah
        }
    }

    async createNewSekolah(dto: SekolahDTO) {
        return await this.sekolahRepository.createSekolah(dto)
    }

    async createNewTipeSekolah(dto: TipeSekolahDTO) {
        const idSekolah = dto.idSekolah
        const sekolah = await this.sekolahRepository.findOneBy({
            idSekolah
        })

        if (!sekolah) {
            throw new NotFoundException(
                `Sekolah dengan id ${idSekolah} tidak ditemukan.`
            )
        }

        return await this.tipeSekolahRepository.createTipeSekolah(dto)
    }

    async getTipeSekolahBySekolahID(idSekolah: number) {
        await this.getByID(idSekolah)

        const arrayOfTipeSekolah = await this.tipeSekolahRepository.findBy({
            idSekolah
        })

        return arrayOfTipeSekolah
    }

    async getTipeSekolahByID(id: string) {
        const tipeSekolah = this.tipeSekolahRepository.findOneBy({ id })

        if (!tipeSekolah) {
            throw new NotFoundException(
                `Tipe sekolah dengan id ${id} tidak ditemukan`
            )
        }

        return tipeSekolah
    }

    async updateTipeSekolahByID(id: string, dto: Partial<TipeSekolahUpdateDTO>) {
        const existing = await this.getTipeSekolahByID(id)

        if (!existing) {
            throw new NotFoundException(
                `Tipe sekolah dengan id ${id} tidak ditemukan`
            )
        }

        const edited = {
            id,
            ...dto
        }

        return await this.tipeSekolahRepository.save(edited)
    }

    async updateSekolahByID(akun: Akun, dto: Partial<SekolahUpdateDTO>) {
        if (akun.tipeAkun != TipeAkun.adminSekolah) {
            throw new ForbiddenException(
                `Rute ini khusus untuk admin sekolah`
            )
        }

        const idSekolah = await this.getSekolahIDFromAkun(akun)

        return await this.sekolahRepository.updateSekolah(idSekolah, dto)
    }

    async getSekolahIDFromAkun(akun: Akun) {
        const idTipeSekolah: unknown = akun.idTipeSekolah
        const id = idTipeSekolah as TipeSekolah
        const tipeSekolah = await this.getTipeSekolahByID(id.id)

        return tipeSekolah.idSekolah
    }

    async createLiniMasa(akun: Akun, dto: LiniMasaDTO) {
        if (akun.tipeAkun != TipeAkun.adminSekolah) {
            throw new ForbiddenException(
                `Rute ini khusus untuk admin sekolah`
            )
        }

        const idSekolah = await this.getSekolahIDFromAkun(akun)

        return await this.liniMasaRepository.createLiniMasa(idSekolah, dto)
    }

    async updateLiniMasa(akun: Akun, id: string, dto: LiniMasaDTO) {
        if (akun.tipeAkun != TipeAkun.adminSekolah) {
            throw new ForbiddenException(
                `Rute ini khusus untuk admin sekolah`
            )
        }

        return await this.liniMasaRepository.updateLiniMasa(id, dto)
    }

    async deleteLiniMasa(akun: Akun, id: string) {
        if (akun.tipeAkun != TipeAkun.adminSekolah) {
            throw new ForbiddenException(
                `Rute ini khusus untuk admin sekolah`
            )
        }

        return await this.liniMasaRepository.deleteLiniMasa(id)
    }

    async getLiniMasa(idSekolah: number) {
        const result = await this.liniMasaRepository.getAllByIDSekolah(idSekolah)
        const finalResult = result.map(item => {
            return {
                startDate: item.startDate,
                endDate: item.endDate,
                kegiatan: item.kegiatan
            }
        })

        return finalResult
    }
}

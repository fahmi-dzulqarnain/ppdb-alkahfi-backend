import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SekolahDTO } from './model';
import { TipeSekolahDTO } from './model/dto';
import { TipeSekolahUpdateDTO } from './model/dto/tipe-sekolah-update.dto';
import { SekolahRepository } from './sekolah.repository';
import { TipeSekolahRepository } from './tipe-sekolah.repository';

@Injectable()
export class SekolahService {
    constructor(
        @InjectRepository(SekolahRepository)
        private sekolahRepository: SekolahRepository,
        @InjectRepository(TipeSekolahRepository)
        private tipeSekolahRepository: TipeSekolahRepository
    ) {}

    async getAll() {
        return await this.sekolahRepository.find()
    }

    async getByID(idSekolah: number) {
        if (idSekolah) {
            const sekolah = await this.sekolahRepository.findOneBy({ 
                idSekolah 
            })
    
            if(!sekolah) {
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

        if(!sekolah) {
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
        const tipeSekolah = this.tipeSekolahRepository.findOneBy({id})

        if(!tipeSekolah) {
            throw new NotFoundException(
                `Tipe sekolah dengan id ${id} tidak ditemukan`
            )
        }

        return tipeSekolah
    }

    async updateTipeSekolahByID(id: string, dto: Partial<TipeSekolahUpdateDTO>) {
        const existing = await this.getTipeSekolahByID(id)

        if(!existing) {
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
}

import { Injectable, NotAcceptableException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { TipeSekolah } from "./model";
import { TipeSekolahDTO } from "./model/dto";

@Injectable()
export class TipeSekolahRepository extends Repository<TipeSekolah> {
    constructor(dataSource: DataSource) {
        super(TipeSekolah, dataSource.createEntityManager())
    }

    async createTipeSekolah(dto: TipeSekolahDTO) {
        const tipeSekolah = this.create(dto)

        try {
            return await this.save(tipeSekolah)
        } catch (error) {
            return error
        }
    }

    async substractSisaKuota(id: string) {
        const tipeSekolah = await this.findTipeSekolahByID(id)

        tipeSekolah.sisaKuota -= 1

        return this.update({ id }, tipeSekolah)
    }

    async findTipeSekolahByID(id: string) {
        const tipeSekolah = await this.findOneBy({ id })

        if (!tipeSekolah) {
            throw new NotFoundException(
                `Tidak ada tipe sekolah dengan id ${id}`
            )
        }

        return tipeSekolah
    }

    async checkAvailability(id: string) {
        const tipeSekolah = await this.findTipeSekolahByID(id)
        const namaTipe = tipeSekolah.namaTipe
        const sisaKuota = tipeSekolah.sisaKuota

        if (sisaKuota <= 0) {
            throw new NotAcceptableException(
                `Kuota ${namaTipe} telah habis`
            )
        }

        return {
            statusCode: 200,
            message: `Kuota ${namaTipe} masih tersedia ${sisaKuota}`
        }
    }
}
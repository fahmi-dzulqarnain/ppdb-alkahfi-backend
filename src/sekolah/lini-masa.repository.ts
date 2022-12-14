import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { LiniMasa } from "./model";
import { LiniMasaDTO } from "./model/dto/lini-masa.dto";

@Injectable()
export class LiniMasaRepository extends Repository<LiniMasa> {
    constructor(dataSource: DataSource) {
        super(LiniMasa, dataSource.createEntityManager())
    }

    async createLiniMasa(idSekolah: number, dto: LiniMasaDTO) {
        const liniMasa = this.create({
            idSekolah,
            ...dto
        })

        try {
            return await this.save(liniMasa)
        } catch (error) {
            return error
        }
    }

    async getAllByIDSekolah(idSekolah: number) {
        return await this.findBy({ idSekolah })
    }

    async getByID(id: string) {
        const liniMasa = await this.findOneBy({ id })

        if (!liniMasa) {
            throw new NotFoundException(
                `Lini masa dengan id ${id} tidak ditemukan`
            )
        }

        return liniMasa
    }

    async updateLiniMasa(id: string, dto: LiniMasaDTO) {
        const liniMasa = await this.getByID(id)
        const idSekolah = liniMasa.idSekolah
        const edited = {
            idSekolah,
            ...dto
        }

        return await this.save(edited)
    }

    async deleteLiniMasa(id: string) {
        const liniMasa = await this.getByID(id)

        return await this.delete(liniMasa)
    }
}
import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Sekolah, SekolahDTO } from "./model";
import { SekolahUpdateDTO } from "./model/dto/sekolah-update.dto";

@Injectable()
export class SekolahRepository extends Repository<Sekolah> {
    constructor(dataSource: DataSource) {
        super(Sekolah, dataSource.createEntityManager())
    }

    async createSekolah(dto: SekolahDTO) {
        const sekolah = this.create(dto)

        try {
            return await this.save(sekolah)
        } catch (error) {
            return error
        }
    }

    async updateSekolah(idSekolah: number, dto: SekolahUpdateDTO) {
        const sekolah = this.findOneBy({ idSekolah })

        if (!sekolah) {
            throw new NotFoundException(
                `Sekolah dengan id ${idSekolah} tidak ditemukan`
            )
        }

        const edited = {
            idSekolah,
            ...dto
        }

        return await this.save(edited)
    }
}
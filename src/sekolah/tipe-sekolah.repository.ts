import { Injectable, NotFoundException } from "@nestjs/common";
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
        const tipeSekolah = await this.findOneBy({ id })
        
        if(!tipeSekolah) {
            throw new NotFoundException(
                `Tidak ada tipe sekolah dengan id ${id}`
            )
        }

        tipeSekolah.sisaKuota -= 1

        return this.update({ id }, tipeSekolah)
    }
}
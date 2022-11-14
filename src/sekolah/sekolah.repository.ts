import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Sekolah, SekolahDTO } from "./model";

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
}
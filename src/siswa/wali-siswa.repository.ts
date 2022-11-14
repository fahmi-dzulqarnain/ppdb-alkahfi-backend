import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { RegisterDTO } from "src/auth/model/dto";
import { DataSource, Repository } from "typeorm";
import { WaliSiswa } from "./model";

@Injectable()
export class WaliSiswaRepository extends Repository<WaliSiswa> {
    constructor(
        @Inject(forwardRef(() => DataSource))
        dataSource: DataSource
    ){
        super(WaliSiswa, dataSource.createEntityManager())
    }

    async createWaliSiswa(dto: RegisterDTO) {
        const waliSiswa = this.create({
            ...dto
        })

        try {
            const waliSiswaSaved = await this.save(waliSiswa)
            const idOrangTua = waliSiswaSaved.id
            
            return {
                idOrangTua: idOrangTua,
                message: "Wali Siswa ditambahkan"
            }
        } catch (error) {
            return error
        }
    }
}
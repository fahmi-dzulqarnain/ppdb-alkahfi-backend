import { forwardRef, Inject, Injectable } from "@nestjs/common";
import { RegisterDTO } from "src/auth/model/dto";
import { DataSource, Repository } from "typeorm";
import { Siswa } from "./model";

@Injectable()
export class SiswaRepository extends Repository<Siswa> {
    constructor(
        @Inject(forwardRef(() => DataSource))
        dataSource: DataSource
    ) {
        super(Siswa, dataSource.createEntityManager())
    }

    async createSiswa(dto: RegisterDTO, idRegistrasi: string, idOrangTua: string) {
        const siswa = this.create({
            idRegistrasi,
            idOrangTua,
            ...dto
        })

        try {
            await this.save(siswa)

            return {
                message: "Siswa Created"
            }
        } catch (error) {
            return {
                error
            }
        }
    }

    async getSiswaByID(id: string) {
        return await this.findOneBy({ id })
    }
}
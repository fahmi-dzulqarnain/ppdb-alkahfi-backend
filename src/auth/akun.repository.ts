import { BadRequestException, ConflictException, forwardRef, Inject, Injectable, InternalServerErrorException } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import { Akun } from "./model";
import { RegisterDTO } from "./model/dto";
import * as bcrypt from 'bcrypt'
import { TipeAkun } from "./model/enum/tipe-akun.enum";

@Injectable()
export class AkunRepository extends Repository<Akun> {
    constructor(
        @Inject(forwardRef(() => DataSource))
        dataSource: DataSource
    ) {
        super(Akun, dataSource.createEntityManager());
    }

    async createAccount(dto: RegisterDTO) {
        const salt = await bcrypt.genSalt()
        const hashedPassword = await bcrypt.hash(dto.sandi, salt)

        const akun = this.create({
            username: dto.username,
            sandi: hashedPassword,
            tipeAkun: dto.tipeAkun || TipeAkun.pendaftar,
            idTipeSekolah: dto.idTipeSekolah
        })

        try {
            await this.save(akun)

            return {
                message: "Account Created Successfully",
                akun
            }
        } catch (error) {
            if (error.code === '23505') {
                throw new ConflictException('Akun telah terdaftar, mohon hubungi panitia jika ini adalah kesalahan')
            } else {
                throw new BadRequestException(error.message)
            }
        }
    }
}
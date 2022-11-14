import { Injectable, NotFoundException } from "@nestjs/common";
import { DataSource, In, Repository } from "typeorm";
import { Registrasi } from "./model";
import { StatusRegistrasi } from "./model/enum/status-registrasi.enum";

@Injectable()
export class RegistrasiRepository extends Repository<Registrasi> {
    constructor(dataSource: DataSource) {
        super(Registrasi, dataSource.createEntityManager())
    }

    async createRegistration(noPendaftaran: number) {
        const today = new Date();
        var tomorrow = new Date().setTime(today.getTime() + (24 * 60 * 60 * 1000))

        const nominalTransfer = 219000 + noPendaftaran
        const registration = this.create({
            noPendaftaran,
            waktuDaftar: today.getTime().toString(),
            deadlineBayar: tomorrow.toString(),
            nominalTransfer
        })

        try {
            await this.save(registration)

            return {
                message: "Registration Success",
                idRegistrasi: registration.id
            }
        } catch (error) {
            return {
                error
            }
        }
    }

    async getRegistrasiByNoPendaftaran(noPendaftaran: number) {
        const registrasi = await this.findOneBy({ noPendaftaran })
        
        if(!registrasi) {
            throw new NotFoundException(
                `Registrasi dengan nomor pendaftaran ${noPendaftaran} tidak ditemukan`
            )
        }

        return registrasi
    }

    async updateStatusByIDs(ids: string[], statusRegistrasi: StatusRegistrasi) {
        const registrasiArray = await this.find({
            where: {
                id: In(ids)
            }
        })

        if(!registrasiArray) {
            throw new NotFoundException(
                `Data registrasi tidak ditemukan`
            )
        }

        var updatedCount = 0
        var errorResponse = ""

        for (let index = 0; index < registrasiArray.length; index++) {
            let id = registrasiArray[index].id

            try {
                await this.update({id}, { status: statusRegistrasi})
            } catch (error) {
                errorResponse = error
            }

            updatedCount++
        }

        return {
            message: `Berhasil mengubah status menjadi ${statusRegistrasi}`,
            updatedCount,
            errorResponse
        }
    }

    async updateStatusByID(id: string, statusRegistrasi: StatusRegistrasi) {
        const registrasi = await this.findOneBy({ id })

        if(!registrasi) {
            throw new NotFoundException(
                `Registrasi dengan id ${id} tidak ditemukan`
            )
        }

        return await this.update({ id }, { status: statusRegistrasi })
    }

    async updateReceipt(id: string, buktiTransaksi: string) {
        const registrasi = await this.findOneBy({ id })

        if(!registrasi) {
            throw new NotFoundException(
                `Registrasi dengan id ${id} tidak ditemukan`
            )
        }

        return await this.update({ id }, { buktiTransaksi })
    }

    async getReceipt(id: string) {
        const registrasi = await this.findOneBy({ id })

        if(!registrasi) {
            throw new NotFoundException(
                `Registrasi dengan id ${id} tidak ditemukan`
            )
        }

        return registrasi.buktiTransaksi
    }

    async getByID(id: string) {
        const registrasi = await this.findOneBy({ id })

        if(!registrasi) {
            throw new NotFoundException(
                `Registrasi dengan id ${id} tidak ditemukan`
            )
        }

        return registrasi
    }
}
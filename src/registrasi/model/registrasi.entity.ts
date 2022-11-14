import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn } from "typeorm";
import { StatusRegistrasi } from "./enum/status-registrasi.enum";

@Entity()
export class Registrasi {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    noPendaftaran: number

    @Column()
    waktuDaftar: string
  
    @Column()
    deadlineBayar: string

    @Column()
    nominalTransfer: number

    @Column({ default: "-" })
    buktiTransaksi: string

    @Column({
        type: 'enum',
        enum: StatusRegistrasi,
        default: StatusRegistrasi.menunggu_pembayaran
    })
    status: StatusRegistrasi
}
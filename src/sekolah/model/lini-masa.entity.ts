import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sekolah } from "./sekolah.entity";

@Entity()
export class LiniMasa {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => Sekolah, (sekolah) => sekolah.idSekolah, { eager: true })
    @Column()
    idSekolah: number

    @Column()
    startDate: string

    @Column()
    endDate: string

    @Column()
    kegiatan: string
}
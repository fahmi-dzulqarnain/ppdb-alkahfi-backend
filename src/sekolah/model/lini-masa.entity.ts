import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sekolah } from "./sekolah.entity";

@Entity()
export class LiniMasa {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => Sekolah, (sekolah) => sekolah.idSekolah, { eager: true })
    @JoinColumn()
    idSekolah: number

    @Column()
    startDate: string

    @Column()
    endDate: string

    @Column()
    kegiatan: string
}
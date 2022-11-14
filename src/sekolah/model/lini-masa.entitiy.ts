import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { Sekolah } from "./sekolah.entity";

@Entity()
export class LiniMasa {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => Sekolah, (sekolah) => sekolah.idSekolah, { eager: true })
    @Column()
    idSekolah: number

    @Column( { type: 'date' } )
    startDate: string

    @Column( { type: 'date' } )
    endDate: string

    @Column()
    kegiatan: string
}
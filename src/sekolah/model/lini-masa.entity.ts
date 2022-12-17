import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class LiniMasa {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column()
    idSekolah: number

    @Column()
    startDate: string

    @Column()
    endDate: string

    @Column()
    kegiatan: string
}
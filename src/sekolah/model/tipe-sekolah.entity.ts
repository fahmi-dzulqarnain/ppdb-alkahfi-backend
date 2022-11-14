import { Akun } from "src/auth/model";
import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Sekolah } from "./sekolah.entity";

@Entity()
export class TipeSekolah {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @ManyToOne(() => Sekolah, (sekolah) => sekolah.tipeSekolah)
    @Column({ update: false })
    idSekolah: number

    @OneToMany(() => Akun, (akun) => akun.id, { cascade: true })
    akuns: Akun[]

    @Column()
    namaTipe: string

    @Column()
    kuota: number

    @Column()
    sisaKuota: number

    @Column()
    kapasitas: number
}
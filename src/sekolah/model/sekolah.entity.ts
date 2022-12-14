import { Column, Entity, JoinColumn, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TipeSekolah } from "./tipe-sekolah.entity";

@Entity()
export class Sekolah {
    @PrimaryGeneratedColumn('increment')
    idSekolah: number

    @Column()
    namaSekolah: string

    @Column()
    logo: string

    @Column()
    alamat: string

    @Column()
    kontak: string

    @Column()
    namaRekening: string

    @Column()
    noRekening: string

    @Column('text', { array: true })
    syarat: string[]

    @Column()
    linkWAGroup: string

    @Column()
    biayaPendaftaran: number

    @Column()
    biayaAwal: number

    @Column()
    biayaSPP: number

    @OneToMany(() => TipeSekolah, (tipeSekolah) => tipeSekolah.idSekolah, {
        cascade: true,
        eager: true
    })
    tipeSekolah: TipeSekolah[]

    @Column('boolean', { default: true })
    isRegistrationOpen: boolean = true

    @Column({ default: 0 })
    orderNumber: number
}
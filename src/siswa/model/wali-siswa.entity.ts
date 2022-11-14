import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class WaliSiswa {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ default: "" })
    nikAyah: string

    @Column()
    namaAyah: string

    @Column({ default: "" })
    tahunLahirAyah: string

    @Column({ default: "" })
    pekerjaanAyah: string

    @Column({ default: "" })
    penghasilanAyah: string

    @Column()
    hpAyah: string
  
    @Column({ default: "" })
    nikIbu: string

    @Column()
    namaIbu: string

    @Column({ default: "" })
    tahunLahirIbu: string

    @Column({ default: "" })
    pekerjaanIbu: string

    @Column({ default: "" })
    penghasilanIbu: string

    @Column()
    hpIbu: string
  
    @Column()
    alamat: string

    @Column()
    kelurahan: string

    @Column()
    kecamatan: string

    @Column({ default: "" })
    noRT: string

    @Column({ default: "" })
    noRW: string

    @Column({ default: "" })
    kodePos: string

    @Column({ default: "" })
    lintang: string

    @Column({ default: "" })
    bujur: string
}
import { Registrasi } from "src/registrasi/model";
import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { JenisKelamin } from "./enum/jenis-kelamin.enum";
import { WaliSiswa } from "./wali-siswa.entity";

@Entity()
export class Siswa {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @OneToOne(() => Registrasi, (registrasi) => registrasi.id, { eager: true })
    @Column({ type: 'uuid' })
    @JoinColumn()
    idRegistrasi: string

    @Column()
    namaLengkap: string
   
    @Column()
    tempatLahir: string

    @Column()
    tanggalLahir: string

    @Column({ default: "" })
    asalSekolah: string

    @Column({ type: 'int', default: 0 })
    rerataRapor: number

    @Column({ default: "" })
    prestasi: string

    @OneToOne(() => WaliSiswa, (waliSiswa) => waliSiswa.id, { eager: true })
    @Column({ type: 'uuid' })
    @JoinColumn()
    idOrangTua: string
  
    @Column({
        type: 'enum',
        enum: JenisKelamin,
        default: JenisKelamin.laki_laki
    })
    jenisKelamin: JenisKelamin

    @Column({ default: "" })
    nisn: string

    @Column({ default: "" })
    kewarganegaraan: string

    @Column({ default: "" })
    nik: string

    @Column({ default: "" })
    noKK: string

    @Column({ default: "" })
    noAktaLahir: string

    @Column({ default: "" })
    tempatTinggal: string

    @Column({ default: "" })
    modaTransportasi: string

    @Column({ type: 'int', default: 0 })
    jarakRumah: number

    @Column({ type: 'int', default: 1 })
    anakKe: number
}
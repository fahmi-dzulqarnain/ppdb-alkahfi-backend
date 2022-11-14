import { TipeSekolah } from "src/sekolah/model";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { TipeAkun } from "./enum/tipe-akun.enum";

@Entity()
export class Akun {
    @PrimaryGeneratedColumn('uuid')
    id: string

    @Column({ generated: 'increment' })
    noPendaftaran: number

    @Column({ unique: true })
    username: string

    @Column()
    sandi: string

    @Column({
        type: 'enum',
        enum: TipeAkun,
        default: TipeAkun.pendaftar
    })
    tipeAkun: TipeAkun

    @ManyToOne(() => TipeSekolah, (tipeSekolah) => tipeSekolah.id, { 
        eager: true, 
        cascade: true 
    })
    @JoinColumn({ name: "idTipeSekolah" })
    @Column({ nullable: false })
    idTipeSekolah: string
  
    @Column({ 
        type: 'timestamptz', 
        default: () => 'NOW()' 
    })
    createdAt: string
}
import { TipeSekolah } from "./tipe-sekolah.entity"

export class SekolahModel {
    orderNumber: number
    namaSekolah: string
    logo: string
    detail: DetailSekolahModel[]
}

export class DetailSekolahModel {
    idSekolah: number
    alamat: string
    kontak: string
    namaRekening: string
    noRekening: string
    syarat: string[]
    linkWAGroup: string
    biayaPendaftaran: number
    biayaAwal: number
    biayaSPP: number
    tipeSekolah: TipeSekolah[]
    isRegistrationOpen: boolean = true
}
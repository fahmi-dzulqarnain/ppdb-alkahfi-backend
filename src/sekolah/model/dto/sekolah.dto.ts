import { IsArray, IsNotEmpty, IsNumber, IsNumberString, IsString, IsUrl } from "class-validator"

export class SekolahDTO {
    @IsString()
    @IsNotEmpty()
    namaSekolah: string

    @IsString()
    @IsNotEmpty()
    logo: string

    @IsString()
    @IsNotEmpty()
    alamat: string

    @IsString()
    @IsNotEmpty()
    kontak: string

    @IsString()
    @IsNotEmpty()
    namaRekening: string
  
    @IsString()
    @IsNotEmpty()
    noRekening: string

    @IsArray()
    syarat: string[]

    @IsUrl()
    linkWAGroup: string

    @IsNumberString()
    biayaPendaftaran: number

    @IsNumberString()
    biayaAwal: number

    @IsNumberString()
    biayaSPP: number
}
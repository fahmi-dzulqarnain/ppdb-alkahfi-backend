import { IsArray, IsNotEmpty, IsNumberString, IsOptional, IsString, IsUrl } from "class-validator"

export class SekolahUpdateDTO {
    @IsString()
    @IsOptional()
    namaSekolah?: string

    @IsUrl()
    @IsOptional()
    logo?: string

    @IsString()
    @IsOptional()
    alamat?: string

    @IsString()
    @IsOptional()
    kontak?: string

    @IsString()
    @IsOptional()
    namaRekening?: string

    @IsString()
    @IsOptional()
    noRekening?: string

    @IsArray()
    @IsOptional()
    syarat?: string[]

    @IsUrl()
    @IsOptional()
    linkWAGroup?: string

    @IsNumberString()
    @IsOptional()
    biayaPendaftaran?: number

    @IsNumberString()
    @IsOptional()
    biayaAwal?: number

    @IsNumberString()
    @IsOptional()
    biayaSPP?: number
}
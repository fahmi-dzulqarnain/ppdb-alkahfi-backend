import {
    IsEnum, IsMobilePhone, IsNotEmpty,
    IsNumberString, IsOptional, IsString,
    IsUUID, Matches, MaxLength
} from "class-validator"
import { TipeAkun } from "../enum/tipe-akun.enum"

export class RegisterDTO {
    @IsString()
    @IsNotEmpty()
    @MaxLength(24)
    username: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(48)
    sandi: string

    @IsEnum(TipeAkun)
    tipeAkun: TipeAkun

    @IsUUID()
    idTipeSekolah: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(48)
    namaAyah: string

    @IsMobilePhone(["id-ID", "en-SG", "ms-MY"])
    hpAyah: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(48)
    namaIbu: string

    @IsMobilePhone(["id-ID", "en-SG", "ms-MY"])
    hpIbu: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(64)
    alamat: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(16)
    kelurahan: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(16)
    kecamatan: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(48)
    namaLengkap: string

    @IsString()
    @IsNotEmpty()
    @MaxLength(24)
    tempatLahir: string

    @Matches(/^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)\d{4}$/i, {
        message: "$property must be formatted as dd-MM-yyyy"
    })
    tanggalLahir: string

    @IsString()
    @IsOptional()
    @MaxLength(32)
    asalSekolah: string

    @IsNumberString()
    @MaxLength(3)
    rerataRapor: number

    @IsString()
    @IsOptional()
    @MaxLength(50)
    prestasi: string

    @IsString()
    nisn: string
}
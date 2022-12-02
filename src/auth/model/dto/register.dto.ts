import {
    IsEnum, IsInt, IsMobilePhone, IsNotEmpty,
    IsOptional, IsString,
    IsUUID, Matches, Max, MaxLength
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
    @IsNotEmpty({
        message: "Nama ayahanda perlu diisi"
    })
    @MaxLength(48)
    namaAyah: string

    @IsMobilePhone(["id-ID", "en-SG", "ms-MY"], null, {
        message: "HP ayahanda perlu sesuai format nomor HP"
    })
    hpAyah: string

    @IsString()
    @IsNotEmpty({
        message: "Nama ibunda perlu diisi"
    })
    @MaxLength(48)
    namaIbu: string

    @IsMobilePhone(["id-ID", "en-SG", "ms-MY"], null, {
        message: "HP ibunda perlu sesuai format nomor HP"
    })
    hpIbu: string

    @IsString()
    @IsNotEmpty({
        message: "Alamat perlu diisi"
    })
    @MaxLength(64)
    alamat: string

    @IsString()
    @IsNotEmpty({
        message: "Kelurahan perlu diisi"
    })
    @MaxLength(16)
    kelurahan: string

    @IsString()
    @IsNotEmpty({
        message: "Kecamatan perlu diisi"
    })
    @MaxLength(16)
    kecamatan: string

    @IsString()
    @IsNotEmpty({
        message: "Nama lengkap perlu diisi"
    })
    @MaxLength(48)
    namaLengkap: string

    @IsString()
    @IsNotEmpty({
        message: "Tempat lahir perlu diisi"
    })
    @MaxLength(24)
    tempatLahir: string

    @Matches(/^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)\d{4}$/i, {
        message: "Tanggal lahir harus ber format hh-BB-tttt"
    })
    tanggalLahir: string

    @IsString()
    @IsOptional()
    @MaxLength(32)
    asalSekolah: string

    @IsInt({
        message: "Rerata rapor hanya boleh angka tanpa koma"
    })
    @Max(100, {
        message: "Rerata rapor tidak boleh lebih dari 100"
    })
    rerataRapor: number

    @IsString()
    @IsOptional()
    @MaxLength(64)
    prestasi: string

    @IsString()
    nisn: string
}
import { IsNotEmpty, IsNumber, IsString } from "class-validator"

export class TipeSekolahDTO {
    @IsNumber()
    idSekolah: number

    @IsString()
    @IsNotEmpty()
    namaTipe: string

    @IsNumber()
    kuota: number

    @IsNumber()
    sisaKuota: number

    @IsNumber()
    kapasitas: number
}
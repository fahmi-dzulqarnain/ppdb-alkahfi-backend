import { IsNumber, IsOptional, IsString } from "class-validator"

export class TipeSekolahUpdateDTO {
    @IsString()
    @IsOptional()
    namaTipe?: string

    @IsNumber()
    @IsOptional()
    kuota?: number

    @IsNumber()
    @IsOptional()
    sisaKuota?: number

    @IsNumber()
    @IsOptional()
    kapasitas?: number
}
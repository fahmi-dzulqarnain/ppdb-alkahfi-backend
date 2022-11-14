import { IsArray, IsEnum, IsNotEmpty } from "class-validator";
import { StatusRegistrasi } from "../enum/status-registrasi.enum";

export class UpdateStatusDTO {
    @IsArray()
    @IsNotEmpty()
    ids: string[]

    @IsEnum(StatusRegistrasi)
    statusRegistrasi: StatusRegistrasi
}
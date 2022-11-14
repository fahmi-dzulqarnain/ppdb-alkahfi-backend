import { IsEnum, IsUUID } from "class-validator";
import { StatusRegistrasi } from "../enum/status-registrasi.enum";

export class UpdateOneStatusDTO {
    @IsUUID()
    id: string

    @IsEnum(StatusRegistrasi)
    statusRegistrasi: StatusRegistrasi
}
import { IsMobilePhone, IsNotEmpty, Matches } from "class-validator";

export class LoginDTO {
    @IsMobilePhone(["id-ID", "en-SG", "ms-MY"])
    @IsNotEmpty()
    noHP: string

    @Matches(/^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)\d{4}$/i, {
        message: "$property must be formatted as dd-MM-yyyy"
    })
    tanggalLahir: string
}
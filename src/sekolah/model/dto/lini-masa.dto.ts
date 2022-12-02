import { IsString, Matches, MaxLength } from "class-validator"

export class LiniMasaDTO {
    @IsString()
    @Matches(/^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)\d{4}$/i, {
        message: "Tanggal mulai harus ber format hh-BB-tttt"
    })
    startDate: string

    @IsString()
    @Matches(/^([0-2][0-9]|(3)[0-1])(-)(((0)[0-9])|((1)[0-2]))(-)\d{4}$/i, {
        message: "Tanggal berakhir harus ber format hh-BB-tttt"
    })
    endDate: string

    @IsString()
    @MaxLength(80)
    kegiatan: string
}
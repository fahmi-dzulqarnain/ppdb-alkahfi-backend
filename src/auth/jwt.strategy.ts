import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { InjectRepository } from "@nestjs/typeorm";
import { ExtractJwt, Strategy } from "passport-jwt";
import { TipeSekolah } from "src/sekolah/model";
import { AkunRepository } from "./akun.repository";
import { TipeAkun } from "./model/enum/tipe-akun.enum";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(
        @InjectRepository(AkunRepository)
        private akunRepository: AkunRepository
    ) {
        super({
            secretOrKey: 'rahasiaLah',
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        })
    }

    async validate(payload: { 
            username: string, 
            tipeAkun: TipeAkun 
        }
    ) {
        const { username, tipeAkun } = payload
        const akun = await this.akunRepository.findOneBy({ username, tipeAkun })
        
        if (!akun) {
            throw new UnauthorizedException('Token invalid')
        }

        return akun
    }
}
import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { Akun } from "./model";

export const GetAkun = createParamDecorator(
    (_data, ctx: ExecutionContext) : Akun => {
        const req = ctx.switchToHttp().getRequest()
        return req.user
    }
)
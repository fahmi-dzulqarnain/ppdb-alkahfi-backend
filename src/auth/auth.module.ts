import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegistrasiModule } from 'src/registrasi/registrasi.module';
import { SekolahModule } from 'src/sekolah/sekolah.module';
import { SiswaModule } from 'src/siswa/siswa.module';
import { AkunRepository } from './akun.repository';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { Akun } from './model';

@Module({
  imports: [
    PassportModule.register({ 
      defaultStrategy: 'jwt', 
      session: true 
    }),
    JwtModule.register({
      secret: 'rahasiaLah',
      signOptions: {
        expiresIn: '60m'
      }
    }),
    TypeOrmModule.forFeature([Akun]),
    RegistrasiModule,
    SiswaModule,
    SekolahModule
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    AkunRepository, 
    JwtStrategy
  ],
  exports: [AkunRepository]
})
export class AuthModule {}

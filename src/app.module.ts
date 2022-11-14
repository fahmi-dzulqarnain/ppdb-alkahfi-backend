import { Module } from '@nestjs/common';
import { SekolahModule } from './sekolah/sekolah.module';
import { AuthModule } from './auth/auth.module';
import { RegistrasiModule } from './registrasi/registrasi.module';
import { SiswaModule } from './siswa/siswa.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Akun } from './auth/model';
import { LiniMasa, Sekolah, TipeSekolah } from './sekolah/model';
import { Siswa, WaliSiswa } from './siswa/model';
import { Registrasi } from './registrasi/model';
import { env } from 'process';
import 'dotenv/config'

@Module({
  imports: [
    SekolahModule, 
    AuthModule, 
    RegistrasiModule, 
    SiswaModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: env.DB_NAME,
      username: env.DB_USER,
      password: env.DB_PASS,
      host: env.DB_HOST,
      port: parseInt(env.DB_PORT),
      entities: [
        Akun,
        Sekolah,
        TipeSekolah,
        Siswa,
        WaliSiswa,
        Registrasi,
        LiniMasa
      ],
      autoLoadEntities: true,
      synchronize: true,
      dropSchema: false
    })
  ]
})
export class AppModule {}

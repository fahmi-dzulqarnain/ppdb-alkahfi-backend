import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { RegistrasiModule } from 'src/registrasi/registrasi.module';
import { SekolahModule } from 'src/sekolah/sekolah.module';
import { Siswa, WaliSiswa } from './model';
import { SiswaController } from './siswa.controller';
import { SiswaRepository } from './siswa.repository';
import { SiswaService } from './siswa.service';
import { WaliSiswaRepository } from './wali-siswa.repository';

@Module({
  imports: [
    RegistrasiModule,
    SekolahModule,
    forwardRef(() => AuthModule),
    TypeOrmModule.forFeature([
      Siswa,
      WaliSiswa
    ])
  ],
  controllers: [SiswaController],
  providers: [SiswaService, SiswaRepository, WaliSiswaRepository],
  exports: [
    SiswaRepository,
    WaliSiswaRepository
  ]
})
export class SiswaModule {}

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from 'src/auth/auth.module';
import { SekolahModule } from 'src/sekolah/sekolah.module';
import { Registrasi } from './model';
import { RegistrasiController } from './registrasi.controller';
import { RegistrasiRepository } from './registrasi.repository';
import { RegistrasiService } from './registrasi.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Registrasi]),
    forwardRef(() => AuthModule),
    SekolahModule
  ],
  controllers: [RegistrasiController],
  providers: [
    RegistrasiService,
    RegistrasiRepository
  ],
  exports: [RegistrasiRepository]
})
export class RegistrasiModule {}

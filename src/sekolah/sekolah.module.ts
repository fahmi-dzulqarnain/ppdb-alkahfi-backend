import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LiniMasaRepository } from './lini-masa.repository';
import { LiniMasa, Sekolah, TipeSekolah } from './model';
import { SekolahController } from './sekolah.controller';
import { SekolahRepository } from './sekolah.repository';
import { SekolahService } from './sekolah.service';
import { TipeSekolahRepository } from './tipe-sekolah.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Sekolah, TipeSekolah, LiniMasa
    ])
  ],
  controllers: [SekolahController],
  providers: [
    SekolahService,
    SekolahRepository,
    TipeSekolahRepository,
    LiniMasaRepository
  ],
  exports: [
    SekolahRepository,
    TipeSekolahRepository
  ]
})
export class SekolahModule { }

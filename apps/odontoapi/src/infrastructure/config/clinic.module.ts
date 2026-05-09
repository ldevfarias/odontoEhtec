import { Module } from '@nestjs/common';
import { CLINIC_REPOSITORY } from '../../domain/ports/out/clinic.repository';
import { CREATE_CLINIC_USE_CASE } from '../../domain/ports/in/clinic/create-clinic.use-case';
import { FIND_CLINIC_BY_ID_USE_CASE } from '../../domain/ports/in/clinic/find-clinic-by-id.use-case';
import { LIST_CLINICS_USE_CASE } from '../../domain/ports/in/clinic/list-clinics.use-case';
import { UPDATE_CLINIC_USE_CASE } from '../../domain/ports/in/clinic/update-clinic.use-case';
import { DELETE_CLINIC_USE_CASE } from '../../domain/ports/in/clinic/delete-clinic.use-case';
import { DrizzleClinicRepository } from '../adapters/out/drizzle-clinic.repository';
import { CreateClinicUseCase } from '../../application/use-cases/clinic/create-clinic.use-case';
import { FindClinicByIdUseCase } from '../../application/use-cases/clinic/find-clinic-by-id.use-case';
import { ListClinicsUseCase } from '../../application/use-cases/clinic/list-clinics.use-case';
import { UpdateClinicUseCase } from '../../application/use-cases/clinic/update-clinic.use-case';
import { DeleteClinicUseCase } from '../../application/use-cases/clinic/delete-clinic.use-case';
import { ClinicController } from '../adapters/in/clinic/clinic.controller';
import { SubscriberModule } from './subscriber.module';

@Module({
  imports: [SubscriberModule],
  providers: [
    { provide: CLINIC_REPOSITORY, useClass: DrizzleClinicRepository },
    { provide: CREATE_CLINIC_USE_CASE, useClass: CreateClinicUseCase },
    { provide: FIND_CLINIC_BY_ID_USE_CASE, useClass: FindClinicByIdUseCase },
    { provide: LIST_CLINICS_USE_CASE, useClass: ListClinicsUseCase },
    { provide: UPDATE_CLINIC_USE_CASE, useClass: UpdateClinicUseCase },
    { provide: DELETE_CLINIC_USE_CASE, useClass: DeleteClinicUseCase },
  ],
  controllers: [ClinicController],
  exports: [CLINIC_REPOSITORY],
})
export class ClinicModule {}

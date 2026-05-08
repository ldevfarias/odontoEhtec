import { Module } from '@nestjs/common';
import { PATIENT_REPOSITORY } from '../../domain/ports/out/patient.repository';
import { CREATE_PATIENT_USE_CASE } from '../../domain/ports/in/patient/create-patient.use-case';
import { FIND_PATIENT_BY_ID_USE_CASE } from '../../domain/ports/in/patient/find-patient-by-id.use-case';
import { LIST_PATIENTS_USE_CASE } from '../../domain/ports/in/patient/list-patients.use-case';
import { UPDATE_PATIENT_USE_CASE } from '../../domain/ports/in/patient/update-patient.use-case';
import { DELETE_PATIENT_USE_CASE } from '../../domain/ports/in/patient/delete-patient.use-case';
import { PrismaPatientRepository } from '../adapters/out/prisma-patient.repository';
import { CreatePatientUseCase } from '../../application/use-cases/patient/create-patient.use-case';
import { FindPatientByIdUseCase } from '../../application/use-cases/patient/find-patient-by-id.use-case';
import { ListPatientsUseCase } from '../../application/use-cases/patient/list-patients.use-case';
import { UpdatePatientUseCase } from '../../application/use-cases/patient/update-patient.use-case';
import { DeletePatientUseCase } from '../../application/use-cases/patient/delete-patient.use-case';
import { PatientController } from '../adapters/in/patient/patient.controller';
import { ClinicModule } from './clinic.module';

@Module({
  imports: [ClinicModule],
  providers: [
    { provide: PATIENT_REPOSITORY, useClass: PrismaPatientRepository },
    { provide: CREATE_PATIENT_USE_CASE, useClass: CreatePatientUseCase },
    { provide: FIND_PATIENT_BY_ID_USE_CASE, useClass: FindPatientByIdUseCase },
    { provide: LIST_PATIENTS_USE_CASE, useClass: ListPatientsUseCase },
    { provide: UPDATE_PATIENT_USE_CASE, useClass: UpdatePatientUseCase },
    { provide: DELETE_PATIENT_USE_CASE, useClass: DeletePatientUseCase },
  ],
  controllers: [PatientController],
})
export class PatientModule {}

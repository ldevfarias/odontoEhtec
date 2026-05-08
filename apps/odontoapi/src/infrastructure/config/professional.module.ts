import { Module } from '@nestjs/common';
import { PROFESSIONAL_REPOSITORY } from '../../domain/ports/out/professional.repository';
import { CREATE_PROFESSIONAL_USE_CASE } from '../../domain/ports/in/professional/create-professional.use-case';
import { FIND_PROFESSIONAL_BY_ID_USE_CASE } from '../../domain/ports/in/professional/find-professional-by-id.use-case';
import { LIST_PROFESSIONALS_USE_CASE } from '../../domain/ports/in/professional/list-professionals.use-case';
import { UPDATE_PROFESSIONAL_USE_CASE } from '../../domain/ports/in/professional/update-professional.use-case';
import { DELETE_PROFESSIONAL_USE_CASE } from '../../domain/ports/in/professional/delete-professional.use-case';
import { PrismaProfessionalRepository } from '../adapters/out/prisma-professional.repository';
import { CreateProfessionalUseCase } from '../../application/use-cases/professional/create-professional.use-case';
import { FindProfessionalByIdUseCase } from '../../application/use-cases/professional/find-professional-by-id.use-case';
import { ListProfessionalsUseCase } from '../../application/use-cases/professional/list-professionals.use-case';
import { UpdateProfessionalUseCase } from '../../application/use-cases/professional/update-professional.use-case';
import { DeleteProfessionalUseCase } from '../../application/use-cases/professional/delete-professional.use-case';
import { ProfessionalController } from '../adapters/in/professional/professional.controller';
import { ClinicModule } from './clinic.module';

@Module({
  imports: [ClinicModule],
  providers: [
    { provide: PROFESSIONAL_REPOSITORY, useClass: PrismaProfessionalRepository },
    { provide: CREATE_PROFESSIONAL_USE_CASE, useClass: CreateProfessionalUseCase },
    { provide: FIND_PROFESSIONAL_BY_ID_USE_CASE, useClass: FindProfessionalByIdUseCase },
    { provide: LIST_PROFESSIONALS_USE_CASE, useClass: ListProfessionalsUseCase },
    { provide: UPDATE_PROFESSIONAL_USE_CASE, useClass: UpdateProfessionalUseCase },
    { provide: DELETE_PROFESSIONAL_USE_CASE, useClass: DeleteProfessionalUseCase },
  ],
  controllers: [ProfessionalController],
})
export class ProfessionalModule {}

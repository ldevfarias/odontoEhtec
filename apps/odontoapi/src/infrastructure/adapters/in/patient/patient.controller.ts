import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Inject,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import type { ApiResponse } from '@odontoehtec/shared';
import type { CreatePatientDto } from './create-patient.dto';
import type { UpdatePatientDto } from './update-patient.dto';
import {
  CREATE_PATIENT_USE_CASE,
  type ICreatePatientUseCase,
  type CreatePatientOutput,
} from '../../../../domain/ports/in/patient/create-patient.use-case';
import {
  FIND_PATIENT_BY_ID_USE_CASE,
  type IFindPatientByIdUseCase,
  type FindPatientByIdOutput,
} from '../../../../domain/ports/in/patient/find-patient-by-id.use-case';
import {
  LIST_PATIENTS_USE_CASE,
  type IListPatientsUseCase,
  type ListPatientsOutput,
} from '../../../../domain/ports/in/patient/list-patients.use-case';
import {
  UPDATE_PATIENT_USE_CASE,
  type IUpdatePatientUseCase,
  type UpdatePatientOutput,
} from '../../../../domain/ports/in/patient/update-patient.use-case';
import {
  DELETE_PATIENT_USE_CASE,
  type IDeletePatientUseCase,
} from '../../../../domain/ports/in/patient/delete-patient.use-case';

@Controller('patients')
export class PatientController {
  constructor(
    @Inject(CREATE_PATIENT_USE_CASE)
    private readonly createPatient: ICreatePatientUseCase,
    @Inject(FIND_PATIENT_BY_ID_USE_CASE)
    private readonly findPatientById: IFindPatientByIdUseCase,
    @Inject(LIST_PATIENTS_USE_CASE)
    private readonly listPatients: IListPatientsUseCase,
    @Inject(UPDATE_PATIENT_USE_CASE)
    private readonly updatePatient: IUpdatePatientUseCase,
    @Inject(DELETE_PATIENT_USE_CASE)
    private readonly deletePatient: IDeletePatientUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreatePatientDto): Promise<ApiResponse<CreatePatientOutput>> {
    const data = await this.createPatient.execute({
      name: dto.name,
      cpf: dto.cpf,
      birthDate: dto.birthDate ? new Date(dto.birthDate) : null,
      phone: dto.phone,
      email: dto.email,
      clinicId: dto.clinicId,
    });
    return { data, message: 'Paciente criado com sucesso' };
  }

  @Get()
  async list(
    @Query('clinicId') clinicId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ): Promise<ApiResponse<ListPatientsOutput>> {
    const data = await this.listPatients.execute({
      clinicId,
      page: Number(page),
      limit: Number(limit),
    });
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<FindPatientByIdOutput>> {
    const data = await this.findPatientById.execute({ id });
    return { data };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdatePatientDto
  ): Promise<ApiResponse<UpdatePatientOutput>> {
    const data = await this.updatePatient.execute({
      id,
      name: dto.name,
      phone: dto.phone,
      email: dto.email,
      birthDate:
        dto.birthDate !== undefined ? (dto.birthDate ? new Date(dto.birthDate) : null) : undefined,
    });
    return { data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deletePatient.execute({ id });
  }
}

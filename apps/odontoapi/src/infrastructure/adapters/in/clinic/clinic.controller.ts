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
import type { CreateClinicDto } from './create-clinic.dto';
import type { UpdateClinicDto } from './update-clinic.dto';
import {
  CREATE_CLINIC_USE_CASE,
  type ICreateClinicUseCase,
  type CreateClinicOutput,
} from '../../../../domain/ports/in/clinic/create-clinic.use-case';
import {
  FIND_CLINIC_BY_ID_USE_CASE,
  type IFindClinicByIdUseCase,
  type FindClinicByIdOutput,
} from '../../../../domain/ports/in/clinic/find-clinic-by-id.use-case';
import {
  LIST_CLINICS_USE_CASE,
  type IListClinicsUseCase,
  type ListClinicsOutput,
} from '../../../../domain/ports/in/clinic/list-clinics.use-case';
import {
  UPDATE_CLINIC_USE_CASE,
  type IUpdateClinicUseCase,
  type UpdateClinicOutput,
} from '../../../../domain/ports/in/clinic/update-clinic.use-case';
import {
  DELETE_CLINIC_USE_CASE,
  type IDeleteClinicUseCase,
} from '../../../../domain/ports/in/clinic/delete-clinic.use-case';

@Controller('clinics')
export class ClinicController {
  constructor(
    @Inject(CREATE_CLINIC_USE_CASE)
    private readonly createClinic: ICreateClinicUseCase,
    @Inject(FIND_CLINIC_BY_ID_USE_CASE)
    private readonly findClinicById: IFindClinicByIdUseCase,
    @Inject(LIST_CLINICS_USE_CASE)
    private readonly listClinics: IListClinicsUseCase,
    @Inject(UPDATE_CLINIC_USE_CASE)
    private readonly updateClinic: IUpdateClinicUseCase,
    @Inject(DELETE_CLINIC_USE_CASE)
    private readonly deleteClinic: IDeleteClinicUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreateClinicDto): Promise<ApiResponse<CreateClinicOutput>> {
    const data = await this.createClinic.execute(dto);
    return { data, message: 'Clínica criada com sucesso' };
  }

  @Get()
  async list(
    @Query('subscriberId') subscriberId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ): Promise<ApiResponse<ListClinicsOutput>> {
    const data = await this.listClinics.execute({
      subscriberId,
      page: Number(page),
      limit: Number(limit),
    });
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<FindClinicByIdOutput>> {
    const data = await this.findClinicById.execute({ id });
    return { data };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateClinicDto
  ): Promise<ApiResponse<UpdateClinicOutput>> {
    const data = await this.updateClinic.execute({ id, ...dto });
    return { data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteClinic.execute({ id });
  }
}

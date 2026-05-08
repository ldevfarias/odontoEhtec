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
import { ApiTags } from '@nestjs/swagger';
import type { ApiResponse } from '@odontoehtec/shared';
import type { CreateProfessionalDto } from './create-professional.dto';
import type { UpdateProfessionalDto } from './update-professional.dto';
import {
  CREATE_PROFESSIONAL_USE_CASE,
  type ICreateProfessionalUseCase,
  type CreateProfessionalOutput,
} from '../../../../domain/ports/in/professional/create-professional.use-case';
import {
  FIND_PROFESSIONAL_BY_ID_USE_CASE,
  type IFindProfessionalByIdUseCase,
  type FindProfessionalByIdOutput,
} from '../../../../domain/ports/in/professional/find-professional-by-id.use-case';
import {
  LIST_PROFESSIONALS_USE_CASE,
  type IListProfessionalsUseCase,
  type ListProfessionalsOutput,
} from '../../../../domain/ports/in/professional/list-professionals.use-case';
import {
  UPDATE_PROFESSIONAL_USE_CASE,
  type IUpdateProfessionalUseCase,
  type UpdateProfessionalOutput,
} from '../../../../domain/ports/in/professional/update-professional.use-case';
import {
  DELETE_PROFESSIONAL_USE_CASE,
  type IDeleteProfessionalUseCase,
} from '../../../../domain/ports/in/professional/delete-professional.use-case';

@Controller('professionals')
@ApiTags('Professionals')
export class ProfessionalController {
  constructor(
    @Inject(CREATE_PROFESSIONAL_USE_CASE)
    private readonly createProfessional: ICreateProfessionalUseCase,
    @Inject(FIND_PROFESSIONAL_BY_ID_USE_CASE)
    private readonly findProfessionalById: IFindProfessionalByIdUseCase,
    @Inject(LIST_PROFESSIONALS_USE_CASE)
    private readonly listProfessionals: IListProfessionalsUseCase,
    @Inject(UPDATE_PROFESSIONAL_USE_CASE)
    private readonly updateProfessional: IUpdateProfessionalUseCase,
    @Inject(DELETE_PROFESSIONAL_USE_CASE)
    private readonly deleteProfessional: IDeleteProfessionalUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreateProfessionalDto): Promise<ApiResponse<CreateProfessionalOutput>> {
    const data = await this.createProfessional.execute(dto);
    return { data, message: 'Profissional criado com sucesso' };
  }

  @Get()
  async list(
    @Query('clinicId') clinicId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '10'
  ): Promise<ApiResponse<ListProfessionalsOutput>> {
    const data = await this.listProfessionals.execute({
      clinicId,
      page: Number(page),
      limit: Number(limit),
    });
    return { data };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<FindProfessionalByIdOutput>> {
    const data = await this.findProfessionalById.execute({ id });
    return { data };
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProfessionalDto
  ): Promise<ApiResponse<UpdateProfessionalOutput>> {
    const data = await this.updateProfessional.execute({ id, ...dto });
    return { data };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteProfessional.execute({ id });
  }
}

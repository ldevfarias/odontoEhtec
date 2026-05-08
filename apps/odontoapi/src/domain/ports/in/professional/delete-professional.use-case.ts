export const DELETE_PROFESSIONAL_USE_CASE = Symbol('IDeleteProfessionalUseCase');

export interface DeleteProfessionalInput {
  id: string;
}

export interface IDeleteProfessionalUseCase {
  execute(input: DeleteProfessionalInput): Promise<void>;
}

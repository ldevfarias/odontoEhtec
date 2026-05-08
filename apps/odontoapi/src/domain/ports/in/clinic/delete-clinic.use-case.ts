export const DELETE_CLINIC_USE_CASE = Symbol('IDeleteClinicUseCase');

export interface DeleteClinicInput {
  id: string;
}

export interface IDeleteClinicUseCase {
  execute(input: DeleteClinicInput): Promise<void>;
}

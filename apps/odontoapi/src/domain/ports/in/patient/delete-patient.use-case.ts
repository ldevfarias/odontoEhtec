export const DELETE_PATIENT_USE_CASE = Symbol('IDeletePatientUseCase');

export interface DeletePatientInput {
  id: string;
}

export interface IDeletePatientUseCase {
  execute(input: DeletePatientInput): Promise<void>;
}

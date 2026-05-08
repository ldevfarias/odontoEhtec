export const DELETE_PLAN_USE_CASE = Symbol('IDeletePlanUseCase');

export interface DeletePlanInput {
  id: string;
}

export interface IDeletePlanUseCase {
  execute(input: DeletePlanInput): Promise<void>;
}

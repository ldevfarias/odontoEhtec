export const FIND_PLAN_BY_ID_USE_CASE = Symbol('IFindPlanByIdUseCase');

export interface FindPlanByIdInput {
  id: string;
}

export interface FindPlanByIdOutput {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IFindPlanByIdUseCase {
  execute(input: FindPlanByIdInput): Promise<FindPlanByIdOutput>;
}

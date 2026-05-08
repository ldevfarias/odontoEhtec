export const CREATE_PLAN_USE_CASE = Symbol('ICreatePlanUseCase');

export interface CreatePlanInput {
  name: string;
  description?: string;
  price: number;
  isActive?: boolean;
}

export interface CreatePlanOutput {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreatePlanUseCase {
  execute(input: CreatePlanInput): Promise<CreatePlanOutput>;
}

export const UPDATE_PLAN_USE_CASE = Symbol('IUpdatePlanUseCase');

export interface UpdatePlanInput {
  id: string;
  name?: string;
  description?: string | null;
  price?: number;
  isActive?: boolean;
}

export interface UpdatePlanOutput {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUpdatePlanUseCase {
  execute(input: UpdatePlanInput): Promise<UpdatePlanOutput>;
}

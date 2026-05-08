import type { Plan } from '../../entities/plan.entity';

export const PLAN_REPOSITORY = Symbol('IPlanRepository');

export interface CreatePlanData {
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
}

export interface UpdatePlanData {
  name?: string;
  description?: string | null;
  price?: number;
  isActive?: boolean;
}

export interface PlanPage {
  items: Plan[];
  total: number;
}

export interface IPlanRepository {
  create(data: CreatePlanData): Promise<Plan>;
  findById(id: string): Promise<Plan | null>;
  findByName(name: string): Promise<Plan | null>;
  findAll(page: number, limit: number): Promise<PlanPage>;
  update(id: string, data: UpdatePlanData): Promise<Plan>;
  delete(id: string): Promise<void>;
}

export const LIST_PLANS_USE_CASE = Symbol('IListPlansUseCase');

export interface ListPlansInput {
  page: number;
  limit: number;
}

export interface PlanItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ListPlansOutput {
  items: PlanItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IListPlansUseCase {
  execute(input: ListPlansInput): Promise<ListPlansOutput>;
}

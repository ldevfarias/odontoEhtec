import { describe, it, expect } from 'vitest';
import type { ApiResponse, Pagination } from './index';

describe('ApiResponse', () => {
  it('wraps data correctly', () => {
    const response: ApiResponse<string> = { data: 'ok' };
    expect(response.data).toBe('ok');
    expect(response.message).toBeUndefined();
  });

  it('includes pagination when provided', () => {
    const pagination: Pagination = { page: 1, limit: 10, total: 50, totalPages: 5 };
    const response: ApiResponse<string[]> = { data: [], pagination };
    expect(response.pagination?.totalPages).toBe(5);
  });
});

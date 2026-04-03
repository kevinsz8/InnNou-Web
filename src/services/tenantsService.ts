import { apiCall } from '@/utils/api';
import type { ApiResponse } from '@/utils/api';

export interface Tenant {
  tenantId: string;
  name: string;
  slug: string;
  createdUtc: string;
}

export interface GetTenantsQueryResponse {
  tenants: Tenant[];
}

export async function getTenants(): Promise<ApiResponse<GetTenantsQueryResponse>> {
  return apiCall<GetTenantsQueryResponse>('https://localhost:7279/tenants', {
    method: 'GET',
    headers: { accept: 'application/json' },
  });
}

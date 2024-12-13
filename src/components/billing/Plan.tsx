export type Plan = {
  id: number;
  type: 'FREE_PLAN' | undefined;
  organizationId: number;
  name: string;
  amount: number;
  currency: string;
  frequency: string;
  status: PlanStatus;
  statusReason: string;
  uploadSizeLimit: number;
  uploadCountLimit: number;
  downloadSizeLimit: number;
  downloadCountLimit: number;
};

export type PlanStatus = 'PENDING_PAYMENT' | 'ACTIVE' | 'CANCELLED';

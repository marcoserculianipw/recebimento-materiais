export type ChecklistStatus = 'CONFORME' | 'NAO_CONFORME';

export interface ChecklistItemResult {
  id: string;
  title: string;
  status: ChecklistStatus;
  observation?: string;
  photoUrl?: string;
}

export type OverallStatus = 'CONFORME' | 'NAO_CONFORME';

export interface ReceivingRecord {
  id: string;
  invoiceNumber: string;
  invoiceDate: string;
  supplier: string;
  material: string;
  quantity: string;
  batch: string;
  carrier: string;
  licensePlate: string;
  driver: string;
  purchaseOrder: string;
  responsible: string;
  receivedAt: string;
  generalObservation: string;
  invoicePhoto: string;
  checklist: ChecklistItemResult[];
  overallStatus: OverallStatus;
  createdAt: string;
}

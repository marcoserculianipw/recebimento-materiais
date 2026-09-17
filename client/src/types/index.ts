export type ChecklistStatus = 'CONFORME' | 'NAO_CONFORME';

export interface ChecklistItemResult {
  id: string;
  title: string;
  status: ChecklistStatus;
  observation?: string; // O que foi identificado? (quando não conforme)
  photoUrl?: string;    // Foto da ocorrência
}

export type OverallStatus = 'CONFORME' | 'NAO_CONFORME';

export interface ReceivingFormData {
  invoiceNumber: string;       // Nº da NF
  invoiceDate: string;         // Data da NF
  supplier: string;            // Fornecedor
  material: string;            // Material/Produto
  quantity: string;            // Quantidade
  batch: string;               // Lote
  carrier: string;             // Transportadora
  licensePlate: string;        // Placa
  driver: string;              // Motorista
  purchaseOrder: string;       // Pedido/OC
  responsible: string;         // Responsável
  receivedAt: string;          // Data e hora do recebimento (automático)
  generalObservation: string;  // Observação
  invoicePhoto: string;        // Foto da NF (base64 ou URL)
  checklist: ChecklistItemResult[]; // 9 itens de conferência
}

export interface ReceivingRecord extends ReceivingFormData {
  id: string;                  // ID único gerado (ex: REC-20260917-8392)
  overallStatus: OverallStatus;// 🟢 CONFORME ou 🔴 NÃO CONFORME
  createdAt: string;           // ISO timestamp
}

export interface UserProfile {
  name: string;
  email: string;
  jobTitle?: string;
}

export const CHECKLIST_ITEMS_TEMPLATE: { id: string; title: string }[] = [
  { id: 'compartimento', title: 'Integridade do compartimento' },
  { id: 'limpeza', title: 'Limpeza do veículo' },
  { id: 'contaminacao', title: 'Ausência de contaminação cruzada' },
  { id: 'pallets', title: 'Condições dos pallets' },
  { id: 'rastreabilidade', title: 'Rastreabilidade' },
  { id: 'embalagem', title: 'Integridade da embalagem' },
  { id: 'violacao', title: 'Contenção / violação' },
  { id: 'documentacao', title: 'Documentação do produto' },
  { id: 'pragas', title: 'Ausência de pragas' },
];

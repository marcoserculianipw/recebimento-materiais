import { ReceivingRecord } from '../types';

const STORAGE_KEY = 'recebimento_materiais_records_v1';

// Imagens de demonstração de alta qualidade em SVG codificado em data URI para não depender de rede externa
const DEMO_NF_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="800" viewBox="0 0 600 800" fill="%23ffffff"><rect width="100%" height="100%" fill="%23f9fafb" stroke="%23cbd5e1" stroke-width="4"/><text x="40" y="70" font-family="sans-serif" font-size="22" font-weight="bold" fill="%230a3d62">DANFE - DOCUMENTO AUXILIAR DA NOTA FISCAL</text><line x1="40" y1="90" x2="560" y2="90" stroke="%2394a3b8" stroke-width="2"/><text x="40" y="130" font-family="sans-serif" font-size="16" fill="%231e293b">Nº 000.128.450 - SÉRIE 1</text><text x="40" y="160" font-family="sans-serif" font-size="14" fill="%2364748b">EMISSÃO: 16/09/2026</text><rect x="40" y="180" width="520" height="80" fill="%23ffffff" stroke="%23e2e8f0" rx="6"/><text x="55" y="210" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">EMITENTE: KLABIN S.A.</text><text x="55" y="235" font-family="sans-serif" font-size="12" fill="%23475569">CNPJ: 89.637.490/0001-45 | IE: 104.567.890</text><rect x="40" y="280" width="520" height="120" fill="%23ffffff" stroke="%23e2e8f0" rx="6"/><text x="55" y="310" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">DESTINATÁRIO: INTERCARTA EMBALAGENS</text><text x="55" y="340" font-family="sans-serif" font-size="13" fill="%23334155">PRODUTO: PAPEL KRAFT LINER 125G/M²</text><text x="55" y="365" font-family="sans-serif" font-size="13" fill="%23334155">QUANTIDADE: 14.500 KG | LOTE: KL-2026-904</text><rect x="40" y="420" width="520" height="200" fill="%23ffffff" stroke="%23e2e8f0" rx="6"/><text x="55" y="450" font-family="sans-serif" font-size="14" font-weight="bold" fill="%230f172a">TRANSPORTADORA: JAMEF TRANSPORTES</text><text x="55" y="480" font-family="sans-serif" font-size="13" fill="%23334155">MOTORISTA: Carlos Eduardo Silva | PLACA: BRA-9A42</text><text x="55" y="510" font-family="sans-serif" font-size="13" fill="%23334155">PEDIDO/OC: OC-98432</text><circle cx="500" cy="720" r="40" fill="%2316a34a" opacity="0.15"/><text x="465" y="725" font-family="sans-serif" font-size="12" font-weight="bold" fill="%2316a34a">CONFERIDO</text></svg>`;

const DEMO_AVARIA_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="450" viewBox="0 0 600 450" fill="%23ffffff"><rect width="100%" height="100%" fill="%23fef2f2" stroke="%23f87171" stroke-width="4"/><text x="30" y="50" font-family="sans-serif" font-size="20" font-weight="bold" fill="%23dc2626">REGISTRO FOTOGRÁFICO DE OCORRÊNCIA</text><text x="30" y="80" font-family="sans-serif" font-size="14" fill="%23991b1b">Item: Condições dos pallets</text><rect x="30" y="100" width="540" height="280" fill="%23fee2e2" stroke="%23ef4444" rx="8" stroke-dasharray="6,6"/><path d="M150 320 L250 160 L350 280 L420 200 L490 320 Z" fill="%23fca5a5"/><circle cx="210" cy="180" r="25" fill="%23ef4444" opacity="0.6"/><text x="180" y="270" font-family="sans-serif" font-size="16" font-weight="bold" fill="%23b91c1c">[Foto da avaria / ripa quebrada no pallet]</text><text x="30" y="415" font-family="sans-serif" font-size="13" fill="%237f1d1d">Gravado em: 17/09/2026 - Pela Câmera do Operador</text></svg>`;

const INITIAL_MOCK_RECORDS: ReceivingRecord[] = [
  {
    id: 'REC-20260917-1042',
    invoiceNumber: '128450',
    invoiceDate: '2026-09-16',
    supplier: 'Klabin S.A.',
    material: 'Bobina Papel Kraft Liner 125g',
    quantity: '14.500 kg (12 bobinas)',
    batch: 'KL-2026-904',
    carrier: 'Jamef Transportes',
    licensePlate: 'BRA-9A42',
    driver: 'Carlos Eduardo Silva',
    purchaseOrder: 'OC-98432',
    responsible: 'Marcos Chaves (Operação)',
    receivedAt: '17/09/2026 09:30',
    generalObservation: 'Descarga realizada na Doca 02 sem intercorrências no descarregamento.',
    invoicePhoto: DEMO_NF_SVG,
    overallStatus: 'CONFORME',
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    checklist: [
      { id: 'compartimento', title: 'Integridade do compartimento', status: 'CONFORME' },
      { id: 'limpeza', title: 'Limpeza do veículo', status: 'CONFORME' },
      { id: 'contaminacao', title: 'Ausência de contaminação cruzada', status: 'CONFORME' },
      { id: 'pallets', title: 'Condições dos pallets', status: 'CONFORME' },
      { id: 'rastreabilidade', title: 'Rastreabilidade', status: 'CONFORME' },
      { id: 'embalagem', title: 'Integridade da embalagem', status: 'CONFORME' },
      { id: 'violacao', title: 'Contenção / violação', status: 'CONFORME' },
      { id: 'documentacao', title: 'Documentação do produto', status: 'CONFORME' },
      { id: 'pragas', title: 'Ausência de pragas', status: 'CONFORME' },
    ],
  },
  {
    id: 'REC-20260917-1088',
    invoiceNumber: '54201',
    invoiceDate: '2026-09-17',
    supplier: 'Colacril Autoadesivos',
    material: 'Adesivo Acrílico Aquoso Tubete 3"',
    quantity: '8 tambores (1.600 kg)',
    batch: 'CL-8821B',
    carrier: 'Braspress Transportes',
    licensePlate: 'RXT-4G19',
    driver: 'Antônio Ferreira',
    purchaseOrder: 'OC-98510',
    responsible: 'Marcos Chaves (Operação)',
    receivedAt: '17/09/2026 14:15',
    generalObservation: 'Pallet inferior apresentou travessas quebradas, material inspecionado e segregado para análise.',
    invoicePhoto: DEMO_NF_SVG,
    overallStatus: 'NAO_CONFORME',
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    checklist: [
      { id: 'compartimento', title: 'Integridade do compartimento', status: 'CONFORME' },
      { id: 'limpeza', title: 'Limpeza do veículo', status: 'CONFORME' },
      { id: 'contaminacao', title: 'Ausência de contaminação cruzada', status: 'CONFORME' },
      {
        id: 'pallets',
        title: 'Condições dos pallets',
        status: 'NAO_CONFORME',
        observation: 'Pallet de madeira com duas travessas inferiores rachadas e pregos expostos.',
        photoUrl: DEMO_AVARIA_SVG,
      },
      { id: 'rastreabilidade', title: 'Rastreabilidade', status: 'CONFORME' },
      { id: 'embalagem', title: 'Integridade da embalagem', status: 'CONFORME' },
      { id: 'violacao', title: 'Contenção / violação', status: 'CONFORME' },
      { id: 'documentacao', title: 'Documentação do produto', status: 'CONFORME' },
      { id: 'pragas', title: 'Ausência de pragas', status: 'CONFORME' },
    ],
  },
];

export const storageService = {
  getRecords(): ReceivingRecord[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_RECORDS));
        return INITIAL_MOCK_RECORDS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Falha ao ler registros do storage local:', e);
      return INITIAL_MOCK_RECORDS;
    }
  },

  getRecordById(id: string): ReceivingRecord | undefined {
    const records = this.getRecords();
    return records.find((r) => r.id === id);
  },

  saveRecord(record: ReceivingRecord): void {
    const records = this.getRecords();
    // Insere no topo da lista (mais recentes primeiro)
    const updated = [record, ...records.filter((r) => r.id !== record.id)];
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage excedido ao salvar fotos grandes, salvando sem duplicatas:', e);
      // Fallback em caso de cota de armazenamento local
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated.slice(0, 10)));
    }
  },

  resetToInitial(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_MOCK_RECORDS));
  },
};

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Camera,
  CheckSquare,
  Award,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  AlertCircle,
  Truck,
  User,
  Clock,
  Check,
  AlertTriangle,
} from 'lucide-react';
import { Header } from '../components/Header';
import { CameraCapture } from '../components/CameraCapture';
import { ChecklistItemRow } from '../components/ChecklistItemRow';
import { StatusBadge } from '../components/StatusBadge';
import {
  ReceivingFormData,
  ChecklistItemResult,
  CHECKLIST_ITEMS_TEMPLATE,
  ReceivingRecord,
} from '../types';
import { authService } from '../services/authService';
import { receivingService } from '../services/receivingService';
import { getCurrentDateTimeFormatted, getTodayDateForInput } from '../utils/idGenerator';

interface NewReceivingPageProps {
  onBack: () => void;
  onSuccess: (savedRecord: ReceivingRecord) => void;
}

type StepType = 'DADOS' | 'FOTO_NF' | 'CONFERENCIA' | 'RESULTADO';

export const NewReceivingPage: React.FC<NewReceivingPageProps> = ({
  onBack,
  onSuccess,
}) => {
  const currentUser = authService.getCurrentUser();

  // Estado do formulário
  const [formData, setFormData] = useState<ReceivingFormData>({
    invoiceNumber: '',
    invoiceDate: getTodayDateForInput(),
    supplier: '',
    material: '',
    quantity: '',
    batch: '',
    carrier: '',
    licensePlate: '',
    driver: '',
    purchaseOrder: '',
    responsible: currentUser.name,
    receivedAt: getCurrentDateTimeFormatted(),
    generalObservation: '',
    invoicePhoto: '',
    checklist: CHECKLIST_ITEMS_TEMPLATE.map((tpl) => ({
      id: tpl.id,
      title: tpl.title,
      status: 'CONFORME', // Padrão conforme para agilidade, operador altera se houver desvio
    })),
  });

  const [currentStep, setCurrentStep] = useState<StepType>('DADOS');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successSavedRecord, setSuccessSavedRecord] = useState<ReceivingRecord | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Atualiza data/hora automática a cada minuto enquanto na tela
  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      receivedAt: getCurrentDateTimeFormatted(),
      responsible: prev.responsible || currentUser.name,
    }));
  }, [currentUser.name]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setValidationError(null);
  };

  const handleChecklistItemChange = (updatedItem: ChecklistItemResult) => {
    setFormData((prev) => ({
      ...prev,
      checklist: prev.checklist.map((item) =>
        item.id === updatedItem.id ? updatedItem : item
      ),
    }));
  };

  const handleInvoicePhotoConfirmed = (photoDataUrl: string) => {
    setFormData((prev) => ({ ...prev, invoicePhoto: photoDataUrl }));
    setValidationError(null);
  };

  const handleRemoveInvoicePhoto = () => {
    setFormData((prev) => ({ ...prev, invoicePhoto: '' }));
  };

  // Validação de etapas
  const goToStep = (step: StepType) => {
    setValidationError(null);

    if (step === 'FOTO_NF' || step === 'CONFERENCIA' || step === 'RESULTADO') {
      if (!formData.invoiceNumber.trim()) {
        setValidationError('Por favor, informe o Nº da NF.');
        setCurrentStep('DADOS');
        return;
      }
      if (!formData.supplier.trim()) {
        setValidationError('Por favor, informe o Fornecedor.');
        setCurrentStep('DADOS');
        return;
      }
      if (!formData.material.trim()) {
        setValidationError('Por favor, informe o Material/Produto.');
        setCurrentStep('DADOS');
        return;
      }
    }

    if (step === 'CONFERENCIA' || step === 'RESULTADO') {
      if (!formData.invoicePhoto) {
        setValidationError('A foto da Nota Fiscal é obrigatória. Tire e confirme a foto da NF.');
        setCurrentStep('FOTO_NF');
        return;
      }
    }

    setCurrentStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cálculo de conformidade geral
  const overallStatus = receivingService.calculateOverallStatus(formData.checklist);
  const nonConformingItems = formData.checklist.filter(
    (item) => item.status === 'NAO_CONFORME'
  );

  // Finalizar e salvar recebimento
  const handleFinalize = async () => {
    setIsSubmitting(true);
    try {
      const saved = await receivingService.createReceiving(formData);
      setSuccessSavedRecord(saved);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Erro ao salvar recebimento:', err);
      alert('Falha ao salvar recebimento. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // TELA DE SUCESSO PÓS-FINALIZAÇÃO
  if (successSavedRecord) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header title="RECEBIMENTO CONCLUÍDO" />
        <div className="max-w-lg mx-auto p-4 py-8 text-center space-y-6 animate-fadeIn">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-12 h-12" />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Recebimento registrado com sucesso!
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Registro de entrada física concluído e integrado.
            </p>
          </div>

          {/* Card com Resumo do ID */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm text-left space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                ID do Registro
              </span>
              <span className="text-sm font-mono font-bold text-[#0a3d62] bg-blue-50 px-2.5 py-1 rounded-md">
                {successSavedRecord.id}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Nº Nota Fiscal:</span>
                <span className="font-semibold text-slate-800">{successSavedRecord.invoiceNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 block">Resultado:</span>
                <StatusBadge status={successSavedRecord.overallStatus} size="sm" />
              </div>
              <div>
                <span className="text-slate-400 block">Fornecedor:</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {successSavedRecord.supplier}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block">Responsável:</span>
                <span className="font-semibold text-slate-800 truncate block">
                  {successSavedRecord.responsible}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              onClick={() => onSuccess(successSavedRecord)}
              className="w-full py-4 px-4 bg-[#0a3d62] hover:bg-[#072b46] active:bg-[#041c2e] text-white font-bold rounded-xl shadow-md transition-all touch-target text-sm uppercase tracking-wider"
            >
              Ver Detalhes do Recebimento
            </button>

            <button
              type="button"
              onClick={onBack}
              className="w-full py-3.5 px-4 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-200 transition-all touch-target text-sm"
            >
              Voltar à Tela Inicial
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <Header title="NOVO RECEBIMENTO" showBack onBack={onBack} />

      <main className="max-w-xl mx-auto px-4 pt-4">
        {/* Barra de Progresso Mobile amigável */}
        <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-4">
          <div className="flex items-center justify-between text-xs font-bold text-slate-600 mb-2">
            <span className="text-[#0a3d62] uppercase tracking-wider">
              {currentStep === 'DADOS' && 'Passo 1 de 4: Dados da Nota'}
              {currentStep === 'FOTO_NF' && 'Passo 2 de 4: Foto da NF'}
              {currentStep === 'CONFERENCIA' && 'Passo 3 de 4: Conferência'}
              {currentStep === 'RESULTADO' && 'Passo 4 de 4: Finalização'}
            </span>
            <span className="text-slate-400">
              {currentStep === 'DADOS' && '25%'}
              {currentStep === 'FOTO_NF' && '50%'}
              {currentStep === 'CONFERENCIA' && '75%'}
              {currentStep === 'RESULTADO' && '100%'}
            </span>
          </div>

          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#0a3d62] h-full transition-all duration-300 rounded-full"
              style={{
                width:
                  currentStep === 'DADOS'
                    ? '25%'
                    : currentStep === 'FOTO_NF'
                    ? '50%'
                    : currentStep === 'CONFERENCIA'
                    ? '75%'
                    : '100%',
              }}
            />
          </div>

          {/* Abas de Navegação Rápida */}
          <div className="grid grid-cols-4 gap-1 mt-3 pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={() => goToStep('DADOS')}
              className={`py-1.5 px-1 rounded text-[11px] font-semibold transition-colors ${
                currentStep === 'DADOS'
                  ? 'bg-blue-50 text-[#0a3d62] font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              1. Dados
            </button>
            <button
              type="button"
              onClick={() => goToStep('FOTO_NF')}
              className={`py-1.5 px-1 rounded text-[11px] font-semibold transition-colors ${
                currentStep === 'FOTO_NF'
                  ? 'bg-blue-50 text-[#0a3d62] font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              2. Foto NF
            </button>
            <button
              type="button"
              onClick={() => goToStep('CONFERENCIA')}
              className={`py-1.5 px-1 rounded text-[11px] font-semibold transition-colors ${
                currentStep === 'CONFERENCIA'
                  ? 'bg-blue-50 text-[#0a3d62] font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              3. Conferência
            </button>
            <button
              type="button"
              onClick={() => goToStep('RESULTADO')}
              className={`py-1.5 px-1 rounded text-[11px] font-semibold transition-colors ${
                currentStep === 'RESULTADO'
                  ? 'bg-blue-50 text-[#0a3d62] font-bold'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              4. Finalizar
            </button>
          </div>
        </div>

        {/* Alerta de Validação */}
        {validationError && (
          <div className="mb-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm p-3 rounded-xl flex items-center gap-2 animate-shake">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
            <span>{validationError}</span>
          </div>
        )}

        {/* ==================================================== */}
        {/* ETAPA 1: DADOS DA NOTA E MATERIAL                    */}
        {/* ==================================================== */}
        {currentStep === 'DADOS' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Bloco 1: Informações Principais da NF */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                <FileText className="w-5 h-5 text-[#0a3d62]" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Dados da Nota Fiscal & Material
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nº da NF <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber}
                    onChange={handleInputChange}
                    placeholder="Ex: 128450"
                    inputMode="numeric"
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none touch-target"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data da NF
                  </label>
                  <input
                    type="date"
                    name="invoiceDate"
                    value={formData.invoiceDate}
                    onChange={handleInputChange}
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none touch-target"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Fornecedor <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="supplier"
                  value={formData.supplier}
                  onChange={handleInputChange}
                  placeholder="Nome do fornecedor / emitente"
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none touch-target"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Material / Produto <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder="Ex: Bobina Kraft, Fita Adesiva, Tubetes..."
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none touch-target"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Quantidade
                  </label>
                  <input
                    type="text"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    placeholder="Ex: 500 kg / 10 cx"
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none touch-target"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lote
                  </label>
                  <input
                    type="text"
                    name="batch"
                    value={formData.batch}
                    onChange={handleInputChange}
                    placeholder="Ex: L-89201"
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none touch-target"
                  />
                </div>
              </div>
            </div>

            {/* Bloco 2: Transporte e Logística */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                <Truck className="w-5 h-5 text-[#0a3d62]" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Transporte & Identificação
                </h2>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Transportadora
                </label>
                <input
                  type="text"
                  name="carrier"
                  value={formData.carrier}
                  onChange={handleInputChange}
                  placeholder="Nome da transportadora"
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none touch-target"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Placa do Veículo
                  </label>
                  <input
                    type="text"
                    name="licensePlate"
                    value={formData.licensePlate}
                    onChange={handleInputChange}
                    placeholder="Ex: ABC-1234"
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 uppercase focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none touch-target"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Motorista
                  </label>
                  <input
                    type="text"
                    name="driver"
                    value={formData.driver}
                    onChange={handleInputChange}
                    placeholder="Nome do condutor"
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none touch-target"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Pedido / Ordem de Compra (OC)
                </label>
                <input
                  type="text"
                  name="purchaseOrder"
                  value={formData.purchaseOrder}
                  onChange={handleInputChange}
                  placeholder="Ex: OC-50123"
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none touch-target"
                />
              </div>
            </div>

            {/* Bloco 3: Responsável, Data/Hora e Observações */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3.5">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                <User className="w-5 h-5 text-[#0a3d62]" />
                <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                  Controle Interno
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Responsável (Automático M365)
                  </label>
                  <input
                    type="text"
                    name="responsible"
                    value={formData.responsible}
                    onChange={handleInputChange}
                    className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-800 font-medium focus:outline-none touch-target"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Data e Hora do Recebimento (Automático)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="receivedAt"
                      value={formData.receivedAt}
                      readOnly
                      className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-200 bg-slate-100 text-slate-800 font-medium focus:outline-none touch-target pr-9"
                    />
                    <Clock className="w-4 h-4 text-slate-400 absolute right-3 top-3.5 pointer-events-none" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Observação Geral (Opcional)
                </label>
                <textarea
                  name="generalObservation"
                  value={formData.generalObservation}
                  onChange={handleInputChange}
                  rows={2}
                  placeholder="Informações adicionais da entrega, doca, etc."
                  className="w-full text-sm px-3 py-2.5 rounded-lg border border-slate-300 bg-white text-slate-900 focus:ring-2 focus:ring-[#0a3d62] focus:border-[#0a3d62] outline-none"
                />
              </div>
            </div>

            {/* Botão Avançar para Foto da NF */}
            <button
              type="button"
              onClick={() => goToStep('FOTO_NF')}
              className="w-full py-4 px-4 bg-[#0a3d62] hover:bg-[#072b46] active:bg-[#041c2e] text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 touch-target text-sm uppercase tracking-wide"
            >
              <span>Avançar para Foto da NF</span>
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* ==================================================== */}
        {/* ETAPA 2: FOTO DA NOTA FISCAL                         */}
        {/* ==================================================== */}
        {currentStep === 'FOTO_NF' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-slate-100 pb-2.5">
                <Camera className="w-5 h-5 text-[#0a3d62]" />
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    FOTO DA NOTA FISCAL
                  </h2>
                  <p className="text-xs text-slate-500">
                    Tire uma foto legível da DANFE física com a câmera do celular
                  </p>
                </div>
              </div>

              {/* Informações da NF vinculada */}
              <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs flex justify-between items-center">
                <div>
                  <span className="text-slate-500 block">Vinculando à NF:</span>
                  <span className="font-bold text-slate-800">{formData.invoiceNumber || 'Não informada'}</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">Fornecedor:</span>
                  <span className="font-bold text-slate-800">{formData.supplier || 'Não informado'}</span>
                </div>
              </div>

              {/* Componente Câmera dedicado para NF */}
              <CameraCapture
                label="Nota Fiscal (DANFE)"
                buttonText="Tirar Foto da Nota Fiscal"
                currentPhoto={formData.invoicePhoto}
                onPhotoConfirmed={handleInvoicePhotoConfirmed}
                onRemovePhoto={handleRemoveInvoicePhoto}
              />
            </div>

            {/* Ações da Etapa 2 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => goToStep('DADOS')}
                className="py-3.5 px-4 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1.5 touch-target text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Voltar</span>
              </button>

              <button
                type="button"
                onClick={() => goToStep('CONFERENCIA')}
                className="py-3.5 px-4 bg-[#0a3d62] hover:bg-[#072b46] active:bg-[#041c2e] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5 touch-target text-sm uppercase tracking-wide"
              >
                <span>Conferência</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* ETAPA 3: CONFERÊNCIA DO RECEBIMENTO                  */}
        {/* ==================================================== */}
        {currentStep === 'CONFERENCIA' && (
          <div className="space-y-4 animate-fadeIn">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <CheckSquare className="w-5 h-5 text-[#0a3d62]" />
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">
                    CONFERÊNCIA DO RECEBIMENTO
                  </h2>
                </div>

                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-full font-semibold">
                  9 Itens
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Selecione a situação de cada critério. Se houver não conformidade, informe o que foi identificado e tire uma foto da ocorrência.
              </p>
            </div>

            {/* Lista dos 9 Itens */}
            <div className="space-y-3">
              {formData.checklist.map((item, index) => (
                <ChecklistItemRow
                  key={item.id}
                  index={index}
                  item={item}
                  onChange={handleChecklistItemChange}
                />
              ))}
            </div>

            {/* Resumo dinâmico de conformidade no rodapé da etapa */}
            <div
              className={`p-4 rounded-xl border flex items-center justify-between ${
                overallStatus === 'CONFORME'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}
            >
              <div className="flex items-center space-x-2">
                {overallStatus === 'CONFORME' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                )}
                <div className="text-xs font-semibold">
                  <span>Status atual da conferência: </span>
                  <strong>{overallStatus === 'CONFORME' ? 'CONFORME' : `${nonConformingItems.length} NÃO CONFORME(S)`}</strong>
                </div>
              </div>
            </div>

            {/* Ações da Etapa 3 */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => goToStep('FOTO_NF')}
                className="py-3.5 px-4 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-700 font-bold rounded-xl border border-slate-300 transition-all flex items-center justify-center gap-1.5 touch-target text-sm"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Foto NF</span>
              </button>

              <button
                type="button"
                onClick={() => goToStep('RESULTADO')}
                className="py-3.5 px-4 bg-[#0a3d62] hover:bg-[#072b46] active:bg-[#041c2e] text-white font-bold rounded-xl shadow transition-all flex items-center justify-center gap-1.5 touch-target text-sm uppercase tracking-wide"
              >
                <span>Ver Resultado</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ==================================================== */}
        {/* ETAPA 4: RESULTADO DO RECEBIMENTO & FINALIZAR        */}
        {/* ==================================================== */}
        {currentStep === 'RESULTADO' && (
          <div className="space-y-4 animate-fadeIn">
            {/* Banner de Resultado */}
            <div
              className={`p-6 rounded-2xl border-2 text-center shadow-md ${
                overallStatus === 'CONFORME'
                  ? 'bg-emerald-50/80 border-emerald-500 text-emerald-900'
                  : 'bg-rose-50/80 border-rose-500 text-rose-900'
              }`}
            >
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full mb-3 shadow-inner bg-white">
                {overallStatus === 'CONFORME' ? (
                  <CheckCircle2 className="w-9 h-9 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-9 h-9 text-rose-600" />
                )}
              </div>

              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                RESULTADO DO RECEBIMENTO
              </h2>

              <div className="text-2xl font-black tracking-tight mb-2">
                {overallStatus === 'CONFORME' ? (
                  <span className="text-emerald-700 flex items-center justify-center gap-2">
                    <span>🟢</span> CONFORME
                  </span>
                ) : (
                  <span className="text-rose-700 flex items-center justify-center gap-2">
                    <span>🔴</span> NÃO CONFORME
                  </span>
                )}
              </div>

              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                {overallStatus === 'CONFORME'
                  ? 'Todos os 9 itens de conferência foram aprovados sem apontamentos.'
                  : `Foi apontada não conformidade em ${nonConformingItems.length} item(ns). Os apontamentos e fotos serão anexados ao histórico.`}
              </p>
            </div>

            {/* Se houver não conformidade, lista resumida dos apontamentos */}
            {overallStatus === 'NAO_CONFORME' && (
              <div className="bg-white p-4 rounded-2xl border border-rose-200 shadow-sm space-y-3">
                <span className="text-xs font-bold text-rose-800 uppercase tracking-wide flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  Apontamentos de Não Conformidade:
                </span>

                <div className="space-y-2">
                  {nonConformingItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 bg-rose-50/60 rounded-lg border border-rose-200 text-xs space-y-1.5"
                    >
                      <div className="font-bold text-rose-900">{item.title}</div>
                      <div className="text-slate-700">
                        <strong>Identificado: </strong>
                        {item.observation || 'Nenhuma descrição detalhada informada.'}
                      </div>
                      {item.photoUrl && (
                        <div className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Foto da ocorrência anexada
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Resumo Simples dos Dados do Recebimento */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 text-xs">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-xs">
                  Resumo do Recebimento
                </span>
                <button
                  type="button"
                  onClick={() => goToStep('DADOS')}
                  className="text-blue-700 hover:underline font-semibold"
                >
                  Editar Dados
                </button>
              </div>

              <div className="grid grid-cols-2 gap-y-2 gap-x-3 text-slate-600">
                <div>
                  <span className="text-slate-400 block">Nº da NF:</span>
                  <span className="font-semibold text-slate-900">{formData.invoiceNumber}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Data NF:</span>
                  <span className="font-semibold text-slate-900">{formData.invoiceDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Fornecedor:</span>
                  <span className="font-semibold text-slate-900">{formData.supplier}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Material:</span>
                  <span className="font-semibold text-slate-900">{formData.material}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Quantidade:</span>
                  <span className="font-semibold text-slate-900">{formData.quantity || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Lote:</span>
                  <span className="font-semibold text-slate-900">{formData.batch || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Transportadora:</span>
                  <span className="font-semibold text-slate-900">{formData.carrier || '-'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Placa:</span>
                  <span className="font-semibold text-slate-900">{formData.licensePlate || '-'}</span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-100">
                  <span className="text-slate-400 block">Responsável:</span>
                  <span className="font-semibold text-slate-900">{formData.responsible}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-slate-400 block">Data e Hora:</span>
                  <span className="font-semibold text-slate-900">{formData.receivedAt}</span>
                </div>
              </div>

              {formData.generalObservation && (
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-slate-400 block">Observação:</span>
                  <span className="text-slate-800 italic">{formData.generalObservation}</span>
                </div>
              )}
            </div>

            {/* BOTÃO FINALIZAR RECEBIMENTO (AÇÃO PRINCIPAL) */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleFinalize}
                disabled={isSubmitting}
                className="w-full py-4 px-5 bg-[#0a3d62] hover:bg-[#072b46] active:bg-[#041c2e] text-white font-extrabold text-base rounded-2xl shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2.5 touch-target active:scale-[0.99] disabled:opacity-70 uppercase tracking-wide border border-blue-900/30"
              >
                {isSubmitting ? (
                  <span>SALVANDO DADOS...</span>
                ) : (
                  <>
                    <span className="text-lg">✅</span>
                    <span>FINALIZAR RECEBIMENTO</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => goToStep('CONFERENCIA')}
                disabled={isSubmitting}
                className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-700 font-semibold rounded-xl border border-slate-300 text-xs transition-colors"
              >
                Revisar Itens da Conferência
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import receivingRoutes from './routes/receivingRoutes.js';
import { isEntraConfigured, config } from './config/entraConfig.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Configuração de CORS e limite ampliado para fotos em Base64
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Rotas de API
app.use('/api', receivingRoutes);

// Status do serviço e verificação da integração Microsoft 365
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    service: 'Recebimento de Materiais API',
    timestamp: new Date().toISOString(),
    microsoftEntraConfigured: isEntraConfigured(),
    sharepointSiteConfigured: Boolean(config.sharepoint.siteId),
  });
});

app.get('/api/graph/status', (req, res) => {
  if (isEntraConfigured()) {
    res.json({
      connected: true,
      message: 'Microsoft Entra ID configurado.',
      tenantId: config.azure.tenantId ? `${config.azure.tenantId.substring(0, 6)}...` : '',
    });
  } else {
    res.json({
      connected: false,
      message: 'Credenciais do Entra ID pendentes no arquivo .env (executando em modo local / simulação).',
    });
  }
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 SERVIDOR RECEBIMENTO DE MATERIAIS RODANDO NA PORTA ${PORT}`);
  console.log(`   Status Microsoft Entra ID: ${isEntraConfigured() ? 'CONFIGURADO ✅' : 'PENDENTE NO .ENV ⚠️'}`);
  console.log(`====================================================`);
});

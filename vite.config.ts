import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';

function devApiPlugin(): Plugin {
  return {
    name: 'mutqin-dev-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) {
          return next();
        }

        // Handle payment processing simulation
        if (req.url === '/api/payment/process' && req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', () => {
            try {
              const data = JSON.parse(body || '{}');
              const baseAmount = Number(data.amountSAR) || 100;
              const subtotal = Math.round((baseAmount / 1.15) * 100) / 100;
              const vatAmount = Math.round((baseAmount - subtotal) * 100) / 100;
              const invoiceNumber = `MUTQ-${Date.now().toString().slice(-8)}`;
              const timestampIso = new Date().toISOString();
              const qrPayload = Buffer.from(
                JSON.stringify({
                  seller: 'Mutqin Marketplace for Services LLC',
                  vatNumber: '310984920100003',
                  timestamp: timestampIso,
                  total: baseAmount.toFixed(2),
                  vat: vatAmount.toFixed(2),
                  invoice: invoiceNumber,
                })
              ).toString('base64');

              res.setHeader('Content-Type', 'application/json');
              res.end(
                JSON.stringify({
                  success: true,
                  transactionId: `TXN-SA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
                  gateway: data.method || 'mada',
                  amountSAR: baseAmount,
                  subtotalSAR: subtotal,
                  vatAmountSAR: vatAmount,
                  invoiceNumber,
                  zatcaQrPayload: qrPayload,
                  merchantCR: '1010892341',
                  status: 'APPROVED',
                  timestamp: timestampIso,
                  messageEn: `Payment of ${baseAmount} SAR approved via ${(data.method || 'mada').toUpperCase()}`,
                  messageAr: `تمت عملية الدفع بنجاح بمبلغ ${baseAmount} ر.س`,
                })
              );
            } catch (err: unknown) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              const message = err instanceof Error ? err.message : 'Payment simulation error';
              res.end(JSON.stringify({ error: message }));
            }
          });
          return;
        }

        // Handle PubChem safety lookups
        if (req.url?.startsWith('/api/science/pubchem/')) {
          const rawCompound = req.url.replace('/api/science/pubchem/', '').split('?')[0];
          const compoundQuery = decodeURIComponent(rawCompound).trim();
          try {
            const fetchUrl = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(compoundQuery)}/property/MolecularFormula,MolecularWeight,IUPACName,Title,InChIKey/JSON`;
            const pcRes = await fetch(fetchUrl);
            if (pcRes.ok) {
              const pcData = (await pcRes.json()) as {
                PropertyTable?: {
                  Properties?: Array<{
                    CID?: number;
                    Title?: string;
                    MolecularFormula?: string;
                    MolecularWeight?: string;
                    IUPACName?: string;
                    InChIKey?: string;
                  }>;
                };
              };
              if (pcData?.PropertyTable?.Properties?.[0]) {
                const prop = pcData.PropertyTable.Properties[0];
                res.setHeader('Content-Type', 'application/json');
                res.end(
                  JSON.stringify({
                    found: true,
                    cid: prop.CID,
                    title: prop.Title || compoundQuery,
                    formula: prop.MolecularFormula,
                    molecularWeight: prop.MolecularWeight,
                    iupacName: prop.IUPACName,
                    inchikey: prop.InChIKey,
                    pubchemUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${prop.CID}`,
                    provenance: 'Authoritative PubChem PUG REST API (NLM / NIH)',
                  })
                );
                return;
              }
            }
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify({ found: false, message: 'Compound not found in PubChem registry' }));
            return;
          } catch (e: unknown) {
            res.setHeader('Content-Type', 'application/json');
            const errorMsg = e instanceof Error ? e.message : 'PubChem query failed';
            res.end(JSON.stringify({ found: false, error: errorMsg }));
            return;
          }
        }

        next();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), devApiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize GoogleGenAI server-side client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Helper for rate-limited scientific fetch
async function fetchWithRetry(url: string, maxRetries = 2, delayMs = 500): Promise<any> {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, delayMs * Math.pow(2, i)));
        continue;
      }
      return null;
    } catch (e) {
      if (i === maxRetries) throw e;
      await new Promise((r) => setTimeout(r, delayMs));
    }
  }
  return null;
}

// -------------------------------------------------------------
// 1. Science Lab: PubChem Chemistry & Environmental Safety API
// -------------------------------------------------------------
app.get('/api/science/pubchem/:compound', async (req: Request, res: Response) => {
  const compoundQuery = req.params.compound.trim();
  try {
    const url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(compoundQuery)}/property/MolecularFormula,MolecularWeight,IUPACName,Title,InChIKey/JSON`;
    const data = await fetchWithRetry(url);

    if (data?.PropertyTable?.Properties?.[0]) {
      const prop = data.PropertyTable.Properties[0];
      const cid = prop.CID;
      res.json({
        found: true,
        cid,
        title: prop.Title || compoundQuery,
        formula: prop.MolecularFormula,
        molecularWeight: prop.MolecularWeight,
        iupacName: prop.IUPACName,
        inchikey: prop.InChIKey,
        pubchemUrl: `https://pubchem.ncbi.nlm.nih.gov/compound/${cid}`,
        provenance: 'Authoritative PubChem PUG REST API (NLM / NIH)'
      });
    } else {
      res.json({ found: false, message: 'Compound not found in PubChem registry' });
    }
  } catch (err: any) {
    res.status(500).json({ error: 'Failed to query PubChem database', details: err?.message });
  }
});

// -------------------------------------------------------------
// 2. Gemini AI: Multi-turn Chatbot (gemini-3.5-flash / gemini-3.8-flash)
// -------------------------------------------------------------
app.post('/api/gemini/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    const contents: any[] = [];

    if (Array.isArray(history)) {
      for (const item of history) {
        contents.push({
          role: item.role === 'user' ? 'user' : 'model',
          parts: [{ text: item.text }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const systemInstruction = `You are "مُتقَن الذكي" (Mutqin AI Assistant), the official Saudi home maintenance and residential service advisor for the Mutqin marketplace.
You assist homeowners and property managers across Saudi Arabia (Riyadh, Jeddah, Dammam, Khobar, Mecca, Medina).
Key guidelines:
1. Speak in friendly, polite Saudi-accented Arabic or professional English, matching the user's language.
2. Provide technical advice on air conditioning (split units, central HVAC in Saudi heat), plumbing, SASO-standard electrical (230V 60Hz), deep sanitization, and eco-friendly cleaning agents.
3. Recommend booking verified Mutqin technicians when hands-on work or safety is required.
4. Emphasize home safety, chemical precautions for kids/pets, and proper AC filter cleaning cycles before peak summer temperatures.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({ reply: response.text || 'عذراً، يرجى المحاولة مرة أخرى.' });
  } catch (err: any) {
    console.error('Gemini chat error:', err);
    res.status(500).json({ error: 'AI service unavailable', details: err?.message });
  }
});

// -------------------------------------------------------------
// 3. Gemini AI: Search Grounded Intelligence (gemini-3.5-flash)
// -------------------------------------------------------------
app.post('/api/gemini/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    const systemInstruction = `You are the Saudi Service Marketplace Market Researcher. Provide factual, grounded insights on Saudi residential standards, current municipal cleaning guidelines, SASO standards, or seasonal market rates in SAR. Always cite verified details.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: query,
      config: {
        systemInstruction,
        tools: [{ googleSearch: {} }],
      },
    });

    const searchChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const webSearchQueries = response.candidates?.[0]?.groundingMetadata?.webSearchQueries || [];

    res.json({
      text: response.text,
      groundingChunks: searchChunks,
      webSearchQueries,
    });
  } catch (err: any) {
    console.error('Gemini search error:', err);
    res.status(500).json({ error: 'Grounding search failed', details: err?.message });
  }
});

// -------------------------------------------------------------
// 4. Gemini AI: High-Thinking Forensic Diagnosis (gemini-3.1-pro-preview)
// -------------------------------------------------------------
app.post('/api/gemini/diagnose', async (req: Request, res: Response) => {
  try {
    const { issueDescription, serviceCategory, imageBase64 } = req.body;
    const promptText = `Analyze this complex home maintenance defect:
Category: ${serviceCategory}
Customer Complaint: "${issueDescription}"

Provide a thorough, forensic multi-tier engineering breakdown:
1. Root cause diagnosis (e.g. compressor capacitor failure vs refrigerant leak, moisture intrusion behind bathroom tiles).
2. Safety and environmental hazards (electrical shock hazard, mold proliferation, toxic refrigerant).
3. Estimated repair scope, required SASO-certified replacement parts, and recommended technician qualification.
4. Fair market cost estimate breakdown in Saudi Riyals (SAR).`;

    let parts: any[] = [{ text: promptText }];
    if (imageBase64) {
      parts.unshift({
        inlineData: {
          mimeType: 'image/jpeg',
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }

    // Try high thinking model, fallback to 3.8-flash if not accessible
    let response;
    try {
      response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: { parts },
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH },
        },
      });
    } catch (proErr) {
      console.warn('Fallback to 3.8-flash for diagnose:', proErr);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
      });
    }

    res.json({ analysis: response.text });
  } catch (err: any) {
    console.error('Gemini diagnose error:', err);
    res.status(500).json({ error: 'Diagnosis failed', details: err?.message });
  }
});

// -------------------------------------------------------------
// 5. Gemini AI: Low-Latency Quick Estimate (gemini-3.1-flash-lite)
// -------------------------------------------------------------
app.post('/api/gemini/fast-estimate', async (req: Request, res: Response) => {
  try {
    const { serviceType, quantity, city } = req.body;
    const prompt = `Give a concise 2-sentence instant price range estimation in SAR for: ${serviceType}, quantity: ${quantity}, in city: ${city || 'Riyadh'}. Include standard warranty period.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingLevel: ThinkingLevel.MINIMAL },
      },
    });

    res.json({ estimate: response.text });
  } catch (err: any) {
    console.error('Fast estimate error:', err);
    res.status(500).json({ error: 'Fast estimate failed', details: err?.message });
  }
});

// -------------------------------------------------------------
// 6. Saudi Payment Gateway Simulation & ZATCA Tax Invoicing
// -------------------------------------------------------------
app.post('/api/payment/process', async (req: Request, res: Response) => {
  try {
    const { method, amountSAR, customerName, phone, serviceTitle } = req.body;

    const baseAmount = Number(amountSAR) || 100;
    const vatRate = 0.15; // 15% Saudi VAT standard
    const subtotal = Math.round((baseAmount / (1 + vatRate)) * 100) / 100;
    const vatAmount = Math.round((baseAmount - subtotal) * 100) / 100;

    const invoiceNumber = `MUTQ-${Date.now().toString().slice(-8)}`;
    const timestampIso = new Date().toISOString();
    const crNumber = '1010892341'; // Sample Saudi Commercial Registration

    // Generate ZATCA Phase 2 simulated QR Payload
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

    res.json({
      success: true,
      transactionId: `TXN-SA-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      gateway: method,
      amountSAR: baseAmount,
      subtotalSAR: subtotal,
      vatAmountSAR: vatAmount,
      invoiceNumber,
      zatcaQrPayload: qrPayload,
      merchantCR: crNumber,
      status: 'APPROVED',
      timestamp: timestampIso,
      messageEn: `Payment of ${baseAmount} SAR approved via ${method.toUpperCase()}`,
      messageAr: `تمت عملية الدفع بنجاح بمبلغ ${baseAmount} ر.س عبر ${method === 'mada' ? 'مدى' : method === 'apple_pay' ? 'أبل باي' : method === 'stc_pay' ? 'STC Pay' : 'البطاقة الائتمانية'}`,
    });
  } catch (err: any) {
    res.status(500).json({ error: 'Payment processing error', details: err?.message });
  }
});

// -------------------------------------------------------------
// Vite middleware for development or static build in production
// -------------------------------------------------------------
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Mutqin Saudi marketplace server running on http://0.0.0.0:${port}`);
  });
}

setupServer();

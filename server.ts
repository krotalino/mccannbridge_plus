import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

// Lazy Google GenAI Client
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  return new GoogleGenAI({
    apiKey: apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Chat endpoint (with Server-Sent Events streaming support)
app.post("/api/ai/chat", async (req, res) => {
  const {
    messages = [],
    agent = {},
    context = {},
    attachments = [],
    knowledgeChunks = [],
    stream = true,
  } = req.body;

  try {
    const ai = getGeminiClient();
    
    // Construct System Instruction based on selected agent and context
    let systemInstruction = agent.systemPrompt || 
      "Tu es l'Assistant IA officiel de l'agence McCann Bridge pour McCann et Orange Cameroun. Sois précis, créatif, percutant et professionnel.";

    // Append Context & RAG Grounding if available
    let contextPrompt = "";
    if (context.client || context.brand || context.project) {
      contextPrompt += "\n\n--- CONTEXTE MCCANN BRIDGE SELECTIONNÉ PAR L'UTILISATEUR ---\n";
      if (context.client) contextPrompt += `- Client: ${context.client}\n`;
      if (context.brand) contextPrompt += `- Marque: ${context.brand}\n`;
      if (context.project) contextPrompt += `- Projet / Campagne: ${context.project}\n`;
    }

    if (context.documents && context.documents.length > 0) {
      contextPrompt += `\n--- DOCUMENTS ATTACHÉS COMME CONTEXTE DIRECT ---\n`;
      context.documents.forEach((doc: any, i: number) => {
        contextPrompt += `Document #${i + 1}: ${doc.name || doc.title} (${doc.category || 'Général'}, version ${doc.version || 'V1'})\n`;
        if (doc.content) {
          contextPrompt += `Contenu extrait:\n"""\n${doc.content.slice(0, 3000)}\n"""\n\n`;
        }
      });
    }

    if (knowledgeChunks && knowledgeChunks.length > 0) {
      contextPrompt += `\n--- EXTRAITS PERTINENTS DE LA KNOWLEDGE BASE (RAG) ---\n`;
      knowledgeChunks.forEach((chunk: any, idx: number) => {
        contextPrompt += `[Source ${idx + 1}] Document: "${chunk.documentTitle || chunk.title}" (Page/Slide: ${chunk.page || 1}, Catégorie: ${chunk.category || 'Interne'})\nExtrait: """${chunk.content}"""\n\n`;
      });
      contextPrompt += `\nDIRECTIVE RAG: Quand tu utilises des informations provenant de ces extraits documentaires, cite obligatoirement la source au format [Source X: NomDuDocument] dans ta réponse pour la traçabilité.\n`;
    }

    systemInstruction += contextPrompt;

    // Convert messages for Gemini
    const contents: any[] = [];

    // Prior message turns
    const history = messages.slice(0, -1);
    const lastUserMessage = messages[messages.length - 1];

    for (const msg of history) {
      contents.push({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content || "" }],
      });
    }

    // Process last message with any attachments
    const lastParts: any[] = [];

    // Add attachments inline if present (image/pdf base64 or text)
    if (attachments && attachments.length > 0) {
      for (const att of attachments) {
        if (att.data && att.mimeType && att.mimeType.startsWith("image/")) {
          const cleanBase64 = att.data.replace(/^data:image\/[a-z]+;base64,/, "");
          lastParts.push({
            inlineData: {
              mimeType: att.mimeType,
              data: cleanBase64,
            },
          });
        } else if (att.text) {
          lastParts.push({
            text: `[Fichier joint: ${att.name || 'document'}]\nContenu:\n${att.text.slice(0, 4000)}\n`,
          });
        }
      }
    }

    lastParts.push({ text: lastUserMessage?.content || "Bonjour" });

    contents.push({
      role: "user",
      parts: lastParts,
    });

    // Identify sources to return to client
    const matchedSources = (knowledgeChunks || []).map((c: any, i: number) => ({
      id: c.id || `src-${i}`,
      documentId: c.documentId || `doc-${i}`,
      title: c.documentTitle || c.title || "Document McCann Bridge",
      page: c.page || 1,
      category: c.category || "Documentation",
      excerpt: c.content?.slice(0, 200) || "",
    }));

    if (context.documents && context.documents.length > 0) {
      context.documents.forEach((d: any, idx: number) => {
        if (!matchedSources.some((s: any) => s.title === (d.name || d.title))) {
          matchedSources.push({
            id: `ctx-${idx}`,
            documentId: d.id || `doc-ctx-${idx}`,
            title: d.name || d.title || "Document Contextuel",
            page: 1,
            category: d.category || "Contexte",
            excerpt: d.description || d.content?.slice(0, 150) || "Document joint en contexte direct.",
          });
        }
      });
    }

    if (!ai) {
      // Fallback simulated streaming response when running without live external API Key
      if (stream) {
        res.setHeader("Content-Type", "text/event-stream");
        res.setHeader("Cache-Control", "no-cache");
        res.setHeader("Connection", "keep-alive");

        const simulatedResponse = generateSimulatedResponse(
          lastUserMessage?.content || "",
          agent,
          context,
          matchedSources
        );

        const words = simulatedResponse.split(" ");
        let accumulated = "";

        for (let i = 0; i < words.length; i++) {
          const chunk = (i === 0 ? "" : " ") + words[i];
          accumulated += chunk;
          res.write(`data: ${JSON.stringify({ text: chunk })}\n\n`);
          await new Promise((r) => setTimeout(r, 20));
        }

        res.write(`data: ${JSON.stringify({ done: true, sources: matchedSources })}\n\n`);
        return res.end();
      } else {
        const responseText = generateSimulatedResponse(
          lastUserMessage?.content || "",
          agent,
          context,
          matchedSources
        );
        return res.json({ text: responseText, sources: matchedSources });
      }
    }

    // Call Gemini API server-side
    const temperature = typeof agent.temperature === "number" ? agent.temperature : 0.7;

    if (stream) {
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      const responseStream = await ai.models.generateContentStream({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction,
          temperature,
        },
      });

      for await (const chunk of responseStream) {
        if (chunk.text) {
          res.write(`data: ${JSON.stringify({ text: chunk.text })}\n\n`);
        }
      }

      res.write(`data: ${JSON.stringify({ done: true, sources: matchedSources })}\n\n`);
      return res.end();
    } else {
      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents,
        config: {
          systemInstruction,
          temperature,
        },
      });

      return res.json({
        text: response.text || "",
        sources: matchedSources,
      });
    }
  } catch (error: any) {
    console.error("AI Generation Error:", error);
    if (stream && res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: error.message || "Erreur de génération IA" })}\n\n`);
      return res.end();
    }
    res.status(500).json({ error: error.message || "Une erreur est survenue lors de l'appel IA." });
  }
});

// Auto-generate concise conversation title
app.post("/api/ai/generate-title", async (req, res) => {
  const { prompt = "", answer = "" } = req.body;
  try {
    const ai = getGeminiClient();
    if (!ai) {
      const clean = prompt.slice(0, 32).trim();
      return res.json({ title: clean ? clean.charAt(0).toUpperCase() + clean.slice(1) : "Nouvelle conversation" });
    }

    const titleResponse = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: `Génère un titre très court (3 à 5 mots maximum), percutant et sans guillemets en français pour résumer cette demande : "${prompt}"`,
      config: {
        temperature: 0.3,
      },
    });

    const title = titleResponse.text?.replace(/["\n\r]/g, "").trim() || "Nouvelle conversation";
    res.json({ title });
  } catch (e) {
    const fallback = prompt.slice(0, 32).trim() || "Nouvelle conversation";
    res.json({ title: fallback });
  }
});

// Global Semantic Search Endpoint
app.post("/api/search/semantic", async (req, res) => {
  const { query, documents = [] } = req.body;
  if (!query) return res.json({ results: [] });

  const qLower = query.toLowerCase();
  const scored = documents.map((doc: any) => {
    let score = 0;
    const titleMatch = (doc.name || doc.title || "").toLowerCase().includes(qLower);
    const categoryMatch = (doc.category || "").toLowerCase().includes(qLower);
    const tagMatch = (doc.tags || []).some((t: string) => t.toLowerCase().includes(qLower));
    const projectMatch = (doc.project || "").toLowerCase().includes(qLower);
    const brandMatch = (doc.brand || "").toLowerCase().includes(qLower);
    const clientMatch = (doc.client || "").toLowerCase().includes(qLower);
    const contentMatch = (doc.content || "").toLowerCase().includes(qLower);

    if (titleMatch) score += 40;
    if (tagMatch) score += 30;
    if (projectMatch || brandMatch || clientMatch) score += 25;
    if (categoryMatch) score += 20;
    if (contentMatch) score += 15;

    // Fuzzy keywords match
    const words = qLower.split(/\s+/).filter((w: string) => w.length > 2);
    words.forEach((w: string) => {
      if ((doc.name || "").toLowerCase().includes(w)) score += 10;
      if ((doc.content || "").toLowerCase().includes(w)) score += 5;
      if ((doc.description || "").toLowerCase().includes(w)) score += 5;
    });

    return { ...doc, score };
  });

  const results = scored.filter((d: any) => d.score > 0).sort((a: any, b: any) => b.score - a.score);
  res.json({ results });
});

// Helper for simulated high-quality response if API key is not yet set
function generateSimulatedResponse(
  userPrompt: string,
  agent: any,
  context: any,
  sources: any[]
): string {
  const agentName = agent.name || "Assistant IA McCann";
  const brand = context.brand || "Orange";
  const project = context.project || "Campagne Globale";

  let intro = `### Recommandation [${agentName}] pour **${brand}** (${project})\n\n`;
  
  if (sources.length > 0) {
    intro += `> ℹ️ *Analyse réalisée en s'appuyant sur ${sources.length} document(s) de la base de connaissances McCann Bridge.* [Source 1: ${sources[0].title}]\n\n`;
  }

  intro += `Voici une proposition stratégique et créative adaptée à votre demande : **"${userPrompt}"**\n\n`;

  intro += `#### 1. Axe & Angle d'Attaque\n`;
  intro += `- **Positionnement :** Accent sur l'impact culturel, l'accessibilité et la fidélité de marque au Cameroun.\n`;
  intro += `- **Ton de communication :** Énergique, bienveillant, aspirationnel et orienté conversion.\n\n`;

  intro += `#### 2. Propositions d'Exécution\n`;
  intro += `1. **Accroche Principale :** *"Plus proche de vos ambitions, chaque jour avec ${brand}."*\n`;
  intro += `2. **Déclinaison Social Media :** Série de capsules vidéo interactives (Reels / TikTok) mettant en avant les bénéfices utilisateurs et des témoignages authentiques.\n`;
  intro += `3. **Activation Terrain & Influence :** Collaboration avec des créateurs de contenu locaux axée sur des démonstrations d'usage quotidiennes.\n\n`;

  intro += `#### 3. Prochaines Étapes Recommandées\n`;
  intro += `- Valider le brief créatif final et aligner les équipes Community Management.\n`;
  intro += `- Décliner les formats visuels dans le respect des Brand Guidelines [Source 1].\n`;
  intro += `- Programmer la validation client dans le module dédié de McCann Bridge.`;

  return intro;
}

// Start Server and Mount Vite
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`McCann Bridge Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

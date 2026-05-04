
```javascript
import Anthropic from "@anthropic-ai/sdk";
import * as readline from "readline";

const client = new Anthropic();

interface NewsItem {
  title: string;
  source: string;
  summary: string;
  relevance: number;
}

interface ConversationMessage {
  role: "user" | "assistant";
  content: string;
}

// Initialize readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function searchNews(topic: string): Promise<NewsItem[]> {
  // Simulated news data - in a real app, this would call an actual news API
  const mockNewsDatabase: { [key: string]: NewsItem[] } = {
    tecnologia: [
      {
        title: "Nuevas GPUs revolucionan el procesamiento de IA",
        source: "TechNews Daily",
        summary:
          "Los últimos avances en arquitectura de GPU prometen multiplicar por 10 la velocidad de procesamiento en aplicaciones de inteligencia artificial.",
        relevance: 0.95,
      },
      {
        title: "Python sigue siendo el lenguaje más popular para IA",
        source: "Dev Community",
        summary:
          "Según la encuesta anual 2024, Python mantiene su posición como lenguaje preferido por desarrolladores de inteligencia artificial.",
        relevance: 0.88,
      },
      {
        title: "Quantum Computing alcanza nuevos hitos",
        source: "Science Daily",
        summary:
          "Investigadores logran mantener qubits estables por más tiempo, acercándose a computadoras cuánticas prácticas.",
        relevance: 0.82,
      },
    ],
    economia: [
      {
        title: "Mercados se recuperan tras reportes de inflación",
        source: "Financial Times",
        summary:
          "Los índices bursátiles suben 2.5% después de que reportes muestren desaceleración en la inflación.",
        relevance: 0.91,
      },
      {
        title: "Startups tech recaudan récord de inversión",
        source: "Venture Beat",
        summary:
          "El sector de startups tecnológicas experimentó el mayor flujo de capital de riesgo en cinco años.",
        relevance: 0.85,
      },
      {
        title: "Criptomonedas rebasan los 70,000 dólares",
        source: "Crypto News",
        summary:
          "Bitcoin y otras criptomonedas principales alcanzan nuevos máximos históricos impulsadas por adopción institucional.",
        relevance: 0.79,
      },
    ],
    salud: [
      {
        title: "Avances en tratamiento de enfermedades neurodegenerativas",
        source: "Medical Journal",
        summary:
          "Un nuevo fármaco muestra resultados prometedores en ensayos clínicos para el Alzheimer.",
        relevance: 0.93,
      },
      {
        title: "Bienestar mental: estudios sobre meditación",
        source: "Health Weekly",
        summary:
          "Investigaciones demuestran que 10 minutos diarios de meditación reduce ansiedad en 40%.",
        relevance: 0.87,
      },
      {
        title: "Nutrición: proteína vegetal iguala a animal",
        source: "Nutrition Today",
        summary:
          "Científicos descubren combinación de proteínas vegetales con valor nutricional equivalente a carnes.",
        relevance: 0.81,
      },
    ],
    agricultura: [
      {
        title: "Cultivos resistentes al cambio climático",
        source: "Agronomy Review",
        summary:
          "Nuevas variedades de trigo y maíz mantienen rendimientos en sequías extremas.",
        relevance: 0.90,
      },
      {
        title: "Agricultura vertical reduce uso de agua",
        source: "Sustainable Farming",
        summary:
          "Sistemas hidropónicos urbanos utilizan 95% menos agua que agricultura tradicional.",
        relevance: 0.86,
      },
      {
        title: "Insectos beneficiosos controlan plagas",
        source: "Organic Farming Digest",
        summary:
          "La introducción de depredadores naturales reduce necesidad de pesticidas químicos en 70%.",
        relevance: 0.80,
      },
    ],
  };

  // Normalize topic for lookup
  const normalizedTopic = topic.toLowerCase().trim();

  // Return matching news or empty array
  return (
    mockNewsDatabase[normalizedTopic] ||
    mockNewsDatabase[
      Object.keys(mockNewsDatabase).find(
        (key) =>
          key.includes(normalizedTopic) || normalizedTopic.includes(key)
      ) as string
    ] ||
    []
  );
}

async function runNewsSearcher(): Promise<void> {
  const conversationHistory: ConversationMessage[] = [];

  console.log("\n=== BUSCADOR DE NOTICIAS POR TEMAS DE INTERÉS ===");
  console.log(
    "Escribe 'salir' para terminar. Puedes preguntar sobre: tecnología, economía, salud, agricultura\n"
  );

  while (true) {
    const userInput = await question("Tú: ");

    if (userInput.toLowerCase() === "salir") {
      console.log(
        "\n¡Gracias por usar el Buscador de Noticias! Hasta pronto."
      );
      rl.close();
      break;
    }

    if (!userInput.trim()) {
      
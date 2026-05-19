import { prisma } from "../lib/prisma.js";

const QUIZ_ITEMS = [
  {
    question: "Um gestor faz piadas constrangedoras sobre você em reuniões recorrentes. Isso merece atenção?",
    options: ["Não, é só brincadeira", "Sim, pode indicar conduta inadequada", "Só se houver testemunhas", "Depende do humor do dia"],
    correctIndex: 1,
    explanation:
      "Comentários repetidos que expõem ou constrangem podem indicar conduta inadequada e merecem atenção. Com base nos materiais da Byst.end, observe frequência, contexto e impacto. Registre episódios e busque orientação nos canais oficiais da organização.",
    violenceType: "ASSÉDIO MORAL",
  },
  {
    question: "Flerte recíproco e respeitoso é a mesma coisa que assédio sexual?",
    options: ["Sim, sempre", "Não — flerte envolve troca e respeito mútuo", "Depende do cargo", "Flerte nunca existe no trabalho"],
    correctIndex: 1,
    explanation:
      "Flerte envolve troca, respeito e vontade mútua. Assédio pode começar quando há insistência após recusa, uso de poder ou constrangimento. Silêncio não é consentimento.",
    violenceType: "ASSÉDIO SEXUAL",
  },
  {
    question: "A frase \"foi só uma piada\" após um comentário ofensivo é um sinal de alerta?",
    options: ["Não, encerra o assunto", "Sim, pode minimizar microagressões", "Só se repetir 10 vezes", "Apenas se for gravado"],
    correctIndex: 1,
    explanation:
      "Microagressões muitas vezes aparecem como piadas ou comentários aparentemente leves. O impacto se acumula com o tempo e não deve ser normalizado.",
    violenceType: "MICROAGRESSÕES",
  },
  {
    question: "Negar promoção por identidade de gênero pode configurar discriminação?",
    options: ["Não, é critério interno", "Sim, pode violar princípios de equidade", "Só em empresas públicas", "Apenas com prova em vídeo"],
    correctIndex: 1,
    explanation:
      "Discriminação ocorre quando diferenças pessoais são usadas para excluir ou prejudicar. Negar oportunidades sem critério justo é sinal de alerta.",
    violenceType: "DISCRIMINAÇÃO",
  },
  {
    question: "Testemunhas têm papel na prevenção de violências no trabalho?",
    options: ["Não, não é problema delas", "Sim, omissão pode perpetuar abusos", "Só se forem da liderança", "Apenas com autorização judicial"],
    correctIndex: 1,
    explanation:
      "Quem presencia conduta abusiva pode intervir ou reportar. O silêncio coletivo fortalece agressores e enfraquece vítimas.",
    violenceType: "ASSÉDIO MORAL",
  },
  {
    question: "Cobrança firme e respeitosa é diferente de humilhação pública?",
    options: ["Não, é a mesma coisa", "Sim — demanda adequada é objetiva e respeitosa", "Depende do setor", "Humilhação é normal em metas"],
    correctIndex: 1,
    explanation:
      "Demanda adequada usa feedback técnico e respeitoso. Assédio moral inclui humilhação, exposição ou metas usadas para desestabilizar.",
    violenceType: "ASSÉDIO MORAL",
  },
];

export async function seedQuiz() {
  for (const item of QUIZ_ITEMS) {
    const content = await prisma.content.findFirst({
      where: { violenceType: item.violenceType, type: { in: ["micro", "nano"] } },
    });
    const layer = await prisma.educationLayer.findFirst({ where: { number: 2 } });

    await prisma.quizQuestion.create({
      data: {
        question: item.question,
        options: JSON.stringify(item.options),
        correctIndex: item.correctIndex,
        explanation: item.explanation,
        violenceType: item.violenceType,
        contentId: content?.id,
        layerId: layer?.id,
      },
    });
  }
  console.log(`Seeded ${QUIZ_ITEMS.length} quiz questions`);
}

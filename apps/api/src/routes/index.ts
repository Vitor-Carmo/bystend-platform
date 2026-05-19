import { Router, type Request, type Response, type NextFunction } from "express";
import { z } from "zod";
import { prisma } from "../lib/prisma.js";
import { sessionIdSchema } from "../lib/session.js";
import { handleChat } from "../services/chat.js";
import { getProgressBySessionId, upsertProgressFields } from "../services/progress.js";
import { searchContents } from "../services/search.js";

export const router = Router();

router.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "bystend-api" });
});

router.get("/categories", async (_req, res, next) => {
  try {
    const categories = await prisma.category.findMany({
      include: { _count: { select: { contents: true } } },
      orderBy: { name: "asc" },
    });
    res.json(
      categories.map((c) => ({
        slug: c.slug,
        name: c.name,
        contentCount: c._count.contents,
      }))
    );
  } catch (e) {
    next(e);
  }
});

router.get("/layers", async (_req, res, next) => {
  try {
    const layers = await prisma.educationLayer.findMany({
      orderBy: { number: "asc" },
      include: { _count: { select: { contents: true } } },
    });
    res.json(
      layers.map((l) => ({
        number: l.number,
        slug: l.slug,
        name: l.name,
        description: l.description,
        contentCount: l._count.contents,
      }))
    );
  } catch (e) {
    next(e);
  }
});

router.get("/contents", async (req, res, next) => {
  try {
    const schema = z.object({
      type: z.string().optional(),
      category: z.string().optional(),
      layer: z.coerce.number().optional(),
      violenceType: z.string().optional(),
      limit: z.coerce.number().default(50),
      offset: z.coerce.number().default(0),
    });
    const q = schema.parse(req.query);

    const where: Record<string, unknown> = {};
    if (q.type) where.type = q.type;
    if (q.category) where.category = { slug: q.category };
    if (q.layer) where.layer = { number: q.layer };
    if (q.violenceType) where.violenceType = q.violenceType;

    const [items, total] = await Promise.all([
      prisma.content.findMany({
        where,
        include: {
          layer: true,
          category: true,
          nanoCards: { orderBy: { order: "asc" } },
        },
        take: q.limit,
        skip: q.offset,
        orderBy: { createdAt: "desc" },
      }),
      prisma.content.count({ where }),
    ]);

    res.json({ items, total });
  } catch (e) {
    next(e);
  }
});

router.get("/contents/:id", async (req, res, next) => {
  try {
    const item = await prisma.content.findUnique({
      where: { id: req.params.id },
      include: {
        layer: true,
        category: true,
        nanoCards: { orderBy: { order: "asc" } },
      },
    });
    if (!item) return res.status(404).json({ error: "Conteúdo não encontrado" });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

router.get("/search", async (req, res, next) => {
  try {
    const schema = z.object({
      q: z.string().default(""),
      type: z.string().optional(),
      category: z.string().optional(),
      layer: z.coerce.number().optional(),
      limit: z.coerce.number().default(20),
    });
    const q = schema.parse(req.query);
    const results = await searchContents(q);
    res.json({ query: q.q, results });
  } catch (e) {
    next(e);
  }
});

router.get("/seasonal", async (req, res, next) => {
  try {
    const month = req.query.month ? parseInt(String(req.query.month), 10) : new Date().getMonth() + 1;
    const items = await prisma.content.findMany({
      where: { type: "seasonal" },
      include: { nanoCards: { orderBy: { order: "asc" } }, layer: true },
      orderBy: { seasonalDate: "asc" },
    });
    const filtered = items.filter((i) => {
      if (!i.seasonalDate) return true;
      return i.seasonalDate.getMonth() + 1 === month;
    });
    res.json({ month, items: filtered.length ? filtered : items.slice(0, 6) });
  } catch (e) {
    next(e);
  }
});

router.get("/learning-paths", async (_req, res, next) => {
  try {
    const paths = await prisma.learningPath.findMany({
      include: { _count: { select: { items: true } } },
    });
    res.json(paths);
  } catch (e) {
    next(e);
  }
});

router.get("/learning-paths/:slug", async (req, res, next) => {
  try {
    const path = await prisma.learningPath.findUnique({
      where: { slug: req.params.slug },
      include: {
        items: {
          orderBy: { order: "asc" },
          include: {
            content: {
              include: { layer: true, category: true, nanoCards: { orderBy: { order: "asc" } } },
            },
          },
        },
      },
    });
    if (!path) return res.status(404).json({ error: "Trilha não encontrada" });
    res.json(path);
  } catch (e) {
    next(e);
  }
});

router.get("/quiz", async (_req, res, next) => {
  try {
    const questions = await prisma.quizQuestion.findMany({
      include: { layer: true, content: { select: { id: true, title: true, theme: true } } },
    });
    res.json(
      questions.map((q) => ({
        id: q.id,
        question: q.question,
        options: JSON.parse(q.options) as string[],
        violenceType: q.violenceType,
        layer: q.layer,
        relatedContent: q.content,
      }))
    );
  } catch (e) {
    next(e);
  }
});

router.get("/progress/:sessionId", async (req, res, next) => {
  try {
    const { sessionId } = z.object({ sessionId: sessionIdSchema }).parse({ sessionId: req.params.sessionId });
    const progress = await getProgressBySessionId(sessionId);
    res.json(progress);
  } catch (e) {
    next(e);
  }
});

router.post("/progress", async (req, res, next) => {
  try {
    const schema = z
      .object({
        sessionId: sessionIdSchema,
        completedContentId: z.string().min(1).optional(),
        completedLayerSlug: z.string().min(1).optional(),
        pathId: z.string().min(1).optional(),
      })
      .refine(
        (body) => Boolean(body.completedContentId ?? body.completedLayerSlug ?? body.pathId),
        "Informe ao menos um campo de progresso para atualizar"
      );
    const body = schema.parse(req.body);
    const progress = await upsertProgressFields(body.sessionId, {
      completedContentId: body.completedContentId,
      completedLayerSlug: body.completedLayerSlug,
      pathId: body.pathId,
    });
    res.json(progress);
  } catch (e) {
    next(e);
  }
});

router.post("/quiz/answer", async (req, res, next) => {
  try {
    const schema = z.object({
      questionId: z.string(),
      selectedIndex: z.number().int().min(0),
      sessionId: z.string().optional(),
    });
    const body = schema.parse(req.body);
    const question = await prisma.quizQuestion.findUnique({ where: { id: body.questionId } });
    if (!question) return res.status(404).json({ error: "Pergunta não encontrada" });

    const correct = body.selectedIndex === question.correctIndex;
    const relatedContentIds = question.contentId ? [question.contentId] : [];

    if (body.sessionId) {
      const progress = await prisma.userProgress.upsert({
        where: { sessionId: body.sessionId },
        create: {
          sessionId: body.sessionId,
          quizScore: correct ? 1 : 0,
          quizTotal: 1,
        },
        update: {
          quizScore: { increment: correct ? 1 : 0 },
          quizTotal: { increment: 1 },
        },
      });
      void progress;
    }

    res.json({
      correct,
      explanation: question.explanation,
      relatedContentIds,
    });
  } catch (e) {
    next(e);
  }
});

router.post("/chat", async (req, res, next) => {
  try {
    const schema = z.object({
      message: z.string().min(1).max(4000),
      sessionId: z.string().default(() => `anon-${Date.now()}`),
    });
    const body = schema.parse(req.body);
    const response = await handleChat(body.sessionId, body.message);
    res.json(response);
  } catch (e) {
    next(e);
  }
});

router.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err);
  if (err instanceof z.ZodError) {
    return res.status(400).json({ error: "Dados inválidos", details: err.errors });
  }
  res.status(500).json({ error: "Erro interno do servidor" });
});

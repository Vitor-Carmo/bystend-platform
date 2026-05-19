import { prisma } from "../lib/prisma.js";

export async function seedLearningPaths() {
  const path = await prisma.learningPath.upsert({
    where: { slug: "reconhecer-e-agir" },
    create: {
      slug: "reconhecer-e-agir",
      title: "Reconhecer sinais e agir com responsabilidade",
      description:
        "Trilha baseada nas 8 camadas educacionais da Byst.end, do conhecimento básico à prevenção contínua.",
    },
    update: {},
  });

  const layers = await prisma.educationLayer.findMany({ orderBy: { number: "asc" } });
  let order = 0;

  for (const layer of layers) {
    const contents = await prisma.content.findMany({
      where: {
        layerId: layer.id,
        type: { in: ["micro", "nano"] },
      },
      take: 2,
      orderBy: { createdAt: "asc" },
    });

    for (const content of contents) {
      await prisma.learningPathItem.upsert({
        where: { pathId_contentId: { pathId: path.id, contentId: content.id } },
        create: { pathId: path.id, contentId: content.id, order: order++ },
        update: { order: order - 1 },
      });
    }
  }

  const videos = await prisma.content.findMany({
    where: { type: "video" },
    take: 3,
  });
  for (const video of videos) {
    await prisma.learningPathItem.upsert({
      where: { pathId_contentId: { pathId: path.id, contentId: video.id } },
      create: { pathId: path.id, contentId: video.id, order: order++ },
      update: { order: order - 1 },
    });
  }

  console.log(`Learning path with ${order} items`);
}

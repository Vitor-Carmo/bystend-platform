import { LAYER_DEFINITIONS } from "@bystend/shared";
import { prisma } from "../lib/prisma.js";
import { categorySlugFromViolence, slugify } from "../lib/normalize.js";

const CATEGORIES = [
  { slug: "microagressoes", name: "Microagressões", violence: "MICROAGRESSÕES" },
  { slug: "discriminacao", name: "Discriminação", violence: "DISCRIMINAÇÃO" },
  { slug: "assedio-moral", name: "Assédio Moral", violence: "ASSÉDIO MORAL" },
  { slug: "assedio-sexual", name: "Assédio Sexual", violence: "ASSÉDIO SEXUAL" },
  { slug: "importunacao-sexual", name: "Importunação Sexual", violence: "IMPORTUNAÇÃO SEXUAL" },
  { slug: "estupro", name: "Estupro", violence: "ESTUPRO" },
  { slug: "violencia-digital", name: "Violência Digital", violence: "VIOLÊNCIA DIGITAL" },
  { slug: "cultura-respeito", name: "Cultura de Respeito", violence: "GERAL" },
  { slug: "fontes-oficiais-marco-legal", name: "Fontes Oficiais e Marco Legal", violence: "GERAL" },
  { slug: "visao-mercado", name: "Visão de Mercado", violence: "GERAL" },
];

export async function seedLayersAndCategories() {
  for (const layer of LAYER_DEFINITIONS) {
    await prisma.educationLayer.upsert({
      where: { number: layer.number },
      create: {
        number: layer.number,
        slug: layer.slug,
        name: layer.name,
        description: layer.description,
      },
      update: {
        name: layer.name,
        description: layer.description,
      },
    });
  }

  for (const cat of CATEGORIES) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      create: { slug: cat.slug, name: cat.name },
      update: { name: cat.name },
    });
  }
}

export async function getLayerId(layerNumber: number | null) {
  if (!layerNumber) return null;
  const layer = await prisma.educationLayer.findUnique({ where: { number: layerNumber } });
  return layer?.id ?? null;
}

export async function getCategoryId(violenceType: string) {
  const slug = categorySlugFromViolence(violenceType);
  return getCategoryIdBySlug(slug);
}

export async function getCategoryIdBySlug(slug: string) {
  const cat = await prisma.category.findUnique({ where: { slug } });
  return cat?.id ?? null;
}

export { slugify };

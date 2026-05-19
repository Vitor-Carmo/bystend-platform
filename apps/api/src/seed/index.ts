import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { prisma } from "../lib/prisma.js";
import { seedLayersAndCategories } from "./layers.js";
import { seedVideos } from "./videos.js";
import { seedNanoContents } from "./nano-contents.js";
import { seedSeasonal } from "./seasonal.js";
import { seedSlogans } from "./slogans.js";
import { seedLearningPaths } from "./learning-paths.js";
import { seedQuiz } from "./quiz.js";

const NANO_MARKER = "VÍDEOS, NANO E MICRO CONTEÚDOS EDUCATIVOS.xlsx - 2.3. NANO CONTEÚDOS.csv";

export function resolveDataDir(): string {
  const fromEnv = process.env.CSV_DATA_DIR;
  if (fromEnv && path.isAbsolute(fromEnv)) return fromEnv;
  if (fromEnv) return path.resolve(process.cwd(), fromEnv);

  const candidates = [
    path.resolve(process.cwd(), "data"),
    path.resolve(process.cwd(), "../../data"),
    path.resolve(process.cwd(), "data"),
    "C:\\Users\\lrzezak\\Downloads",
  ];
  for (const c of candidates) {
    if (fs.existsSync(path.join(c, NANO_MARKER))) return c;
  }
  return path.resolve(process.cwd(), "data");
}

async function main() {
  const dataDir = resolveDataDir();
  console.log(`Using CSV data from: ${dataDir}`);

  await prisma.chatMessage.deleteMany();
  await prisma.chatSession.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.learningPathItem.deleteMany();
  await prisma.learningPath.deleteMany();
  await prisma.nanoCard.deleteMany();
  await prisma.slogan.deleteMany();
  await prisma.content.deleteMany();
  await prisma.educationLayer.deleteMany();
  await prisma.category.deleteMany();

  await seedLayersAndCategories();
  await seedVideos(dataDir);
  await seedNanoContents(dataDir);
  await seedSeasonal(dataDir);
  await seedSlogans(dataDir);
  await seedLearningPaths();
  await seedQuiz();

  const counts = {
    contents: await prisma.content.count(),
    nanos: await prisma.nanoCard.count(),
    slogans: await prisma.slogan.count(),
    paths: await prisma.learningPath.count(),
    quiz: await prisma.quizQuestion.count(),
  };
  console.log("Seed complete:", counts);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

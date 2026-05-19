import { Disclaimer } from "@/components/Disclaimer";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViolentometroExplorer } from "@/components/violentometro/ViolentometroExplorer";

export default function ViolentometroPage() {
  return (
    <>
      <SectionHeader
        eyebrow="Escala educativa"
        title="Violentômetro"
        subtitle="Entenda a escalada de condutas no trabalho — da atenção inicial a situações que exigem resposta imediata. Conteúdo sensível: leia com calma."
      />
      <Disclaimer>
        Esta escala é uma ferramenta educativa da Byst.end. Não classifica automaticamente sua situação nem
        substitui denúncia, RH, apoio psicológico ou orientação jurídica. Em risco imediato, priorize sua
        segurança e canais de emergência.
      </Disclaimer>
      <ViolentometroExplorer />
    </>
  );
}

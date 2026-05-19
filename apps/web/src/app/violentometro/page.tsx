import { Disclaimer } from "@/components/Disclaimer";
import { ViolentometroUI } from "@/components/ViolentometroUI";
import { VIOLENTOMETRO_NIVEIS } from "@/data/violentometro";

export default function ViolentometroPage() {
  return (
    <>
      <h1 style={{ marginBottom: "0.5rem" }}>O Violentômetro: A escalada da violência</h1>
      <p style={{ color: "var(--muted)", marginBottom: "1.5rem", maxWidth: "640px" }}>
        Ferramenta educativa que ajuda a reconhecer a progressão de condutas — das microagressões
        até situações de alto risco. Cada nível indica uma faixa de atenção e caminhos de cuidado.
      </p>
      <Disclaimer />
      <ViolentometroUI items={VIOLENTOMETRO_NIVEIS} />
    </>
  );
}

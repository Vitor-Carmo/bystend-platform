import {
  VIOLENTOMETRO_ZONAS,
  type ViolentometroNivel,
  type ViolentometroZona,
} from "@/data/violentometro";

export interface ViolentometroUIProps {
  items: ViolentometroNivel[];
}

interface ZonaUiStyle {
  borderColor: string;
  bgColor: string;
  dotColor: string;
  label: string;
  emphasis?: boolean;
}

const ZONA_UI: Record<ViolentometroZona, Omit<ZonaUiStyle, "label">> = {
  atencao: {
    borderColor: "#3b82f6",
    bgColor: "rgba(59, 130, 246, 0.12)",
    dotColor: "#3b82f6",
  },
  alerta: {
    borderColor: "#eab308",
    bgColor: "rgba(234, 179, 8, 0.12)",
    dotColor: "#eab308",
  },
  cuidado: {
    borderColor: "#f97316",
    bgColor: "rgba(249, 115, 22, 0.12)",
    dotColor: "#f97316",
  },
  reaja: {
    borderColor: "#dc2626",
    bgColor: "rgba(220, 38, 38, 0.15)",
    dotColor: "#dc2626",
    emphasis: true,
  },
};

function getZonaStyle(zona: ViolentometroZona, corNivel: string): ZonaUiStyle {
  const base = ZONA_UI[zona];
  return {
    label: VIOLENTOMETRO_ZONAS[zona].label,
    borderColor: corNivel || base.borderColor,
    bgColor: base.bgColor,
    dotColor: corNivel || base.dotColor,
    emphasis: base.emphasis,
  };
}

function TimelineCard({ item }: { item: ViolentometroNivel }) {
  const style = getZonaStyle(item.zona, item.cor);

  return (
    <article
      className={`v-card${style.emphasis ? " v-card--reaja" : ""}`}
      style={{
        borderLeftColor: style.borderColor,
        background: style.bgColor,
      }}
    >
      <span className="v-faixa-label" style={{ color: style.borderColor }}>
        {style.label} · Nível {item.ordem}
      </span>
      <h3 className="v-title">{item.titulo}</h3>
      <p className="v-desc">{item.descricao}</p>
      {item.exemplo ? (
        <p className="v-exemplo">
          <strong>Exemplo:</strong> {item.exemplo}
        </p>
      ) : null}
      {item.rotaSaida ? (
        <p className="v-rota">
          <strong>O que fazer:</strong> {item.rotaSaida}
        </p>
      ) : null}
    </article>
  );
}

export function ViolentometroUI({ items }: ViolentometroUIProps) {
  return (
    <div className="v-timeline" role="list" aria-label="Escala do Violentômetro">
      {items.map((item) => {
        const style = getZonaStyle(item.zona, item.cor);
        return (
          <div key={item.id} className="v-item" role="listitem">
            <span className="v-dot" style={{ background: style.dotColor }} aria-hidden />
            <TimelineCard item={item} />
          </div>
        );
      })}
    </div>
  );
}

import { Info } from "lucide-react";
import styles from "./Disclaimer.module.css";

interface DisclaimerProps {
  children?: React.ReactNode;
}

export function Disclaimer({ children }: DisclaimerProps) {
  return (
    <aside className={styles.disclaimer} role="note">
      <Info className={styles.icon} size={18} aria-hidden />
      <p>
        {children ??
          "Conteúdo educativo da Byst.end. Não constitui parecer jurídico nem substitui canais oficiais de denúncia ou apoio da sua organização."}
      </p>
    </aside>
  );
}

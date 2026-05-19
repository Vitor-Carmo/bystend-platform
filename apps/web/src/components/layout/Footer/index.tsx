import Image from "next/image";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div>
          <Image
            src="/logo.png"
            alt="Byst.end"
            width={163}
            height={150}
            className={styles.logo}
          />
          <p className={styles.note}>
            Plataforma educativa sobre prevenção de assédio no trabalho. Não substitui canais oficiais de
            denúncia, RH ou orientação jurídica da sua organização.
          </p>
          <span className={styles.badge}>Sessão anônima · sem login</span>
        </div>
        <p className={styles.meta}>
          © {year} Byst.end
          <br />
          Conteúdos com fontes indicadas
        </p>
      </div>
    </footer>
  );
}

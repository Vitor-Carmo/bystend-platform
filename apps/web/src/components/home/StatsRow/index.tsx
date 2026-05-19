import styles from "./StatsRow.module.css";

const stats = [
  { value: "5", label: "áreas de exploração" },
  { value: "8", label: "camadas educacionais" },
  { value: "20", label: "níveis no violentômetro" },
  { value: "0", label: "dados pessoais exigidos" },
];

export function StatsRow() {
  return (
    <div className={styles.row}>
      {stats.map((s) => (
        <div key={s.label} className={styles.stat}>
          <strong>{s.value}</strong>
          {s.label}
        </div>
      ))}
    </div>
  );
}

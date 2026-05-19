import { Badge } from "@/components/ui/Badge";

interface LevelBadgeProps {
  level: number;
  name: string;
}

export function LevelBadge({ level, name }: LevelBadgeProps) {
  return (
    <Badge tone="default">
      Nível {level} · {name}
    </Badge>
  );
}

import { format, formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

export function formatStarCount(stars: number) {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`;
  }
  return stars.toLocaleString("ja-JP");
}

export function formatDiff(additions: number, deletions: number) {
  return `+${additions.toLocaleString("ja-JP")} / -${deletions.toLocaleString("ja-JP")}`;
}

export function formatMergedAt(dateIso: string) {
  const date = new Date(dateIso);
  return `${format(date, "yyyy/MM/dd")}（${formatDistanceToNow(date, {
    locale: ja,
    addSuffix: true
  })}）`;
}

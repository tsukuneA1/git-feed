import { MOCK_TAGS } from "@/mocks/data";

export const TAG_LABEL_BY_ID = Object.fromEntries(
  MOCK_TAGS.map((tag) => [tag.id, tag.label] as const)
);

export function resolveTagLabels(ids: string[]) {
  return ids.map((id) => TAG_LABEL_BY_ID[id] ?? id);
}

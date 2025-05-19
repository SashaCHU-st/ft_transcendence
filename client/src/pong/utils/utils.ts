export function stripPredTag(name: string): string {
  return name.startsWith("(pred) ") ? name.replace("(pred) ", "") : name;
}

import type { ImageLoaderProps } from "next/image";

export default function imageLoader({ src, width }: ImageLoaderProps) {
  if (src.includes("?")) {
    return `${src}&w=${width}`;
  }
  return `${src}?w=${width}`;
}

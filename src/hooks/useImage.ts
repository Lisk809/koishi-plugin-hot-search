import type { Config } from "../index";
import { h } from "koishi";

export function useImage(config: Config) {
  return config.isUseImage
    ? (image) => h("img", { src: image })
    : (image) => image;
}

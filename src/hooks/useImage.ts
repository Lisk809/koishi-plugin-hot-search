import type {Config} from "../index"

export function useImage(config: Config){
 return config.isUseImage ? image=>h("img", {src:image}) : image=>image
}

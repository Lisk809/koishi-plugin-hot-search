import { useData } from "./useData";

const config = useData();
export function useSource(name) {
  return config.endpoints[name];
}

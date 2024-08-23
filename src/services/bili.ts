import type { Context, Command } from "koishi";
import type { Config } from "../index"

import { useSource, useImage } from "../hooks";

export const name = "bili";

interface BiliData {
  data: {
    list: Array<{
      position: number;
      keyword: string;
      icon: string;
    }>;
  };
}

export async function handler(ctx: Context, config: Config) {
  const source = useSource(config, name);
  const image = useImage(config);
  ctx
    .command("hotof."+name)
    .option("num", "-n <num:number>", { fallback: 10 })
    .action(async ({ options }) => {
      const data: BiliData = await fetch(source).then((res) => res.json());
      return data.data.list
        .slice(0, options.num)
        .map(
          (a) =>
            `=${a.position}= [${(a.icon||"").endsWith("Ko24.png")?"热":(a.icon?"新":"无")}]${a.keyword}\n`,
        )
        .join("");
    });
}

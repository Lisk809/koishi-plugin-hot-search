import type { Context, Command } from "koishi";
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

export async function handler(ctx: Context, hotof: Command) {
  const source = useSource(name);
  const image = useImage(ctx.root.config);
  hotof
    .subcommand(name)
    .option("num", "-n <num:number>", { fallback: 10 })
    .action(async ({ options }) => {
      const data: BiliData = await fetch(source).then((res) => res.json());
      return data.data.list
        .slice(0, options.num)
        .map(
          (a) =>
            `=${a.position}= ${a.keyword}\n${a.icon ? image(a.icon) : "(暂无图片捏)"}\n`,
        )
        .join("");
    });
}

import { Context, Command } from "koishi";
import { useSource, useImage } from "../hooks";

export const name = "douyin";

interface DouyinData {
  data: {
    word_list: Array<{
      position: number;
      word: string;
      hot_value: number;
      video_count: number;
      word_cover: {
        url_list: string[];
      };
    }>;
    trending_list: Array<{
      word: string;
      hot_value: number;
      video_count: number;
      word_cover: { url_list: string[] };
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
      const data: DouyinData = await fetch(source).then((res) => res.json());
      const hots = data.data.word_list
        .slice(0, options.num)
        .map(
          (a) =>
            `=${a.position}= ${a.word}(${a.hot_value / 10000 + "w"}, 视频${a.video_count})\n${a.word_cover.url_list[0] ? image(a.word_cover.url_list[0]) : "(暂无图片捏)"}\n`,
        )
        .join("");
      const trendings =
        "实时上升热点\n" +
        data.data.trending_list
          .slice(0, options.num)
          .map(
            (a) =>
              `+ ${a.word}(视频${a.video_count})\n${a.word_cover.url_list[0]}\n`,
          );
      return `■热点榜■\n${hots}\n■实时上升热点■${trendings}`;
    });
}

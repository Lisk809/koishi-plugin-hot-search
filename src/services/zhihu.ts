import type { Context, Command } from 'koishi'
import type { Config } from '../index'

import { useSource, useImage } from '../hooks'

export const name = 'zhihu'

interface ZhihuData {
  top_search: {
    words: Array<{
      display_query: string
    }>
  }
}

export async function handler(ctx: Context, config: Config) {
  const source = useSource(config, name)
  const image = useImage(config)
  ctx
    .command('hotof.' + name)
    .option('num', '-n <num:number>', { fallback: 10 })
    .action(async ({ options }) => {
      const data: ZhihuData = await fetch(source).then((res) => res.json())
      return (
        '知乎热搜🔥\n' +
        data.top_search.words
          .slice(0, options.num)
          .map((a) => `${a.display_query}`)
          .join('\n')
      )
    })
}

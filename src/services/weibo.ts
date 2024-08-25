import type { Context, Command } from 'koishi'
import type { Config } from '../index'

import { useSource, useImage } from '../hooks'

export const name = 'weibo'

interface SingleData {
  rank: number
  icon_desc?: string
  label_name?: string
  word_scheme?: string
  word: string
}

interface WeiboData {
  data: {
    realtime: Array<SingleData>
    hotgovs: Array<SingleData>
  }
}

export async function handler(ctx: Context, config: Config) {
  const source = useSource(config, name)
  const image = useImage(config)
  ctx
    .command(`${config.command}${name}`)
    .option('num', '-n <num:number>', { fallback: 10 })
    .action(async ({ options }) => {
      const data: WeiboData = await fetch(source).then((res) => res.json())
      const { realtime, hotgovs } = data.data
      return (
        hotgovs
          .map((a) => `⏏️  [${a.icon_desc || a.label_name}] ${a.word_scheme || a.word}\n`)
          .join('') +
        realtime
          .slice(0, options.num)
          .map((a) => `=${a.rank + 1}= [${a.icon_desc || a.label_name}] ${a.word_scheme || a.word}`)
          .join('\n')
      )
    })
}

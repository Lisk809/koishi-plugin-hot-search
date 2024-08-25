import { Context, Schema } from 'koishi'
import { Hots } from './hots'
import * as services from './services'

export const name = 'hot-search'

export type plats = 'bili' | 'douyin' | 'zhihu' | 'weibo'

export const hots = new Hots(Object.values(services))

export interface Config {
  command: string
  endpoints: { [key in plats]: string }
  isUseImage: boolean
}

export const Config: Schema<Config> = Schema.object({
  command: Schema.string().default('hotof.'),
  endpoints: Schema.object({
    bili: Schema.string(),
    douyin: Schema.string(),
    zhihu: Schema.string(),
    weibo: Schema.string(),
  }).default({
    bili: 'https://app.bilibili.com/x/v2/search/trending/ranking',
    douyin: 'https://aweme-lq.snssdk.com/aweme/v1/hot/search/list/?aid=1128&version_code=880',
    zhihu: 'https://www.zhihu.com/api/v4/search/top_search',
    weibo: 'https://weibo.com/ajax/side/hotSearch',
  }),
  isUseImage: Schema.boolean().default(true),
})

export function apply(ctx: Context, config: Config) {
  hots.use(ctx, config)
}

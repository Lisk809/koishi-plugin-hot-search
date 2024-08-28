import type { Config } from './index'

import { Context, Command } from 'koishi'

type service = {
  name: string
  status?: 'ok' | 'error'
  handler: (ctx: Context, hotof: Command) => void
}

export class Hots {
  services: service[]
  config: Config
  ctx: Context
  constructor(internal) {
    this.services = []
    this.services=this.services.concat(internal)
  }
  define(name: string, handler: (ctx: Context, hotof: Command) => void) {
    this.services.push({ name, handler })
    this.apply(this.ctx, handler)
  }
  apply(ctx, handler) {
    handler(ctx, this.config)
  }
  initialize(instance) {
    instance.usage('获取各平台热搜🔥')
    instance.example('hotof.bili -n 10')
  }
  use(ctx, config) {
    this.config = config
    this.ctx = ctx
    const hotof = ctx.command(this.config.command)
    this.initialize(hotof)
    this.mount(ctx)
  }
  mount(ctx) {
    if (!this.services.length) throw new TypeError('services list is empty')
    this.services.forEach(({ name, handler }, index) => {
      try {
        this.apply(ctx, handler)
      } catch (e) {
        this.services[index].status = 'error'
        throw e
      }
      this.services[index].status = 'ok'
    })
  }
}

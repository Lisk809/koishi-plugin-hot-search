import type {Config} from "./index"

import { Context, Command } from "koishi";

type service = {
  name: string;
  status?: "ok" | "error";
  handler: (ctx: Context, hotof: Command) => void;
};

export class Hots {
  services: service[];
  config: Config;
  constructor(internal) {
    this.services = [];
    internal.forEach(({ name, handler }) => {
      this.define(name, handler);
    });
  }
  define(name: string, handler: (ctx: Context, hotof: Command) => void) {
    this.services.push({ name, handler });
  }
  async apply(ctx, name, handler, hotof) {
    handler.call(ctx, hotof);
  }
  initialize(instance) {
    instance.usage("Get platform hot search!");
    instance.example("hotof.bili -i -n=10");
  }
  use(ctx) {
    this.config = ctx.root.config;
    const hotof = ctx.command(ctx.root.config.command);
    this.initialize(hotof);
    this.mounted(hotof, ctx);
  }
  mounted(hotof, ctx) {
    if (!this.services.length) throw new TypeError("services list is empty");
    this.services.forEach(({ name, handler }, index) => {
      try {
        this.apply(ctx, name, handler, hotof);
      } catch (e) {
        this.services[index].status = "error";
        throw e;
      }
      this.services[index].status = "ok";
    });
  }
}

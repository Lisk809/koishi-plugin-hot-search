import services from './service'
import {config} from './index';


import type {Config} from './index';
import {} from 'koishi';

type service = {name:string, handler:(this:Context)=>void}

class Hots{
  services:Service[]|[]=[];
  constructor(internal){
    internal.forEach(({name, handler})=>{
      this.define(name, handler)
    })
  }
  define(name, handler){
    this.services.push({name,handler})
  }
  async apply(ctx, name, handler, hotof){
    handler.apply(ctx, hotof)
  }
  initialze(instance){
    instance.usage("Get platform hot search!")
    instance.example("hotof.bili -i -n=10")
  }
  use(ctx){
    const hotof=ctx.command(ctx.root.config.command)
    initialize(hotof)
    
  }
  mounted(hotof, ctx){
    if(isEmpty(services)) throw new TypeError("services list is empty")
    this.services.forEach(({name, handler}, index)=>{
      try{
        this.apply(ctx, name, handler, hotof)
      } catch(e){
	this.services[index].status="error"
        throw e;
      }
      this.services[index].status="ok"
    })
  }
}

export const hots = new Hots(services)

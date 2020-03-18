import { TracingConfig, TracingOptions } from 'jaeger-client'
import { Context, Application } from 'egg'
import { Tracer } from 'opentracing'

interface JaegerTracingOptions {
  config: TracingConfig;
  options?: TracingOptions;
}

export type curlWithTracing = <T = any>(ctx: Context, url: string, options?: urllib.RequestOptions2) => Promise<T>
export type setupTracer = (app: Application, config: TracingConfig, options?: TracingOptions) => Tracer
export type getTracer = () => Tracer

declare module 'egg' {
  export interface EggAppConfig {
    jaegerTracing: JaegerTracingOptions;
  }
}

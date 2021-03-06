import { TracingConfig, TracingOptions } from 'jaeger-client'
import { Context, Application } from 'egg'
import { Tracer, Span, SpanOptions } from 'opentracing'

interface JaegerTracingOptions {
  enable: boolean;
  config: TracingConfig;
  options?: TracingOptions;
  tracingKeys?: sntring[];
}

export declare const curlWithTracing: <T = any>(ctx: Context, url: string, options?: urllib.RequestOptions2) => Promise<T>
export declare const setupTracer: (app: Application, config: TracingConfig, options?: TracingOptions) => Tracer
export declare const fromParentSpan: (ctx: Context, name: string, options?: SpanOptions) => Span
export declare const getTracer: () => Tracer

declare module 'egg' {
  export interface EggAppConfig {
    jaegerTracing: JaegerTracingOptions;
  }
}

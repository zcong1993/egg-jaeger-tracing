const { initTracer } = require('jaeger-client')

module.exports = app => {
  if (!app.config.coreMiddleware.includes('tracing')) {
    app.config.coreMiddleware.unshift('tracing');
  }

  const tracingConfig = app.config.jaegerTracing;
  if (tracingConfig?.enable) {
    if (!tracingConfig.config) {
      throw new Error('config.gymboEggCommon.tracing.config is required');
    }
    if (!tracingConfig.options) {
      throw new Error('config.gymboEggCommon.tracing.options is required');
    }
    app.tracer = initTracer(tracingConfig.config, tracingConfig.options);
  }
}

const { v4 } = require('uuid')
const { FORMAT_HTTP_HEADERS, Tags } = require('opentracing')

module.exports = function () {
  return async (ctx, next) => {
    if (!ctx.request.headers['x-request-id']) {
      ctx.request.headers['x-request-id'] = v4();
    }
    ctx.tracer = {
      traceId: ctx.request.headers['x-request-id'],
    };

    if (!ctx.app.config.jaegerTracing.enable) {
      await next();
      return;
    }

    // jaeger tracing
    const parentSpanContext = ctx.app.tracer.extract(
      FORMAT_HTTP_HEADERS,
      ctx.request.headers
    );

    const span = ctx.app.tracer.startSpan('web-handler', {
      childOf: parentSpanContext,
      tags: { [Tags.SPAN_KIND]: Tags.SPAN_KIND_RPC_SERVER },
    });

    ctx.span = span;

    try {
      await next();
      span.setTag(Tags.HTTP_STATUS_CODE, ctx.status || 200);
    } catch (err) {
      span.setTag(Tags.ERROR, true);
      span.setTag(Tags.HTTP_STATUS_CODE, err.statusCode || 500);
      throw err;
    } finally {
      const matchedRoute = ctx._matchedRoute || '__no_matched';
      const routerName = ctx.routerName || matchedRoute;
      span.setTag('route', routerName);
      span.finish();
    }
  };
}

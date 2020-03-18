const { setupTracer } = require('./lib')

module.exports = app => {
  console.log(222, app.config.name, app.config.jaegerTracing)
  setupTracer(app, {
    serviceName: app.config.name,
    ...app.config.jaegerTracing.config,
  }, app.config.jaegerTracing.options)
}

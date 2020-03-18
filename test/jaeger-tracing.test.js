'use strict';

const mock = require('egg-mock');

describe('test/jaeger-tracing.test.js', () => {
  let app;
  before(() => {
    app = mock.app({
      baseDir: 'apps/jaeger-tracing-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mock.restore);

  it('should GET /', () => {
    return app.httpRequest()
      .get('/')
      .expect('hi, jaegerTracing')
      .expect(200);
  });
});

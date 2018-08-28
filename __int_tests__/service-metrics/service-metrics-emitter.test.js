const ServiceMetricsEmitter = require('../../src/service-metrics/service-metrics-emitter');
const ServiceMetricsBufferTestDataGenerator = require('../../data-generator/service-metrics/service-metrics-data-generator.js');


describe('emitBuffer', () => {
    test.only('emit all metrics', (done) => {
        const serviceMetricsEmitter = new ServiceMetricsEmitter(0, false, 'MDB', 'development');
        const serviceMetricsBufferTestDataGenerator = new ServiceMetricsBufferTestDataGenerator(serviceMetricsEmitter);
        serviceMetricsBufferTestDataGenerator.addData(serviceMetricsEmitter);
        serviceMetricsEmitter.emitBuffer().then(() => {
            done();
        });
    });
});

/*
describe('emitMetrics', () => {
    test('flush namespace metrics from buffer', (done) => {
        const serviceMetricsEmitter = new ServiceMetricsEmitter(0, false, 'MyOrg', 'development');
        serviceMetricsEmitter.addServiceMethodCountMetric('Test', ServiceMetricMethods.Get, ServiceMetricNames.NotFoundResponses);
        const metrics = serviceMetricsEmitter.buffer['MyOrg/Services/Test'];
        serviceMetricsEmitter.emitMetrics(metrics).then(() => {
            done();
        });
    });
});*/
/* 
describe('addRequestMetric', () => {
    test('add one metric', () => {
        const serviceMetricsEmitter = new ServiceMetricsEmitter(0, false, 'MyOrg', 'development');
        serviceMetricsEmitter.addServiceMethodCountMetric('Test', ServiceMetricMethods.Get, ServiceMetricNames.NotFoundResponses);
        console.log(serviceMetricsEmitter.buffer);
    });

    test('add two metrics with same namespace', () => {
        const serviceMetricsEmitter = new ServiceMetricsEmitter(0, false, 'MyOrg', 'development');
        serviceMetricsEmitter.addServiceMethodCountMetric('Test', ServiceMetricMethods.Get, ServiceMetricNames.NotFoundResponses);
        serviceMetricsEmitter.addServiceMethodCountMetric('Test', ServiceMetricMethods.Get, ServiceMetricNames.NotFoundResponses);
        console.log(serviceMetricsEmitter.buffer);
    });

    test('add two metrics with different namespaces', () => {
        const serviceMetricsEmitter = new ServiceMetricsEmitter(0, false, 'MyOrg', 'development');
        serviceMetricsEmitter.addServiceMethodCountMetric('Test', ServiceMetricMethods.Get, ServiceMetricNames.NotFoundResponses);
        serviceMetricsEmitter.addServiceMethodCountMetric('Test2', ServiceMetricMethods.Get, ServiceMetricNames.NotFoundResponses);
        console.log(serviceMetricsEmitter.buffer);
    });

    test('add two metrics with different namespaces', () => {
        const serviceMetricsEmitter = new ServiceMetricsEmitter(0, false, 'MyOrg', 'development');
        serviceMetricsEmitter.addServiceMethodCountMetric('Test', ServiceMetricMethods.Get, ServiceMetricNames.NotFoundResponses);
        serviceMetricsEmitter.addServiceMethodCountMetric('Test', ServiceMetricMethods.Get, ServiceMetricNames.NotFoundResponses);
        serviceMetricsEmitter.addServiceMethodCountMetric('Test2', ServiceMetricMethods.Get, ServiceMetricNames.NotFoundResponses);
        serviceMetricsEmitter.addServiceMethodCountMetric('Test2', ServiceMetricMethods.Get, ServiceMetricNames.NotFoundResponses);
        console.log(serviceMetricsEmitter.buffer);
    });
});
*/
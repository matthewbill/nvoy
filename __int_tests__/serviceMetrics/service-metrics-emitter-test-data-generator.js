const ServiceMetricMethods = require('../../src/service-metrics/service-metric-methods');
const ServiceMetricNames = require('../../src/service-metrics/service-metric-names');

class ServiceMetricsBufferTestDataGenerator {
    constructor(logger) {
        const self = this;
        self.logger = logger;
    }
    addData(serviceMetricsEmitter) {
        const self = this;
        self.logger.info('Adding metrics to buffer.');
        self.addMethodMetrics(serviceMetricsEmitter, ServiceMetricMethods.GET);
        self.addMethodMetrics(serviceMetricsEmitter, ServiceMetricMethods.GET_ITEM);
        self.addMethodMetrics(serviceMetricsEmitter, ServiceMetricMethods.GET_ITEM_RESOURCE);
        self.addMethodMetrics(serviceMetricsEmitter, ServiceMetricMethods.POST);
        self.addMethodMetrics(serviceMetricsEmitter, ServiceMetricMethods.PUT);
        self.addMethodMetrics(serviceMetricsEmitter, ServiceMetricMethods.DELETE);
        self.logger.info(`Finished adding metrics to buffer. Setting timeout for creation of new metrics to ${self.batchDelay}`);
    }

    addMethodMetrics(serviceMetricsEmitter, method) {
        const self = this;
        self.addMethodMetricName(serviceMetricsEmitter, method, ServiceMetricNames.INTERNAL_SERVER_EXCEPTION_RESPONSES, self.getRandomInt(5, 10));
        self.addMethodMetricName(serviceMetricsEmitter, method, ServiceMetricNames.FORBIDDEN_RESPONSES, self.getRandomInt(10, 20));
        self.addMethodMetricName(serviceMetricsEmitter, method, ServiceMetricNames.UNAUTHORIZED_RESPONSES, self.getRandomInt(20, 30));
        self.addMethodMetricName(serviceMetricsEmitter, method, ServiceMetricNames.BAD_REQUEST_RESPONSES, self.getRandomInt(5, 10));
        self.addMethodMetricName(serviceMetricsEmitter, method, ServiceMetricNames.OK_RESPONSES, self.getRandomInt(700, 1000));
        self.addMethodMetricName(serviceMetricsEmitter, method, ServiceMetricNames.NOT_FOUND_RESPONSES, self.getRandomInt(10, 20));
    }

    addMethodMetricName(serviceMetricsEmitter, method, metricName, count) {
        const self = this;
        for (let i = 0; i < count; i++) {
            serviceMetricsEmitter.addServiceMethodCountMetric('Test', method, ServiceMetricNames.REQUESTS);
            serviceMetricsEmitter.addServiceMethodCountMetric('Test', method, metricName);
            serviceMetricsEmitter.addServiceResponseTimeMetric('Test', method, self.getRandomInt(1000, 3000));
            serviceMetricsEmitter.addServiceResponseSizeMetric('Test', method, self.getRandomInt(5, 50));
            serviceMetricsEmitter.addRequestCountMetric('Test');
        }
    }

    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min)) + min;
    }
}
module.exports = ServiceMetricsBufferTestDataGenerator;

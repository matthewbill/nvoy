describe('exports', () => {
    test('exports work correctly', () => {

        // aws-metrics
        const {AwsMetricDatum} = require('../index');
        expect(AwsMetricDatum).toBeDefined();

        const {AwsMetricsBuffer} = require('../index');
        expect(AwsMetricsBuffer).toBeDefined();

        const {AwsMetricsEmitter} = require('../index');
        expect(AwsMetricsEmitter).toBeDefined();

        // service-metrics
        const {ServiceMetricMethods} = require('../index');
        expect(ServiceMetricMethods).toBeDefined();

        const {ServiceMetricNames} = require('../index');
        expect(ServiceMetricNames).toBeDefined();

        const {ServiceMetricsEmitter} = require('../index');
        expect(ServiceMetricsEmitter).toBeDefined();

        // web-metrics
        const {WebMetricsEmitter} = require('../index');
        expect(WebMetricsEmitter).toBeDefined();
        
    });
});

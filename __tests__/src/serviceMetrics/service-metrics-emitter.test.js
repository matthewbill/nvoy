const ServiceMetricsEmitter = require('../../../src/service-metrics/service-metrics-emitter');
const ServiceMetricNames = require('../../../src/service-metrics/service-metric-names');

describe('addRequestCountMetric', () => {
    test('addRequestCountMetric', () => {
        const org = 'test';
        const serviceName = 'TestService';
        const environment = 'development';
        const sut = new ServiceMetricsEmitter(0, false, org, environment, createCloudWatch());
        const namespace = `${org}/Services/${serviceName}`;
        const dimensions = [
            { Name: 'Environment', Value: environment },
        ];
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: ServiceMetricNames.REQUESTS,
                Dimensions: dimensions,
                 Unit: 'Count',
                 Value: 1,
              },
            ],
            Namespace: namespace,
          }];
        sut.addRequestCountMetric(serviceName);
        expect(sut.buffer.buffer[namespace]).toEqual(expectedMetrics);
    });
});

describe('addServiceMethodCountMetric', () => {
    test('addServiceMethodCountMetric', () => {
        const org = 'test';
        const serviceName = 'TestService';
        const metricName = 'TestMetric';
        const environment = 'development';
        const method = 'GET';
        const sut = new ServiceMetricsEmitter(0, false, org, environment, createCloudWatch());
        const namespace = `${org}/Services/${serviceName}`;
        const dimensions = [
            { Name: 'Method', Value: method },
            { Name: 'Environment', Value: environment },
        ];
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: metricName,
                Dimensions: dimensions,
                 Unit: 'Count',
                 Value: 1,
              },
            ],
            Namespace: namespace,
          }];
        sut.addServiceMethodCountMetric(serviceName, method, metricName);
        expect(sut.buffer.buffer[namespace]).toEqual(expectedMetrics);
    });
});

describe('addServiceResponseSizeMetric', () => {
    test('addServiceResponseSizeMetric', () => {
        const org = 'test';
        const serviceName = 'TestService';
        const responseSize = 50;
        const environment = 'development';
        const method = 'GET';
        const sut = new ServiceMetricsEmitter(0, false, org, environment, createCloudWatch());
        const namespace = `${org}/Services/${serviceName}`;
        const dimensions = [
            { Name: 'Method', Value: method },
            { Name: 'Environment', Value: environment },
        ];
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: ServiceMetricNames.RESPONSE_SIZE,
                Dimensions: dimensions,
                 Unit: 'Bytes',
                 Value: responseSize,
              },
            ],
            Namespace: namespace,
          }];
        sut.addServiceResponseSizeMetric(serviceName, method, responseSize);
        expect(sut.buffer.buffer[namespace]).toEqual(expectedMetrics);
    });
});

describe('addServiceResponseTimeMetric', () => {
    test('addServiceResponseTimeMetric', () => {
        const org = 'test';
        const serviceName = 'TestService';
        const responseTime = 500;
        const environment = 'development';
        const method = 'GET';
        const sut = new ServiceMetricsEmitter(0, false, org, environment, createCloudWatch());
        const namespace = `${org}/Services/${serviceName}`;
        const dimensions = [
            { Name: 'Method', Value: method },
            { Name: 'Environment', Value: environment },
        ];
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: ServiceMetricNames.RESPONSE_TIME,
                Dimensions: dimensions,
                 Unit: 'Milliseconds',
                 Value: responseTime,
              },
            ],
            Namespace: namespace,
          }];
        sut.addServiceResponseTimeMetric(serviceName, method, responseTime);
        expect(sut.buffer.buffer[namespace]).toEqual(expectedMetrics);
    });
});

function createCloudWatch(errors) {
    jest.mock('aws-sdk');
    const CloudWatch = require('aws-sdk').CloudWatch;
    const putMetricDataMock = jest.fn();
    putMetricDataMock.callCount = 0;
    putMetricDataMock.mockImplementation((input, callback) => {
        putMetricDataMock.callCount += 1;
        if (errors) {
            callback('error', 'data');
        } else {
            callback(undefined, 'data');
        }
    });
    CloudWatch.mockImplementation(() => {
        return {
            putMetricData: putMetricDataMock,
        };
    });
    return new CloudWatch();
}

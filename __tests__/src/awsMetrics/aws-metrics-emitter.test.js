const winston = require('winston');
const AwsMetricsEmitter = require('../../../src/aws-metrics/aws-metrics-emitter');

describe('constructor', () => {
    test('buffer empty at start', () => {
        const awsMetricsEmitter = createAwsMetricsEmitter(0);
        expect(awsMetricsEmitter.buffer).toEqual({ buffer: {} });
    });
    test('last emit null at start', () => {
        const awsMetricsEmitter = createAwsMetricsEmitter(0);
        expect(awsMetricsEmitter.lastEmit).toEqual(null);
    });
    test('batch delay set', () => {
        const awsMetricsEmitter = createAwsMetricsEmitter(10);
        expect(awsMetricsEmitter.batchDelay).toEqual(10);
    });
});

describe('stop', () => {
    test('stop disabled', () => {
        const awsMetricsEmitter = createAwsMetricsEmitter(0);
        awsMetricsEmitter.enabled = true;
        awsMetricsEmitter.stop();
        expect(awsMetricsEmitter.enabled).toBe(false);
    });
});

describe('emitBuffer', () => {
    test('emits all namespaces and clears buffer', (done) => {
        const awsMetricsEmitter = createAwsMetricsEmitter(0);
        awsMetricsEmitter.buffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Count', 1, true);
        awsMetricsEmitter.buffer.addMetricDatum('TestNamespace2', 'TestMetric', null, 'Count', 1, true);
        awsMetricsEmitter.emitBuffer().then(() => {
            expect(awsMetricsEmitter.cloudWatch.putMetricData.callCount).toBe(2);
            expect(awsMetricsEmitter.buffer.TestNamespace2).toBeUndefined();
            expect(awsMetricsEmitter.buffer.TestNamespace1).toBeUndefined();
            done();
        });
    });
});

function createAwsMetricsEmitter(delay) {
    const cloudWatch = createCloudWatch(false);
    const logger = winston.createLogger();
    const awsMetricsEmitter = new AwsMetricsEmitter(delay, false, cloudWatch, logger);
    return awsMetricsEmitter;
}

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

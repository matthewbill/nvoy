const AwsMetricDatum = require('../../../src/aws-metrics/aws-metric-datum');

describe('constructor', () => {
    test('sets properties correctly', () => {
        const metricName = 'testName';
        const dimensions = [
            { Name: 'Method', Value: 'GET' },
            { Name: 'Environment', Value: 'Development' },
        ];
        const unit = 'Count';
        const value = 1;
        const sut = new AwsMetricDatum(metricName, dimensions, unit, value);
        expect(sut.MetricName).toBe(metricName);
        expect(sut.Unit).toBe(unit);
        expect(sut.Value).toBe(value);
        expect(sut.Dimensions).toEqual(dimensions);
    });
});
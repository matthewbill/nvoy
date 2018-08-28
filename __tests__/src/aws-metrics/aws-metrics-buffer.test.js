const AwsMetricsBuffer = require('../../../src/aws-metrics/aws-metrics-buffer');

describe('clearBuffer', () => {
    test('clears buffer', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Count', 1, true);
        awsMetricsBuffer.clearBuffer();
        expect(awsMetricsBuffer.buffer).toEqual({});
    });
});

describe('addMetricDatum', () => {
    test('one metric, one namespace', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Count', 1, true);
        
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: 'TestMetric',
                Unit: 'Count',
                Value: 1,
              },
            ],
            Namespace: 'TestNamespace',
          }];
        expect(awsMetricsBuffer.buffer.TestNamespace).toEqual(expectedMetrics);
    });
    test('two metrics, one namespace', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Count', 1, true);
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: 'TestMetric',
                StatisticValues: {
                    Maximum: 1,
                    Minimum: 1,
                    SampleCount: 2,
                    Sum: 2,
                },
                Unit: 'Count',
              },
            ],
            Namespace: 'TestNamespace',
          }];
        expect(awsMetricsBuffer.buffer.TestNamespace).toEqual(expectedMetrics);
    });
    test('three metrics, one namespace', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Bits', 50, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Bits', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Bits', 75, true);
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: 'TestMetric',
                StatisticValues: {
                    Maximum: 75,
                    Minimum: 1,
                    SampleCount: 3,
                    Sum: 126,
                },
                Unit: 'Bits',
              },
            ],
            Namespace: 'TestNamespace',
          }];
        expect(awsMetricsBuffer.buffer.TestNamespace).toEqual(expectedMetrics);
    });
    test('three metrics, two namespaces', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace2', 'TestMetric2', null, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace2', 'TestMetric2', null, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace2', 'TestMetric2', null, 'Count', 1, true);
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: 'TestMetric',
                StatisticValues: {
                    Maximum: 1,
                    Minimum: 1,
                    SampleCount: 3,
                    Sum: 3,
                },
                Unit: 'Count',
              },
            ],
            Namespace: 'TestNamespace',
        }];
        const expectedMetrics2 = [{
            MetricData: [
              {
                MetricName: 'TestMetric2',
                StatisticValues: {
                    Maximum: 1,
                    Minimum: 1,
                    SampleCount: 3,
                    Sum: 3,
                },
                Unit: 'Count',
              },
            ],
            Namespace: 'TestNamespace2',
        }];
        expect(awsMetricsBuffer.buffer.TestNamespace).toEqual(expectedMetrics);
        expect(awsMetricsBuffer.buffer.TestNamespace2).toEqual(expectedMetrics2);
    });
    test('one metric, one namespace with dimension', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        const dimensions = [
            {
                Name: 'MyName',
                Value: 'MyValue',
            },
        ];
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', dimensions, 'Count', 1, true);
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: 'TestMetric',
                Dimensions: dimensions,
                Unit: 'Count',
                Value: 1,
              },
            ],
            Namespace: 'TestNamespace',
          }];
        expect(awsMetricsBuffer.buffer.TestNamespace).toEqual(expectedMetrics);
    });

    test('two metric, one namespace with same dimension', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        const dimensions = [
            {
                Name: 'MyName',
                Value: 'MyValue',
            },
        ];
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', dimensions, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', dimensions, 'Count', 1, true);
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: 'TestMetric',
                Dimensions: dimensions,
                StatisticValues: {
                    Maximum: 1,
                    Minimum: 1,
                    SampleCount: 2,
                    Sum: 2,
                },
                Unit: 'Count',
              },
            ],
            Namespace: 'TestNamespace',
        }];
        expect(awsMetricsBuffer.buffer.TestNamespace).toEqual(expectedMetrics);
    });

    test('two metrics, one namespace with different dimensions creates two metric datums', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        const dimensions = [
            {
                Name: 'MyName',
                Value: 'MyValue',
            },
        ];
        const dimensions2 = [
            {
                Name: 'MyName2',
                Value: 'MyValue2',
            },
        ];
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', dimensions, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', dimensions2, 'Count', 1, true);
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: 'TestMetric',
                Dimensions: dimensions,
                Unit: 'Count',
                Value: 1,
              },
              {
                MetricName: 'TestMetric',
                Dimensions: dimensions2,
                Unit: 'Count',
                Value: 1,
              },
            ],
            Namespace: 'TestNamespace',
        }];
        expect(awsMetricsBuffer.buffer.TestNamespace).toEqual(expectedMetrics);
    });

    test('two different metrics, one namespace', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric2', null, 'Count', 1, true);
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: 'TestMetric',
                Unit: 'Count',
                Value: 1,
              },
              {
                MetricName: 'TestMetric2',
                Unit: 'Count',
                Value: 1,
              },
            ],
            Namespace: 'TestNamespace',
        }];
        expect(awsMetricsBuffer.buffer.TestNamespace).toEqual(expectedMetrics);
    });

    test('two different metrics for two different namespaces', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric', null, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace', 'TestMetric2', null, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace2', 'TestMetric', null, 'Count', 1, true);
        awsMetricsBuffer.addMetricDatum('TestNamespace2', 'TestMetric2', null, 'Count', 1, true);
        const expectedMetrics = [{
            MetricData: [
              {
                MetricName: 'TestMetric',
                Unit: 'Count',
                Value: 1,
              },
              {
                MetricName: 'TestMetric2',
                Unit: 'Count',
                Value: 1,
              },
            ],
            Namespace: 'TestNamespace',
        }];
        const expectedMetrics2 = [{
            MetricData: [
              {
                MetricName: 'TestMetric',
                Unit: 'Count',
                Value: 1,
              },
              {
                MetricName: 'TestMetric2',
                Unit: 'Count',
                Value: 1,
              },
            ],
            Namespace: 'TestNamespace2',
        }];
        expect(awsMetricsBuffer.buffer.TestNamespace).toEqual(expectedMetrics);
        expect(awsMetricsBuffer.buffer.TestNamespace2).toEqual(expectedMetrics2);
    });

    test('adding 20 metric datums creates one namespace metrics object', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        const namespace = 'TestNamespace';
        for (let i = 0; i < 20; i++) {
            awsMetricsBuffer.addMetricDatum(namespace, `TestMetric${i}`, null, 'Count', 1, true);
        }
        expect(awsMetricsBuffer.buffer[namespace].length).toEqual(1);
        expect(awsMetricsBuffer.buffer[namespace][0].MetricData.length).toEqual(20);
    });

    test('adding 21 metric datums creates a new namespace metrics object', () => {
        const awsMetricsBuffer = new AwsMetricsBuffer(0, false);
        const namespace = 'TestNamespace';
        for (let i = 0; i < 21; i++) {
            awsMetricsBuffer.addMetricDatum(namespace, `TestMetric${i}`, null, 'Count', 1, true);
        }
        expect(awsMetricsBuffer.buffer[namespace].length).toEqual(2);
        expect(awsMetricsBuffer.buffer[namespace][0].MetricData.length).toEqual(20);
        expect(awsMetricsBuffer.buffer[namespace][1].MetricData.length).toEqual(1);
    });
});

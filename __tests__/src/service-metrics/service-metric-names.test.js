const ServiceMetricNames = require('../../../src/service-metrics/service-metric-names.js');

describe('get methods', () => {
    test('get methods', () => {
        const requests = ServiceMetricNames.REQUESTS;
        expect(requests).toBeDefined();
        const internalServiceException = ServiceMetricNames.INTERNAL_SERVER_EXCEPTION_RESPONSES;
        expect(internalServiceException).toBeDefined();
        const badRequest = ServiceMetricNames.BAD_REQUEST_RESPONSES;
        expect(badRequest).toBeDefined();
        const unauthorized = ServiceMetricNames.UNAUTHORIZED_RESPONSES;
        expect(unauthorized).toBeDefined();
        const notFound = ServiceMetricNames.NOT_FOUND_RESPONSES;
        expect(notFound).toBeDefined();
        const forbidden = ServiceMetricNames.FORBIDDEN_RESPONSES;
        expect(forbidden).toBeDefined();
        const ok = ServiceMetricNames.OK_RESPONSES;
        expect(ok).toBeDefined();
        const created = ServiceMetricNames.CREATED_RESPONSES;
        expect(created).toBeDefined();
        const noContent = ServiceMetricNames.NO_CONTENT_RESPONSES;
        expect(noContent).toBeDefined();
        const responseTime = ServiceMetricNames.RESPONSE_TIME;
        expect(responseTime).toBeDefined();
        const responseSize = ServiceMetricNames.RESPONSE_SIZE;
        expect(responseSize).toBeDefined();
    })
})
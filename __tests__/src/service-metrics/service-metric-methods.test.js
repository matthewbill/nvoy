const ServiceMeticMethods = require('../../../src/service-metrics/service-metric-methods.js');

describe('get methods', () => {
    test('get methods', () => {
        const get = ServiceMeticMethods.GET;
        expect(get).toBeDefined();
        const post = ServiceMeticMethods.POST;
        expect(post).toBeDefined();
        const put = ServiceMeticMethods.PUT;
        expect(put).toBeDefined();
        const del = ServiceMeticMethods.DELETE;
        expect(del).toBeDefined();
        const getItem = ServiceMeticMethods.GET_ITEM;
        expect(getItem).toBeDefined;
        const getItemResource = ServiceMeticMethods.GET_ITEM_RESOURCE;
        expect(getItemResource).toBeDefined();
    })
});
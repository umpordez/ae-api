require('../test-helper');

const assert = require('assert');
const AeClient = require('../../ae-api');

describe('Aliexpress Client', () => {
    const {
        TEST_TOKEN,
        TEST_APP_KEY,
        TEST_APP_SECRET,
        TEST_CODE,
        TEST_REFRESH_TOKEN
    } = process.env;

    const appKey = '123456';
    const appSecret = 'helloworld';

    it('Test authorize URL' , () => {
        const client = new AeClient('dev', appKey, appSecret);
        const url = client.getAuthorizeUrl(
            'https://api.fornece.club/webhook/aliexpress'
        );

        assert.strictEqual(
            url,
            // eslint-disable-next-line max-len
            'https://api-sg.aliexpress.com/oauth/authorize?response_type=code&force_auth=true&redirect_uri=https%3A%2F%2Fapi.fornece.club%2Fwebhook%2Faliexpress&client_id=123456'
        );
    });

    it('Test get signature', () => {
        const client = new AeClient('dev', appKey, appSecret);
        const signature1 = client.getSignatureByParams(
            '',
            {
                access_token: 'test',
                app_key: '123456',
                timestamp: '1517820392000',
                sign_method: 'sha256',
                aliexpress_category_id: '200135143',
                method: 'aliexpress.logistics.redefining.getonlinelogisticsinfo',
            }
        );

        assert.strictEqual(
            signature1,
            'F7F7926B67316C9D1E8E15F7E66940ED3059B1638C497D77973F30046EFB5BBB'
        );

        const signature2 = client.getSignatureByParams(
            '/auth/token/create',
            {
                app_key: '12345678',
                code: '3_500102_JxZ05Ux3cnnSSUm6dCxYg6Q26',
                timestamp: '1517820392000',
                sign_method: 'sha256'
            }
        );

        assert.strictEqual(
            signature2,
            '35607762342831B6A417A0DED84B79C05FEFBF116969C48AD6DC00279A9F4D81'

        );
    });

    it.skip('Generate access token', async () => {
        const client = new AeClient('dev', TEST_APP_KEY, TEST_APP_SECRET);
        const token = await client.getAcessTokenByCode(TEST_CODE);

        /*
            {
                refresh_token_valid_time: 1704531678000,
                havana_id: '',
                expire_time: 1704445278000,
                locale: 'zh_CN',
                user_nick: 'br1043680154',
                access_token: '',
                refresh_token: '',
                user_id: '163688471',
                account_platform: 'buyerApp',
                refresh_expires_in: 172800,
                expires_in: 86400,
                sp: 'ae',
                seller_id: '',
                account: '',
                code: '0',
                request_id: ''
            }
        */

        assert(token);
    });

    it.skip('Generate a new token by refresh token', async () => {
        const client = new AeClient('dev', TEST_APP_KEY, TEST_APP_SECRET);
        const token = await client.getAccessTokenByRefreshToken(
            TEST_REFRESH_TOKEN
        );

        assert(token);
    });

    it('getProduct', async () => {
        const client = new AeClient(
            'dev',
            TEST_APP_KEY,
            TEST_APP_SECRET,
            TEST_TOKEN
        );

        client.defaultLanguage = 'pt';
        client.defaultShipCountry = 'BR';
        client.defaultCurrency = 'BRL';

        const response = await client.doAuthenticateRequest(
            'aliexpress.ds.product.get',
            { product_id: '1005006057059635' }
        );

        assert(response);
        const res = response.aliexpress_ds_product_get_response;

        assert(res.rsp_msg === 'Call succeeds');
        assert(res.rsp_code === 200);
    });
});

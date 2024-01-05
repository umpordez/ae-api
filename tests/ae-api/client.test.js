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
                user_nick: '',
                access_token: '',
                refresh_token: '',
                user_id: '',
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


    it.skip('getProduct', async () => {
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

		/* eslint-disable max-len */
		//   {
		//   	"result": {
		//   		"ae_item_sku_info_dtos": {
		//   			"ae_item_sku_info_d_t_o": [
		//   				{
		//   					"offer_sale_price": "54.69",
		//   					"ipm_sku_stock": 492,
		//   					"sku_stock": true,
		//   					"sku_id": "12000035530517031",
		//   					"currency_code": "BRL",
		//   					"sku_price": "71.02",
		//   					"offer_bulk_sale_price": "54.69",
		//   					"sku_available_stock": 492,
		//   					"id": "14:200006151#400ml",
		//   					"sku_code": "LA60234889A1",
		//   					"ae_sku_property_dtos": {
		//   						"ae_sku_property_d_t_o": [
		//   							{
		//   								"sku_property_value": "Light Grey",
		//   								"sku_image": "https://ae01.alicdn.com/kf/S97a9922754d14e70819efa44c16862baH.jpg",
		//   								"sku_property_name": "Color",
		//   								"property_value_definition_name": "400ml",
		//   								"property_value_id": 200006151,
		//   								"sku_property_id": 14
		//   							}
		//   						]
		//   					}
		//   				}
		//   			]
		//   		},
		//   		"ae_multimedia_info_dto": {
		//   			"image_urls": "https://ae01.alicdn.com/kf/S10aaab919e484b0591ea56cee0dedf3ak.jpg;https://ae01.alicdn.com/kf/Sd6b5ce0098204e9995c1ae1440697d80g.jpg;https://ae01.alicdn.com/kf/Sa38f9ab1dd6245b898d31fb3626d0dafP.jpg;https://ae01.alicdn.com/kf/Sbb0ebdf6338a42e0a8d0ba3f74910e8fz.jpg;https://ae01.alicdn.com/kf/S0dacf61af058405d83300d623772b8606.jpg;https://ae01.alicdn.com/kf/S80ad107790564e1dbdb627952e5445a0R.jpg"
		//   		},
		//   		"package_info_dto": {
		//   			"package_width": 15,
		//   			"package_height": 28,
		//   			"package_length": 18,
		//   			"gross_weight": "0.900",
		//   			"package_type": false,
		//   			"product_unit": 100000015
		//   		},
		//   		"logistics_info_dto": {
		//   			"delivery_time": 7,
		//   			"ship_to_country": "BR"
		//   		},
		//   		"product_id_converter_result": {
		//   			"main_product_id": 1005006057059635,
		//   			"sub_product_id": "{\"US\":3256805870744883}"
		//   		},
		//   		"ae_item_base_info_dto": {
		//   			"gmt_create": "2023-09-19 15:20:13",
		//   			"subject": "Portátil USB Mini Espremedor Elétrico, Misturador De Frutas, Liquidificador Recarregável, Fruta, Fabricante De Suco Fresco, Copo De Limão, Máquina Doméstica",
		//   			"evaluation_count": "1",
		//   			"sales_count": "7",
		//   			"product_status_type": "onSelling",
		//   			"avg_evaluation_rating": "1.0",
		//   			"gmt_modified": "2024-01-03 03:06:52",
		//   			"currency_code": "CNY",
		//   			"owner_member_seq_long": 2675378076,
		//   			"category_id": 200301151,
		//   			"product_id": 1005006057059635,
		//   			"detail": "<div class=\"detailmodule_html\"><div class=\"detail-desc-decorate-richtext\"><p><br /></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_1\">Especifica&ccedil;&atilde;o:</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_2\">Materiais: ABS + COMO</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_3\">Tamanho: 13,8*11,2*23,75 cm/5,4*4,4 * 9in</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_4\">Energia: 45W</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_5\">Tens&atilde;o: 7.4V</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_6\">Carregamento: carregamento USB</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_7\">Peso: 1100g</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_8\">Materiais: ABS/COMO</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_9\">Fun&ccedil;&atilde;o: Totalmente autom&aacute;tico</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_10\">Capacidade: ≤ 400ml</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_11\">Rendimento m&aacute;ximo do suco ao mesmo tempo: ≤ 400ml</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_12\">Tipo do cortador: Cortador dobro</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_13\">Capacidade caixa res&iacute;duo polpa: ≤ 500ml</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_14\">Velocidade: 18000 rpm</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_15\">Use: Suco De Laranja, suco De Rom&atilde;, suco De Ma&ccedil;&atilde;, suco De Uva, suco De Melancia</span></p> \n<p><br /></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_16\">Nota:</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_17\">Devido ao monitor diferente e efeito de luz, a cor real do item pode ser ligeiramente diferente da cor mostrada nas fotos. -Obrigado!</span></p> \n<p><br /></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_18\">Por favor aguarde 1-2cm medi&ccedil;&atilde;o desvio devido &agrave; medi&ccedil;&atilde;o manual.</span></p> \n<p><br /></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_19\">Pacakge inclui:</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_20\">1 x Mini Fruit Mixer</span></p> \n<p><span style=\"background-color:rgb(255, 255, 255);color:rgb(0, 0, 0)\" id=\"tl_21\">1 x cabo USB</span></p> \n<p><br /></p> \n<p><br /></p> \n<p><img src=\"https://ae01.alicdn.com/kf/Sa38f9ab1dd6245b898d31fb3626d0dafP.jpg\" slate-data-type=\"image\" /><img src=\"https://ae01.alicdn.com/kf/Sbb0ebdf6338a42e0a8d0ba3f74910e8fz.jpg\" slate-data-type=\"image\" /><img src=\"https://ae01.alicdn.com/kf/S1119572c39c54106ac63960855aa1620A.jpg\" slate-data-type=\"image\" /><img src=\"https://ae01.alicdn.com/kf/S0dacf61af058405d83300d623772b8606.jpg\" slate-data-type=\"image\" /><img src=\"https://ae01.alicdn.com/kf/S3d43c09827494fd79ab91ab098fb653aN.jpg\" slate-data-type=\"image\" /><img src=\"https://ae01.alicdn.com/kf/Sd6b5ce0098204e9995c1ae1440697d80g.jpg\" slate-data-type=\"image\" /><img src=\"https://ae01.alicdn.com/kf/Sd8d8e245661b4087a72006fb118605ef4.jpg\" slate-data-type=\"image\" /></p> \n<p><br /></p></div></div>\r\n"
		//   		},
		//   		"ae_item_properties": {
		//   			"ae_item_property": [
		//   				{
		//   					"attr_name_id": 2,
		//   					"attr_value_id": 9275262276,
		//   					"attr_name": "Brand Name",
		//   					"attr_value": "isfriday"
		//   				},
		//   				{
		//   					"attr_name_id": 219,
		//   					"attr_value_id": 9441741844,
		//   					"attr_name": "Origin",
		//   					"attr_value": "Mainland China"
		//   				},
		//   				{
		//   					"attr_name_id": 10,
		//   					"attr_value_id": 351785,
		//   					"attr_name": "Material",
		//   					"attr_value": "ABS"
		//   				},
		//   				{
		//   					"attr_name_id": 3,
		//   					"attr_value_id": -1,
		//   					"attr_name": "Model Number",
		//   					"attr_value": "Mini Electric Juicer"
		//   				},
		//   				{
		//   					"attr_name_id": 326,
		//   					"attr_value_id": 202965839,
		//   					"attr_name": "Style",
		//   					"attr_value": "Vertical"
		//   				}
		//   			]
		//   		},
		//   		"ae_store_info": {
		//   			"store_id": 1102923213,
		//   			"shipping_speed_rating": "4.3",
		//   			"communication_rating": "4.1",
		//   			"store_name": "Isfriday CH Store",
		//   			"store_country_code": "CN",
		//   			"item_as_described_rating": "4.0"
		//   		}
		//   	},
		//   	"rsp_code": 200,
		//   	"rsp_msg": "Call succeeds",
		//   	"request_id": "2140fa3517044610955631799"
		//   }
		/* eslint-enable max-len */

        assert(res.rsp_msg === 'Call succeeds');
        assert(res.rsp_code === 200);
    });
});

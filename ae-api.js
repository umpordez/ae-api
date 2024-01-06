const axios = require('axios');
const querystring = require('querystring');
const V = require('argument-validator');

const crypto = require('crypto');

// https://www.yuque.com/richardyanhao-mekyj/cm0dv1/kuprl9yt3ggokqem

const configByEnv = {
    dev: {
        apiBaseUrl: 'https://api-sg.aliexpress.com',
        authorizeBaseUrl: 'https://api-sg.aliexpress.com/oauth/authorize'
    },

    prod: {
        apiBaseUrl: 'https://api-sg.aliexpress.com',
        authorizeBaseUrl: 'https://api-sg.aliexpress.com/oauth/authorize'
    }
};

function getHmacsha256Hex(secret, text) {
    return crypto.createHmac('sha256', secret).update(text).digest('hex');
}

// eslint-disable-next-line max-len
// https://open.aliexpress.com/doc/doc.htm?spm=a2o9m.11193531.0.0.41524bd639wEKx&nodeId=27493&docId=118729#/?docId=742

function getSignatureByParams(appSecret, pathname, params) {
    const parts = [ pathname ];
    const keys = Object.keys(params);

    keys.sort((a, b) => a.localeCompare(b));

    for (const key of keys) {
        parts.push(`${key}${params[key]}`);
    }

    const str = parts.join('');

    return getHmacsha256Hex(appSecret, str).toUpperCase();
}

function isObject(value) {
    return value && Object.prototype.toString.call(value) === '[object Object]';
}


class AliexpressClient {
    constructor(env, appKey, appSecret, accessToken) {
        V.string(env, 'token');
        V.string(appKey, 'appKey');
        V.string(appSecret, 'appSecret');

        this.env = env;
        this.appKey = appKey;
        this.appSecret = appSecret;
        this.accessToken = accessToken;

        this.config = configByEnv[env];

        this.lastRequests = [];
        this.lastResponses = [];
    }

    getSignatureByParams(pathname, body) {
        return getSignatureByParams(
            this.appSecret,
            pathname !== '/sync' ? pathname : '',
            body
        );
    }

    async doRequest(pathname, body = {}) {
        V.string(pathname, 'pathname');

        const headers = {
            'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
        };

        let url = this.config.apiBaseUrl;

        if (pathname.startsWith('/auth')) {
            url += `/rest`;
        }

        url += pathname;

        body.app_key = body.app_key || this.appKey;
        body.sign_method = body.sign_method || 'sha256';
        body.timestamp = body.timestamp || new Date().getTime();

        body.target_language = this.defaultLanguage;
        body.ship_to_country = this.defaultShipCountry;
        body.target_currency = this.defaultCurrency;

        for (const key in body) {
            if (body[key] === undefined) {
                delete body[key];
            }

            if (isObject(body[key])) {
                body[key] = JSON.stringify(body[key]);
            }
        }

        const signature = this.getSignatureByParams(pathname, body);

        const data = querystring.stringify({
            ...body,
            sign: signature
        });

        const options = { url, data, method: 'POST', headers };

        this.lastRequest = { ...options, ...body };
        this.lastRequests.push({ ...this.lastRequest });

        let response;
        const { stack } = new Error();

        try {
            const res = await axios(options);

            this.lastResponse = { body: res.data, headers: res.headers };
            this.lastResponses.push(this.lastResponse);

            response = res.data;

            if (response.error_response) {
                response = response.error_response;
                response.message = response.message || response.msg;
            }

            if (response.code && response.message && response.request_id) {
                const err = new Error(`${response.code} - ${response.message}`);

                err.code = response.code;
                err.type = response.type;
                err.request_id = response.request_id;
                err.rawResponse = response;

                throw err;
            }
        } catch (ex) {
            ex.response = ex.response || ex.res;
            this.lastResponse = { error: ex.message };

            if (ex.response) {
                const { response } = ex;

                this.lastResponse = {
                    body: response.data,
                    headers: response.headers
                };

                if (response.data && response.data.error_message) {
                    ex.message = response.data.error_message;
                } else if (response.data) {
                    ex.message += `\n${response.data}`;
                }
            }

            this.lastResponses.push({ ...this.lastResponse });

            ex.stack = stack;
            throw ex;
        }

        return response;
    }

    doAuthenticateRequest(method, body = {}) {
        body.method = method;
        body.access_token = this.accessToken;

        V.string(body.access_token, 'access_token');
        V.string(body.method, 'method');

        return this.doRequest('/sync', body);
    }

    getAcessTokenByCode(code) {
        V.string(code, 'code');

        return this.doRequest('/auth/token/create', { code });
    }

    getAccessTokenByRefreshToken(refreshToken) {
        V.string(refreshToken, 'refreshToken');

        return this.doRequest('/auth/token/refresh', {
            refresh_token: refreshToken
        });
    }

    getAuthorizeUrl(redirectUri) {
        return `${this.config.apiBaseUrl}/oauth/authorize?${querystring
            .stringify({
                response_type: 'code',
                force_auth: true,
                redirect_uri: redirectUri,
                client_id: this.appKey
            })}`;
    }
}

module.exports = AliexpressClient;

ae-api
====

The simplest module to make requests to Aliexpress API you'll ever find!

This is *just* a module to sign the requests, generate the authorization URL and keep a
sanity in the `.lastRequest`/`.lastResponse`.

We don't do any normalization or store the token/app key, it's all up to you.


You can use this to get the authorization code as following:

```javascript
const AeClient = require('ae-api');

const YOUR_APP_KEY = '';
const YOUR_APP_SECRET = '';

const authorizationCallbackUrl = 'https://myurl.com';

const client = new AeClient('prod', YOUR_APP_KEY, YOUR_APP_SECRET);
const url = client.getAuthorizeUrl(authorizationCallbackUrl);

console.log(url); // https://api-sg.aliexpress.com/oauth/authorize?response...
```

After you get the aliexpress account code, you can request the access token by this:

```javascript
const client = new AeClient('prod', YOUR_APP_KEY, YOUR_APP_SECRET);
const token = await client.getAcessTokenByCode(CODE_RECEIVED_IN_CALLBACK_URL);

console.log(token);

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
```

After that, you can make requests to the API:

```javascript
const client = new AeClient(
    'prod',
    YOUR_APP_KEY,
    YOUR_APP_SECRET,
    ALIEXPRESS_ACCOUNT_ACCESS_TOKEN
);

const response = await client.doAuthenticateRequest(
    'aliexpress.ds.product.get', // api method
    { product_id: '1005006057059635' } // other params
);

console.log(response);
```

When you need to refresh the access token, you can get a new one with this:
```javascript

const client = new AeClient('prod', YOUR_APP_KEY, YOUR_APP_SECRET);
const token = await client.getAccessTokenByRefreshToken(
    ALIEXPRESS_ACCOUNT_REFRESH_TOKEN
);

console.log(token);
```

Also, you can always get the last request body and response by:
```javascript
const client = new AeClient(
    'prod',
    YOUR_APP_KEY,
    YOUR_APP_SECRET,
    ALIEXPRESS_ACCOUNT_ACCESS_TOKEN
);

try {
    const response = await client.doAuthenticateRequest(
        'aliexpress.ds.product.get', // api method
        { product_id: '1005006057059635' } // other params
    );

    console.log(response);
} catch (ex) {
    console.error(ex);
}

console.log(client.lastRequest);
console.log(client.lastResponse);

```

Have fun! \o/

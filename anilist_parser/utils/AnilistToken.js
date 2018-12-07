"use strict";
var _this = this;
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = require("axios");
exports.apiURL = 'https://anilist.co/api/';
var isTokenExpired = function () {
    return _this.tokenExpirationTime <= Math.floor(Date.now() / 1000);
};
var authenticate = function () {
    var authData = {
        grant_type: 'client_credentials',
        client_id: _this.client_id,
        client_secret: _this.client_secret
    };
    return axios_1.default.post(exports.apiURL + "auth/access_token", authData)
        .then(function (response) {
        var token = response.data.access_token;
        var tokenExpirationTime = response.data.expires;
        return { token: token, tokenExpirationTime: tokenExpirationTime };
    })
        .catch(function (err) {
        throw new Error(err);
    });
};
var authPromises;
var getAuth = function () {
    if (!authPromises) {
        authPromises = authenticate();
    }
    return authPromises.then(function (res) {
        _this.token = res.token;
        _this.tokenExpirationTime = res.tokenExpirationTime;
        authPromises = null;
        return _this.token;
    }).catch(function (err) {
        authPromises = null;
        throw new Error(err);
    });
};
exports.init = function (client_id, client_secret) {
    _this.client_id = client_id;
    _this.client_secret = client_secret;
    _this.tokenExpirationTime = 0;
    getAuth().catch(function (err) {
        console.error(err.message);
    });
};
exports.getToken = function () {
    if (isTokenExpired()) {
        return getAuth();
    }
    else {
        return Promise.resolve(_this.token);
    }
};
//# sourceMappingURL=AnilistToken.js.map
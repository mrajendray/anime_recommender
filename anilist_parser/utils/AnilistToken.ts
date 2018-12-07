import axios from "axios";

export const apiURL = 'https://anilist.co/api/';
const isTokenExpired = () => {
    return this.tokenExpirationTime <= Math.floor(Date.now() / 1000);
};

const authenticate = () => {
    const authData = {
        grant_type: 'client_credentials',
        client_id: this.client_id,
        client_secret: this.client_secret
    };
    return axios.post(`${apiURL}auth/access_token`, authData)
        .then(response => {
            let token = response.data.access_token;
            let tokenExpirationTime = response.data.expires;

            return { token, tokenExpirationTime };
        })
        .catch(err => {
            throw new Error(err);
        });
};
let authPromises;
const getAuth = () => {
    if (!authPromises) {
        authPromises = authenticate();
    }
    return authPromises.then(res => {
        this.token = res.token;
        this.tokenExpirationTime = res.tokenExpirationTime;

        authPromises = null;

        return this.token;
    }).catch(err => {
        authPromises = null;
        throw new Error(err);
    });
};

export const init = (client_id, client_secret) => {
    this.client_id = client_id;
    this.client_secret = client_secret;

    this.tokenExpirationTime = 0;

    getAuth().catch(err => {
        console.error(err.message);
    });
};

export const getToken = () => {
    if (isTokenExpired()) {
        return getAuth();
    } else {
        return Promise.resolve(this.token);
    }
};
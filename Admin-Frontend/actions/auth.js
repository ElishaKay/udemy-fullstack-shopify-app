import fetch from 'isomorphic-fetch';
import cookie from 'js-cookie';
import { API } from '../config';
import Router from 'next/router';

import { parseCookies } from 'nookies'
import { tryParse } from '../utils/error'

export const verifiedShop = () => {
    let onLoginEndpoint;

    if (isAuth() && isAuth().role === 1) {
        createBlogEndpoint = `${API}/blog`;
    } else if (isAuth() && isAuth().role === 0) {
        createBlogEndpoint = `${API}/user/blog`;
    }

    return fetch(`${onLoginEndpoint}`, {
        method: 'GET'
    })
        .then(response => {
            handleResponse(response);
            return response.json();
        })
        .catch(err => console.log(err));
};

export const handleResponse = response => {
    if (response.status === 401) {
        signout(() => {
            Router.push({
                pathname: '/signin',
                query: {
                    message: 'Your session is expired. Please signin'
                }
            });
        });
    }
};

// set cookie
export const setCookie = (key, value) => {
    if (process.browser) {
        cookie.set(key, value, {
            expires: 1
        });
    }
};

export const removeCookie = key => {
    if (process.browser) {
        cookie.remove(key, {
            expires: 1
        });
    }
};
// get cookie
export const getCookie = key => {
    if (process.browser) {
        return cookie.get(key);
    }
};
// localstorage
export const setLocalStorage = (key, value) => {
    if (process.browser) {
        localStorage.setItem(key, JSON.stringify(value));
    }
};

export const removeLocalStorage = key => {
    if (process.browser) {
        localStorage.removeItem(key);
    }
};
// autheticate user by pass data to cookie and localstorage
export const authenticate = (data, next) => {
    setCookie('token', data.token);
    setLocalStorage('user', data.user);
    next();
};

export const isAuth = () => {
    if (process.browser) {
       console.log('ran isAuth function')
       return cookie.get('user');
    }
}

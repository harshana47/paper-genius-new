import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, { AxiosResponse } from 'axios';
import { Alert } from 'react-native';
import Config from 'react-native-config';

const BASE_URL = Config.BASE_URL;

const publicInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    },
});

const privateInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 50000,
    headers: {
        'Content-Type': 'application/json',
    },
});


const responseBody = (response: AxiosResponse) => response;

export const publicRequests = {
    get: (url: string) => publicInstance.get(url).then(responseBody),
    post: (url: string, body: any) =>
        publicInstance.post(url, body).then(responseBody),
};

export const privateRequests = {
    get: (url: string, params?: any) =>
        privateInstance.get(url, { params }).then(responseBody),
    post: (url: string, body?: any) =>
        privateInstance.post(url, body).then(responseBody),
    patch: (url: string, body: any) =>
        privateInstance.patch(url, body).then(responseBody),
    put: (url: string, body?: any) =>
        privateInstance.put(url, body).then(responseBody),
    delete: (url: string) => privateInstance.delete(url).then(responseBody),
};

publicInstance.interceptors.request.use(
    (config: any) => {
        return config;
    },
    function (error: any) {
        return Promise.reject(error);
    },
);

publicInstance.interceptors.response.use(
    (response: any) => {
        if (response.data.code < 0) {
            return Promise.reject(response.data.result);
        }

        return response;
    },
    (error: any) => {
        const originalConfig = error.config;
        const errorMsg = error.response;
        console.error('ERROR => ', errorMsg);

        if (error.response.status === 500 && !originalConfig._retry)
            [Alert.alert('Server Error!')];

        return Promise.reject(errorMsg);
    },
);

// Private

privateInstance.interceptors.request.use(
    async (config: any) => {
        const accessToken = await getAccessToken();
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        } else {
            // Handle logout functionality
            return Promise.reject('Unauthorized');
        }
        return config;
    },
    function (error: any) {
        return Promise.reject(error);
    },
);

privateInstance.interceptors.response.use(
    (response: any) => {
        if (response.data.code < 0) {
            return Promise.reject(response.data.result);
        }

        return response;
    },
    async (error: any) => {
        const originalConfig = error.config;
        const errorMsg = error.response;

        if (!error.response) {
            console.log('No response from server - possible network issue.');
            Alert.alert('Network Error!');
        }

        // log out unauthorized token

        if (error.response.status === 401 && !originalConfig._retry) {
            // Implement logic for unauthorized
        }

        if (error.response.status === 500 && !originalConfig._retry)
            [Alert.alert('Server Error!')];

        return Promise.reject(errorMsg);
    },
);


const getAccessToken = async () => {
    const data: any = await AsyncStorage.getItem('UserDetail');
    const accessToken: string = await JSON.parse(data).token;
    if (accessToken) {
        return accessToken;
    } else {
        return null;
    }
};

export default publicInstance;

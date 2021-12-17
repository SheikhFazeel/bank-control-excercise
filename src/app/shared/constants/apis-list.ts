'use strict';
import { AppConfig } from '../../app.config';

const apiConfig = new AppConfig();

export const SERVER_URL: string = apiConfig.config.apiUrl.backendUrl;

// User
export const USER_BASE_URL = `${SERVER_URL}users`;
export const USER_DETAIL = `${USER_BASE_URL}/{id}`;
export const USER_UPDATE = `${USER_BASE_URL}/{id}`;
export const USER_DELETE = `${USER_BASE_URL}/{id}`;
/*
Date: 06/03/2025

Establish the routes used regarding User accounts and authentication. 
*/

import {Router} from 'express';
import {authenticate, register, showRegister, logout, showLogin} from './controller.js';

export const routes = new Router();

routes.get('/login', showLogin);
routes.post('/login', authenticate);
routes.get('/register', showRegister);
routes.post('/register', register);
routes.get('/logout', logout);

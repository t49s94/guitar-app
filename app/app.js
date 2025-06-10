/*
Date: 06/03/2025

JS file that provides setting forNode application used by index.js. Creates node app, establish DB 
connection, sets routes, etc.
*/

import express from 'express';
import {routes as guitarRoutes} from './guitars/routes.js';
import {routes as authRoutes} from './auth/routes.js';
import session from 'express-session';
import {create as createHandlebars} from 'express-handlebars';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import helpers from 'handlebars-helpers';
import { checkAuth } from './auth/controller.js';
import {  storeGuitar, upload, updateGuitar } from './guitars/controller.js';

const app = express();
const hbs = createHandlebars();
dotenv.config();

var math = helpers.comparison();

await mongoose.connect(`mongodb+srv://${process.env.DB_ADMIN}:${process.env.DB_PASSWORD}@clustersantillana.ua6dg85.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSantillana`)

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', './app/views');


app.use(express.static('./public'));
app.use(express.urlencoded({ extended: false }));
app.use(session({
    secret: 'birds fly high asdlkfjlksajdfsdafZXCV234asdf',
    saveUninitialized: false,
    resave: false
}));

app.use((req, res, next) => {
    if (req.session.user && req.session.user.isAuthenticated) {
        res.locals.user = req.session.user;
    }

    next();
});

app.use('/guitars', guitarRoutes);
app.use('/', authRoutes);

app.post('/guitars', checkAuth, upload.single('guitar_image'), storeGuitar);
app.post('/guitars/:id', checkAuth, upload.single('guitar_image'), updateGuitar);
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/sum/:a-:b', (req, res) => {
    res.send(`${parseInt(req.params.a) + parseInt(req.params.b)}`);
});

// / -- Home Page
// /guitars -- index page/list
// /guitars/id -- individual guitar by id

export function start() {
    app.listen(80, () => {
        console.log('Listening at http://localhost');
    });
}

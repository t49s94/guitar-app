/*
Date: 06/03/2025

The file manages user accounts.
*/

import { compare, hash } from './crypt.js';
import {User} from './model.js';


// Get request that redirects the user to Login page.
export const showLogin = (req, res) => res.render('auth/login', {title: 'Login', layout: 'plain'});

// Post request to authenticate users.
export async function authenticate(req, res) {
    const { email, password } = req.body;

    if (!email || !password) {
        res.redirect('/login');
        return;
    }

    // Finds the user given the email provided
    const user = await User.findOne({email: email.toLowerCase()});

    if (!user) {
        res.redirect('/login');
        return;
    }

    if (await compare(password, user.password)) {
        req.session.user = {
            email,
            isAuthenticated: true
        };

        res.redirect('/guitars');
    } else {
        res.redirect('/login');
    }
}

// Get request that redirects user to Register page
export const showRegister = (req, res) => res.render('auth/register', {title: 'Register', layout: 'plain'});

// Post request that registers a new user
export async function register(req, res){
    const { email, password } = req.body;

    if (!email || !password) {
        res.redirect('/register');
        return;
    }

    const hashText = await hash(password);

    await User.create({
        email: email.toLowerCase(),
        password: hashText
    });

    req.session.user = {
        email,
        isAuthenticated: true
    };

    res.redirect('/guitars');
}

// Ensures the user is authenticated
export function checkAuth(req, res, next) {
    let isAuthenticated = req.session.user && req.session.user.isAuthenticated;

    if (isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
}

// Logs out user
export function logout(req, res) {
    req.session.destroy();

    res.redirect('/');
}
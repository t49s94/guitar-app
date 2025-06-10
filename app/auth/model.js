/*
Date: 06/03/2025

Describes the User model
*/

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});

export const User = mongoose.model('User', userSchema);
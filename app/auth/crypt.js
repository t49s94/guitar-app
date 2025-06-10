/*
Date: 06/03/2025

The file manages password encryption and user authentication.
*/

import {genSalt, hash as genHash, compare as compareValue} from 'bcrypt';

// Encrypts password
export const hash = async (plainText) => {
    const salt = await genSalt(12);

    return await genHash(plainText, salt);
}

// Compares passwords to see if they match
export const compare = async (plainText, hash) => {
    return await compareValue(plainText, hash);
}
/*
Date: 06/03/2025

Describes the Guitar model
*/

import mongoose from 'mongoose';

const guitarSchema = new mongoose.Schema({
    make: String,
    model: String,
    image: String,
    make_lower: String
});

const Guitar = mongoose.model('Guitar', guitarSchema);

// Creates a guitar
export async function addGuitar(make, model, image) {
    await Guitar.create({
        make,
        model,
        image,
        make_lower: make.toLowerCase()
    });
}

// Gets all guitars
export async function getAll() {
    return await Guitar.find();
}

// Get guitar by Id
export async function getById(id) {
    return await Guitar.findById(id);
}

// Get guitat by Make
export async function getByMake(make) {
    return await Guitar.find({make_lower: make.toLowerCase()});
}

// Delete a guitar
export async function removeGuitar(id) {
    await Guitar.deleteOne({_id: id});
}


// Update a guitar
export async function saveGuitar(id, make, model, image) {
    const guitar = await getById(id);

    if (guitar) {
        guitar.make = make;
        guitar.model = model;
        guitar.image = image;
        guitar.make_lower = make.toLowerCase();

        guitar.save();
    }
}
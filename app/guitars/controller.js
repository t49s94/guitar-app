/*
Date: 06/03/2025

Guitars Controller. Contains functions to create, read, update and delete guitar objects.
*/

import {addGuitar, getAll, getById, getByMake, removeGuitar, saveGuitar} from './model.js';
import multer from "multer";

// Get request to redirect to Guitar form
export async function createGuitar(req, res) {
    res.render('guitars/form');
}

// Delete guitar by Id
export async function deleteGuitar(req, res) {
    const id = req.params.id;

    if (!isIdValid(id)) {
        res.send(404);
        return;
    }

    await removeGuitar(id);
    res.redirect('/guitars');

}

// Get request to redirect to Guitar Form and update guitar
export async function editGuitar(req, res) {
    const id = req.params.id;

    if (!isIdValid(id)) {
        res.send(404);
        return;
    }

    const guitar = await getById(id);
    
    if (!guitar) {
        res.send(404);
        return;
    }

    res.render('guitars/form', {guitar: convertToObj(guitar)});
}

// Get request to redirect to List page which shows all the guitars in DB
export async function listGuitars(req, res) {
    const guitars = await getAll();
    res.render('guitars/list', {
        guitars: guitars.map(convertToObj),
        title: 'My Guitars',
    });
    
}

// Get request that redirects to Show page which displays a guitar
export async function showGuitar(req, res) {
    const id = req.params.id;

    // Tries to find a guitat by Id or Make
    if (isIdValid(id)) {
        const guitar = await getById(id);

        if (!guitar) {
            res.send(404);
        } else {
            res.render('guitars/show', {
                guitar: convertToObj(guitar),
                title: `Guitar: ${guitar.make} ${guitar.model}`
            });
        }
    } else {
        const found = await getByMake(req.params.id);

        if (found.length === 0) {
            res.send(404);
        } else {
            res.render('guitars/list', {
                guitars: found.map(convertToObj),
                title: `Guitars Made By ${found[0].make}`
            });
        }
    }
}


// Function used to upload files from form
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/assets/images/uploads/'); // Directory where files will be saved
    },

    filename: async function (req, file, cb) {
        
        const {guitar_make, guitar_model} = req.body;

        var guitar_image = null;
        // If no file was uploaded, quit function
        if(!file.originalname){
            return null;
        }

        if (guitar_make && guitar_model) {
            guitar_image = Date.now() + '-' + file.originalname;
            cb(null, guitar_image); // Rename file to prevent conflicts

        } 
            
    }
});

// Exports function that uploads files
export const upload = multer({ storage: storage });

// Post request to create guitars
export async function storeGuitar(req, res) {
    
    const {guitar_make, guitar_model} = req.body;
    const guitar_image = req.file.filename;

    if (guitar_make && guitar_model) {
        await addGuitar(guitar_make, guitar_model, guitar_image);
        res.redirect('/guitars');
    } else {
        res.redirect('/guitars/create');
    }
        
}

// Post request which updates a guitar
export async function updateGuitar(req, res) {
    const id = req.params.id;

    if (!isIdValid(id)) {
        res.send(404);
        return;
    }

    const {guitar_make, guitar_model, existing_image} = req.body;
    var guitar_image = null;

    // If user didn't upload a file and the guitar had an existing image, don't update image
    if(!req.file && existing_image)
        guitar_image = existing_image;
    // If user uploaded image, update guitar image
    else if(req.file.filename)
        guitar_image = req.file.filename;

    if (guitar_make && guitar_model) {
        await saveGuitar(id, guitar_make, guitar_model, guitar_image);
        res.redirect(`/guitars/${id}`);
    } else {      
        res.redirect(`/guitars/${id}/edit`);
    }
}

// Helper function which converts record retrieved by DB into Object
const convertToObj = (g) => ({id: g._id, make: g.make, model: g.model, image: g.image});
// Check if the Id provided is valid
const isIdValid = (id) => id.length === 24;
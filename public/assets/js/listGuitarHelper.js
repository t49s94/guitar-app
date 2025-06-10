/*
Date: 06/03/2025

Helper file which supports Modal functionality used by guitars/list.handlebars. 
*/
window.onload = (event) => {

    const modalBody = document.getElementById('modalBody');
    const deleteAnchor = document.getElementById('deleteAnchor');
    var deleteButtons = document.getElementsByClassName("deleteButton");

    /*
    Event handler for Delete Buttons Click event. Changes the Modal body's text based on the Delete button
    clicked. Also, support the deletion of the guitar desired.
    */
    var handleClickDeleteButton = function() {
        modalBody.innerHTML = `Are you sure you want to delete guitar: ${this.getAttribute("data-make")} - ${this.getAttribute("data-model")} ?`;
        deleteAnchor.setAttribute("href", `/guitars/${this.getAttribute("data-id")}/delete`);
    };

    for (var i = 0; i < deleteButtons.length; i++) {
        deleteButtons[i].addEventListener('click', handleClickDeleteButton, false);
    }

};
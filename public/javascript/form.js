//Author: Amritpal Singh

// The function formSubmit() is called when the form is submitted.
function formSubmit() {
    return true;
}

//function to add space in postal code number after 3 digits automatically when it is entered.
function postalCodeSpace(e) {
    let inputText = document.getElementById(e.id).value;
    inputText = inputText.split(' ').join('');    // Remove space when it is entered manually.

    let updatedText = inputText.match(/.{1,3}/g).join(' ');
    document.getElementById(e.id).value = updatedText;
}
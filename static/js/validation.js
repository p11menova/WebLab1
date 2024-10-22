function validateX(){
    checkboxes = document.querySelectorAll('input[type=checkbox]')
    for (let checkbox of checkboxes){
        if(checkbox.checked){
            return true;
        }
    }
    checkboxes[4].setCustomValidity("please choose X value");
    checkboxes[4].reportValidity();
    return false;
}

function validateY() {
    element = document.getElementById("Y-input");
    y = element.value.replace(',', '.');
    console.log(y);
    if (parseFloat(y) > 5 || parseFloat(y) < -3 || isNaN(parseFloat(y))) {
        element.setCustomValidity("please enter a number from -3 to 5 :)");
        element.reportValidity();
        return false;
    } else {
        element.setCustomValidity("");
        element.reportValidity();
        return true;
    }

}
export function TodoListItemCreator() {

    // Create the Input Element
    const input = document.createElement('input');

    //Set the Input Element Attributes
    input.setAttribute('type', 'text');
    input.setAttribute('size','50');
    input.setAttribute('placeholder','What do you need to do?');
    input.setAttribute('maxlength', 50);

    return input;
}

export function TodoListItemCreator(addItem) {
    // Create the Input Element
    const input = document.createElement('input');
    input.className = "TodoListItemCreator"

    //Set the Input Element Attributes
    input.setAttribute('type', 'text');
    input.setAttribute('size','50');
    input.setAttribute('placeholder','What do you need to do?');
    input.setAttribute('maxlength', 50);

    // Add an event listener for 'keyup' events
    input.addEventListener('keyup', ev => {
        if (ev.code === 'Enter') {
            // Add the new item
            addItem(ev.target.value);
            // Blank the input after 'Enter'
            ev.target.value = "";
        }
    });

    return input;
}

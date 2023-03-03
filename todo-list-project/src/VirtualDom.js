class VirtualDom {
    //  Mount a component at the given element.
    //  @param el_id The ID of the element where the Virtual DOM will mount a component
    //  @param component A function that returns an HTMLElement when called 
    
    mount(el_id, component) {
        // mount method: save the two arguments for later use, and call refresh()
        this.mountpoint = document.getElementById(el_id);
        this.root = component;
        this.refresh();
    }

    // Re-render the component and replace the 
    // dom below the mountpoint

    refresh() {
        // This code checks that mountpoint is defined, 
        // and if so, it replaces the contents of mountpoint 
        // with a newly rendered HTML element
        if (this.mountpoint) {
            const new_element = this.root();
            this.mountpoint.replaceChildren(new_element);
        }
        resetHookIndicies();
    }
}

// Cache state pairs in this array
const hooks = [];

//Reset this to zero at the end of a rendering cycle
// Increment it during each invocation of myUseState
let hookIndex = 0;

// Return a two element array.
// first element is the current value
// second element is a function that sets the value.
// @param initial  The initial value
export function myUseState(initial) {
    // Return the cached pair if it exists
    let pair = hooks[hookIndex];
    if (pair) {
        hookIndex++;
        return pair;
    }
    // No cached pair found. Initialize a new one.
    pair = [initial, (v) => { pair[0] = v; VDOM.refresh();}];
    // Cache the pair
    hooks[hookIndex++] = pair;

    return pair;
}

function resetHookIndicies() {
    hookIndex = 0;
}

export const VDOM = new VirtualDom();
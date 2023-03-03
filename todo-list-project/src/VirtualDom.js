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
    }
}

export const VDOM = new VirtualDom();
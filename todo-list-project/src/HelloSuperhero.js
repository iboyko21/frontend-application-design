export default function HelloSuperhero(name) {
    const element = document.createElement("div");
    element.innerHTML = `Hello ${name}`;
    return element;
}
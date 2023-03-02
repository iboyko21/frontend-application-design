import checked from './assets/checked.png';
import unchecked from './assets/unchecked.png';

export function TodoListItem(item) {
    const div = document.createElement('div');
    const image = `<img src="${item.complete ? checked : unchecked}" width="20" height="20"/>`;
    div.innerHTML = `${image} ${item.text}`;
    return div;
}
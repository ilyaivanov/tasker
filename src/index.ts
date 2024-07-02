import { div, pasteIntoCursor, placeCarretAt } from "./html";
import {
    saveItemsToLocalStorage,
    saveStateToLocalStorage,
    loadItemsFromLocalStorage,
    loadStateFromLocalStorage,
} from "./persistance";

import "./sample.scss";

let selectedItemEl: HTMLElement | undefined;
let selectedItem = 0;

let isEditing = 0;
const savedItems = loadItemsFromLocalStorage();
let items: string[];

if (savedItems == undefined) items = ["one", "two"];
else items = savedItems;

const savedState = loadStateFromLocalStorage();
if (savedState) selectedItem = savedState.selectedIndex;

//
// Syncing functions
// main idea of these is to sync data with the UI
//
function buildItem(title: string) {
    return div({ classes: "item", text: title });
}

function insertAfter(index: number, el: HTMLElement) {
    app.children[index].insertAdjacentElement("afterend", el);
}
function insertBefore(index: number, el: HTMLElement) {
    app.children[index].insertAdjacentElement("beforebegin", el);
}

function addItemAt(index: number, title: string) {
    items.splice(index, 0, title);
    const el = buildItem(title);
    if (items.length == 1) app.appendChild(el);
    else if (index == 0) insertBefore(index, el);
    else insertAfter(index - 1, el);
}

function removeItemAt(index: number) {
    if (index >= 0) {
        app.children[index].remove();
        items.splice(index, 1);
    }
}

function setItemText(index: number, title: string) {
    items[index] = title;
    (app.children[index] as HTMLElement).innerText = title;
}

const app = div({ children: items.map(buildItem) });

function updateSelected(newSelectedIndex: number) {
    if (newSelectedIndex < 0 || newSelectedIndex >= items.length) return;

    if (selectedItemEl) selectedItemEl.classList.remove("selected");

    selectedItem = newSelectedIndex;
    selectedItemEl = app.children[selectedItem] as HTMLElement;
    selectedItemEl.classList.add("selected");
}

function startEdit() {
    if (selectedItemEl) {
        const itemElem = selectedItemEl as any;
        itemElem.contentEditable = "true";
        itemElem.focus();
        isEditing = 1;
    }
}

function stopEdit() {
    if (selectedItemEl) {
        items[selectedItem] = selectedItemEl.innerText;
        selectedItemEl.removeAttribute("contentEditable");
        isEditing = 0;
    }
}

function removeSelectedItem() {
    removeItemAt(selectedItem);

    if (items.length == 0) {
        selectedItem = -1;
    } else if (selectedItem == items.length) updateSelected(selectedItem - 1);
    else updateSelected(selectedItem);

    saveItemsToLocalStorage(items);
    saveStateToLocalStorage({ selectedIndex: selectedItem });
}

document.addEventListener("keydown", (e) => {
    if (!isEditing) {
        if (e.code == "KeyJ") {
            updateSelected(selectedItem + 1);
            saveStateToLocalStorage({ selectedIndex: selectedItem });
        }
        if (e.code == "KeyK") {
            updateSelected(selectedItem - 1);
            saveStateToLocalStorage({ selectedIndex: selectedItem });
        }

        if (e.code == "KeyI") {
            if (selectedItemEl) {
                startEdit();
                placeCarretAt(selectedItemEl, 0);
                e.preventDefault();
            }
        }
        if (e.code == "KeyA") {
            if (selectedItemEl) {
                startEdit();
                placeCarretAt(selectedItemEl, items[selectedItem].length);
                e.preventDefault();
            }
        }
        if (e.code == "KeyA") {
            startEdit();
            e.preventDefault();
        }
        if (e.code == "Enter" || e.code == "KeyO") {
            let newIndex = 0;
            if (selectedItem != -1)
                newIndex = e.shiftKey ? selectedItem : selectedItem + 1;

            addItemAt(newIndex, "");

            updateSelected(newIndex);
            startEdit();
            e.preventDefault();
        }
        if (e.code == "KeyR" && !e.metaKey) {
            setItemText(selectedItem, "");
            startEdit();
            e.preventDefault();
        }
        if (e.code == "KeyD") removeSelectedItem();
    } else if (isEditing) {
        if (e.code == "Enter" || e.code == "Escape") {
            stopEdit();
            e.preventDefault();
            saveItemsToLocalStorage(items);
            saveStateToLocalStorage({ selectedIndex: selectedItem });
        }
    }
});

document.addEventListener("paste", function (e) {
    e.preventDefault();

    const text = e.clipboardData!.getData("text");
    pasteIntoCursor(text);
});

updateSelected(selectedItem);
document.body.appendChild(app);

import { div, placeCarretAt } from "./html";
import {
    saveItemsToLocalStorage,
    saveStateToLocalStorage,
    loadItemsFromLocalStorage,
    loadStateFromLocalStorage,
} from "./persistance";

import "./sample.scss";

let selectedItem = 0;
let isEditing = 0;
const items = loadItemsFromLocalStorage() || ["one", "two"];

const savedState = loadStateFromLocalStorage();
if (savedState) selectedItem = savedState.selectedIndex;

const app = div({
    children: items.map((title) => div({ classes: "item", text: title })),
});

function insertAfter(index: number, title: string) {
    app.children[index].insertAdjacentElement(
        "afterend",
        div({ classes: "item", text: title }),
    );
}
function insertBefore(index: number, title: string) {
    app.children[index].insertAdjacentElement(
        "beforebegin",
        div({ classes: "item", text: title }),
    );
}

function getSelectedItemElem(): HTMLElement {
    return app.children[selectedItem] as HTMLElement;
}

function updateSelected(newSelectedIndex: number) {
    if (newSelectedIndex < 0 || newSelectedIndex >= items.length) return;

    const el = getSelectedItemElem();

    if (el) el.classList.remove("selected");

    selectedItem = newSelectedIndex;
    getSelectedItemElem().classList.add("selected");
}

function startEdit() {
    const itemElem = getSelectedItemElem() as any;
    itemElem.contentEditable = "true";
    itemElem.focus();
    isEditing = 1;
}
function stopEdit() {
    const itemElem = getSelectedItemElem();
    items[selectedItem] = itemElem.innerText;
    itemElem.removeAttribute("contentEditable");
    isEditing = 0;
}

function removeSelectedItem() {
    const itemElem = getSelectedItemElem();
    itemElem.remove();
    items.splice(selectedItem, 1);

    if (selectedItem == items.length) updateSelected(selectedItem - 1);
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
            startEdit();
            placeCarretAt(getSelectedItemElem(), 0);
            e.preventDefault();
        }
        if (e.code == "KeyA") {
            startEdit();
            placeCarretAt(getSelectedItemElem(), items[selectedItem].length);
            e.preventDefault();
        }
        if (e.code == "KeyA") {
            startEdit();
            e.preventDefault();
        }
        if (e.code == "Enter" || e.code == "KeyO") {
            const newIndex = e.shiftKey ? selectedItem : selectedItem + 1;
            items.splice(newIndex, 0, "");
            getSelectedItemElem().classList.remove("selected");

            if (e.shiftKey) insertBefore(selectedItem, items[newIndex]);
            else insertAfter(selectedItem, items[newIndex]);

            updateSelected(newIndex);
            startEdit();
            e.preventDefault();
        }
        if (e.code == "KeyR" && !e.metaKey) {
            items[selectedItem] = "";
            getSelectedItemElem().innerText = "";
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

updateSelected(selectedItem);
document.body.appendChild(app);

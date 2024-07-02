import { div } from "./html";
import "./sample.scss";

let selectedItem = 0;
let isEditing = 0;
const items = ["one", "two", "three", "four", "five"];

const app = div({
    children: items.map((title) => div({ classes: "item", text: title })),
});

function insertAfter(index: number, title: string) {
    app.children[index].insertAdjacentElement(
        "afterend",
        div({ classes: "item", text: title })
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
    itemElem.removeAttribute("contentEditable");
    isEditing = 0;
}

document.addEventListener("keydown", (e) => {
    if (!isEditing) {
        if (e.code == "KeyJ") updateSelected(selectedItem + 1);
        if (e.code == "KeyK") updateSelected(selectedItem - 1);

        if (e.code == "KeyI") {
            startEdit();
            e.preventDefault();
        }
        if (e.code == "Enter") {
            items.splice(selectedItem, 0, "new foo");
            insertAfter(selectedItem, items[selectedItem]);
            updateSelected(selectedItem + 1);
            startEdit();
            e.preventDefault();
        }
        if (e.code == "KeyR") {
            items[selectedItem] = "";
            getSelectedItemElem().innerText = "";
            startEdit();
            e.preventDefault();
        }
    } else if (isEditing) {
        if (e.code == "Enter" || e.code == "Escape") {
            stopEdit();
            e.preventDefault();
        }
    }
});

updateSelected(0);
document.body.appendChild(app);

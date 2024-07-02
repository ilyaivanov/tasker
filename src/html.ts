type Props = {
    children?: (HTMLElement | string)[];
    classes?: string;
    id?: string;
    text?: string;
};
export const div = (props: Props) => {
    const div = document.createElement("div");
    if (props.classes) div.classList.add(props.classes);
    if (props.id) div.classList.add(props.id);

    if (props.children && props.text) {
        console.error(props);
        throw new Error("Can't have both text and children on an element");
    }

    if (props.text) div.innerText = props.text;

    if (props.children) {
        for (const child of props.children) {
            div.append(child);
        }
    }

    return div;
};

export function placeCarretAt(element: HTMLElement, position: number) {
    if (element.innerText.length == 0) return;

    const range = document.createRange();
    const selection = window.getSelection()!;

    range.setStart(element.childNodes[0], position);
    // range.selectNodeContents(element);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
}

export function pasteIntoCursor(text: string) {
    const selection = window.getSelection()!;
    if (!selection.rangeCount) return;

    const range = selection.getRangeAt(0);

    range.deleteContents();

    const textNode = document.createTextNode(text);

    range.insertNode(textNode);

    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
}

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
    const range = document.createRange();
    const selection = window.getSelection()!;

    range.setStart(element.childNodes[0], position);
    // range.selectNodeContents(element);
    range.collapse(true);

    selection.removeAllRanges();
    selection.addRange(range);
}
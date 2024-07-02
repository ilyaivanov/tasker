export type PersistedState = {
    selectedIndex: number;
};
export function saveItemsToLocalStorage(items: string[]) {
    localStorage.setItem("items", items.join("\n"));
}
export function saveStateToLocalStorage(state: PersistedState) {
    localStorage.setItem("state", JSON.stringify(state));
}

export function loadItemsFromLocalStorage() {
    const saved = localStorage.getItem("items");
    if (saved != undefined) {
        if (saved.length == 0) return [];
        else return saved.split("\n");
    }
}

export function loadStateFromLocalStorage(): PersistedState | undefined {
    const saved = localStorage.getItem("state");
    if (saved != undefined) return JSON.parse(saved);
}

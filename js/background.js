let autoNewTab = true;
let selectorTypeBFS = true;

chrome.commands.onCommand.addListener((command) => {
    if (command === "select-star") {
        selectStar();
    }
});

async function selectStar() {
    let bookmarkTree = await chrome.bookmarks.getTree();
    let selection = undefined

    if (selectorTypeBFS === true) {
        selection = selectBFS(bookmarkTree);
    } else {
        selection = selectDFS(bookmarkTree);
    }

    openTab(selection)

}


function selectBFS(bookmarkTree) {
    let numChildren = bookmarkTree.length
    let selectionNum = Math.floor(Math.random() * numChildren)
    let selection = bookmarkTree[selectionNum]

    if (!("children" in selection) || selection.children.length === 0) {
        return selection;
    } else {
        return selectBFS(selection.children);
    }
}


function selectDFS(bookmarkTree) {
    console.log(bookmarkTree);
}


function openTab(bookmark) {
    let newTab = {
        url: undefined
    }

    if ("children" in bookmark) {
        newTab.url = "chrome://bookmarks/?id=" + bookmark.id
    } else {
        newTab.url = bookmark.url
    }

    if (autoNewTab) {
        chrome.tabs.create(newTab)
    } else {
        chrome.tabs.update(newTab)
    }
}

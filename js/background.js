let autoNewTab = true;
let useDeepSelect = true;
let includeEmptyFolders = true;
let bookmarkArray = [];

chrome.commands.onCommand.addListener((command) => {
    if (command === "select-star") {
        selectStar();
    }
});

async function selectStar() {
    let bookmarkTree = await chrome.bookmarks.getTree();
    let selection = undefined

    if (useDeepSelect === true) {
        selection = deepSelect(bookmarkTree);
    } else {
        selection = flatSelect(bookmarkTree);
    }

    openTab(selection)
}


function flatSelect(bookmarkTree) {
    let numChildren = bookmarkTree.length
    let selectionNum = Math.floor(Math.random() * numChildren)
    let selection = bookmarkTree[selectionNum]

    if (!("children" in selection) || selection.children.length === 0) {
        return selection;
    } else {
        return flatSelect(selection.children);
    }
}


function deepSelect(bookmarkTree) {
    bookmarkArray = [];
    traverseBookmarkTree(bookmarkTree);
    let selectionIndex = Math.floor(Math.random() * bookmarkArray.length)
    let selection = bookmarkArray[selectionIndex]
    return selection
}


function traverseBookmarkTree(bookmarkTree) {
    let numChildren = bookmarkTree.length;
    for (let i = 0; i < numChildren; i++) {
        let node = bookmarkTree[i]
        if (!("children" in node) || (includeEmptyFolders && node.children.length === 0)) {
            bookmarkArray.push(node)
        } else {
            traverseBookmarkTree(node.children)
        }
    }
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

let autoNewTab = true
let selectorType = "DFS"

chrome.commands.onCommand.addListener( (command) => {
    if (command === "select-star") {
        selectStar()
    }
});

function selectStar() {
    chrome.bookmarks.getTree((tree) => {
        console.log(tree)
    })
}

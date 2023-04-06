/**
 * @name Obsidian Web Clipper (Apple platforms)
 * @desc This script will generate a new note in Obsidian containing the content of the current webpage.
 * It utilizes Obsidian's [callout](https://help.obsidian.md/How+to/Use+callouts)
 * and [tags](https://help.obsidian.md/How+to/Working+with+tags) syntax.
 * I've been using this since forever so it is hard to trace back the original source,
 * but it looks like I've forked the script from [Stephan "Kepano" Ango's gist](https://gist.github.com/kepano/90c05f162c37cf730abb8ff027987ca3)
 * and over time modified it to work better with my exact workflow.
 */

javascript: Promise.all([
  import("https://unpkg.com/turndown@6.0.0?module"),
  import("https://unpkg.com/@tehshrike/readability@0.2.0"),
]).then(async ([{ default: Turndown }, { default: Readability }]) => {
  const vault = "Jarvis";
  const folder = "📖 Bookshelf/Unread/";
  const tags = "- article\n- status/unread";
  function getSelectionHtml() {
    var html = "";
    if (typeof window.getSelection != "undefined") {
      var sel = window.getSelection();
      if (sel.rangeCount) {
        var container = document.createElement("div");
        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
          container.appendChild(sel.getRangeAt(i).cloneContents());
        }
        html = container.innerHTML;
      }
    } else if (typeof document.selection != "undefined") {
      if (document.selection.type == "Text") {
        html = document.selection.createRange().htmlText;
      }
    }
    return html;
  }
  const selection = getSelectionHtml();
  const { title, byline, content } = new Readability(
    document.cloneNode(true)
  ).parse();
  function getFileName(fileName) {
    fileName = fileName.replace(":", "").replace(/\//g, "-");
    return fileName;
  }
  const fileName = getFileName(title);
  if (selection) {
    var markdownify = selection;
  } else {
    var markdownify = content;
  }
  if (vault) {
    var vaultName = "&vault=" + encodeURIComponent(`${vault}`);
  } else {
    var vaultName = "";
  }
  const markdownBody = new Turndown({
    headingStyle: "atx",
    hr: "---",
    bulletListMarker: "-",
    codeBlockStyle: "fenced",
    emDelimiter: "*",
  }).turndown(markdownify);
  var date = new Date();
  const convertDate = (date) => {
    const yyyy = date.getFullYear().toString();
    const mm = (date.getMonth() + 1).toString();
    const dd = date.getDate().toString();
    const mmChars = mm.split("");
    const ddChars = dd.split("");
    return (
      yyyy +
      "-" +
      (mmChars[1] ? mm : "0" + mmChars[0]) +
      "-" +
      (ddChars[1] ? dd : "0" + ddChars[0])
    );
  };
  const today = convertDate(date);
  const fileContent =
    "---\n" +
    "tags:\n" +
    tags +
    "\n" +
    "---\n" +
    "> [!info]-\n" +
    "> This article was downloaded from the internet ([source](" +
    document.URL +
    ")) and placed on my [[Bookshelf]] on [[" +
    today +
    "]].\n> \n" +
    "> This file automatically move to a folder matching the option chosen below.\n\n" +
    "> [!cite] Current progress\n" +
    "> - [x] *[[Unread]]*\n" +
    "> - [ ] *[[Reading]]*\n" +
    "> - [ ] *[[Finished]]*\n\n" +
    markdownBody;
  document.location.href =
    "obsidian://new?" +
    "file=" +
    encodeURIComponent(folder + fileName) +
    "&content=" +
    encodeURIComponent(fileContent) +
    vaultName;
});

/**
 * To utilize this script, you need to create a new bookmark in your browser and paste the following code as the URL:
 * javascript:%20Promise.all%28%5B%0A%20%20import%28%22https%3A%2F%2Funpkg.com%2Fturndown%406.0.0%3Fmodule%22%29%2C%0A%20%20import%28%22https%3A%2F%2Funpkg.com%2F%40tehshrike%2Freadability%400.2.0%22%29%2C%0A%5D%29.then%28async%20%28%5B%7B%20default%3A%20Turndown%20%7D%2C%20%7B%20default%3A%20Readability%20%7D%5D%29%20%3D%3E%20%7B%0A%20%20const%20vault%20%3D%20%22Jarvis%22%3B%0A%20%20const%20folder%20%3D%0A%20%20%20%20%22%F0%9F%93%96%20Bookshelf%2FUnread%2F%22%3B%0A%20%20const%20tags%20%3D%20%22-%20article%5Cn-%20status%2Funread%22%3B%0A%20%20function%20getSelectionHtml%28%29%20%7B%0A%20%20%20%20var%20html%20%3D%20%22%22%3B%0A%20%20%20%20if%20%28typeof%20window.getSelection%20%21%3D%20%22undefined%22%29%20%7B%0A%20%20%20%20%20%20var%20sel%20%3D%20window.getSelection%28%29%3B%0A%20%20%20%20%20%20if%20%28sel.rangeCount%29%20%7B%0A%20%20%20%20%20%20%20%20var%20container%20%3D%20document.createElement%28%22div%22%29%3B%0A%20%20%20%20%20%20%20%20for%20%28var%20i%20%3D%200%2C%20len%20%3D%20sel.rangeCount%3B%20i%20%3C%20len%3B%20%2B%2Bi%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20container.appendChild%28sel.getRangeAt%28i%29.cloneContents%28%29%29%3B%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20html%20%3D%20container.innerHTML%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%20else%20if%20%28typeof%20document.selection%20%21%3D%20%22undefined%22%29%20%7B%0A%20%20%20%20%20%20if%20%28document.selection.type%20%3D%3D%20%22Text%22%29%20%7B%0A%20%20%20%20%20%20%20%20html%20%3D%20document.selection.createRange%28%29.htmlText%3B%0A%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20return%20html%3B%0A%20%20%7D%0A%20%20const%20selection%20%3D%20getSelectionHtml%28%29%3B%0A%20%20const%20%7B%20title%2C%20byline%2C%20content%20%7D%20%3D%20new%20Readability%28%0A%20%20%20%20document.cloneNode%28true%29%0A%20%20%29.parse%28%29%3B%0A%20%20function%20getFileName%28fileName%29%20%7B%0A%20%20%20%20fileName%20%3D%20fileName.replace%28%22%3A%22%2C%20%22%22%29.replace%28%2F%5C%2F%2Fg%2C%20%22-%22%29%3B%0A%20%20%20%20return%20fileName%3B%0A%20%20%7D%0A%20%20const%20fileName%20%3D%20getFileName%28title%29%3B%0A%20%20if%20%28selection%29%20%7B%0A%20%20%20%20var%20markdownify%20%3D%20selection%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20var%20markdownify%20%3D%20content%3B%0A%20%20%7D%0A%20%20if%20%28vault%29%20%7B%0A%20%20%20%20var%20vaultName%20%3D%20%22%26vault%3D%22%20%2B%20encodeURIComponent%28%60%24%7Bvault%7D%60%29%3B%0A%20%20%7D%20else%20%7B%0A%20%20%20%20var%20vaultName%20%3D%20%22%22%3B%0A%20%20%7D%0A%20%20const%20markdownBody%20%3D%20new%20Turndown%28%7B%0A%20%20%20%20headingStyle%3A%20%22atx%22%2C%0A%20%20%20%20hr%3A%20%22---%22%2C%0A%20%20%20%20bulletListMarker%3A%20%22-%22%2C%0A%20%20%20%20codeBlockStyle%3A%20%22fenced%22%2C%0A%20%20%20%20emDelimiter%3A%20%22%2A%22%2C%0A%20%20%7D%29.turndown%28markdownify%29%3B%0A%20%20var%20date%20%3D%20new%20Date%28%29%3B%0A%20%20const%20convertDate%20%3D%20%28date%29%20%3D%3E%20%7B%0A%20%20%20%20const%20yyyy%20%3D%20date.getFullYear%28%29.toString%28%29%3B%0A%20%20%20%20const%20mm%20%3D%20%28date.getMonth%28%29%20%2B%201%29.toString%28%29%3B%0A%20%20%20%20const%20dd%20%3D%20date.getDate%28%29.toString%28%29%3B%0A%20%20%20%20const%20mmChars%20%3D%20mm.split%28%22%22%29%3B%0A%20%20%20%20const%20ddChars%20%3D%20dd.split%28%22%22%29%3B%0A%20%20%20%20return%20%28%0A%20%20%20%20%20%20yyyy%20%2B%0A%20%20%20%20%20%20%22-%22%20%2B%0A%20%20%20%20%20%20%28mmChars%5B1%5D%20%3F%20mm%20%3A%20%220%22%20%2B%20mmChars%5B0%5D%29%20%2B%0A%20%20%20%20%20%20%22-%22%20%2B%0A%20%20%20%20%20%20%28ddChars%5B1%5D%20%3F%20dd%20%3A%20%220%22%20%2B%20ddChars%5B0%5D%29%0A%20%20%20%20%29%3B%0A%20%20%7D%3B%0A%20%20const%20today%20%3D%20convertDate%28date%29%3B%0A%20%20const%20fileContent%20%3D%0A%20%20%20%20%22---%5Cn%22%20%2B%0A%20%20%20%20%22tags%3A%5Cn%22%20%2B%0A%20%20%20%20tags%20%2B%0A%20%20%20%20%22%5Cn%22%20%2B%0A%20%20%20%20%22---%5Cn%22%20%2B%0A%20%20%20%20%22%3E%20%5B%21info%5D-%5Cn%22%20%2B%0A%20%20%20%20%22%3E%20This%20article%20was%20downloaded%20from%20the%20internet%20%28%5Bsource%5D%28%22%20%2B%20document.URL%20%2B%20%22%29%29%20and%20placed%20on%20my%20%5B%5BBookshelf%5D%5D%20on%20%5B%5B%22%20%2B%20today%20%2B%20%22%5D%5D.%5Cn%3E%20%5Cn%22%20%2B%0A%20%20%20%20%22%3E%20This%20file%20automatically%20move%20to%20a%20folder%20matching%20the%20option%20chosen%20below.%5Cn%5Cn%22%20%2B%0A%20%20%20%20%22%3E%20%5B%21cite%5D%20Current%20progress%5Cn%22%20%2B%0A%20%20%20%20%22%3E%20-%20%5Bx%5D%20%2A%5B%5BUnread%5D%5D%2A%5Cn%22%20%2B%0A%20%20%20%20%22%3E%20-%20%5B%20%5D%20%2A%5B%5BReading%5D%5D%2A%5Cn%22%20%2B%0A%20%20%20%20%22%3E%20-%20%5B%20%5D%20%2A%5B%5BFinished%5D%5D%2A%5Cn%5Cn%22%20%2B%0A%20%20%20%20markdownBody%3B%0A%20%20document.location.href%20%3D%0A%20%20%20%20%22obsidian%3A%2F%2Fnew%3F%22%20%2B%0A%20%20%20%20%22file%3D%22%20%2B%0A%20%20%20%20encodeURIComponent%28folder%20%2B%20fileName%29%20%2B%0A%20%20%20%20%22%26content%3D%22%20%2B%0A%20%20%20%20encodeURIComponent%28fileContent%29%20%2B%0A%20%20%20%20vaultName%3B%0A%7D%29%3B
 * That's it!
 */

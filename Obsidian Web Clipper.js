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
    "> - [x] *Unread*\n" +
    "> - [ ] *Reading*\n" +
    "> - [ ] *Finished*\n\n" +
    markdownBody;
  document.location.href =
    "obsidian://new?" +
    "file=" +
    encodeURIComponent(folder + fileName) +
    "&content=" +
    encodeURIComponent(fileContent) +
    vaultName;
});

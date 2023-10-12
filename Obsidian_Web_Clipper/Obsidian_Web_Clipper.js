/**
 * @name Obsidian Web Clipper
 * @desc This script will generate a new note with certain characteristics in a directory within Obsidian containing the content of the current webpage. For instructions on how to use this script, please see the README.md file.
 */

javascript: Promise.all([
  import("https://unpkg.com/turndown@6.0.0?module"),
  import("https://unpkg.com/@tehshrike/readability@0.2.0"),
]).then(async ([{ default: Turndown }, { default: Readability }]) => {
  const vault = "Jarvis";
  const folder = "📖 Bookshelf/Article/Unread/";
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
    fileName = fileName.replace(":", "").replace(/\//g, "-").replace("‘", "'");
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
    "---" + "\n" +
    "created: " + today + "\n" +
    "unread: true" + "\n" +
    "reading: false" + "\n" +
    "finished: false" + "\n" +
    "source: " + document.URL + "\n" +
    "type: \"[[Article]]\"" + "\n" +
    "---" + "\n" +
    markdownBody;
  document.location.href =
    "obsidian://new?" +
    "file=" +
    encodeURIComponent(folder + fileName) +
    "&content=" +
    encodeURIComponent(fileContent) +
    vaultName;
});

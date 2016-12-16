(function () {
  "use strict";

  if (typeof window.ttBookmarkletsSettings !== "undefined") {
    var scriptURL = document.getElementById("bookmarklets-script-file").src;
    window.ttBookmarkletsSettings.scriptURL = scriptURL;
    $("#view-source").attr("href", scriptURL);
    makeBookmarkletLinks(window.ttBookmarkletsSettings);
  } else {
    console.error("No settings provided. Settings must be available "
      + "on `window.ttBookmarkletsSettings`");
  }

  /**
   * Generates an encoded bookmarklet URI for the settings provided
   * @param scriptURL {String} - URL from where to load TT Bookmarklets script
   * @param item {Object} - Must have {action: {function}, import: [{Array}]}
   * @return {String|undefined} - Encoded URI
   */
  function generateURI(scriptURL, item) {
    if (typeof window.ttBookmarklets === "undefined") {
      console.error("Invalid TT Bookmarklet Script");
      return undefined;
    }
    if (typeof window.ttBookmarklets[item.methodName] !== "function") {
      console.error("Method named \"" + item.methodName + "\" not found!");
      return undefined;
    }
    var resultURI = [
      "javascript:(",
      String(bookmarkletMain)
        .replace(/scriptURL/g, "\"" + scriptURL + "\"")
        .replace(/defaultAction/g, item.methodName),
      ")()"
    ].join("");
    console.info("\"" + item.methodName + "\" has the following action");
    console.log(resultURI);
    return encodeURI(resultURI);
  }

  /**
   * This function gets attached to all bookmarklets
   * It loads the TT Bookmarklets scripts and then calls a function
   * specified on the `window.ttBookmarklets` object
   * NOTE: This function gets converted into a string and some of the variable
   * names inside will be dynamically replaced
   */
  function bookmarkletMain() {
    var lib = document.createElement("script");
    lib.type = "text/javascript";
    lib.src = scriptURL;
    lib.onload = function () {
      if (typeof window.ttBookmarklets === "undefined") {
        alert("TT Bookmarklet script failed to load!");
        return;
      }
      if (typeof window.ttBookmarklets.defaultAction === "function") {
        window.ttBookmarklets.defaultAction();
      } else {
        console.warn("TT Bookmarklet Script has no definition for defaultAction!");
      }
    };
    document.body.appendChild(lib);
  }

  /**
   * Generates the list of links
   * @param settings {Object}
   */
  function makeBookmarkletLinks(settings) {
    var list = $("#bookmarklets");
    var items = settings.bookmarklets;
    for (var i = 0; i < items.length; i++) {
      var item = items[i];
      var uri = generateURI(settings.scriptURL, item);
      if (typeof uri !== "undefined") {
        list.append("<li><a href=\"" + uri + "\" class=\"marklet\">"
          + (item.name || item.methodName) + "</a>" + item.description + "</li>");
      } else {
        console.warn("Item definition is invalid", item);
      }
    }
  }
})();
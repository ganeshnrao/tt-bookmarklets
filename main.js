(function () {
    'use strict';

    var scriptURL = document.getElementById('bookmarklets-script-file').src;
    window.ttBookmarkletsSettings.scriptURL = scriptURL;
    $('#view-source').attr('href', scriptURL);
    makeBookmarkletLinks(window.ttBookmarkletsSettings);

    /**
     * Generates an encoded bookmarklet URI for the settings provided
     * @param scriptURL {String} - URL from where to load TT Bookmarklets script
     * @param item {Object} - Must have {action: {function}, import: [{Array}]}
     * @return {String|undefined} - Encoded URI
     */
    function generateURI(scriptURL, item) {
        if (!window.ttBookmarklets) {
            console.error('Invalid TT Bookmarklet Script');
            return undefined;
        }
        if (!window.ttBookmarklets[item.methodName]) {
            console.error('Method named "' + item.methodName + '" not found!');
            return undefined;
        }
        var resultURI = item.raw ? [
            'javascript:(',
            String(window.ttBookmarklets[item.methodName]),
            ')()'
        ].join('') : [
            'javascript:(',
            String(bookmarkletMain)
            .replace(/scriptURL/g, '"' + scriptURL + '"')
            .replace(/defaultAction/g, item.methodName),
            ')()'
        ].join('');
        console.info('"' + item.methodName + '" has the following action');
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
        var lib = document.createElement('script');
        lib.type = 'text/javascript';
        lib.src = scriptURL;
        lib.onload = function () {
            if (!window.ttBookmarklets) {
                alert('TT Bookmarklet script failed to load!');
                return;
            }
            if (window.ttBookmarklets.defaultAction) {
                window.ttBookmarklets.defaultAction();
            } else {
                console.warn('TT Bookmarklet Script has no definition for defaultAction!');
            }
        };
        document.body.appendChild(lib);
    }

    /**
     * Generates the list of links
     * @param settings {Object}
     */
    function makeBookmarkletLinks(settings) {
        var list = $('#bookmarklets');
        var items = settings.bookmarklets;
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            var uri = generateURI(settings.scriptURL, item);
            if (uri) {
                list.append('<li><a href="' + uri + '" class="marklet">' + (item.name || item.methodName) + '</a>'
                    + item.description + '</li>');
            } else {
                console.warn('Item definition is invalid', item);
            }
        }
    }
})();
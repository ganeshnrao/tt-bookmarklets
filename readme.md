###TT Bookmarklets
This repo contains a set of bookmarklets to help make the workflow at TT a bit
smoother and easier.

##### How it works
* `index.html` is the page from where people can drag the bookmarklets to their
Bookmarks bar. This page uses `main.js` to generate the encoded URI links
based on the `settings` object passed to `makeBookmarkletLinks` function
* `main.js` generates encoded URIs to perform the following for each bookmarklet
  * Inject `ttBookmarklets.js` into the document dynamically
  * Once loaded, `ttBookmarklets.js` generates a `window.ttBookmarklets` object
  * Call the corresponding `methodName` provided in the `settings` object on the
  `ttBookmarklets` object
* In `main.js` the `scriptURL` property should point to a publicly visible URL
to the `ttBookmarklets.js` file
* Since these bookmarklets call a method on a dynamically loaded object, once
some any user has created the bookmarklets by dragging them to their bookmarks
bar, if you make changes to `ttBookmarklets.js` file then all those installed
bookmarklets will be updated automatically

#### TODO
* Minification for `ttBookmarklets.js`
* Add more bookmarklets
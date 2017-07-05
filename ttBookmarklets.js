(function () {
    'use strict';

    if (!window.ttBookmarklets) {
        window.ttBookmarklets = new TTBookmarklets();
    }

    function TTBookmarklets() {
        /**
         * Default action if no action is provided
         */
        this.defaultAction = function () {
            console.log('No action provided');
        };

        /**
         * Replaces occurrences of '{{(<index>}}' with the value that index from the
         * array passed as seconds argument.
         * @param tpl {String} - Template
         * @param array {Array} - Array of values
         * @return {String|undefined} - Returns 'undefined' if array doesn't have the
         * index specified in the string. Otherwise returns the substituted string.
         */
        this.substitute = function (tpl, array) {
            if (!(array instanceof Array) || array.length === 0) {
                return undefined;
            }
            var matches = tpl.match(/{{([0-9]+)}}/g);
            for (var i = 0; i < matches.length; i++) {
                if (typeof array[i] === 'undefined') {
                    return undefined;
                }
                tpl = tpl.replace(matches[i], array[i]);
            }
            return tpl;
        };

        /**
         * Expects options to have three properties
         * {message: {String}, regEx: {RegExp Object}, urlTemplate: {String}}
         * Prompts user to input a string, parses user's input using the regEx object
         * and substitutes the values in the urlTemplate. If the result of
         * substitution is a valid string then sets the window's location.
         * @param options {Object} - Object with {message, redEx, urlTemplate}
         */
        this.fetchUrlById = function (options) {
            var input = prompt(options.message);
            if (typeof input === 'string') {
                var matches = options.regEx.exec(input.trim());
                var newUrl = this.substitute(options.urlTemplate, matches);
                if (newUrl) {
                    window.location.href = newUrl;
                }
            }
        };

        /**
         * Opens the UserSnap console iFrame in a new tab
         */
        this.openUserConsole = function () {
            var consoleUrl;
            var iFrames = document.getElementsByTagName('iframe');
            if (iFrames.length > 0) {
                for (var i = 0; i < iFrames.length; i++) {
                    if (iFrames[i].src.indexOf('usersnap.com/angular/console') >= 0) {
                        consoleUrl = iFrames[i].src;
                        break;
                    }
                }
            }
            if (consoleUrl) {
                window.location.href = consoleUrl;
            } else {
                alert('No UserSnap Console detected on current page. '
                    + 'This only works if you\'re on a UserSnap page with a user console');
            }
        };

        /**
         * Opens a UserSnap by ID
         */
        this.getUserSnap = function () {
            this.fetchUrlById({
                message: 'Enter UserSnap ID',
                regEx: /[0-9]+$/i,
                urlTemplate: 'https://usersnap.com/a/#/TradingTech/p/debesys-producti/{{0}}'
            });
        };

        /**
         * Opens a JIRA by ID
         */
        this.getJira = function () {
            this.fetchUrlById({
                message: 'Enter JIRA Number or ID',
                regEx: /[0-9]+$/i,
                urlTemplate: 'https://jira.tradingtechnologies.com/browse/DEB-{{0}}'
            });
        };

        /**
         * Finds all branches in all TT Repositories that have a matching JIRA ID
         */
        this.searchBranch = function () {
            this.fetchUrlById({
                message: 'Enter JIRA Number or ID to find it\'s GitHub Branches',
                regEx: /[0-9]+$/i,
                urlTemplate: 'https://github.com/search?q=org%3Atradingtechnologies+DEB-{{0}}&type=Issues'
            });
        };

        this.copyCommitIds = function () {
            try {
                var commits = [],
                    commitElements = [].slice.call(document.getElementsByClassName('commit-id')),
                    div = document.createElement('div'),
                    selection = window.getSelection(),
                    range = document.createRange();
                commitElements.forEach(function (commitHref) {
                    commits.push(commitHref.href.split('/').pop());
                });
                div.textContent = commits.join('\n');
                document.body.appendChild(div);
                range.selectNodeContents(div);
                selection.removeAllRanges();
                selection.addRange(range);
                document.execCommand('copy');
                document.body.removeChild(div);
                window.alert('Successfully copied ' + commitElements.length + ' commit IDs');
            } catch (error) {
                window.alert('Failed to copy commit IDs');
            }
        }
    }
}());
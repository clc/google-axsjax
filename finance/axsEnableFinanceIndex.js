// Copyright 2008 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview AxsJAX script intended to enhance accessibility of
 * the Index page of Google Finance.
 *
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsFinance = {};

/**
 * Strings for enhancing the presentation
 */
axsFinance.str = {
  UP : ' up by ',
  UP_ABBR : '+',
  DOWN : ' down by ',
  DOWN_ABBR : '-',
  PRCNT : ' percent',
  PRCNT_ABBR : '%',
  MLN : ' million',
  MLN_ABBR : 'M',
  BLN : ' billion',
  BLN_ABBR : 'B',
  TO_ABBR : '-',
  TO : 'to',
  WEEKS : 'Fifty two week',
  WEEKS_ABBR : '52Wk',
  AVG_VOL : 'Average volume',
  AVG_VOL_ABBR : 'Avg Vol:',
  NA_ABBR : '-',
  NA : 'Not available',
  GOOGLE_FINANCE_INDEX : 'Google Finance Index',
  RECENT_QUOTE_TEMPLATE : '{0}, {1}, change {2}.',
  HELP : 'The following shortcut keys are available.',
  DISCLAIMER : '- Disclaimer',
  OR : 'or',
  PM : 'PM',
  AM : 'AM'
};

/**
 * XPath for retrieving the current quote
 * @type string
 */
axsFinance.QUOTE_XPATH = "id('md')//span[@class='pr']/..";

/**
 * Map from abbreviated phrases to expanded phrases.
 */
axsFinance.phrasesMap = new Object();
axsFinance.phrasesMap[axsFinance.str.WEEKS_ABBR] = axsFinance.str.WEEKS;
axsFinance.phrasesMap[axsFinance.str.NA_ABBR] = axsFinance.str.NA;
axsFinance.phrasesMap[axsFinance.str.AVG_VOL_ABBR] = axsFinance.str.AVG_VOL;
axsFinance.phrasesMap[axsFinance.str.TO_ABBR] = axsFinance.str.TO;
axsFinance.phrasesMap[axsFinance.str.PM] = axsFinance.str.PM;
axsFinance.phrasesMap[axsFinance.str.AM] = axsFinance.str.AM;

/**
 * Map from prefix characters to strings.
 */
axsFinance.prefixMap = new Object();
axsFinance.prefixMap[axsFinance.str.DOWN_ABBR] = axsFinance.str.DOWN;
axsFinance.prefixMap[axsFinance.str.UP_ABBR] = axsFinance.str.UP;

/**
 * Map from suffix characters to strings.
 */
axsFinance.suffixMap = new Object();
axsFinance.suffixMap[axsFinance.str.BLN_ABBR] = axsFinance.str.BLN;
axsFinance.suffixMap[axsFinance.str.MLN_ABBR] = axsFinance.str.MLN;
axsFinance.suffixMap[axsFinance.str.PRCNT_ABBR] = axsFinance.str.PRCNT;

/**
 * CNR
 */
axsFinance.CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

    '<target title="Markets" hotkey="m">' +
      '(//li[@class="nav-item"])[1]//a' +
    '</target>' +

    '<target title="News" hotkey="e">' +
      '(//li[@class="nav-item"])[2]//a' +
    '</target>' +

    '<target title="Portfolios" hotkey="o">' +
      '(//li[@class="nav-item"])[3]//a' +
    '</target>' +

    '<target title="Stock screener" hotkey="s">' +
      '(//li[@class="nav-item"])[4]//a' +
    '</target>' +

    '<target title="Google domestic trends" hotkey="g">' +
      '(//li[@class="nav-item"])[5]//a' +
    '</target>' +

    '<target title="Go to link" hotkey="ENTER">' +
      './/descendant-or-self::a' +
    '</target>' +

    '<target title="Read current quote" hotkey="q" ' +
        'action="CALL:axsFinance.readCurrentQuote">' +
      'id("price-panel")' +
    '</target>' +

    '<target title="Create portfolio from quotes" hotkey="t" ' +
        'onEmpty="No recent quotes.">' +
      'id("rq-create")' +
    '</target>' +

    '<list title="Recent quotes" next="DOWN j" prev="UP k" fwd="n" back="p"' +
        ' type="dynamic" onEmpty="No recent quotes">' +

      '<item action="CALL:axsFinance.readRecentQuote">' +
        'id("rq")//tr' +
      '</item>' +

    '</list>' +

    '<list title="Recent activity" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic" onEmpty="No recent activities">' +

      '<item>' +
        '//li[@class="ra-entry"]' +
      '</item>' +

    '</list>' +

    '<list title="Market data" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p">' +

      '<item action="CALL:axsFinance.readMarketData">' +
        'id("snap-data")/li' +
      '</item>' +

    '</list>' +

    '<list title="News" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic">' +

      '<item>' +
        '//div[@class="cluster"]' +
      '</item>' +

      '<target title="View all news" hotkey="a">' +
        '(id("news-sidebar-footer")//a[text()])[1]' +
      '</target>' +

      '<target title="Subscribe" hotkey="u">' +
        '(id("news-sidebar-footer")//a[text()])[2]' +
      '</target>' +

    '</list>' +

    '<list title="Discussions" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic">' +

      '<item>' +
        'id("groups")//div[@class="item"]' +
      '</item>' +

      '<target title="All discussions" hotkey="a">' +
        '//div[@class="sfe-break-top"]//a' +
      '</target>' +

    '</list>' +

  '</cnr>';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsFinance.axsJAXObj = null;

/**
 * The AxsJAX navigation object. Provides page navigation.
 * av object that will handle navigation.
 * @type AxsNav?
 */
axsFinance.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsFinance.axsLensObj = null;

/**
 * The AxsJAX sound object used for playing earcons.
 * @type {AxsSound?}
 */
axsFinance.axsSound = null;

/**
 * The PowerKey object that shows an auto completion element for valid actions.
 * @type {PowerKey?}
 */
axsFinance.powerKeyObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsFinance.magSize = 2.5;

/**
 * Flag indicating if the page is initialized
 * @type boolean
 */
axsFinance.searchBoxFocusEnabled = false;

/**
 * Time out for processing events.
 * @type {Number}
 */
axsFinance.EVT_HANDL_TIMEOUT_INT = 300;

/**
 * Map for flags indicating if a handler for an event has been triggered
 * @type {Object}
 */
axsFinance.eventHandlerToEventMap = new Object();

/**
 * Initializes the AxsJAX script for Google finance - quotes page.
 */
axsFinance.initAxsJAX = function() {
  //Initialize AxsJAX object
  axsFinance.axsJAXObj = new AxsJAX(true);

  //Initialize AxsNav object
  axsFinance.axsNavObj = new AxsNav(axsFinance.axsJAXObj);
  axsFinance.axsNavObj.navInit(axsFinance.CNR, null);

  //Initialize AxsLens object
  axsFinance.axsLensObj = new AxsLens(axsFinance.axsJAXObj);
  axsFinance.axsNavObj.setLens(axsFinance.axsLensObj);
  axsFinance.axsLensObj.setMagnification(axsFinance.magSize);

  //Initialize AxsSound object
  axsFinance.axsSound = new AxsSound(true);
  axsFinance.axsNavObj.setSound(axsFinance.axsSound);

  //Initialize PowerKey object
  axsFinance.powerKeyObj = new PowerKey('list', axsFinance.axsJAXObj);
  axsFinance.axsNavObj.setPowerKey(axsFinance.powerKeyObj, '.');

  //Add event listeners
  document.addEventListener('keypress', axsFinance.keyHandler, true);

  //Handle the focus in the search box performed by the page script during init
  var searchBox = document.getElementById('searchbox');
  searchBox.addEventListener('focus', axsFinance.searchBoxKeyHandler, false);

  //read the current quote
  axsFinance.announceIntro();
};

/**
 * Reads rows from a table and populates the values in a given template.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readRecentQuote = function(item) {
  var row = item.elem;

  var xPath = './td[not(.//b)]';
  var columns = axsFinance.axsJAXObj.evalXPath(xPath, row);
  var values = new Array();

  for (var i = 0, length = columns.length; i < length; i++) {
    values[i] = axsFinance.getSpaceSeparatedVisibleDescendantsTextContent(
        columns[i]);
    values[i] = axsFinance.parseSpecialCharsAndTokens(values[i]);
  }

  var text = axsFinance.populateTemplate(axsFinance.str.RECENT_QUOTE_TEMPLATE,
    values);
  axsFinance.speakAndGo(row, text);
};

/**
 * Gets the text content of the DOM tree rooted at a given node selecting
 * only visible nodes (i.e. display != none). The text content of all the
 * nodes is concatenated and separated with space.
 * @param {Node} node The root node.
 * @return {string} The text content.
 */
axsFinance.getSpaceSeparatedVisibleDescendantsTextContent = function(node) {
  var text = '';
  var xPath = './/descendant-or-self::*[not(contains(@style,"display: ' +
      'none;"))]/text()';
  var textNodes = axsFinance.axsJAXObj.evalXPath(xPath, node);

  for (var i = 0, count = textNodes.length; i < count; i++) {
    text = text + textNodes[i].textContent + ' ';
  }

  return text;
};

/**
 * Handles the focus event of the search box. Avoids focusing of
 * this element performed by the page scripts.
 * @param {Event} evt The focus event.
 */
axsFinance.searchBoxKeyHandler = function(evt) {
  if (!axsFinance.searchBoxFocusEnabled) {
    axsFinance.axsJAXObj.speakTextViaNode(' ');
    evt.target.blur();
  }
};

/**
 * Announces the page title and the index quote.
 */
axsFinance.announceIntro = function() {
  var xPath = 'id("companyheader")//h3';
  var titleNode = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];

  if (titleNode) {
    var title = axsFinance.parseSpecialCharsAndTokens(titleNode.textContent);
    title = axsFinance.str.GOOGLE_FINANCE_INDEX + '. ' + title;

    var ratio = axsFinance.getIndexQuote();
    var text = title + ' ' + ratio;

    var conversionResult = document.getElementById('price-panel');
    axsFinance.speakAndGo(conversionResult, text);
  }
};

/**
 * Returns the index quote.
 * @return {string} The index quote.
 */
axsFinance.getIndexQuote = function() {
  var pricePanel = document.getElementById('price-panel');
  var text = axsFinance.normalizeString(pricePanel.textContent);
  // we prevent mapping the last character to suffix
  text = text.replace(axsFinance.str.DISCLAIMER, '');
  text = text.replace(axsFinance.str.AM, ' ' + axsFinance.str.AM);
  text = text.replace(axsFinance.str.PM, ' ' + axsFinance.str.PM);
  // due to inconsistency in showing up changes as percent
  // (sometimes the + is there and sometimes omitted)
  text = text.replace(' (', ' ' + axsFinance.str.OR + ' ');
  return axsFinance.parseSpecialCharsAndTokens(text);
};

/**
 * Callback handler for reading elements in the 'Market data' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readMarketData = function(item) {
  var element = item.elem;
  var text = axsFinance.parseSpecialCharsAndTokens(element.textContent);
  axsFinance.speakAndGo(element, text);
};

/**
 * Reads the current quote.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readCurrentQuote = function(item) {
  var text = axsFinance.getIndexQuote();
  axsFinance.speakAndGo(item.elem, text);
};

/**
 * Speaks a text and positions the screen to an element.
 * @param {Node} element DOM node.
 * @param {string} text The text to be spoken.
 * characters.
 */
axsFinance.speakAndGo = function(element, text) {
  axsFinance.axsLensObj.view(element);
  axsFinance.axsJAXObj.speakTextViaNode(text);
  element.scrollIntoView(true);
  axsFinance.axsJAXObj.markPosition(element);
};

/**
 * Populates a template replacing special tokens (like {i} where i is is an
 * index) with concrete values.
 * @param {string} template The template string to populate.
 * @param {Array} values The array with replacement (concrete) values.
 * @return {string} The string generated from populating the template.
 */
axsFinance.populateTemplate = function(template, values) {
  var sentence = new String(template);
  for (var i = 0, value; i < values.length; i++) {
    sentence = sentence.replace('{' + i + '}', values[i]);
  }
  return sentence;
};

/**
 * Replaces phrases (i.e. the entire text), tokens (i.e. words), and symbols
 * (i.e. characters) of the processed text with predefined values (mappings).
 * built by alternating a phrase and a column content.
 * @param {string} text The text to be processed.
 * @return {string} The text with replaced phrases/tokens/symbols.
 */
axsFinance.parseSpecialCharsAndTokens = function(text) {
  var parsedText = '';

  //check input
  if (text === '') {
    return text;
  }

  //remove leading and trailing spaces
  text = axsFinance.normalizeString(text);

  //check for phrase word mapping
  var phraseMapping = axsFinance.phrasesMap[text];
  if (phraseMapping != undefined) {
    return phraseMapping;
  }

  //process every word separately
  var tokens = text.split(' ');
  for (var i = 0, t; t = tokens[i]; i++) {
    var token = tokens[i];

    //check for whole word mapping
    var tokenMapping = axsFinance.phrasesMap[token];
    if (tokenMapping != undefined) {
      token = tokenMapping;
    } else {

      //remove brackets
      if (token.length > 0 && token.charAt(0) === '(') {
        token = token.substring(1);
      }
      if (token.length > 1 && token.charAt(token.length - 1) === ')') {
        token = token.substring(0, token.length - 1);
      }

      //parse the first character
      var prefixMapping = axsFinance.prefixMap[token.charAt(0)];
      if (prefixMapping != undefined) {
        token = prefixMapping + ' ' + token.substring(1);
      }

      //parse the last character
      var lastCharacter = token.charAt(token.length - 1);
      var suffixMapping = axsFinance.suffixMap[lastCharacter];
      if (suffixMapping != undefined) {
        token = token.substring(0, token.length - 1) + ' ' + suffixMapping;
      }
    }
    parsedText = parsedText + ' ' + token;
  }

  return parsedText;
};

/**
 * Normalizes a string to enable correct presentation (i.e. speaking). All
 * leading and trailing spaces are truncated, all types of white space
 * characters are replaced by ' ', and all carriage returns ('\r') and line
 * feeds(\n) are removed.
 * @param {string} text The text to be normalized.
 * @return {string} The normalized version of the text.
 */
axsFinance.normalizeString = function(text) {
  //remove leading and trailing spaces
  text = text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  //replace fancy space characters with normal space (code 32)
  text = text.replace(/\s+/g, ' ');
  //remove carriage return and new line characters
  return text.replace(/\n+/g, '').replace(/\r+/g, '');
};

/**
 * Handler for key events. 'ESC' unfocuses the current focused element and
 * 'q' reads (speaks) the current quote.
 * @param {Event} evt A keypress event.
 * @return {boolean} If true, indicates that the event should be propagated.
 */
axsFinance.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27) { // ESC
    axsFinance.axsJAXObj.lastFocusedNode.blur();
    return false;
  }
  if (axsFinance.axsJAXObj.inputFocused) {
    return true;
  }

  if (evt.charCode == 46) { // .
    axsFinance.axsNavObj.showAvailableActionsSelector();
  }

  var command = axsFinance.charCodeMap[evt.charCode];

  if (command) {
    return command();
  }
  return true;
};

/**
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate
 *         that the keycode has been handled.
 */
axsFinance.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
 47 : function() {
        axsFinance.searchBoxFocusEnabled = true;
        document.getElementById('searchbox').focus();
        document.getElementById('searchbox').select();
        return false;
      },
  // ? (question mark)
  63 : function() {
        var helpStr = axsFinance.str.HELP +
            axsFinance.axsNavObj.localHelpString() +
        axsFinance.axsNavObj.globalHelpString();
        axsFinance.axsJAXObj.speakTextViaNode(helpStr);
        return false;
      },
  // - (minus symbol)
  45 : function() {
        axsFinance.magSize -= 0.10;
        axsFinance.axsLensObj.setMagnification(axsFinance.magSize);
        return false;
      },
  // = (equal symbol)
  61 : function() {
        axsFinance.magSize += 0.10;
        axsFinance.axsLensObj.setMagnification(axsFinance.magSize);
        return false;
      }
};

//Run the initialization routine of the script
window.addEventListener('load', axsFinance.initAxsJAX, true);

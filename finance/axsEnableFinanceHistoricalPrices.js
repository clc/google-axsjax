// Copyright 2009 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview AxsJAX script intended to enhance accessibility of
 * the Historical Prices page of Google Finance.
 *
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsFinance = {};

/**
 * Object that contains all string literal used for enhancing the presentation.
 * @type {Object}
 */
axsFinance.str = {
  UP_ABBR : '+',
  UP : 'up by ',
  DOWN_ABBR : '-',
  DOWN : 'down by ',
  TO_ABBR : '-',
  TO : 'to ',
  RECENT_QUOTE_TEMPLATE : '{0}, {1}, change {2}.',
  GOOGLE_FINANCE : 'Google Finance',
  RESULTS_FROM : 'results from',
  HISTORICAL_PRICE_TEMPLATE : '{0}, open {1}, high {2}, low {3}, close {4}, ' +
      'volume {5}.'
};

/**
 * The CNR for the page.
 * @type {string}
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

  '<target title="Create portfolio from quotes" hotkey="t" ' +
      'onEmpty="No recent quotes.">' +
    'id("rq-create")' +
  '</target>' +

  '<target title="Go to link" hotkey="ENTER">' +
    './/descendant-or-self::a' +
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

  '<list title="Historical prices" next="DOWN j" prev="UP k" fwd="n" ' +
      'back="p" type="dynamic" onEmpty="No historical prices">' +

    '<item action="CALL:axsFinance.readHistoricalPrice">' +
      'id("historical_price")//tr[not(@class="bb" or @class="tptr")]' +
    '</item>' +

    '<target title="Begin date" hotkey="b" ' +
        'onEmpty="No recent quotes.">' +
      'id("fromdate")' +
    '</target>' +

    '<target title="End date" hotkey="d" ' +
        'onEmpty="No recent quotes.">' +
      'id("todate")' +
    '</target>' +

    '<target title="Daily" hotkey="y">' +
      '//div[contains(@class,"gf-table-control")]//' +
          'a[contains(@href,"daily")]' +
    '</target>' +

    '<target title="Weekly" hotkey="w">' +
      '//div[contains(@class,"gf-table-control")]//' +
          'a[contains(@href,"weekly")]' +
    '</target>' +

    '<target title="Next page wrap" trigger="listTail">' +
      '//div[@class="SP_arrow_next"]' +
    '</target>' +

    '<target title="Previous page wrap" trigger="listHead">' +
      '//div[@class="SP_arrow_previous"]' +
    '</target>' +

    '<target title="Next page" hotkey="x">' +
      '//div[@class="SP_arrow_next"]' +
    '</target>' +

    '<target title="Previous page" hotkey="r">' +
      '//div[@class="SP_arrow_previous"]' +
    '</target>' +

    '<target title="Last page" hotkey="]">' +
      '//div[@class="SP_arrow_last"]' +
    '</target>' +

    '<target title="First page" hotkey="[" ' +
        'onEmpty="No previous pate">' +
      '//div[@class="SP_arrow_first"]' +
    '</target>' +

  '</list>' +

'</cnr>';

/**
 * Map from phrases to phrases
 */
axsFinance.phrasesMap = new Object();
axsFinance.phrasesMap[axsFinance.str.TO_ABBR] = axsFinance.str.TO;

/**
 * Map from prefix characters to strings
 * @type {Object}
 */
axsFinance.prefixMap = new Object();
axsFinance.prefixMap[axsFinance.str.DOWN_ABBR] = axsFinance.str.DOWN;
axsFinance.prefixMap[axsFinance.str.UP_ABR] = axsFinance.str.UP;

/**
 * Map from suffix characters to strings
 * @type {Object}
 */
axsFinance.suffixMap = new Object();

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsFinance.axsJAXObj = null;

/**
 * The AxsJAX navigation object which provides page navigation.
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
axsFinance.axsSoundObj = null;

/**
 * The PowerKey object that shows an auto completion element for valid
 * actions in the 'Criteria' section.
 * @type {PowerKey?}
 */
axsFinance.pkObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsFinance.magSize = 2.5;

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

    document.addEventListener('DOMNodeInserted',
        axsFinance.refreshRecentQuotesEventListener, false);

    //read the current quote
    axsFinance.announceIntro();
};

/**
 * Announces the introduction of the page.
 */
axsFinance.announceIntro = function() {
  var xPath = '//h3[following-sibling::a[@class="norm"]]';
  var companyNode = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];

  xPath = '//div[contains(@class,"gf-table-control")]//a';
  var periodNode = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];

  var text = axsFinance.str.GOOGLE_FINANCE + ', ' +
      axsFinance.normalizeString(companyNode.textContent) + ', ' +
      axsFinance.normalizeString(periodNode.textContent) + '  ' +
      axsFinance.str.RESULTS_FROM + ' ' + axsFinance.getPeriodAndResults();

  axsFinance.axsJAXObj.speakTextViaNode(text, false);
};

/**
 * This is a listener that refreshed the 'Recent quotes' list
 * and is registered for the event of inserting the recent quotes
 * table.
 *
 * @param {Event} evt A DOMNodeInserted event.
 */
axsFinance.refreshRecentQuotesEventListener = function(evt) {
  if (evt.target.className === 'd-quotes') {
    axsFinance.axsNavObj.refreshList('Recent quotes');
  }
};

/**
 * Returns the time interval for which historical data is shown and
 * result statistic.
 * @return {string} The period and results.
 */
axsFinance.getPeriodAndResults = function() {
  var xPath = '//div[@class="tpsd"]';
  var resultsNode = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];
  return axsFinance.parseSpecialCharsAndTokens(resultsNode.textContent);
};

/**
 * Reads items from the 'Historical prices' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readHistoricalPrice = function(item) {
  var element = item.elem;
  var phrases = new Array();

  for (var i = 1, cell; cell = element.childNodes[i]; i++) {
    phrases.push(axsFinance.parseSpecialCharsAndTokens(cell.textContent));
  }

  var text = axsFinance.populateTemplate(
      axsFinance.str.HISTORICAL_PRICE_TEMPLATE, phrases);
  axsFinance.speakAndGo(element, text);
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
 * Populates a template replacing special tokens (like {i} where is is an index)
 * with concrete values.
 * @param {string} template The template string to populate.
 * @param {Array} phrases The array with replacement (concrete) values.
 * @return {string} The populated template.
 */
axsFinance.populateTemplate = function(template, phrases) {
  var populatedTemplate = new String(template);
  for (var i = 0, value; i < phrases.length; i++) {
    var regExp = new RegExp('\{(' + i + ')\}', 'g');
    populatedTemplate = populatedTemplate.replace(regExp, phrases[i]);
  }
  return populatedTemplate;
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
 * @return {boolean} If true, the event should be propagated.
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
  var command = axsFinance.charCodeMap[evt.charCode];

  if (command) {
    return command();
  }

  return true;
};

/**
 * Map from character codes to functions.
 * @return {boolean} Always returns false to indicate that the keycode
 *         has been handled.
 */
axsFinance.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
 47 : function() {
        document.getElementById('searchbox').focus();
        document.getElementById('searchbox').select();
        return false;
      },
  // ? (question mark)
  63 : function() {
        var helpStr = axsFinance.HELP +
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

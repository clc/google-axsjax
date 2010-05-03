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
 * the Search Results page of Google Finance.
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
  TO_ABBR : '-',
  TO : 'to',
  HELP : 'The following shortcut keys are available.',
  RECENT_QUOTE_TEMPLATE : '{0}, {1}, change {2}.',
  COMPANY_TEMPLATE : '{0} with symbol {2} is traded on {1} for {3} which ' +
      'changed {4}. Market capitalization {5}.',
  MUTUAL_FUND_TEMPLATE : '{0} with symbol {1} has net asset value {2} which ' +
      'changed {3}.',
  NOT_ANNOUNCED : 'not announced'
};

/**
 * Map from abbreviated phrases to expanded phrases.
 */
axsFinance.phrasesMap = new Object();
//axsFinance.phrasesMap[axsFinance.str.TO_ABBR] = axsFinance.str.TO;

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

    '<target title="Show all" hotkey="a">' +
      '//a[contains(@href,"restype=t")]' +
    '</target>' +

    '<target title="Show companies" hotkey="c">' +
      '//a[contains(@href,"restype=company")]' +
    '</target>' +

    '<target title="Show funds" hotkey="f">' +
      '//a[contains(@href,"restype=mutualfund")]' +
    '</target>' +

    '<target title="Go to link" hotkey="ENTER">' +
      './/descendant-or-self::a' +
    '</target>' +

    '<target title="Read index description" hotkey="r" ' +
        'action="CALL:axsFinance.readIndexDescription">' +
      'id("page-content") | //div[@class="g-c"]/div[@class="g-wrap"]' +
    '</target>' +

    '<list title="Domestic trends" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p">' +

      '<item>' +
        '//li[@class="navsub"]' +
      '</item>' +

    '</list>' +

    '<list title="Recent quotes" next="DOWN j" prev="UP k" fwd="n" back="p"' +
        ' type="dynamic" onEmpty="No recent quotes">' +

      '<item action="CALL:axsFinance.readRecentQuote">' +
        'id("rq")//tr' +
      '</item>' +

      '<target title="Create portfolio from quotes" hotkey="t" ' +
          'onEmpty="No recent quotes.">' +
        'id("rq-create")' +
      '</target>' +

    '</list>' +

    '<list title="Recent activity" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic" onEmpty="No recent activities">' +

      '<item>' +
        '//li[@class="ra-entry"]' +
      '</item>' +

    '</list>' +

    '<list title="Companies" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" onEmpty="No companies">' +

      '<item action="CALL:axsFinance.readCompany">' +
        'id("company_results")/tbody/tr[not(@class="tptr")]' +
      '</item>' +

      '<target title="Next page wrap" trigger="listTail">' +
        '//div[@class="SP_arrow_next"]' +
      '</target>' +

      '<target title="Previous page wrap" trigger="listHead">' +
        '//div[@class="SP_arrow_previous"]' +
      '</target>' +

      '<target title="Next page" hotkey="x">' +
        '//div[@class="SP_arrow_next"]' +
      '</target>' +

      '<target title="Previous page" hotkey="v">' +
        '//div[@class="SP_arrow_previous"]' +
      '</target>' +

      '<target title="First page" hotkey="[">' +
        '//div[@class="SP_arrow_first"]' +
      '</target>' +

      '<target title="Last page" hotkey="]">' +
        '//div[@class="SP_arrow_last"]' +
      '</target>' +

    '</list>' +

    '<list title="Mutual funds" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" onEmpty="No mutual funds">' +

      '<item action="CALL:axsFinance.readMutualFund">' +
        'id("mf_results")/tbody/tr[not(@class="tptr")]' +
      '</item>' +

      '<target title="Next page" trigger="listTail">' +
        '//div[@class="SP_arrow_next"]' +
      '</target>' +

      '<target title="Previous page" trigger="listHead">' +
        '//div[@class="SP_arrow_previous"]' +
      '</target>' +

      '<target title="Next page" hotkey="x">' +
        '//div[@class="SP_arrow_next"]' +
      '</target>' +

      '<target title="Previous page" hotkey="v">' +
        '//div[@class="SP_arrow_previous"]' +
      '</target>' +

      '<target title="First page" hotkey="[">' +
        '//div[@class="SP_arrow_first"]' +
      '</target>' +

      '<target title="Last page" hotkey="]">' +
        '//div[@class="SP_arrow_last"]' +
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
 * Announces the page introduction.
 */
axsFinance.announceIntro = function() {
  var text = '';

  var xPath = '//h3';
  var titleNode = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];
  text = text + ' ' + axsFinance.normalizeString(titleNode.textContent);

  xPath = 'id("results-header")/div[@class="g-unit g-first"]/span/text()';
  var sectionNodes = axsFinance.axsJAXObj.evalXPath(xPath, document.body);
  for (var i = 0, sectionNode; sectionNode = sectionNodes[i]; i++) {
    text = text + ' ' + axsFinance.normalizeString(sectionNode.textContent);
  }

  text = text + '.';

  xPath = 'id("results-header")/div[@class!="g-unit g-first"]';
  var resultNodes = axsFinance.axsJAXObj.evalXPath(xPath, document.body);
  for (var i = 0, resultNode; resultNode = resultNodes[i]; i++) {
    text = text + ' ' + axsFinance.normalizeString(resultNode.textContent);
  }

  // tweak a bit to improve presentation
  text = text.replace('- -', '').replace(' - ', ' ' + axsFinance.str.TO + ' ');

  axsFinance.axsJAXObj.speakTextViaNode(text);
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
 * Reads a row from the 'Recent quotes' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readRecentQuote = function(item) {
  axsFinance.readTableRowViaTemplate(item.elem, './td[not(.//b)]',
      axsFinance.str.RECENT_QUOTE_TEMPLATE);
};

/**
 * Reads a row from the 'Companies' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readCompany = function(item) {
  axsFinance.readTableRowViaTemplate(item.elem, './td[@class!="asterisk lft"]',
    axsFinance.str.COMPANY_TEMPLATE);
};

/**
 * Reads a row from the 'Mutual funds' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readMutualFund = function(item) {
  axsFinance.readTableRowViaTemplate(item.elem, './td',
    axsFinance.str.MUTUAL_FUND_TEMPLATE);
};

/**
 * Reads a row from a table by populating cell values selected by a given
 * XPath in a given template.
 * @param {Node} row The row.
 * @param {string} xPath The XPath.
 * @param {string} template The template.
 */
axsFinance.readTableRowViaTemplate = function(row, xPath, template) {
  var columns = axsFinance.axsJAXObj.evalXPath(xPath, row);
  var values = new Array();

  for (var i = 0, length = columns.length; i < length; i++) {
    var value = axsFinance.getSpaceSeparatedVisibleDescendantsTextContent(
        columns[i]);
    value = axsFinance.normalizeString(value);

    if (value) {
      values[i] = axsFinance.parseSpecialCharsAndTokens(value);
    } else {
      values[i] = axsFinance.str.NOT_ANNOUNCED;
    }
  }

  var text = axsFinance.populateTemplate(template, values);

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

  return axsFinance.normalizeString(text);
};

/**
 * Reads rows the current index description.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readIndexDescription = function(item) {
  var descrNode = item.elem;

  // focus on the text so the user can read it by sentence
  descrNode.focus();

  var text = axsFinance.normalizeString(descrNode.textContent);
  alert(text);
  axsFinance.axsJAXObj.speakTextViaNode(text);
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
window.addEventListener('load', axsFinance.initAxsJAX, false);

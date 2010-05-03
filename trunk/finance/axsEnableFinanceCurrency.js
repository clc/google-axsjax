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
 * the Currency page of Google Finance.
 *
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsFinance = {};

/**
 * Help string to be spoken to the user
 * @type string
 */
axsFinance.HELP = 'The following shortcut keys are available. ';

/**
 * Strings for enhancing the presentation
 */
axsFinance.str = {
  OR : 'or',
  UP : ' up by ',
  UP_ABBR : '+',
  DOWN : ' down by ',
  DOWN_ABBR : '-',
  PRCNT : ' percent',
  PRCNT_ABBR : '%',
  GOOGLE_FINANCE_CURRENCY : 'Google Finance Currency',
  CONVERTER_OPENED : 'Currency converter opened',
  CONVERTER_CLOSED : 'Currency converter closed',
  AMOUNT : 'Amount',
  CONVERTER_RESULT : 'Conversion result.',
  CURRENCY_TEMPLATE : '{0}, {1}, {2} or {3}.',
  QUOTE_TEMPLATE : '{0}, {1}, or {2}.',
  PM : 'PM',
  AM : 'AM'
};

/**
 * Map from abbreviated phrases to expanded phrases.
 * @type {Object}
 */
axsFinance.phrasesMap = new Object();

/**
 * Map from prefix characters to strings.
 * @type {Object}
 */
axsFinance.prefixMap = new Object();
axsFinance.prefixMap[axsFinance.str.DOWN_ABBR] = axsFinance.str.DOWN;
axsFinance.prefixMap[axsFinance.str.UP_ABBR] = axsFinance.str.UP;

/**
 * Map from suffix characters to strings.
 * @type {Object}
 */
axsFinance.suffixMap = new Object();
axsFinance.suffixMap[axsFinance.str.PRCNT_ABBR] = axsFinance.str.PRCNT;

/**
 * CNR
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

    '<target title="Announce currency ratio" hotkey="t" ' +
        'action="CALL:axsFinance.announceCurrencyRatio">' +
      '//html' +
    '</target>' +

    '<target title="View reversed ratio" hotkey="v">' +
      'id("currency_reverse")' +
    '</target>' +

    '<target title="Open or close currency converter" hotkey="c" ' +
        'action="CALL:axsFinance.openCloseCurrencyConverter">' +
      '//html' +
    '</target>' +

    '<target title="Go to link" hotkey="ENTER">' +
      './/descendant-or-self::a' +
    '</target>' +

    '<target title="Create portfolio from quotes" hotkey="r" ' +
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
        'back="p" type="dynamic">' +

      '<item>' +
        '//li[@class="ra-entry"]' +
      '</item>' +

    '</list>' +

    '<list title="News" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p">' +

      '<item action="CALL:axsFinance.readNews">' +
        '//div[@class="news-item"]' +
      '</item>' +

      '<target title="View all news" hotkey="a">' +
        '//a[contains(text(), "View all news for")]' +
      '</target>' +

      '<target title="Subscribe" hotkey="u">' +
        '//a[./img[@id="subscribe"]]' +
      '</target>' +

    '</list>' +

    '<list title="Value in other currencies" next="DOWN j" prev="UP k" ' +
        'fwd="n" back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readInOtherCurrency">' +
        '//table[@class="currencies"]//tr' +
      '</item>' +

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
 * Array of DOM elements members of a category. Used for restricting the
 * TAB, Shift + TAB into this category.
 * @type {Array?}
 */
axsFinance.categoryInputElements = null;

/**
 * Flag indicating if the Currency converter is active.
 * @type {boolean}
 */
axsFinance.currencyConverterOpened = false;

/**
 * Initializes the AxsJAX script for Google Finance - Currency page.
 */
axsFinance.initAxsJAX = function() {
  //Initialize AxsJAX object
  axsFinance.axsJAXObj = new AxsJAX(true);

  //Initialize AxsNav object
  axsFinance.axsNavObj = new AxsNav(axsFinance.axsJAXObj);
  axsFinance.axsNavObj.navInit(axsFinance.CNR, null);

  //Initialize AxsLens object
  axsFinance.axsLensObj = new AxsLens(axsFinance.axsJAXObj);
  axsFinance.axsLensObj.setMagnification(axsFinance.magSize);
  axsFinance.axsNavObj.setLens(axsFinance.axsLensObj);

  //Initialize AxsSound object
  axsFinance.axsSound = new AxsSound(true);
  axsFinance.axsNavObj.setSound(axsFinance.axsSound);

  //Initialize PowerKey object
  axsFinance.powerKeyObj = new PowerKey('list', axsFinance.axsJAXObj);
  axsFinance.axsNavObj.setPowerKey(axsFinance.powerKeyObj, '.');

  //Add event listeners
  document.addEventListener('keypress', axsFinance.keyHandler, true);

  var searchBox = document.getElementById('searchbox');
  var func = axsFinance.initialFocusWorkaroundEventHandler;
  searchBox.addEventListener('keypress', func, true);

  document.addEventListener('DOMNodeInserted',
    axsFinance.refreshRecentQuotesEventListener, false);

  //Initialize the page
  axsFinance.announceIntro();
  axsFinance.instrumentInnerIframe();
};

/**
 * Announces the page title and the currency ratio.
 */
axsFinance.announceIntro = function() {
  var text = axsFinance.str.GOOGLE_FINANCE_CURRENCY + ' ' +
      axsFinance.getCurrencyRatio();

  var conversionResult = document.getElementById('currency_value');
  axsFinance.speakAndGo(conversionResult, text);
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
 * Instruments the inner iframe by adding event listeners which
 * delegate to functions of this script. We listen for key events
 * to enable trapping of the TAB, Shift + TAB in the inner iframe,
 * blurring the currently focused element on ESC, and navigation.
 * We also listen for the submit event since on pressing the 'Convert'
 * button the inner iframe is reloaded and should be instrumented again
 * as well as the result of the conversion should be read.
 */
axsFinance.instrumentInnerIframe = function() {
  var xPath = '//iframe[contains(@src,"/finance/converter")]';
  var iframe = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];

  var id = 'currency_converter_result';
  var result = iframe.contentDocument.getElementById(id);

  //Check if the inner iframe is valid and populated.
  if (iframe.contentDocument.invalid === undefined && result) {

    //Key handler to delegate to the Key handler of this script
    var func = axsFinance.keyHandler;
    iframe.contentDocument.addEventListener('keypress', func, true);

    //Key handler to delegate to the Key handler of the AxsNav object
    func = axsFinance.axsNavObj.keyHandler;
    iframe.contentDocument.addEventListener('keypress', func, true);

    //Submit handler
    func = function(evt) {
        //The iframe is about to be reloaded => it is invalid
        iframe.contentDocument.invalid = true;
        axsFinance.instrumentInnerIframe();
        axsFinance.openCloseCurrencyConverter(null);
    };
    iframe.contentDocument.addEventListener('submit', func, true);

    //Focus handler
    func = function(evt) {
             axsFinance.axsJAXObj.lastFocusedNode = evt.target;
             if ((evt.target.tagName == 'INPUT') ||
                 (evt.target.tagName == 'SELECT') ||
                 (evt.target.tagName == 'TEXTAREA')) {
               axsFinance.axsJAXObj.inputFocused = true;
             }
             return true;
           };
    iframe.contentDocument.addEventListener('focus', func, true);

    //Blur handler
    func = function(evt) {
             axsFinance.axsJAXObj.lastFocusedNode = null;
             if ((evt.target.tagName == 'INPUT') ||
                 (evt.target.tagName == 'SELECT') ||
                 (evt.target.tagName == 'TEXTAREA')) {
               axsFinance.axsJAXObj.inputFocused = false;
             }
             return true;
           };
    iframe.contentDocument.addEventListener('blur', func, true);

    axsFinance.setCurrentCatogoryInputs(iframe);
    axsFinance.readConversionResult();
  } else {
    //Poll every 100ms.
    window.setTimeout(axsFinance.instrumentInnerIframe, 100);
  }
};

/**
 * Read the result of the currency conversion.
 */
axsFinance.readConversionResult = function() {
  var xPath = '//iframe[contains(@src,"/finance/converter")]';
  var iframe = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];

  var id = 'currency_converter_result';
  var resultElem = iframe.contentDocument.getElementById(id);
  var result = axsFinance.normalizeString(resultElem.textContent);

  if (result !== '') {
    var text = axsFinance.str.CONVERTER_CLOSED;
    text = text + ' ' + axsFinance.str.CONVERTER_RESULT + ' ' + result;
    axsFinance.axsLensObj.view(resultElem);
    resultElem.scrollIntoView(true);
    axsFinance.axsJAXObj.markPosition(resultElem);

    window.setTimeout(function() {
                        axsFinance.axsJAXObj.speakTextViaNode(text);
                      },
                      0);
  }
};

/**
 * Event handler for the very first 'keypress' event accepted by the
 * search box. The default implementation focuses on the search box.
 * This behavior is undesirable since we do not want a blind user to
 * get stuck in the search box.
 * @param {Event} evt A focus event.
 */
axsFinance.initialFocusWorkaroundEventHandler = function(evt) {
  //Interrupt the TTS
  axsFinance.axsJAXObj.speakTextViaNode('');

  //Swallow the event to prevent default behavior
  evt.target.blur();
  evt.stopPropagation();
  evt.preventDefault();

  //If the key was mapped to a function => execute it
  var command = axsFinance.axsNavObj.getFunctionForKey(evt.keyCode,
                                                        evt.charCode);
  if (command) {
    command();
  }

  //This handler is applicable only to the first keypress event
  var func = axsFinance.initialFocusWorkaroundEventHandler;
  var searchBox = document.getElementById('searchbox');
  searchBox.removeEventListener('keypress', func, true);
};

/**
 * Callback handler for announcing the currency ratio.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.announceCurrencyRatio = function(item) {
  var text = axsFinance.getCurrencyRatio();
  var conversionResult = document.getElementById('currency_value');
  axsFinance.speakAndGo(conversionResult, text);
};

/**
 * Returns the currency ratio.
 * @return {string} The currency ratio.
 */
axsFinance.getCurrencyRatio = function() {
  var currencyValue = document.getElementById('currency_value');
  var text = axsFinance.normalizeString(currencyValue.textContent);
  // we prevent mapping the last character to suffix
  text = text.replace(axsFinance.str.AM, ' ' + axsFinance.str.AM);
  text = text.replace(axsFinance.str.PM, ' ' + axsFinance.str.PM);
  // due to inconsistency in showing up changes as percent
  // (sometimes the + is there and sometimes omitted)
  text = text.replace(' (', ' ' + axsFinance.str.OR + ' ');
  return axsFinance.parseSpecialCharsAndTokens(text);
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
    values[i] = axsFinance.normalizeString(values[i]);
  }

  var text = axsFinance.populateTemplate(axsFinance.str.QUOTE_TEMPLATE, values);
  axsFinance.speakAndGo(row, text);
};

/**
 * Reads an item from the 'News' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readNews = function(item) {
  // this does the default action the framework is supposed to do but for
  // some reason it fails: The first time the list is traversed nothing
  // is spoken but earcons are played.
  // FIXME (svetoslavganov): Remove after the above issue is resolved.
  var element = item.elem;
  var xPath = './/div[@class="cluster"]';
  var newsNode = axsFinance.axsJAXObj.evalXPath(xPath, element)[0];
  axsFinance.speakAndGo(element, newsNode.textContent);
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
 * Reads rows from a table and populates the values in a given template.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readInOtherCurrency = function(item) {
  var row = item.elem;

  var xPath = './td[not(.//b)]';
  var columns = axsFinance.axsJAXObj.evalXPath(xPath, row);
  var values = new Array();
  var valueIndex = 0;

  for (var i = 0, length = columns.length; i < length; i++) {
    var value = axsFinance.normalizeString(columns[i].textContent);
    if (value == '') {
      continue;
    }
    if (value.indexOf('(') > 0) {
      var split = value.split('(');
      values[valueIndex++] = axsFinance.parseSpecialCharsAndTokens(split[0]);
      value = axsFinance.parseSpecialCharsAndTokens(split[1]);
    }
    values[valueIndex++] = value;
  }

  var text = axsFinance.populateTemplate(axsFinance.str.CURRENCY_TEMPLATE,
      values);

  axsFinance.speakAndGo(row, text);
};

/**
 * Set the focus to an element of the 'Currency converter' iFrame.
 * This make the iFrame active and it starts responding to user actions.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsFinance.openCloseCurrencyConverter = function(item) {
  if (axsFinance.currencyConverterOpened) {
    axsFinance.currencyConverterOpened = false;
    var input = document.getElementsByTagName('INPUT')[0];
    input.focus();
    axsFinance.axsJAXObj.speakTextViaNode(axsFinance.str.CONVERTER_CLOSED);
    input.blur();
  } else {
    axsFinance.currencyConverterOpened = true;
    var xPath = '//iframe[contains(@src,"/finance/converter")]';
    var iframe = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];
    var input = iframe.contentDocument.getElementsByTagName('INPUT')[0];

    //The screen reader lacks queuing. Use the title as a workaround.
    var oldTitle = input.title;
    input.title = axsFinance.str.CONVERTER_OPENED + '. ' + input.title;

    var func = function() {
          input.focus();
          input.select();
          // restore the title - see above
          input.title = oldTitle;
        };
    window.setTimeout(func, 1000);
  }
};

/**
 * Sets the inputs (as an array) of the current category
 * @param {Node} categoryNode The category DOM node.
 */
axsFinance.setCurrentCatogoryInputs = function(categoryNode) {
  var inputs = categoryNode.contentDocument.getElementsByTagName('INPUT');
  //Amount
  var amount = inputs[0];
  amount.title = axsFinance.str.AMOUNT;
  //Convert
  var convert = inputs[1];

  var selects = categoryNode.contentDocument.getElementsByTagName('SELECT');
  //From currency
  var fromCurrency = selects[0];
  var labelText = document.createTextNode('From currency: ');
  var id = axsFinance.axsJAXObj.assignId(fromCurrency);
  var selectLabel = document.createElement('LABEL');
  selectLabel.setAttribute('for', String(id));
  selectLabel.appendChild(labelText);
  fromCurrency.parentNode.insertBefore(selectLabel, fromCurrency);
  //To currency
  var toCurrency = selects[1];
  var labelText = document.createTextNode('To currency: ');
  var id = axsFinance.axsJAXObj.assignId(toCurrency);
  var selectLabel = document.createElement('LABEL');
  selectLabel.setAttribute('for', String(id));
  selectLabel.appendChild(labelText);
  toCurrency.parentNode.insertBefore(selectLabel, toCurrency);

  var inputElements = new Array(amount, fromCurrency, toCurrency, convert);
  axsFinance.categoryInputElements = inputElements;
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
 * Event handler for the TAB and Shift + TAB keypress events used for
 * navigation in the current category.
 * @param {Event} evt A keypress event.
 */
axsFinance.tabAndShiftTabWrapEventHandler = function(evt) {
  var target = evt.target;
  var inputs = axsFinance.categoryInputElements;
  var inputsLength = inputs.length;
  var nextInputIndex = -1;

  for (var i = 0, input; input = inputs[i]; i++) {
    if (target === input) {
      nextInputIndex = i;
      break;
    }
  }

  if (evt.shiftKey) {
    nextInputIndex--;
    if (nextInputIndex < 0) {
      nextInputIndex = inputsLength - 1;
    }
  } else {
    nextInputIndex++;
    if (nextInputIndex == inputsLength) {
      nextInputIndex = 0;
    }
  }

  var nextInput = inputs[nextInputIndex];
  nextInput.focus();

  if (nextInput.tagName == 'INPUT') {
    nextInput.select();
  }

  //Swallow the event
  evt.stopPropagation();
  evt.preventDefault();
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
 * @return {string} The normalized text.
 */
axsFinance.normalizeString = function(text) {
  var normalizedStr = new String(text);
  //remove leading and trailing spaces
  normalizedStr = normalizedStr.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  //replace fancy space characters with normal space (code 32)
  normalizedStr = normalizedStr.replace(/\s+/g, ' ');
  //remove carriage return and new line characters
  return normalizedStr.replace(/\n+/g, '').replace(/\r+/g, '');
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
    if (axsFinance.axsJAXObj.lastFocusedNode) {
      axsFinance.axsJAXObj.lastFocusedNode.blur();
    }
    return false;
  }

  if (evt.keyCode == 9) { // TAB
    if (axsFinance.categoryInputElements !== null) {
      axsFinance.tabAndShiftTabWrapEventHandler(evt);
    }
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
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate that the keycode
 * has been handled.
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

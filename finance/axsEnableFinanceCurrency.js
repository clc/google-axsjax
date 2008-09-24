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
  GOOGLE_FINANCE : 'Google Finance',
  CONVERTER_OPENED : 'Currency converter opened',
  CONVERTER_CLOSED : 'Currency converter closed',
  AMOUNT : 'Amount',
  CONVERTER_RESULT : 'Conversion result.'
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
axsFinance.charPrefixMap = new Object();
axsFinance.charPrefixMap[axsFinance.str.DOWN_ABBR] = axsFinance.str.DOWN;
axsFinance.charPrefixMap[axsFinance.str.UP_ABBR] = axsFinance.str.UP;

/**
 * Map from suffix characters to strings.
 * @type {Object}
 */
axsFinance.charSuffixMap = new Object();
axsFinance.charSuffixMap[axsFinance.str.PRCNT_ABBR] = axsFinance.str.PRCNT;

/**
 * CNR
 * @type {string}
 */
axsFinance.CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

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

    '<list title="News" next="DOWN j" prev="UP k" fwd="n" ' +
        'back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readNewsDesc">' +
        'id("newsmovingdiv")//div[@class="inner"]//tbody' +
      '</item>' +

      '<target title="Go to link" hotkey="ENTER">' +
        './/a' +
      '</target>' +

      '<target title="View all news" hotkey="a">' +
        '//a[contains(text(), "View all news for")]' +
      '</target>' +

      '<target title="Subscribe" hotkey="s">' +
        '//a[./img[@id="subscribe"]]' +
      '</target>' +

      '<target title="Related articles" hotkey="r" ' +
          'onEmpty="No related articles available">' +
        './../../..//a[@class="g bld" or @class="rl" or @class="rg"]' +
      '</target>' +

    '</list>' +

    '<list title="Value in other currencies" next="DOWN j" prev="UP k" ' +
        'fwd="n" back="p" type="dynamic">' +

      '<item action="CALL:axsFinance.readInOtherCurrency">' +
        '//table[@class="related-currencies"]//tr' +
      '</item>' +

      '<target title="See ratio with that currency" hotkey="ENTER">' +
        './/a' +
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
axsFinance.init = function() {
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

  //Initialize the page
  axsFinance.announceIntro();
  axsFinance.instrumentInnerIframe();
};

/**
 * Announces the page title and the currency ratio.
 */
axsFinance.announceIntro = function() {
  var xPath = 'id("companyheader")//h1';
  var titleNode = axsFinance.axsJAXObj.evalXPath(xPath, document.body)[0];
  if (titleNode) {
    var title = axsFinance.parseSpecChrsAndTkns(titleNode.textContent);
    title = axsFinance.str.GOOGLE_FINANCE + '. ' + title;

    var ratio = axsFinance.getCurrencyRatio();
    var text = title + ' ' + ratio;
    axsFinance.axsJAXObj.speakTextViaNode(text);
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
  var iframe = document.getElementsByTagName('IFRAME')[0];
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
  var iframe = document.getElementsByTagName('IFRAME')[0];
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
  axsFinance.axsJAXObj.speakTextViaNode(text);
};

/**
 * Returns the currency ratio.
 * @return {string} The currency ratio.
 */
axsFinance.getCurrencyRatio = function() {
  var ratioNode = document.getElementById('currency_value');

  var ratio = ratioNode.textContent;
  ratio = ratio.replace('(', axsFinance.str.OR + ' ');

  //remove the text of the link
  var link = ratioNode.childNodes[9].textContent;
  var index = ratio.indexOf(link);
  ratio = ratio.substring(0, index - 2);

  ratio = axsFinance.parseSpecChrsAndTkns(ratio);
  return ratio;
};

/**
 * Callback handler for reading the 'News' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readNewsDesc = function(item) {
  var element = item.elem;
  var xPath = './/td[@class="title" or @class="source"]';
  var contents = axsFinance.axsJAXObj.evalXPath(xPath, element);

  var text = contents[0].textContent + '. ';
  text = text + contents[1].childNodes[0].textContent;
  text = text + contents[1].childNodes[1].textContent;
  text = axsFinance.normalizeString(text);
  axsFinance.speakAndGo(item.elem, text);
};

/**
 * Callback handler for reading the 'In other currencies' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readInOtherCurrency = function(item) {
  var element = item.elem;

  var currency = element.childNodes[1].textContent;
  var value = element.childNodes[3].textContent;
  value = axsFinance.normalizeString(value);

  //Remove currency symbol if exists
  var index = value.indexOf(' ');
  if (index > -1) {
      value = value.substring(index);
  }

  var abbreviation = element.childNodes[5].textContent;
  abbreviation = axsFinance.addSpaceBetweenChars(abbreviation);
  var absChange = element.childNodes[7].childNodes[1].textContent;
  absChange = axsFinance.parseSpecChrsAndTkns(absChange);
  var relChange = element.childNodes[7].childNodes[3].textContent;
  relChange = axsFinance.parseSpecChrsAndTkns(relChange);

  var text = currency + ' ' + value + ' ' + abbreviation;
  text = text + ' ' + absChange + ' ' + axsFinance.str.OR + ' ' + relChange;

  axsFinance.speakAndGo(element, text);
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
    var iframe = document.getElementsByTagName('IFRAME')[0];
    var input = iframe.contentDocument.getElementsByTagName('INPUT')[0];

    //The screen reader lacks queuing. Use the title as a workaround.
    var oldTitle = input.title;
    input.title = axsFinance.str.CONVERTER_OPENED + '. ' + input.title;
    input.title = oldTitle;

    var func = function() {
                 input.focus();
                 input.select();
               };
    window.setTimeout(func, 0);
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
  selectLabel.setAttribute('for', id);
  selectLabel.appendChild(labelText);
  fromCurrency.parentNode.insertBefore(selectLabel, fromCurrency);
  //To currency
  var toCurrency = selects[1];
  var labelText = document.createTextNode('To currency: ');
  var id = axsFinance.axsJAXObj.assignId(toCurrency);
  var selectLabel = document.createElement('LABEL');
  selectLabel.setAttribute('for', id);
  selectLabel.appendChild(labelText);
  toCurrency.parentNode.insertBefore(selectLabel, toCurrency);

  var inputElements = new Array(amount, fromCurrency, toCurrency, convert);
  axsFinance.categoryInputElements = inputElements;
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
 * @param {Node} element DOM node 
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
 * Adds white spaces between the characters of a string
 * @param {string} text The processed text.
 * @return {string} The processed text with white spaces added between its
 * characters.
 */
axsFinance.addSpaceBetweenChars = function(text) {
  var textWithSpaces = '';
  for (var i = 0; i < text.length; i++) {
    textWithSpaces = textWithSpaces + text.charAt(i);
    if (i < text.length - 1) {
      textWithSpaces = textWithSpaces + ' ';
    }
  }
  return textWithSpaces;
};

/**
 * Replaces phrases (i.e. the entire text), tokens (i.e. words), and symbols
 * (i.e. characters) of the processed text with predefined values (mappings).
 * built by alternating a phrase and a column content.
 * @param {string} text The text to be processed
 * @return {string} The text with replaced phrases/tokens/symbols.
 */
axsFinance.parseSpecChrsAndTkns = function(text) {
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
  for (var i = 0, token; token = tokens[i]; i++) {
    //check for whole word mapping
    var tokenMapping = axsFinance.phrasesMap[token];
    if (tokenMapping != undefined) {
      token = tokenMapping;
    } else {
      //remove parentheses
      if (token.length > 0 && token.charAt(0) === '(') {
        token = token.substring(1);
      }
      if (token.length > 1 && token.charAt(token.length - 1) === ')') {
        token = token.substring(0, token.length - 1);
      }
      //parse the first character
      var prefixMapping = axsFinance.charPrefixMap[token.charAt(0)];
      if (prefixMapping != undefined) {
        token = prefixMapping + ' ' + token.substring(1);
      }
      //parse the last character
      var lastCharacter = token.charAt(token.length - 1);
      var suffixMapping = axsFinance.charSuffixMap[lastCharacter];
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
 * @param {Event} evt A keypress event
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
       axsFinance.searchBoxFocusEnabled = true;
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
    }
};

//Run the initialization routine of the script
window.addEventListener('load', axsFinance.init, true);

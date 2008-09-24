// Copyright 2008 Google Inc.
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
 * the Stock screener page of Google Finance.
 * 
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsFinance = {};


/**
 * Object that contains all string literal used for enhancing the presentation
 * @type {Object}
 */
axsFinance.str = {
  XPATH_TEMPLATE : 'id("{0}")//tr[position() &gt;= {1} ' +
      'and position() &lt;= {2}]',
  MAR_ABBR : '03',
  MAR : 'March',
  JUN_ABBR : '06',
  JUN : 'June',
  SEP_ABBR : '09',
  SEP : 'September',
  DEC_ABBR : '12',
  DEC : 'December',
  N_A_ABBR : '-',
  N_A : 'Not available',
  AND_ABBR : '&',
  AND : 'and'
};

/**
 * Top section of the 'Results' CNR which is dynamically generated
 * @type {string}
 */
axsFinance.CNR_TOP = '<cnr next="RIGHT l" prev="LEFT h">' +

  '<target title="Quarterly data" hotkey="q" ' +
      'onEmpty="Quarterly data already opened" ' +
      'action="CALL:axsFinance.storeCurrentPositionAndClickOnLink">' +
    'id("interim")[@class="nac"]' +
  '</target>' +

  '<target title="Annual data" hotkey="a" ' +
      'onEmpty="Annual data already opened" ' +
      'action="CALL:axsFinance.storeCurrentPositionAndClickOnLink">' +
    'id("annual")[@class="nac"]' +
  '</target>' +

  '<target title="Income statement" hotkey="i" ' +
      'onEmpty="Income statement already opened">' +
    'id("inc")[@class="nac"]' +
  '</target>' +

  '<target title="Balance sheet" hotkey="b" ' +
      'onEmpty="Balance sheet already opened">' +
    'id("bal")[@class="nac"]' +
  '</target>' +

  '<target title="Cash flow" hotkey="c" ' +
      'onEmpty="Cash flow already opened">' +
    'id("cas")[@class="nac"]' +
  '</target>' +

  '<target title="Stock screener" hotkey="s">' +
    '//a[@class="screener-link"]' +
  '</target>';

/**
 * Body section of the 'Results' CNR which is a template applied for each column
 * @type {string}
 */
axsFinance.CNR_BODY = '<list title="{0}" fwd="DOWN j n" ' +
      'back="UP k p">' +

    '<item action="CALL:axsFinance.readTableRow">' +
      '{1}' +
    '</item>' +

  '</list>';

/**
 * Bottom section of the 'Results' CNR which is dynamically generated
 * @type {string}
 */
axsFinance.CNR_BOTTOM = '</cnr>';


/**
 * Stores the last list index to enable handling the multiple list that compose 
 * the results as a table i.e. traversal is performed column by column on the 
 * same row (i.e. the current row does not change)
 */
axsFinance.previousIdx = -1;

/**
 * Stores the last visited criteria row. Needed for reseting the row to its
 * default visual representation upon leaving the criteria list.
 * @type {Object?}
 */
axsFinance.lastCriteriaRow = null;

/**
 * Buffer for queuing TTS messages 
 * @type {string} 
 */
axsFinance.messageBuffer = '';

/**
 * Flag indicating completion of the initial loading of the page
 * @type {boolean} 
 */
axsFinance.initComplete = false;

/**
 * Map from phrases to phrases
 */
axsFinance.phrasesMap = new Object();
axsFinance.phrasesMap[axsFinance.str.MAR_ABBR] = axsFinance.str.MAR;
axsFinance.phrasesMap[axsFinance.str.JUN_ABBR] = axsFinance.str.JUN;
axsFinance.phrasesMap[axsFinance.str.SEP_ABBR] = axsFinance.str.SEP;
axsFinance.phrasesMap[axsFinance.str.DEC_ABBR] = axsFinance.str.DEC;
axsFinance.phrasesMap[axsFinance.str.N_A_ABBR] = axsFinance.str.N_A;
axsFinance.phrasesMap[axsFinance.str.AND_ABBR] = axsFinance.str.AND;

/**
 * Map from prefix characters to strings
 * @type {Object}
 */
axsFinance.charPrefixMap = new Object();
axsFinance.charPrefixMap[axsFinance.str.MINUS_ABR] = axsFinance.str.MINUS;
axsFinance.charPrefixMap[axsFinance.str.UP_ABR] = axsFinance.str.UP;

/**
 * Map from suffix characters to strings
 * @type {Object}
 */
axsFinance.charSuffixMap = new Object();

/**
 * These are strings to be spoken to the user
 */
axsFinance.HELP = 'The following shortcut keys are available. ';

/**
 * Map for flags indicating if a handler for an event has been triggered
 * @type {Object}
 */
axsFinance.eventHandlerToEventMap = new Object();

/**
 * Time out for processing events accepted by watched nodes
 */
axsFinance.EVT_HANDL_TIMEOUT_INT = 300;

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
 * The power key object used for quick search
 * @type {Object?} 
 */
axsFinance.pkResultSearchObj = null;

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
 * Stores the current CNR position. Needed for switching between annual and
 * quarterly data for which different CNRs are generated but the data has the
 * same format. We keep the user on the same record during the switch.
 * @type {Object?}
 */
axsFinance.currentCNRPosition = null;

/**
 * Stores the index of the previous list in the 'Results' section. Each column
 * of the results table is a separate list. However, the user can navigate in
 * the results table using the arrows and this separation in lists is
 * transparent. This index helps identifying when to play a wrap sound while
 * switching the lists.
 * @type {number}
 */
axsFinance.prevNavListIdx = 0;

/**
 * Template for reading items from all lists. This template is 
 * dynamically generated.
 * @type {string}
 */
axsFinance.listItemTemplate = '';

/**
 * The id of the currently active section (i.e. visible data table)
 * @type {string}
 */
axsFinance.visibleCategotyClassName = 'incinterimdiv';

/**
 * Initializes the AxsJAX script for Google finance - quotes page.
 */
axsFinance.initAxsJAX = function() {
  //Initialize the AxsJAX framework utilities
  axsFinance.axsJAXObj = new AxsJAX(true);
  axsFinance.axsLensObj = new AxsLens(axsFinance.axsJAXObj);
  axsFinance.axsLensObj.setMagnification(axsFinance.magSize);
  axsFinance.axsSoundObj = new AxsSound(true);

  //AxsNav
  axsFinance.axsNavObj = new AxsNav(axsFinance.axsJAXObj);
  axsFinance.axsNavObj.setLens(axsFinance.axsLensObj);
  axsFinance.pkObj = new PowerKey('list', axsFinance.axsJAXObj);
  axsFinance.initializeNavigation();
  axsFinance.axsNavObj.setSound(axsFinance.axsSoundObj);

  //Add event listeners
  var func = axsFinance.keyHandler;
  document.addEventListener('keypress', func, true);

  func = axsFinance.documentDOMSubtreeModifiedEventHandler;
  document.addEventListener('DOMSubtreeModified', func, true);
};

/**
 * Builds the CNR for the current state of the page and
 * initializes the AxsNav object with that CRN. Also the 
 * key binding for accessing the available actions is set.
 */
axsFinance.initializeNavigation = function() {
  var template = axsFinance.generateListItemTemplate();
  axsFinance.listItemTemplate = template;

  var cnrStr = axsFinance.generateCnrStr();
  axsFinance.axsNavObj.navInit(cnrStr);

  axsFinance.axsNavObj.setPowerKey(axsFinance.pkObj, '.');
};

/**
 * Announces the current section and period.
 */
axsFinance.announceActiveSectionAndPeriod = function() {
  var xPath = '//a[(@id="inc" or @id="bal" or @id="cas" or @id="interim" or ' +
      '@id="annual") and @class="ac"]';
  var stateLinks = axsFinance.axsJAXObj.evalXPath(xPath, document.body);
  var activeSection = stateLinks[0].textContent;
  var activePeriod = stateLinks[1].textContent;
  var text = activeSection + ' ' + activePeriod;
  axsFinance.axsJAXObj.speakTextViaNode(text, null);
};

/**
 * Stores the current CNR position and click on a page link.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.storeCurrentPositionAndClickOnLink = function(item) {
  var listIdx = axsFinance.axsNavObj.navListIdx;
  var itemIdx = axsFinance.axsNavObj.navItemIdxs[listIdx];
  var currentPosition = new Object();
  currentPosition.listIdx = listIdx;
  currentPosition.itemIdx = itemIdx;
  axsFinance.currentCNRPosition = currentPosition;

  var element = item.elem;
  axsFinance.axsJAXObj.clickElem(element, false);
};

/**
 * Builds a CNR string for the page.
 * @return {string} The CNR string.
 */
axsFinance.generateCnrStr = function() {
  var cnrStr = axsFinance.CNR_TOP;
  var listCNR = '';
  var title = '';
  var begIndex = 2;  //first two rows are irrelevant
  var endIndex = 0;
  var xPath = 'id("' + axsFinance.visibleCategotyClassName + '")//tr';
  var rows = axsFinance.axsJAXObj.evalXPath(xPath, document.body);

  for (var i = 0, row; row = rows[i]; i++) {
    if (row.childNodes.length === 1) {
      endIndex = i;
      title = rows[i - 1].childNodes[1].textContent;
      title = axsFinance.parseSpecChrsAndTkns(title);
      listCNR = axsFinance.generateListCnrStr(title, begIndex, endIndex);
      cnrStr = cnrStr + listCNR;
      begIndex = endIndex + 2;
    }
  }
  cnrStr = cnrStr + axsFinance.CNR_BOTTOM;
  return cnrStr;
};

/**
 * Generates the CNR string for a list.
 * @param {string} title The lists title.
 * @param {number} begIndex The index of the first table row.
 * @param {number} endIndex The index of the last table row.
 * @return {string} The CNR string for the list.
 */
axsFinance.generateListCnrStr = function(title, begIndex, endIndex) {
  var phrases = new Array(axsFinance.visibleCategotyClassName,
                      begIndex,
                          endIndex);
  var cnrXPath = axsFinance.populateTemplate(axsFinance.str.XPATH_TEMPLATE,
                                         phrases);
  phrases = new Array(title, cnrXPath);
  var listCNR = axsFinance.populateTemplate(axsFinance.CNR_BODY, phrases);
  return listCNR;
};

/**
 * Generates a template for reading items in all the lists.
 * @return {string} A template for reading item in all lists.
 */
axsFinance.generateListItemTemplate = function() {
  var xPath = 'id("' + axsFinance.visibleCategotyClassName + '")//tr' +
      '[@class="hdgr"]//td[not(@align)]';

  var columnHeaders = axsFinance.axsJAXObj.evalXPath(xPath, document.body);
  var template = '{0}, ';

  for (var i = 0, columnHeader; columnHeader = columnHeaders[i]; i++) {
    var headerText = columnHeader.textContent;
    var begOfYearIdx = headerText.lastIndexOf(' ');
    var dateString = headerText.substring(begOfYearIdx + 1);
    headerText = headerText.substring(0, begOfYearIdx);
    headerText = headerText + ' ' + axsFinance.parseDate(dateString);

    var index = i + 1;
    template = template + headerText + ', ' + '{' + index + '}' + '. ';
  }

  template = axsFinance.normalizeString(template);
  return template;
};

/**
 * Parses a date string to improve it verbal presentation.
 * @param {string} dateString A date string (format: yyyy-mm-dd).
 * @return {string} The parsed date string.
 */
axsFinance.parseDate = function(dateString) {
  var dateTokens = dateString.split('-');
  var year = dateTokens[0]
  var month = dateTokens[1];
  var parsed = axsFinance.phrasesMap[month] + ' ' + year;
  return parsed;
};

/**
 * Reads items from all lists.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsFinance.readTableRow = function(item) {
  var element = item.elem;
  var phrases = new Array();

  for (var i = 1, cell; cell = element.childNodes[i]; i = i + 2) {
    phrases.push(axsFinance.parseSpecChrsAndTkns(cell.textContent));
  }

  var text = axsFinance.populateTemplate(axsFinance.listItemTemplate, phrases);
  axsFinance.speakAndGo(element, text);
};

/**
 * Event handler for synchronizing the navigation with the state of the page.
 * @param {Event} evt A DOMSubtreeModified event.
 */
axsFinance.documentDOMSubtreeModifiedEventHandler = function(evt) {
  var target = evt.target;

  if (target.id == 'incinterimdiv' ||
      target.id == 'incannualdiv' ||
      target.id == 'balinterimdiv' ||
      target.id == 'balannualdiv' ||
      target.id == 'casinterimdiv' ||
      target.id == 'casannualdiv') {
    axsFinance.visibleCategotyClassName = target.id;

    var func = function() {
        axsFinance.initializeNavigation();
        axsFinance.announceActiveSectionAndPeriod();

        //restore the current position if such is stored
        if (axsFinance.currentCNRPosition) {
          var listIdx = axsFinance.currentCNRPosition.listIdx;
          var itemIdx = axsFinance.currentCNRPosition.itemIdx;
          axsFinance.axsNavObj.navListIdx = listIdx;
          axsFinance.axsNavObj.navItemIdxs[listIdx] = itemIdx;
          axsFinance.currentCNRPosition = null;
        }

        //clear the lens
        axsFinance.axsLensObj.view(null);
    };
    axsFinance.executeFunctionAfterMostRecentEvent(func, evt);
  }
};

/**
 * Executes a function mapped to an event. Since some events are generated
 * too frequently, taking actions on each event may cause significant
 * overhead. This method is mapping the event in the function call to a
 * handling function. Also the event has a timestamp indicating the time for
 * planned execution (obtained by adding an offset to the current system time)
 * of the function to which it is mapped (and will potentially handle it).
 * The handling function is executed after the event timestamp expires.
 * Subsequent requests for executing the same function remap the function to the
 * event parameter in the call and the event timestamp is set as described
 * above. After execution of the mapped function its mapping to an event is
 * removed. Such an implementation ensures processing the last event mapped to
 * the handling function after a certain timeout.
 *
 * @param {Function} func The handling function to execute.
 * @param {Event} evt Event to be propagated to the handlingFunction.
 */
 axsFinance.executeFunctionAfterMostRecentEvent = function(func, evt) {
  if (axsFinance.eventHandlerToEventMap[func.toString()]) {
    evt.timeToHandle = new Date().getTime() + axsFinance.EVT_HANDL_TIMEOUT_INT;
    axsFinance.eventHandlerToEventMap[func.toString()] = evt;
    return;
  }

  evt.timeToHandle = new Date().getTime() + axsFinance.EVT_HANDL_TIMEOUT_INT;
  axsFinance.eventHandlerToEventMap[func.toString()] = evt;

  var delegFunc = function() {
      var currentTime = new Date().getTime();
      var key = func.toString();
      var event = axsFinance.eventHandlerToEventMap[key];

      if (event.timeToHandle > currentTime) {
        window.setTimeout(delegFunc, event.timeToHandle - currentTime);
      } else {
        func(event);
        axsFinance.eventHandlerToEventMap[func.toString()] = null;
      }
  };

   window.setTimeout(delegFunc, axsFinance.EVT_HANDL_TIMEOUT_INT);
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
 * Populates a template replacing special tokens (like {i} where is is an index)
 * with concrete values.
 * @param {string} template The template string to populate.
 * @param {Array} phrases The array with replacement (concrete) values
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
 * @return {string} The normalized version of the text
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
 * @param {Event} evt A keypress event
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
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate 
 *           that the keycode has been handled.
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

/**
 * Invokes the AxsJAX initialization routine after the last element
 * has been inserted in the DOM.
 * @param {Event} evt A DOMNodeInserted event.
 */
axsFinance.init = function(evt) {
  if (evt.target.className == 'nav') {
    axsFinance.initAxsJAX();
  }
};

//Run the initialization routine of the script
window.addEventListener('load', axsFinance.initAxsJAX, true);

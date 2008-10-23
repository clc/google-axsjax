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
 * the the Health Topics Index page of Google Health.
 *
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsHealth = {};

/**
 * Object that contains all string literal used for enhancing the presentation
 */
axsHealth.str = {
  ENTER_ITEM : 'Enter a health topic.',
  BEGINNING : 'beginning with letter',
  SELECTED : 'selected',
  TOPICS : 'Topics'
};

/**
 * CNR for the 'Reference' page.
 */
axsHealth.CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

    '<target title="Search health topics" hotkey="/" ' +
        'action="CALL:axsHealth.showSearchBox">' +
      '/html' +
    '</target>' +

    '<target title="Health home" hotkey="g">' +
      '//p/a[1]' +
    '</target>' +

    '<list title="Topics beginning with letter A" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "A")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter B" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "B")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter C" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "C")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter D" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "D")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter E" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "E")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter F" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "F")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter G" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "G")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter H" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "H")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter I" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "I")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter J" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "J")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter K" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "K")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter L" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "L")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter M" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "M")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter N" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "N")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter O" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "O")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter P" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "P")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter Q" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "Q")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter R" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
           '//a[contains(text(), "R")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter S" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
          '//a[contains(text(), "S")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter T" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "T")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter U" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "U")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter V" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "V")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

    '</list>' +

    '<list title="Topics beginning with letter W" fwd="DOWN j n" ' +
        'back="UP k p">' +

      '<item>' +
        '//table[@class="condition-list" and preceding-sibling::div[1]' +
            '//a[contains(text(), "W")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

  '</list>' +

  '<list title="Topics beginning with letter X" fwd="DOWN j n" ' +
      'back="UP k p">' +

    '<item>' +
      '//table[@class="condition-list" and preceding-sibling::div[1]' +
          '//a[contains(text(), "X")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

   '</list>' +

   '<list title="Topics beginning with letter Y" fwd="DOWN j n" ' +
       'back="UP k p">' +

   '<item>' +
     '//table[@class="condition-list" and preceding-sibling::div[1]' +
         '//a[contains(text(), "Y")]]//a' +
     '</item>' +

     '<target title="Follow link" hotkey="ENTER">' +
       '.' +
     '</target>' +

  '</list>' +

  '<list title="Topics beginning with letter Z" fwd="DOWN j n" ' +
      'back="UP k p">' +

    '<item>' +
      '//table[@class="condition-list" and preceding-sibling::div[1]' +
          '//a[contains(text(), "Z")]]//a' +
      '</item>' +

      '<target title="Follow link" hotkey="ENTER">' +
        '.' +
      '</target>' +

   '</list>' +

'</cnr>';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type {AxsJAX?}
 */
axsHealth.axsJAXObj = null;

/**
 * The AxsJAX navigation object for the 'Personal record' section.
 * @type {AxsNav?}
 */
axsHealth.axsNavObj = null;

/**
 * The AxsJAX sound object used for playing earcons.
 * @type {AxsSound?}
 */
axsHealth.axsSound = null;

/**
 * The AxsLens object that will magnify content.
 * @type {AxsLens?}
 */
axsHealth.axsLensObj = null;

/**
 * The PowerKey object that shows an auto completion element for valid actions.
 * @type {PowerKey?}
 */
axsHealth.powerKeyObj = null;

/**
 * The power key object used for quick search
 * @type {Object?} 
 */
axsHealth.pkResultSearchObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type {Number}
 */
axsHealth.magSize = 2.5;

/**
 * The transparency level of the background of the PowerKey
 * @type {number} 
 */
axsHealth.powerKeyBackgroundTransparency = 40;

/**
 * Initializes the AxsJAX framework. Adds event listeners required for
 * handling dynamic content. Synchronizes the AxsJAX state with the page.
 */
axsHealth.initAxsJAX = function() {
  //Initialize the AxsJAX framework utilities
  axsHealth.axsJAXObj = new AxsJAX(true);
  axsHealth.axsLensObj = new AxsLens(axsHealth.axsJAXObj);
  axsHealth.axsLensObj.setMagnification(axsHealth.magSize);
  axsHealth.axsLensObj.setPadding(25);
  axsHealth.axsSound = new AxsSound(true);

  //All PowerKey instances have Health specific style
  axsHealth.modifyPowerKeyDefaultCssStyle();

  //Initialize AxsNav object
  axsHealth.axsNavObj = new AxsNav(axsHealth.axsJAXObj);
  axsHealth.axsNavObj.setLens(axsHealth.axsLensObj);
  axsHealth.axsNavObj.navInit(axsHealth.CNR, null);
  axsHealth.axsNavObj.setSound(axsHealth.axsSound);

  //Search PowerKey object
  axsHealth.pkResultSearchObj = new PowerKey('list', axsHealth.axsJAXObj);
  axsHealth.pkResultSearchObj.setCompletionPromptStr(axsHealth.str.ENTER_ITEM);
  axsHealth.pkResultSearchObj.setAutoHideCompletionField(true);
  axsHealth.pkResultSearchObj.setDefaultCSSStyle();
  var handler = axsHealth.searchPowerKeyHandler;
  var completionList = axsHealth.getSearchBoxCompletionList();
  var transp = axsHealth.powerKeyBackgroundTransparency;
  axsHealth.pkResultSearchObj.createCompletionField(document.body,
                                                    30,
                                                    handler,
                                                    null,
                                                    completionList,
                                                    false);
  axsHealth.pkResultSearchObj.setBackgroundStyle(null, true, 'grey', transp);
  axsHealth.pkResultSearchObj.setCompletionFieldStyle('black',
                                                       20,
                                                       'white',
                                                       100,
                                                       'normal',
                                                       'Arial, Sans-serif');

  //Add event listeners
  var func = axsHealth.keyHandler;
  document.addEventListener('keypress', func, true);
};

/**
 * Handler for processing the result of a PowerKey search.
 * @param {string?} command The selected string.
 * @param {number} index The index in the completion list of selected item.
 * @param {string?} id The id of the selected item.
 * @param {Array?} args Arguments for the function mapped to the selected item
 * (if such a function is defined).
 */
axsHealth.searchPowerKeyHandler = function(command, index, id, args) {
  var topicIdx = index + 1;
  var xPath = '(//table[@class="condition-list"]//a)[' + topicIdx + ']';
  var link = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];
  axsHealth.axsJAXObj.clickElem(link, false);
};

/**
 * Callback handler for showing the 'Health topic' search box.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.showSearchBox = function(item) {
  axsHealth.pkResultSearchObj.updateCompletionField('visible', true, 40, 20);
};

/**
 * Returns the completion list for the search box (all items in every list).
 * @return {Array} The completion list.
 */
axsHealth.getSearchBoxCompletionList = function() {
  var completionList = new Array();
  for (var i = 0, list; list = axsHealth.axsNavObj.navArray[i]; i++) {
    for (var j = 0, item; item = list.items[j]; j++) {
      completionList.push(item.elem.textContent);
    }
  }
  return completionList;
};

/**
 * Clicks a letter link for fast navigation in the current item
 * list of the 'Add to profile' section.
 * @param {number} charCode The char code of the pressed key.
 */
axsHealth.clickLetterLinkForCharCode = function(charCode) {
  var letter = String.fromCharCode(charCode).toUpperCase();
  var xPath = 'id("indexAZ")//a[text()="' + letter + '"]';
  var link = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];
  axsHealth.axsJAXObj.clickElem(link, false);

  var navListIdx = charCode - 65;
  axsHealth.axsNavObj.navListIdx = navListIdx;

  var text = axsHealth.str.TOPICS + ' ' + axsHealth.str.BEGINNING;
  text = text + ' ' + letter + ' ' + axsHealth.str.SELECTED;
  axsHealth.axsJAXObj.speakTextViaNode(text);
};

/**
 * Modifies the default CSS style of PowerKey to conform to the UI
 * requirements for Health. 
 */
axsHealth.modifyPowerKeyDefaultCssStyle = function() {
  var healthCssStr = '.pkVisibleStatus {' +
    'border-top-width: 8px; ' +
    'border-top-style: solid; ' +
    'border-top-color: rgb(195, 217, 255); ' +

    'border-right-width: 8px; ' +
    'border-right-style: solid; ' +
    'border-right-color: rgb(195, 217, 255); ' +

    'border-bottom-width: 8px; ' +
    'border-bottom-style: solid; ' +
    'border-bottom-color: rgb(195, 217, 255); ' +

    'border-left-width: 8px; ' +
    'border-left-style: solid; ' +
    'border-left-color: rgb(195, 217, 255);' +

    'padding: 10px !important;}';

  PowerKey.cssStr = PowerKey.cssStr + healthCssStr;
};

/**
 * Handler for key events. 'ESC' unfocuses the current focused element and
 * 'q' reads (speaks) the current quote.
 * @param {Event} evt A keypress DOM event.
 * @return {boolean} True if the event was handled, false otherwise.
 */
axsHealth.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) {
    return true;
  }

  if (evt.keyCode == 27) { // ESC
    if (axsHealth.axsJAXObj.lastFocusedNode) {
      axsHealth.axsJAXObj.lastFocusedNode.blur();
      return false;
    }
  }

  if (axsHealth.axsJAXObj.inputFocused) {
    return true;
  }

  //Shift + a letter key
  if (evt.shiftKey && evt.charCode >= 65 && evt.charCode <= 90) {
    axsHealth.clickLetterLinkForCharCode(evt.charCode);
  }

  var command = axsHealth.charCodeMap[evt.charCode];

  if (command) {
    return command();
  }

  return true;
};

/**
 * Map from character codes to functions.
 * @return {boolean} True if the event was handled, false otherwise.
 */
axsHealth.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // ? (question mark)
  63 : function() {
       var help = axsHealth.str.HELP + '. ' +
           axsHealth.axsNavObj.localHelpString() +
           axsHealth.axsNavObj.globalHelpString();
       axsHealth.axsJAXObj.speakTextViaNode(help);
       return false;
    },
  // - (minus symbol)
  45 : function() {
       axsHealth.magSize -= 0.10;
       axsHealth.axsLensObj.setMagnification(axsHealth.magSize);
       return false;
     },
  // = (equal symbol)
  61 : function() {
       axsHealth.magSize += 0.10;
       axsHealth.axsLensObj.setMagnification(axsHealth.magSize);
       return false;
     }
};

//Run the initialization routine of the script
window.addEventListener('load', axsHealth.initAxsJAX, true);

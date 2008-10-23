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
 * the the Reference page of Google Health.
 * 
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsHealth = {};

/**
 * Object that contains all string literal used for enhancing the presentation
 */
axsHealth.str = {
  DESCRIPTION : 'Description',
  ARTICLE : 'Article',
  AUTHORS : 'Authors'
};

/**
 * CNR for the 'Reference' page.
 */
axsHealth.CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

    '<target title="Add this condition to a Google Health profile" ' +
        'hotkey="a">' +
      'id("addProfileButton")//table' +
    '</target>' +

    '<target title="Health topics" hotkey="t">' +
      'id("indexPage")' +
    '</target>' +

    '<list title="Symptoms" fwd="DOWN j n" back="UP k p">' +

      '<item>' +
        '//div[@class="subtitle" and text()="Symptoms"]//following-sibling::' +
            'div[1]/*' +
      '</item>' +

    '</list>' +

    '<list title="Treatment" fwd="DOWN j n" back="UP k p">' +

      '<item>' +
        '//div[@class="subtitle" and text()="Treatment"]//following-sibling::' +
            'div[1]/*' +
      '</item>' +

    '</list>' +

    '<list title="Causes" fwd="DOWN j n" back="UP k p">' +

      '<item>' +
        '//div[@class="subtitle" and text()="Causes"]//following-sibling::' +
            'div[1]/*' +
      '</item>' +

    '</list>' +

    '<list title="Tests and diagnosis" fwd="DOWN j n" back="UP k p">' +

      '<item>' +
        '//div[@class="subtitle" and contains(text(), "Tests")]//' +
            'following-sibling::div[1]/*' +
      '</item>' +

    '</list>' +

    '<list title="Prognosis" fwd="DOWN j n" back="UP k p">' +

      '<item>' +
        '//div[@class="subtitle" and text()="Prognosis"]//following-sibling::' +
            'div[1]/*' +
      '</item>' +

    '</list>' +

    '<list title="Prevention" fwd="DOWN j n" back="UP k p">' +

      '<item>' +
        '//div[@class="subtitle" and text()="Prevention"]//following-sibling' +
            '::div[1]/*' +
      '</item>' +

    '</list>' +

    '<list title="Complications" fwd="DOWN j n" back="UP k p">' +

      '<item>' +
        '//div[@class="subtitle" and text()="Complications"]//' +
            'following-sibling::div[1]/*' +
      '</item>' +

    '</list>' +

    '<list title="When to contact a doctor" fwd="DOWN j n" back="UP k p">' +

      '<item>' +
        '//div[@class="subtitle" and text()="When to contact a doctor"]//' +
            'following-sibling::div[1]/*' +
      '</item>' +

    '</list>' +

    '<list title="Web results" fwd="DOWN j n" back="UP k p">' +

      '<item action="CALL:axsHealth.readWebResult">' +
        '//div[@class="contentbox search"]//div[@class="entry"]' +
      '</item>' +

      '<target title="Open web result" hotkey="ENTER">' +
        './a' +
      '</target>' +

    '</list>' +

    '<list title="Google Scholar results" fwd="DOWN j n" back="UP k p">' +

      '<item action="CALL:axsHealth.readScholarResult">' +
        '//div[@class="contentbox scholar"]//div[@class="entry"]' +
      '</item>' +

      '<target title="Open Scholar result" hotkey="ENTER">' +
        './a' +
      '</target>' +

    '</list>' +

    '<list title="Related Groups" fwd="DOWN j n" back="UP k p">' +

      '<item>' +
        '//div[@class="contentbox groups"]//div[@class="entry"]' +
      '</item>' +

      '<target title="Open Related Groups result" hotkey="ENTER">' +
        './a' +
      '</target>' +

    '</list>' +

  '</cnr>';

/**
 * These are strings to be spoken to the user.
 * @type {String}
 */
axsHealth.HELP = 'The following shortcut keys are available. ';

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
 * The AxsJAX sound object used for palying earcons.
 * @type {AxsSound?}
 */
axsHealth.axsSound = null

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

  //Initialize PowerKey object
  axsHealth.powerKeyObj = new PowerKey('list', axsHealth.axsJAXObj);
  axsHealth.axsNavObj.setPowerKey(axsHealth.powerKeyObj, '.');
  var transp = axsHealth.powerKeyBackgroundTransparency;
  axsHealth.powerKeyObj.setBackgroundStyle(null, true, 'grey', transp);
  axsHealth.powerKeyObj.setCompletionFieldStyle('black',
                                                 20,
                                                 'white',
                                                 100,
                                                 'normal',
                                                 'Arial, Sans-serif');

  //Add event listeners
  var func = axsHealth.keyHandler;
  document.addEventListener('keypress', func, true);

  axsHealth.announceIntroduction();
};

/**
 * Announces the condition described by the page including its description.
 */
axsHealth.announceIntroduction = function() {
  var xPath = '//div[@class="contentbox adam"]//h2[@class="title topTitle"]';
  var condition = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];

  xPath = '(//div[@class="content"]//div[@class="snippet"])[1]';
  var description = axsHealth.axsJAXObj.evalXPath(xPath, document.body)[0];

  var text = condition.textContent + '. ' + axsHealth.str.DESCRIPTION + ':';
  text = text + ' ' + description.textContent + '.';
  text = text + ' ' + axsHealth.axsNavObj.currentList().title;

  window.setTimeout(function() {
                      axsHealth.speakAndGo(condition, text);
                    },
                    0);
};

/**
 * Callback handler for reading an item from the 'Web results' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.readWebResult = function(item) {
  var element = item.elem;

  var result = element.childNodes[1];
  var snippet = element.childNodes[3];
  var text = result.textContent + ' ' + snippet.textContent;
  axsHealth.speakAndGo(element, text);
};

/**
 * Callback handler for reading an item from the 'Google Scholar results' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsHealth.readScholarResult = function(item) {
  var element = item.elem;

  var article = element.childNodes[1];
  var authors = element.childNodes[3];

  var text = axsHealth.str.ARTICLE + ' ' + article.textContent;
  text = text + ' ' + axsHealth.str.AUTHORS + ' ' + authors.textContent;

  axsHealth.speakAndGo(element, text);
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

  'padding: 10 !important;}';

  PowerKey.cssStr = PowerKey.cssStr + healthCssStr;
};

/**
 * Speaks a text and positions the screen to an element.
 * @param {Node} element DOM node.
 * @param {string} text The text to be spoken.
 * characters.
 */
axsHealth.speakAndGo = function(element, text) {
  axsHealth.axsLensObj.view(element);
  axsHealth.axsJAXObj.speakTextViaNode(text);
  element.scrollIntoView(true);
  axsHealth.axsJAXObj.markPosition(element);
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
       var help = axsHealth.HELP + axsHealth.axsNavObj.localHelpString() +
                     axsHealth.axsNavObj.globalHelpString();
       axsHealth.axsJAXObj.speakTextViaNode(help);
       return false;
    }
};

//Run the initialization routine of the script
window.addEventListener('load', axsHealth.initAxsJAX, true);

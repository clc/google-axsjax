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
 * @fileoverview AxsJAX to enhance accessibility the forums page of CraigsList.
 *
 * Example URL: http://austin.craigslist.org/prk/
 * It works also for all subdivisions of:Category(except: event and classes),
 * Personals,Housing,For sale,Services,Gigs and resumes.
 *
 * @author kbarad@gmail.com (Kristiyan Dzhamalov)
 */
// create namespace
var axsCraigsList = {};

/**
 * String constants
 */
axsCraigsList.str = {
  ENTER_DATE : 'Please select date'
};

/**
 * These are strings to be spoken to the user
 * @type string
 */
axsCraigsList.HELP = 'The following shortcut keys are available. '

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsCraigsList.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsCraigsList.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsCraigsList.axsLensObj = null;

/**
 * The AxsSound object that will play earcons
 * @type AxsSound?
 */
axsCraigsList.axsSoundObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsCraigsList.magSize = 1.5;

/**
 * The PowerKey object that will provide a quick search
 * @type PowerKey?
 */
axsCraigsList.pkResultSearchObj = null;

/**
 * The PowerKey object used by the AxsNavObj.
 * @type PowerKey?
 */
axsCraigsList.powerKeyObj = null;

/**
 * CNR
 */
axsCraigsList.cnrString = '<cnr next="RIGHT l" prev="LEFT h">' +

  '<list title="Postings" next="DOWN j" prev="UP k" fwd="n" back="p">' +

    '<item>' +
      '//p' +
    '</item>' +

    '<target title="Go to result" hotkey="ENTER">' +
      './a' +
    '</target>' +

    '<target title="Search topics" hotkey="," ' +
        'action="CALL:axsCraigsList.showSearchBox">' +
      '/html' +
    '</target>' +

  '</list>' +

  '<list title="Additional information" next="DOWN j" prev="UP k" fwd="n" back="p">' +

    '<item>' +
      'id("messages")//a' +
    '</item>' +

    '<target title="Open this link" hotkey="ENTER">' +
      '.' +
    '</target>' +

  '</list>'+

'</cnr>';

/**
 * Initializes the AxsJAX script.
 */
axsCraigsList.init = function() {
  //Initialize AxsJAX
  axsCraigsList.axsJAXObj = new AxsJAX(true);

  //Initialize AxsLens
  axsCraigsList.axsLensObj = new AxsLens(axsCraigsList.axsJAXObj);
  axsCraigsList.axsLensObj.setMagnification(axsCraigsList.magSize);

  //Initialize AxsSound
  axsCraigsList.axsSoundObj = new AxsSound(true);

  //Initialize AxsNav
  axsCraigsList.axsNavObj = new AxsNav(axsCraigsList.axsJAXObj);
  axsCraigsList.axsNavObj.navInit(axsCraigsList.cnrString, null);
  axsCraigsList.axsNavObj.setLens(axsCraigsList.axsLensObj);
  axsCraigsList.axsNavObj.setSound(axsCraigsList.axsSoundObj);

  //Initialize AxsNav's PowerKey object
  axsCraigsList.powerKeyObj = new PowerKey('list', axsCraigsList.axsJAXObj);
  axsCraigsList.axsNavObj.setPowerKey(axsCraigsList.powerKeyObj, '.');

  //Search PowerKey object
  axsCraigsList.pkResultSearchObj = new PowerKey('list',
                                                 axsCraigsList.axsJAXObj);
  var completionPromptStr = axsCraigsList.str.ENTER_DATE;
  axsCraigsList.pkResultSearchObj.setCompletionPromptStr(completionPromptStr);
  axsCraigsList.pkResultSearchObj.setAutoHideCompletionField(true);
  PowerKey.setDefaultCSSStyle();
  var handler = axsCraigsList.searchPowerKeyHandler;
  var completionStrings = axsCraigsList.getSearchBoxCompletionStrings();
  axsCraigsList.pkResultSearchObj.createCompletionField(document.body,
                                                        30,
                                                        handler,
                                                        null,
                                                        completionStrings,
                                                        false);

  //Add event listeners
  document.addEventListener('keypress', axsCraigsList.keyHandler, true);
 };

  /**
   * Handler for processing the result of a PowerKey search.
   * @param {string?} command The selected string.
   * @param {number} index The index in the completion list of selected item.
   * @param {string?} id The id of the selected item.
   * @param {Array?} args Arguments for the function mapped to the selected
   * item.
   * (if such a function is defined).
   */
axsCraigsList.searchPowerKeyHandler = function(command, index, id, args) {
  // PowerKey returns the competion converted to lower case => get the original
  var originalCommand = axsCraigsList.pkResultSearchObj.cmpList_[index];
  var xPath = '(//h4[text() = "' + originalCommand + '"]'+
   '/following-sibling::p)[1]';
  var posting = axsCraigsList.axsJAXObj.evalXPath(xPath, document.body)[0];
  var currentList = axsCraigsList.axsNavObj.navArray[1];
    for (var i = 0, item; item = currentList.items[i]; i++) {
      if (item.elem == posting) {
        axsCraigsList.axsNavObj.navItemIdxs[1] = i;
        axsCraigsList.axsNavObj.lastItem = null;
        axsCraigsList.pkResultSearchObj.cmpTextElement.blur();
        break;
      }
    }
  };

  /**
   * Returns a list of all dates searched with PowerKey.
   * @return {Array} The array of all topics.
   */
  axsCraigsList.getSearchBoxCompletionStrings = function() {
    var xpath = '//h4';
    var dates = axsCraigsList.axsJAXObj.evalXPath(xpath, document.body);

    var completionStrings = new Array();
    for (var i = 0, date; date = dates[i]; i++) {
        completionStrings.push(date.textContent);
    }

    return completionStrings;
    };

  /**
   * Callback handler for showing a search box.
   * @param {Object?} item DOM node wrapper.
   */
  axsCraigsList.showSearchBox = function(item) {
    axsCraigsList.pkResultSearchObj.updateCompletionField('visible',
                                                          true,
                                                          40,
                                                          20);
  };

/**
 * Handler for key events.
 * @param {Object} evt A keypress event.
 * @return {boolean} If true, the event should be propagated.
 */
axsCraigsList.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27){ // ESC
    axsCraigsList.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsCraigsList.axsJAXObj.inputFocused) return true;

  var command = axsCraigsList.keyCodeMap[evt.keyCode] ||
                axsCraigsList.charCodeMap[evt.charCode];

  if (command) return command();

  return true;
};

/**
 * Map from key codes to functions
 */
axsCraigsList.keyCodeMap = {
  // Map additional keyboard behavior that involves key codes here
};

/**
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate
 *                   that the keycode has been handled.
 */
axsCraigsList.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
  47 : function() {
         var searchBox = document.getElementsByName('query')[0];
         searchBox.focus();
         searchBox.select();
         axsCraigsList.axsJAXObj.tabbingStartPosNode = searchBox;
         return false;
       },
  // - (minus symbol)
  45 : function() {
         axsCraigsList.magSize -= 0.10;
         axsCraigsList.axsLensObj.setMagnification(axsCraigsList.magSize);
         return false;
       },
  // = (equal symbol)
  61 : function() {
         axsCraigsList.magSize += 0.10;
         axsCraigsList.axsLensObj.setMagnification(axsCraigsList.magSize);
         return false;
       },
  63 : function() {
         var helpStr = axsCraigsList.HELP +
                       axsCraigsList.axsNavObj.localHelpString() +
                       axsCraigsList.axsNavObj.globalHelpString();
         axsCraigsList.axsJAXObj.speakTextViaNode(helpStr);
         return false;
       }
};

// Run the script
axsCraigsList.init();


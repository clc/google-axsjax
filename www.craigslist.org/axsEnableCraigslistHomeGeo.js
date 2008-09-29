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
 * @fileoverview AxsJAX to enhance accessibility the geo pages of CraigsList.
 *
 * Example URL: http://geo.craigslist.org/iso/us/
 *
 * @author kbarad@gmail.com (Kristiyan Dzhamalov)
 */

// create namespace
var axsCraigsList = {};

/**
 * String constants
 */
axsCraigsList.str = {
  ENTER_LOCATION : 'Please select a location'
};

/**
 * These are strings to be spoken to the user
 * @type string
 */
axsCraigsList.HELP = 'The following shortcut keys are available:';

/**
 * CNR
 */
axsCraigsList.CNR = '<cnr next="RIGHT l" prev="LEFT h">' +

        '<target title="Search locations" hotkey="/" ' +
                'action="CALL:axsCraigsList.showSearchBox">' +
                '/html' +
        '</target>' +

        '<list title="Location" next="DOWN j" prev="UP k" fwd="n" back="p">' +

            '<item>' +
                'id("list")/a' +
            '</item>'+

        '<target title="Open the city link" hotkey="ENTER">' +
                '.' +
        '</target>' +

        '</list>' +

        '</cnr>';

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
 * The PowerKey object used by AxsNav
 * @type PowerKey?
 */
axsCraigsList.pkAxsNavObj = null;

/**
 * Initializes the AxsJAX script
 */
axsCraigsList.init = function() {
  //AxsJAX
  axsCraigsList.axsJAXObj = new AxsJAX(true);

  //AxsNav
  axsCraigsList.axsNavObj = new AxsNav(axsCraigsList.axsJAXObj);
  axsCraigsList.axsNavObj.navInit(axsCraigsList.CNR, null);
  axsCraigsList.pkAxsNavObj = new PowerKey('list', axsCraigsList.axsJAXObj);
  axsCraigsList.axsNavObj.setPowerKey(axsCraigsList.pkAxsNavObj, '.')

  //AxsLens
  axsCraigsList.axsLensObj = new AxsLens(axsCraigsList.axsJAXObj);
  axsCraigsList.axsLensObj.setMagnification(axsCraigsList.magSize);
  axsCraigsList.axsNavObj.setLens(axsCraigsList.axsLensObj);

  //AxsSound
  axsCraigsList.axsSoundObj = new AxsSound(true);
  axsCraigsList.axsNavObj.setSound(axsCraigsList.axsSoundObj);

  //Search PowerKey object
  axsCraigsList.pkResultSearchObj = new PowerKey('list',
                                                 axsCraigsList.axsJAXObj);
  var completionPromptStr = axsCraigsList.str.ENTER_LOCATION;
  axsCraigsList.pkResultSearchObj.setCompletionPromptStr(completionPromptStr);
  axsCraigsList.pkResultSearchObj.setAutoHideCompletionField(true);
  PowerKey.setDefaultCSSStyle();
  var handler = axsCraigsList.searchPowerKeyHandler;
  var completionList = axsCraigsList.getSearchBoxCompletionList();
  axsCraigsList.pkResultSearchObj.createCompletionField(document.body,
                                                        30,
                                                        handler,
                                                        null,
                                                        completionList,
                                                        false);

  //Add event listeners
  document.addEventListener('keypress', axsCraigsList.keyHandler, true);
};

/**
 * Handler for processing the result of a PowerKey search.
 * @param {string?} command The selected string.
 * @param {number} index The index in the completion list of selected item.
 * @param {string?} id The id of the selected item.
 * @param {Array?} args Arguments for the function mapped to the selected item.
 * (if such a function is defined).
 */
axsCraigsList.searchPowerKeyHandler = function(command, index, id, args) {
    var list = axsCraigsList.axsNavObj.currentList();
    var item = list.items[index];
    axsCraigsList.axsJAXObj.clickElem(item.elem);
};

/**
 * Returns a list of all topics for searching with PowerKey.
 * @return {Array} The array of all topics.
 */
axsCraigsList.getSearchBoxCompletionList = function() {
  var completionList = new Array();
  var list = axsCraigsList.axsNavObj.currentList();
  for (var i = 0, item; item = list.items[i]; i++) {
      completionList.push(item.elem.textContent);
  }
  return completionList;
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

  if (evt.keyCode == 27) { // ESC
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
 * Map from key codes to functions.
 */
axsCraigsList.keyCodeMap = {
  // Map additional keyboard behavior that involves key codes here
};

/**
 * Map from character codes to functions.
 * @return {boolean} Always returns false to indicate.
 *                   that the keycode has been handled.
 */
axsCraigsList.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
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
  // ? (question mark)
  63 : function() {
         var helpStr = axsCraigsList.HELP +
                       axsCraigsList.axsNavObj.localHelpString() +
                       axsCraigsList.axsNavObj.globalHelpString();
         axsCraigsList.axsJAXObj.speakTextViaNode(helpStr);
         return false;
       }
};

//start the script
axsCraigsList.init();


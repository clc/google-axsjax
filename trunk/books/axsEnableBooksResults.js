// Copyright 2007 Google Inc.
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
 * @fileoverview Greasemonkey JavaScript to enhance accessibility
 * of Google Books.
 * Note that these are Greasemonkey scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsBooksResults = {};

axsBooksResults.HELP =
    'The following shortcut keys are available. '+
    'Slash, enter search field. ' +
    'Escape, leave search field. ';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsBooksResults.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsBooksResults.axsNavObj = null;

/*
 * Initialize
 */
axsBooksResults.init = function(){
  axsBooksResults.axsJAXObj = new AxsJAX(true);
  axsBooksResults.axsNavObj = new AxsNav(axsBooksResults.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsBooksResults.keyHandler, true);

  var cnlString = "<cnl>" +
      "<list title='Cycle Results' next='RIGHT j' prev='LEFT k' " +
      "fwd='f' back='b'>" +
      "<item>" +
      "id('results_container')//div[@class='resbdy']" +
      "</item>" +
      "<target title='Open result' hotkey='ENTER'>" +
      ".//h2/a" +
      "</target>" +
      "<target title='About this book' hotkey='a'>" +
      ".//a[contains(text(),'About')]" +
      "</target>" +
      "<target title='More editions' hotkey='e' " +
      "onEmpty='There are no other editions available.'>" +
      ".//a[contains(text(),'editions')]" +
      "</target>" +
      "<target title='Next page' trigger='listTail'>" +
      "//img[contains(@src,'nav_next.gif')]/parent::*" +
      "</target>" +
      "<target title='Prev page' trigger='listHead'>" +
      "//img[contains(@src,'nav_previous.gif')]/parent::*" +
      "</target>" +
      "</list>" +
      "<target title='Next page' hotkey='PGDOWN'>" +
      "//img[contains(@src,'nav_next.gif')]/parent::*" +
      "</target>" +
      "<target title='Previous page' hotkey='PGUP'>" +
      "//img[contains(@src,'nav_previous.gif')]/parent::*" +
      "</target>" +
      "</cnl>";

  axsBooksResults.axsNavObj.navInit(cnlString, null);
  axsBooksResults.HELP = axsBooksResults.HELP + 
                         axsBooksResults.axsNavObj.localHelpString() +
                         axsBooksResults.axsNavObj.globalHelpString();

  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsBooksResults.readFirst,100);
};

/**
 * Reads the first thing on the page.
 */
axsBooksResults.readFirst = function(evt){
  var firstElem = axsBooksResults.axsNavObj.nextItem().elem;
  axsBooksResults.axsJAXObj.goTo(firstElem);
};


axsBooksResults.goSearch =  function () { // slash key
  // Focus on the top search field
  var f = document.getElementsByName('q')[0];
  if (f !== undefined) {
    f.focus();
    f.select(); //and select all text
  }
};

/*
 * Handle key events on Books Results page.
 * @param evt {event} the keyboard event.
 * @return {boolean}
 */
axsBooksResults.keyHandler = function(evt){
  if (evt.keyCode == 27) {
    axsBooksResults.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  // We pass on the event if we are in an input field
  if (axsBooksResults.axsJAXObj.inputFocused) return true;

  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  var command = axsBooksResults.charCodeMap[evt.charCode];
  if (command)  return  command();

  return true;
};

axsBooksResults.charCodeMap = {
63 : function () {
    axsBooksResults.axsJAXObj.speakTextViaNode(axsBooksResults.HELP);}, // ?
47 : axsBooksResults.goSearch
};

axsBooksResults.init();

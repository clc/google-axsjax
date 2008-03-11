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
 * of Google Scholar.
 * Note that these are Greasemonkey scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsScholar = {};

//These are strings to be spoken to the user
axsScholar.HELP_PRE = 'The following shortcut keys are available. ';
axsScholar.HELP_POST = '';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsScholar.axsJAXObj = null;

/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsScholar.axsNavObj = null;

axsScholar.init = function(){
  axsScholar.axsJAXObj = new AxsJAX(true);
  axsScholar.axsNavObj = new AxsNav(axsScholar.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsScholar.extraKeyboardNavHandler,
                             true);

  var cnlString = "<cnl>" +
    "<list title='Cycle Results' next='RIGHT j' " +
    "prev='LEFT k' fwd='n' back='p'>" +
    "<item>" +
    "//p[@class='g']" +
    "</item>" +
    "<target title='Open result' hotkey='ENTER'>" +
    "./span[@class='w']" +
    "</target>" +
    "<target title='Cited by' hotkey='c' onEmpty='There are no citations.'>" +
    "./font/a[contains(text(),'Cited by')]" +
    "</target>" +
    "<target title='All versions' hotkey='v' " +
    "onEmpty='There are no other versions.'>" +
    "./a" +
    "</target>" +
    "<target title='Related Articles' hotkey='r' " +
    "onEmpty='There are no related articles.'>" +
    "./font/a[text()='Related Articles']" +
    "</target>" +
    "<target title='Web Search' hotkey='w'>" +
    "./font/a[text()='Web Search']" +
    "</target>" +
    "<target title='Library Search' hotkey='l' " +
    "onEmpty='Library search is unavailable for this article.'>" +
    "./font/a[text()='Library Search']" +
    "</target>" +
    "<target title='B L Direct' hotkey='b' " +
    "onEmpty='B L direct is unavailable for this article.'>" +
    "./font/a[text()='BL Direct']" +
    "</target>" +
    "<target title='Import to citation' hotkey='i' " +
    "onEmpty='Please go to scholar preferences and choose the citation format you wish to use.'>" +
    "./font/a[contains(text(),'Import into')]" +
    "</target>" +
    "<target title='Next page' trigger='listTail'>" +
    "//img[contains(@src,'nav_next.gif')]/.." +
    "</target>" +
    "<target title='Prev page' trigger='listHead'>" +
    "//img[contains(@src,'nav_previous.gif')]/.." +
    "</target>" +
    "</list>" +
    "<target title='Next page' hotkey='PGDOWN'>" +
    "//img[contains(@src,'nav_next.gif')]/.." +
    "</target>" +
    "<target title='Previous page' hotkey='PGUP'>" +
    "//img[contains(@src,'nav_previous.gif')]/.." +
    "</target>" +
    "</cnl>";
  axsScholar.axsNavObj.navInit(cnlString, null);
  axsScholar.HELP_POST = axsScholar.axsNavObj.globalHelpString();

  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsScholar.readTheFirstThing,100);
};



/**
 * Reads the first thing on the page.
 */
axsScholar.readTheFirstThing = function(evt){
  var firstElem = axsScholar.axsNavObj.nextItem().elem;
  axsScholar.axsJAXObj.goTo(firstElem);
};


axsScholar.extraKeyboardNavHandler = function(evt){
  if (evt.keyCode == 27) {
    axsScholar.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  // We pass on the event if we are in an input field
  if (axsScholar.axsJAXObj.inputFocused) return true;

  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  if (evt.charCode == 47){ // / (slash symbol)
    // Focus on the top search blank
    document.getElementsByName('q')[0].focus();  
    document.getElementsByName('q')[0].select(); //and select all text
    return false;
  }

  if (evt.charCode == 63){ // ? (question mark)
    var helpStr = axsScholar.HELP_PRE +
                  axsScholar.axsNavObj.localHelpString() +
                  axsScholar.HELP_POST;
    axsScholar.axsJAXObj.speakTextViaNode(helpStr);
    return false;
  }

  return true;
};

axsScholar.init();

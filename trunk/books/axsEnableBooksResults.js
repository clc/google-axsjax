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

//These are strings used to find specific links
axsBooksResults.ABOUT_THIS_BOOK_STRING = 'About this book';
axsBooksResults.MORE_EDITIONS_STRING = 'More editions';

//These are strings to be spoken to the user
axsBooksResults.NO_OTHER_EDITIONS_STRING =
    'There are no other editions available.';

axsBooksResults.HELP =
    'The following shortcut keys are available. ' +
    'Down arrow or N, go to the next result. ' +
    'Up arrow or P, go to the previous result. ' +
    'Right arrow or J, cycle to the next result. ' +
    'Left arrow or K, cycle to the previous result. ' +
    'Enter, go to the current result. ' +
    'Slash, jump to search field. ' +
    'Escape, leave search field. ' +
    'A, go to the about page. ' +
    'Page up, go to the previous page. ' +
    'Page down, go to the next page. ';


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

  //Setup the results array
//  axsBooksResults.buildResultsArray();

  var cnlString = "<cnl next='' prev='' emptyMsg=''>" +
      "<list title='Results' next='*DOWN|*n' prev='*UP|*p' emptyMsg=''>" +
      "<item action='goto'>" +
      "<startNode index='0' count='*'>" +
      "id('results_container')/table[*]/tbody/tr/td[2]" +
      "</startNode>" + 
      "</item>" +
      "<item action='click'>" +
      "<startNode index='0' count='1'>" +
      "//img[contains(@src,'nav_next.gif')]/parent::*" +
      "</startNode>" +
      "</item>" +
      "<item action='click'>" +
      "<startNode index='0' count='1'>" +
      "//img[contains(@src,'nav_previous.gif')]/parent::*" +
      "</startNode>" +
      "</item>" +
      "</list>" +
      "<list title='Cycle Results' next='*RIGHT|*j' prev='*LEFT|*k' emptyMsg=''>" +
      "<item action='goto'>" +
      "<startNode index='0' count='*'>" +
      "id('results_container')/table[*]/tbody/tr/td[2]" +
      "</startNode>" +
      "</item>" +
      "</list>" +
      "</cnl>";
  axsBooksResults.axsNavObj.navInit(cnlString, null);

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


axsBooksResults.openResult  = function () {
  var current = axsBooksResults.axsNavObj.currentItem().elem;
  var mainLink = current.getElementsByTagName('H2')[0].firstChild;
  axsBooksResults.axsJAXObj.clickElem(mainLink, false);
};


axsBooksResults.aboutPage = function (shift) {
  var current = axsBooksResults.axsNavObj.currentItem().elem;
  var linksArray = current.getElementsByTagName('A');
  for (var i=0, currentLink; currentLink = linksArray[i]; i++){
    if (currentLink.textContent == axsBooksResults.ABOUT_THIS_BOOK_STRING){
      axsBooksResults.axsJAXObj.clickElem(currentLink, shift);
      return;
    }
  }
};

axsBooksResults.editions = function (shift)  {
  var current = axsBooksResults.axsNavObj.currentItem().elem;
  var linksArray = current.getElementsByTagName('A');
  var currentLink;
  for (var i=0; currentLink = linksArray[i]; i++){
    if (currentLink.textContent == axsBooksResults.MORE_EDITIONS_STRING){
      axsBooksResults.axsJAXObj.clickElem(currentLink, shift);
      return;
    }
  }
  axsBooksResults.axsJAXObj.speakTextViaNode(axsBooksResults.NO_OTHER_EDITIONS_STRING);
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

  // tvr: This loses shift for Enter
  var command =  axsBooksResults.keyCodeMap[evt.keyCode] ||
                 axsBooksResults.charCodeMap[evt.charCode];

  if (command)  return  command();

  return true;
};


/*
 * Navigate to the next page of results
 */

axsBooksResults.goToNextPage = function(){
  var images = document.getElementsByTagName('IMG');
  for (var i=0; i<images.length; i++){
    if (images[i].src.indexOf('nav_next.gif') != -1){
      axsBooksResults.axsJAXObj.clickElem(images[i].parentNode, false);
      return;
    }
  }
};

/*
 * Navigate to the previous page of results.
 */

axsBooksResults.goToPrevPage = function(){
  var images = document.getElementsByTagName('IMG');
  for (var i=0; i<images.length; i++){
    if (images[i].src.indexOf('nav_previous.gif') != -1){
      axsBooksResults.axsJAXObj.clickElem(images[i].parentNode, false);
      return;
    }
  }
};

axsBooksResults.keyCodeMap = {
13 : axsBooksResults.openResult, // enter
33 : axsBooksResults.goToPrevPage, // page up
34 : axsBooksResults.goToNextPage // page-down
};


axsBooksResults.charCodeMap = {
63 : function () {
    axsBooksResults.axsJAXObj.speakTextViaNode(axsBooksResults.HELP);}, // ?
65 : function () {axsBooksResults.aboutPage(true);}, // cap A
97 : function () {axsBooksResults.aboutPage(false);}, //  a
69 : function () {axsBooksResults.editions(true);}, // cap E
101 : function () {axsBooksResults.editions(false);}, // e
47 : axsBooksResults.goSearch
};


axsBooksResults.init();

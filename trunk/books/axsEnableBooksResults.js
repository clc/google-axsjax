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
 * @type AxsJAX
 */
axsBooksResults.axsJAXObj = null;
axsBooksResults.resultsArray = new Array();
axsBooksResults.resultsIndex = 0;

axsBooksResults.inputFocused = false;
axsBooksResults.lastFocusedNode = null;

/*
 * Initialize
 */

axsBooksResults.init = function(){
  axsBooksResults.axsJAXObj = new AxsJAX(true);

  //Add event listeners
  document.addEventListener('keypress', axsBooksResults.keyHandler, true);
  document.addEventListener('focus', axsBooksResults.focusHandler, true);
  document.addEventListener('blur', axsBooksResults.blurHandler, true);

  //Setup the results array
  axsBooksResults.buildResultsArray();

  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsBooksResults.readFirst,100);
};

/**
 * Reads the first thing on the page.
 */
axsBooksResults.readFirst = function(evt){
  axsBooksResults.goToNextResult(true);
};


/**
 * Record focus in axsBooksResults.lastFocusedNode.
 * Records if axsBooksResults.lastFocusedNode is an input field.
 * This flag is used in our keyHandler.
 * When an input field has focus,  keystrokes should go to the field
 * and should not trigger hot key commands.
 * @param evt {event} A Focus event
 */

axsBooksResults.focusHandler = function(evt){
  axsBooksResults.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsBooksResults.inputFocused = true;
  }
};

/**
 *Update axsBooksResults.lastFocusedNode.
 * When no input fields have focus, the keystrokes should trigger hot key
 * commands.
 * @param evt {event} A Blur event
 */
axsBooksResults.blurHandler = function (evt){
  axsBooksResults.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsBooksResults.inputFocused = false;
  }
};


axsBooksResults.openResult  = function () {
  var current = axsBooksResults.resultsArray[axsBooksResults.resultsIndex];
  var mainLink = current.getElementsByTagName('H2')[0].firstChild;
  axsBooksResults.axsJAXObj.clickElem(mainLink, false);
};


axsBooksResults.aboutPage = function (shift) {
  var current = axsBooksResults.resultsArray[axsBooksResults.resultsIndex];
    var linksArray = current.getElementsByTagName('A');
    for (var i=0, currentLink; currentLink = linksArray[i]; i++){
      if (currentLink.textContent == axsBooksResults.ABOUT_THIS_BOOK_STRING){
        axsBooksResults.axsJAXObj.clickElem(currentLink, shift);
        return;
      }
    }
};

axsBooksResults.editions = function (shift)  {
  var current = axsBooksResults.resultsArray[axsBooksResults.resultsIndex];
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
    axsBooksResults.lastFocusedNode.blur();
    return false;
  }

  // We pass on the event if we are in an input field
  if (axsBooksResults.inputFocused) return true;

  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  // tvr: This loses shift for Enter
  var command =  axsBooksResults.keyCodeMap[evt.keyCode] ||
                 axsBooksResults.charCodeMap[evt.charCode];

  if (command)  return  command();

  return true;
};


/*
 * Fill up axsBooksResults.resultsArray
 */

axsBooksResults.buildResultsArray = function(){
  var results = document.getElementById('results_container');
  axsBooksResults.resultsArray = new Array();
  axsBooksResults.resultsIndex = -1;
  for (var i=0,child; child = results.childNodes[i]; i++){
    //Skip the cover to avoid repeating the title
    var resultContent = child.firstChild.firstChild.childNodes[1];
    axsBooksResults.resultsArray.push(resultContent);
  }
};
/*
 * Navigate to next result
 * @param cycle {boolean} Flag that indicates if we cycle through results
 */

axsBooksResults.goToNextResult = function(cycle){
  axsBooksResults.resultsIndex++;
  if(axsBooksResults.resultsIndex >= axsBooksResults.resultsArray.length){
    if (!cycle){
      axsBooksResults.resultsIndex = -1;
      axsBooksResults.goToNextPage();
      return;
    } else{
      axsBooksResults.resultsIndex = 0;
    }
  }
  var current = axsBooksResults.resultsArray[axsBooksResults.resultsIndex];
  axsBooksResults.axsJAXObj.goTo(current);
};
/*
 * Navigate to the previous result.
 * @param cycle {boolean} indicates if we cycle through the results.
 */

axsBooksResults.goToPrevResult = function(cycle){
  axsBooksResults.resultsIndex--;
  if(axsBooksResults.resultsIndex < 0){
    if (!cycle){
      axsBooksResults.resultsIndex = -1;
      axsBooksResults.goToPrevPage();
      return;
    } else{
      axsBooksResults.resultsIndex = axsBooksResults.resultsArray.length-1;
    }
  }
  var current = axsBooksResults.resultsArray[axsBooksResults.resultsIndex];
  axsBooksResults.axsJAXObj.goTo(current);
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
34 : axsBooksResults.goToNextPage, // page-down
38 : function () {axsBooksResults.goToPrevResult(false);}, //up arrow
37 : function () {axsBooksResults.goToPrevResult(true);}, // left arrow
40 : function () {axsBooksResults.goToNextResult(false);}, // down arrow
39 : function () {axsBooksResults.goToNextResult(true);} // down arrow
};


axsBooksResults.charCodeMap = {
63 : function () {
    axsBooksResults.axsJAXObj.speakTextViaNode(axsBooksResults.HELP);}, // ?
65 : function () {axsBooksResults.aboutPage(true);}, // cap A
97 : function () {axsBooksResults.aboutPage(false);}, //  a
69 : function () {axsBooksResults.editions(true);}, // cap E
101 : function () {axsBooksResults.editions(false);}, // e
106 : function () {axsBooksResults.goToNextResult(true);  }, // j
107 : function () {axsBooksResults.goToPrevResult(true);}, // k
110: function () {axsBooksResults.goToNextResult(false);}, // n
112 : function () {axsBooksResults.goToPrevResult(false);}, //p
47 : axsBooksResults.goSearch
};


axsBooksResults.init();

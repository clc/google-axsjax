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

axsBooksResults.HELP_STRING =
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

axsBooksResults.resultsArray = null;
axsBooksResults.resultsIndex = 0;

axsBooksResults.inputFocused = false;
axsBooksResults.lastFocusedNode = null;


axsBooksResults.init = function(){
  axsBooksResults.axsJAXObj = new AxsJAX(true);

  //Add event listeners
  document.addEventListener('keypress', axsBooksResults.extraKeyboardNavHandler,
                             true);
  document.addEventListener('focus', axsBooksResults.focusHandler, true);
  document.addEventListener('blur', axsBooksResults.blurHandler, true);

  //Setup the results array
  axsBooksResults.buildResultsArray();

  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsBooksResults.readTheFirstThing,100);
};



/**
 * Reads the first thing on the page.
 */
axsBooksResults.readTheFirstThing = function(evt){
  axsBooksResults.goToNextResult(true);
};


/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsBooksResults.focusHandler = function(evt){
  axsBooksResults.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsBooksResults.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsBooksResults.blurHandler = function (evt){
  axsBooksResults.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsBooksResults.inputFocused = false;
  }
};


axsBooksResults.extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT. 
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsBooksResults.lastFocusedNode.blur();
  }

  if (axsBooksResults.inputFocused){
    return true;
  }

  if (evt.charCode == 106){ // j
    axsBooksResults.goToNextResult(true);
  }
  if (evt.charCode == 107){ // k
    axsBooksResults.goToPrevResult(true);
  }
  if (evt.charCode == 110){ // n
    axsBooksResults.goToNextResult(false);
  }
  if (evt.charCode == 112){ // p
    axsBooksResults.goToPrevResult(false);
  }


  if (evt.charCode == 47){ // / (slash symbol)
    // Focus on the top search blank
    document.getElementsByName('q')[0].focus();  
    document.getElementsByName('q')[0].select(); //and select all text
  }


  if (evt.keyCode == 33){ // Page Up
    axsBooksResults.goToPrevPage();
  }
  if (evt.keyCode == 34){ // Page Down
    axsBooksResults.goToNextPage();
  }
  if (evt.keyCode == 38){ // Up arrow
    axsBooksResults.goToPrevResult(false);
  }
  if (evt.keyCode == 37){ // Left arrow
    axsBooksResults.goToPrevResult(true);
  }
  if (evt.keyCode == 40){ // Down arrow
    axsBooksResults.goToNextResult(false);
  }
  if (evt.keyCode == 39){ // Right arrow
    axsBooksResults.goToNextResult(true);
  }
  if (evt.charCode == 63){ // ? (question mark)
    axsBooksResults.axsJAXObj.speakTextViaNode(axsBooksResults.HELP_STRING);
  }

  //Keys for working with the current result.
  //Capitals will be checked when it should be possible to open the link in a
  //new window since shift clicking usually opens in a new window.
  if (evt.keyCode == 13){ // Enter
    var currentResultNode =
        axsBooksResults.resultsArray[axsBooksResults.resultsIndex];
    var mainLink = currentResultNode.getElementsByTagName('H2')[0].firstChild;
    axsBooksResults.axsJAXObj.clickElem(mainLink, evt.shiftKey);
  }
  if ((evt.charCode == 97) || (evt.charCode == 65)){ // a
    currentResultNode =
        axsBooksResults.resultsArray[axsBooksResults.resultsIndex];
    var linksArray = currentResultNode.getElementsByTagName('A');
    for (var i=0, currentLink; currentLink = linksArray[i]; i++){
      if (currentLink.textContent == axsBooksResults.ABOUT_THIS_BOOK_STRING){
        axsBooksResults.axsJAXObj.clickElem(currentLink, evt.shiftKey);
        return false;
      }
    }
  }
  if ((evt.charCode == 101) || (evt.charCode == 69)){ // e
    currentResultNode =
        axsBooksResults.resultsArray[axsBooksResults.resultsIndex];
    linksArray = currentResultNode.getElementsByTagName('A');
    for (i=0, currentLink; currentLink = linksArray[i]; i++){
      if (currentLink.textContent == axsBooksResults.MORE_EDITIONS_STRING){
        axsBooksResults.axsJAXObj.clickElem(currentLink, evt.shiftKey);
        return false;
      }
    }
    axsBooksResults.axsJAXObj.speakTextViaNode(axsBooksResults.NO_OTHER_EDITIONS_STRING);
  }
  return false;
};




//************
//Functions for results
//************
axsBooksResults.buildResultsArray = function(){
  var resultsContainer = document.getElementById('results_container');
  axsBooksResults.resultsArray = new Array();
  axsBooksResults.resultsIndex = -1;
  for (var i=0,child; child = resultsContainer.childNodes[i]; i++){
    //Skip the cover to avoid repeating the title
    var resultContent = child.firstChild.firstChild.childNodes[1];
    axsBooksResults.resultsArray.push(resultContent);
  }
};

axsBooksResults.goToNextResult = function(cycleBool){
  axsBooksResults.resultsIndex++;
  if(axsBooksResults.resultsIndex >= axsBooksResults.resultsArray.length){
    if (!cycleBool){
      axsBooksResults.resultsIndex = -1;
      axsBooksResults.goToNextPage();
      return;
    } else{
      axsBooksResults.resultsIndex = 0;
    }
  }
  var currentResultNode =
      axsBooksResults.resultsArray[axsBooksResults.resultsIndex];
  axsBooksResults.axsJAXObj.goTo(currentResultNode);
};

axsBooksResults.goToPrevResult = function(cycleBool){
  axsBooksResults.resultsIndex--;
  if(axsBooksResults.resultsIndex < 0){
    if (!cycleBool){
      axsBooksResults.resultsIndex = -1;
      axsBooksResults.goToPrevPage();
      return;
    } else{
      axsBooksResults.resultsIndex = axsBooksResults.resultsArray.length-1;
    }
  }
  var currentResultNode =
      axsBooksResults.resultsArray[axsBooksResults.resultsIndex];
  axsBooksResults.axsJAXObj.goTo(currentResultNode);
};


axsBooksResults.goToNextPage = function(){
  var images = document.getElementsByTagName('IMG');
  for (var i=0; i<images.length; i++){
    if (images[i].src.indexOf('nav_next.gif') != -1){
      axsBooksResults.axsJAXObj.clickElem(images[i].parentNode, false);
      return;
    }
  }
};

axsBooksResults.goToPrevPage = function(){
  var images = document.getElementsByTagName('IMG');
  for (var i=0; i<images.length; i++){
    if (images[i].src.indexOf('nav_previous.gif') != -1){
      axsBooksResults.axsJAXObj.clickElem(images[i].parentNode, false);
      return;
    }
  }
};










axsBooksResults.init();

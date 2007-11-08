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


axsScholar.HELP_STRING =
    'The following shortcut keys are available. ' +
    'G, use guided mode. ' +   
    'Down arrow or N, go to the next result. ' +
    'Up arrow or P, go to the previous result. ' +
    'Right arrow or J, cycle to the next result. ' +
    'Left arrow or K, cycle to the previous result. ' +
    'Enter, open the current item. ' +
    'Shift and Enter, open the current item ' +
    'in a new window. ' +
    'Slash, jump to search blank. ' +
    'Escape, leave search blank. ' +
    '1, read the one box. ' +
    'A, cycle through advertisements. ' +
    'C, cycle through alternate categories to search in. ' +
    'R, cycle through related searches. ' +
    'Page up, go to the previous page. ' +
    'Page down, go to the next page. ';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsScholar.axsJAXObj = null;

axsScholar.resultsArray = null;
axsScholar.resultsIndex = 0;

axsScholar.inputFocused = false;
axsScholar.lastFocusedNode = null;


axsScholar.init = function(){
  axsScholar.axsJAXObj = new AxsJAX();

  //Add event listeners
  document.addEventListener('keypress', axsScholar.extraKeyboardNavHandler,
                             true);
  document.addEventListener('focus', axsScholar.focusHandler, true);
  document.addEventListener('blur', axsScholar.blurHandler, true);

  //Do any necessary preparations for browsing here
  axsScholar.buildResultsArray();

  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
 // window.setTimeout(axsScholar.readTheFirstThing,100);

};



/**
 * Reads the first thing on the page.
 */
axsScholar.readTheFirstThing = function(evt){
  axsScholar.goToNextResult(true);
};


/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsScholar.focusHandler = function(evt){
  axsScholar.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsScholar.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsScholar.blurHandler = function (evt){
  axsScholar.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsScholar.inputFocused = false;
  }
};


axsScholar.extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT. 
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsScholar.lastFocusedNode.blur();
  }
  if (axsScholar.inputFocused){
    return;
  }


  if (evt.charCode == 110){ // n
    axsScholar.goToNextResult(false);
  }
  if (evt.charCode == 112){ // p
    axsScholar.goToPrevResult(false);
  }


  if (evt.charCode == 47){ // / (slash symbol)
    // Focus on the top search blank
    document.getElementsByName('q')[0].focus();  
    document.getElementsByName('q')[0].select(); //and select all text
  }


  if (evt.keyCode == 33){ // Page Up
    axsScholar.goToPrevPage();
  }
  if (evt.keyCode == 34){ // Page Down
    axsScholar.goToNextPage();
  }

};




//************
//Functions for results
//************

axsScholar.buildResultsArray = function(){
  var resultsTd = null;
  var paragraphs = window.content.document.getElementsByTagName('P');
  for (var i=0; i<paragraphs.length; i++){
    if (paragraphs[i].className == 'g'){
      resultsTd = paragraphs[i].parentNode;
      break;
    }
  }
  axsScholar.resultsArray = resultsTd.childNodes;
  axsScholar.resultsIndex = -1;
};

axsScholar.goToNextResult = function(cycleBool){
  axsScholar.resultsIndex++;
  if(axsScholar.resultsIndex >= axsScholar.resultsArray.length){
    if (!cycleBool){
      axsScholar.resultsIndex = -1;
      axsScholar.goToNextPage();
      return;
    } else{
      axsScholar.resultsIndex = 0;
    }
  }
  var currentResult = axsScholar.resultsArray[axsScholar.resultsIndex];
  currentResult.scrollIntoView(true);
  axsScholar.axsJAXObj.speakNode(currentResult);
};

axsScholar.goToPrevResult = function(cycleBool){
  axsScholar.resultsIndex--;
  if(axsScholar.resultsIndex < 0){
    if (!cycleBool){
      axsScholar.resultsIndex = -1;
      axsScholar.goToPrevPage();
      return;
    } else{
      axsScholar.resultsIndex = axsScholar.resultsArray.length-1;
    }
  }
  var currentResult = axsScholar.resultsArray[axsScholar.resultsIndex];
  currentResult.scrollIntoView(true);
  axsScholar.axsJAXObj.speakNode(currentResult);
};


axsScholar.goToNextPage = function(){
  var images = document.getElementsByTagName('IMG');
  for (var i=0; i<images.length; i++){
    if (images[i].src.indexOf('nav_next.gif') != -1){
      axsScholar.axsJAXObj.clickElem(images[i].parentNode);
      return;
    }
  }
};

axsScholar.goToPrevPage = function(){
  var images = document.getElementsByTagName('IMG');
  for (var i=0; i<images.length; i++){
    if (images[i].src.indexOf('nav_previous.gif') != -1){
      axsScholar.axsJAXObj.clickElem(images[i].parentNode);
      return;
    }
  }
};




axsScholar.init();

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



axsScholar.scholarResultObj = function(){
  this.mainLink = null;
  this.versionsLink = null;
  this.citationLink = null;
  this.relatedArticlesLink = null;
  this.webSearchLink = null;
  this.librarySearchLink = null;
  this.HTMLVerLink = null;
  this.BLDirectLink = null;
};



//These are strings used to find specific links
axsScholar.CITED_BY_STRING = 'Cited by';
axsScholar.RELATED_ARTICLES_STRING = 'Related Articles';
axsScholar.WEB_SEARCH_STRING = 'Web Search';
axsScholar.LIBRARY_SEARCH_STRING = 'Library Search';
axsScholar.VIEW_AS_HTML_STRING = 'View as HTML';
axsScholar.BL_DIRECT_STRING = 'BL Direct';
axsScholar.TRY_WEB_QUERY_STRING = 'Try your query on the entire web';


//These are strings to be spoken to the user
axsScholar.NO_MAIN_LINK_STRING = 'There is no main link.';
axsScholar.UNAVAILABLE_STRING = ' unavailable.';
axsScholar.ONLY_ONE_VERSION_STRING = 'There is only one version.';

axsScholar.HELP_STRING =
    'The following shortcut keys are available. ' +
    'Down arrow or N, go to the next result. ' +
    'Up arrow or P, go to the previous result. ' +
    'Right arrow or J, cycle to the next result. ' +
    'Left arrow or K, cycle to the previous result. ' +
    'Enter, go to the current result. ' +
    'Slash, jump to search blank. ' +
    'Escape, leave search blank. ' +
    'O, hear the available options for the current result. ' +
    'C, go to works that cite the current result. ' +
    'V, go to all the versions of the current result. ' +
    'L, find the current result at a local library. ' +
    'R, find related works to the current result. ' +
    'H, go to an H T M L version of the current result. ' +
    'B, find the current result at B L direct. ' +
    'W, perform a web search on the current result. ' +
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



axsScholar.currentResult = null;




axsScholar.init = function(){
  axsScholar.axsJAXObj = new AxsJAX();

  //Add event listeners
  document.addEventListener('keypress', axsScholar.extraKeyboardNavHandler,
                             true);
  document.addEventListener('focus', axsScholar.focusHandler, true);
  document.addEventListener('blur', axsScholar.blurHandler, true);

  //Do any necessary preparations for browsing here
  axsScholar.currentResult = new axsScholar.scholarResultObj();
  axsScholar.buildResultsArray();

  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsScholar.readTheFirstThing,100);

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

  if (evt.charCode == 106){ // j
    axsScholar.goToNextResult(true);
  }
  if (evt.charCode == 107){ // k
    axsScholar.goToPrevResult(true);
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
  if (evt.keyCode == 38){ // Up arrow
    axsScholar.goToPrevResult(false);
  }
  if (evt.keyCode == 37){ // Left arrow
    axsScholar.goToPrevResult(true);
  }
  if (evt.keyCode == 40){ // Down arrow
    axsScholar.goToNextResult(false);
  }
  if (evt.keyCode == 39){ // Right arrow
    axsScholar.goToNextResult(true);
  }
  if (evt.charCode == 63){ // ? (question mark)
    axsScholar.axsJAXObj.speakText(axsScholar.HELP_STRING);
  }

  //Keys for working with the current result.
  //Capitals will be checked when it should be possible to open the link in a
  //new window since shift clicking usually opens in a new window.
  if (evt.charCode == 111){ // o
    axsScholar.announceOptions();
  }

  if (evt.keyCode == 13){ // Enter
    if (axsScholar.currentResult.mainLink){
      axsScholar.axsJAXObj.clickElem(axsScholar.currentResult.mainLink, evt.shiftKey);
    } else{
      axsScholar.axsJAXObj.speakText(axsScholar.NO_MAIN_LINK_STRING);
    }
  }

  if ((evt.charCode == 118) || (evt.charCode == 86)){ // v
    if (axsScholar.currentResult.versionsLink){
      axsScholar.axsJAXObj.clickElem(axsScholar.currentResult.versionsLink, evt.shiftKey);
    } else{
      axsScholar.axsJAXObj.speakText(axsScholar.ONLY_ONE_VERSION_STRING);
    }
  }

  if ((evt.charCode == 99) || (evt.charCode == 67)){ // c
    if (axsScholar.currentResult.citationLink){
      axsScholar.axsJAXObj.clickElem(axsScholar.currentResult.citationLink, evt.shiftKey);
    } else{
      axsScholar.axsJAXObj.speakText(axsScholar.CITED_BY_STRING + axsScholar.UNAVAILABLE_STRING);
    }
  }

  if ((evt.charCode == 114) || (evt.charCode == 82)){ // r
    if (axsScholar.currentResult.relatedArticlesLink){
      axsScholar.axsJAXObj.clickElem(axsScholar.currentResult.relatedArticlesLink, evt.shiftKey);
    } else{
      axsScholar.axsJAXObj.speakText(axsScholar.RELATED_ARTICLES_STRING + axsScholar.UNAVAILABLE_STRING);
    }
  }

  if ((evt.charCode == 119) || (evt.charCode == 87)){ // w
    if (axsScholar.currentResult.webSearchLink){
      axsScholar.axsJAXObj.clickElem(axsScholar.currentResult.webSearchLink, evt.shiftKey);
    } else{
      axsScholar.axsJAXObj.speakText(axsScholar.WEB_SEARCH_STRING + axsScholar.UNAVAILABLE_STRING);
    }
  }

  if ((evt.charCode == 108) || (evt.charCode == 76)){ // l
    if (axsScholar.currentResult.librarySearchLink){
      axsScholar.axsJAXObj.clickElem(axsScholar.currentResult.librarySearchLink, evt.shiftKey);
    } else{
      axsScholar.axsJAXObj.speakText(axsScholar.LIBRARY_SEARCH_STRING + axsScholar.UNAVAILABLE_STRING);
    }
  }

  if ((evt.charCode == 104) || (evt.charCode == 72)){ // h
    if (axsScholar.currentResult.HTMLVerLink){
      axsScholar.axsJAXObj.clickElem(axsScholar.currentResult.HTMLVerLink, evt.shiftKey);
    } else{
      axsScholar.axsJAXObj.speakText(axsScholar.VIEW_AS_HTML_STRING + axsScholar.UNAVAILABLE_STRING);
    }
  }

  if ((evt.charCode == 98) || (evt.charCode == 66)){ // b
    if (axsScholar.currentResult.BLDirectLink){
      axsScholar.axsJAXObj.clickElem(axsScholar.currentResult.BLDirectLink, evt.shiftKey);
    } else{
      axsScholar.axsJAXObj.speakText(axsScholar.BL_DIRECT_STRING + axsScholar.UNAVAILABLE_STRING);
    }
  }
};




//************
//Functions for traversing results
//************

axsScholar.buildResultsArray = function(){
  axsScholar.resultsArray = new Array();
  var paragraphs = document.getElementsByTagName('P');
  for (var i = 0; i<paragraphs.length; i++){
    if (paragraphs[i].className == 'g'){
      axsScholar.resultsArray.push(paragraphs[i]);
    }
  }
  axsScholar.resultsIndex = -1;
  //There were no results
  if (axsScholar.resultsArray.length === 0){
    axsScholar.jumpToTryQueryOnEntireWebLink();
  }
};

//Only used when there are no results
axsScholar.jumpToTryQueryOnEntireWebLink = function(){
  var links = document.getElementsByTagName('A');
  for (var i=0; i<links.length; i++){
    if (links[i].textContent == axsScholar.TRY_WEB_QUERY_STRING){
      links[i].blur();
      links[i].focus();
    }
  }
};

axsScholar.goToNextResult = function(cycleBool){
  if (axsScholar.resultsArray.length === 0){
    axsScholar.jumpToTryQueryOnEntireWebLink();
  }
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
  var currentResultNode = axsScholar.resultsArray[axsScholar.resultsIndex];
  currentResultNode.scrollIntoView(true);
  axsScholar.axsJAXObj.speakNode(currentResultNode);
  axsScholar.buildCurrentResultInfo();
};

axsScholar.goToPrevResult = function(cycleBool){
  if (axsScholar.resultsArray.length === 0){
    axsScholar.jumpToTryQueryOnEntireWebLink();
  }
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
  var currentResultNode = axsScholar.resultsArray[axsScholar.resultsIndex];
  currentResultNode.scrollIntoView(true);
  axsScholar.axsJAXObj.speakNode(currentResultNode);
  axsScholar.buildCurrentResultInfo();
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


//************
//Functions for working with results
//************
axsScholar.buildCurrentResultInfo = function(){
  axsScholar.currentResult = new axsScholar.scholarResultObj();
  var currentResultNode = axsScholar.resultsArray[axsScholar.resultsIndex];
  //Find main link
  if (currentResultNode.childNodes[0].getElementsByTagName('A').length > 0){
    axsScholar.currentResult.mainLink = currentResultNode.childNodes[0].getElementsByTagName('A')[0];
  }
  //Find alternative versions
  if ((currentResultNode.childNodes[2].tagName == 'A') && (currentResultNode.childNodes[2].className == 'fl')){
    axsScholar.currentResult.versionsLink = currentResultNode.childNodes[2];
  }
  //Find links in the snippet area
  var resultSnippet = null;
  for (var i=0; i<currentResultNode.childNodes.length; i++){
    if ((currentResultNode.childNodes[i].tagName == 'FONT') && (currentResultNode.childNodes[i].getElementsByTagName('A').length > 0)){
      resultSnippet = currentResultNode.childNodes[i];
      break;
    }
  }
  var links = resultSnippet.getElementsByTagName('A');
  for (i=0; i<links.length; i++){
    if (links[i].className == 'fl'){
      if (links[i].textContent.indexOf(axsScholar.CITED_BY_STRING) === 0){
        axsScholar.currentResult.citationLink = links[i];
      } else if (links[i].textContent == axsScholar.RELATED_ARTICLES_STRING){
        axsScholar.currentResult.relatedArticlesLink = links[i];
      } else if (links[i].textContent == axsScholar.WEB_SEARCH_STRING){
        axsScholar.currentResult.webSearchLink = links[i];
      } else if (links[i].textContent == axsScholar.LIBRARY_SEARCH_STRING){
        axsScholar.currentResult.librarySearchLink = links[i];
      } else if (links[i].textContent == axsScholar.VIEW_AS_HTML_STRING){
        axsScholar.currentResult.HTMLVerLink = links[i];
      } else if (links[i].textContent == axsScholar.BL_DIRECT_STRING){
        axsScholar.currentResult.BLDirectLink = links[i];
      }
    }
  }
};


axsScholar.announceOptions = function(){
  var messageString = "";
  if (axsScholar.currentResult.citationLink){
    messageString = messageString + 'C, ' + axsScholar.currentResult.citationLink.textContent + '. ';
  }
  if (axsScholar.currentResult.versionsLink){
    messageString = messageString + 'V, ' + axsScholar.currentResult.versionsLink.textContent + '. ';
  }
  if (axsScholar.currentResult.librarySearchLink){
    messageString = messageString + 'L, ' + axsScholar.currentResult.librarySearchLink.textContent + '. ';
  }
  if (axsScholar.currentResult.relatedArticlesLink){
    messageString = messageString + 'R, ' + axsScholar.currentResult.relatedArticlesLink.textContent + '. ';
  }
  if (axsScholar.currentResult.HTMLVerLink){
    messageString = messageString + 'H, ' + axsScholar.currentResult.HTMLVerLink.textContent; + '. ';
  }
  if (axsScholar.currentResult.BLDirectLink){
    messageString = messageString + 'B, ' + axsScholar.currentResult.BLDirectLink.textContent; + '. ';
  }
  if (axsScholar.currentResult.webSearchLink){
    messageString = messageString + 'W, ' + axsScholar.currentResult.webSearchLink.textContent; + '. ';
  }
  axsScholar.axsJAXObj.speakText(messageString);
};




axsScholar.init();

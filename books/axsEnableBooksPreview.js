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
 * @fileoverview AxsJAX JavaScript to enhance accessibility
 * of Google Books.
 * Note that these  scripts are for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsBooksPreview = {};



//These are strings used to find specific links
axsBooksPreview.TWO_PAGES_STRING = 'Two pages';
axsBooksPreview.ABOUT_STRING = 'About this book';
axsBooksPreview.MORE_STRING = 'more';

//These are strings to be spoken to the user
axsBooksPreview.PAGE_STRING = 'Page ';
axsBooksPreview.HELP =
    'The following shortcut keys are available. ' +
    'Right arrow or N, go to the next page. ' +
    'Left arrow or P, go to the previous page. ' +
    'S, jump to search in this book field. ' +
    'J, hear the next search result. ' +
    'K, hear the previous search result. ' +
    'Enter, go to the search result. ' +
    'G, jump to the go to a particular page field. ' +
    'Slash, jump to search for books field. ' +
    'Escape, leave search field. ' +
    'A, go to the about page for this book. ';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsBooksPreview.axsJAXObj = null;

axsBooksPreview.inputFocused = false;
axsBooksPreview.lastFocusedNode = null;

axsBooksPreview.onLeftPage = false;

axsBooksPreview.resultsArray = null;
axsBooksPreview.resultsIndex = 0;


/*
 * init: Set up Books Preview page
 * to use two-page view  with full text.
 */
axsBooksPreview.init = function(){
  axsBooksPreview.axsJAXObj = new AxsJAX(true);

  //Add event listeners
  document.addEventListener('keypress', axsBooksPreview.keyHandler, true);
  document.addEventListener('focus', axsBooksPreview.focusHandler, true);
  document.addEventListener('blur', axsBooksPreview.blurHandler, true);

  //Watch for when pages are changed
  var viewport = document.getElementById('viewport');
  viewport.addEventListener('DOMNodeInserted',
                            axsBooksPreview.pageInsertionHandler,
                            true);
  
  //Watch for when search results show up
  var searchContent = document.getElementById('search_content');
  searchContent.addEventListener('DOMNodeInserted',
                                 axsBooksPreview.resultInsertionHandler,
                                 true);

  //Switch to two page display with plain text
  axsBooksPreview.onLeftPage = false;
  var toolbarImages =
      document.getElementById('toolbar').getElementsByTagName('IMG');
  for (var i=0; i<toolbarImages.length; i++){
    if (toolbarImages[i].title == axsBooksPreview.TWO_PAGES_STRING){
      axsBooksPreview.axsJAXObj.clickElem(toolbarImages[i],false);
    }
  }
  var textModeLink = document.getElementById('text_mode_text');
  if (textModeLink){
    axsBooksPreview.axsJAXObj.clickElem(textModeLink,false);
  }
  axsBooksPreview.expandAllMoreLinks();
  axsBooksPreview.buildResultsArray();

};


/*
 * Speak newly opened page.
 */

axsBooksPreview.pageInsertionHandler = function(evt){
   if (evt.target.tagName == 'P'){
     if (axsBooksPreview.onLeftPage){
       window.setTimeout(axsBooksPreview.speakRightPage,100);
     } else {
       window.setTimeout(axsBooksPreview.speakLeftPage,100);
     }
   }
};

/**
 * Record focus changes and remember when input areas get focus.
 * When an input field has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param evt {event} A Focus event
 */

axsBooksPreview.focusHandler = function(evt){
  axsBooksPreview.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsBooksPreview.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param evt {event} A Blur event
 */
axsBooksPreview.blurHandler = function (evt){
  axsBooksPreview.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsBooksPreview.inputFocused = false;
  }
};



/*
 * go to search field
 */

axsBooksPreview.goFindInBook = function () { // s
  var inputs = document.getElementById('search_form').getElementsByTagName('INPUT');
  for (var i=0,input; input = inputs[i]; i++){
      if (input.type == 'text'){
        input.focus();
        input.select();
        return false;
      }
    }
  return true; //event not handled
};

/*
 * Move to jump-to-page field
 */

axsBooksPreview.jumpToPage = function () { // g
  var jtp = document.getElementById('jtp');
  if (jtp) {
    jtp.focus();
    jtp.select(); //and select all text
    return false;
  } else {
    // event not handled
    return true;
  }
};



/*
 * Go to search field
 */

axsBooksPreview.goSearch = function () { // / (slash symbol)
  var q = document.getElementsByName('q')[0];
  if (q) {
    q.focus();  
    q.select(); //and select all text
    return false;
  } else {
    // event not handled
    return true;
  }
};

axsBooksPreview.keyHandler = function(evt){
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey)
    return true;
  
  if (evt.keyCode == 27) { // escape
    axsBooksPreview.lastFocusedNode.blur();
    return false;
  }

  if (axsBooksPreview.inputFocused) return true;
  
  var command =  axsBooksPreview.keyCodeMap[evt.keyCode] ||
  axsBooksPreview.charCodeMap[evt.charCode];

  if (command)  return  command();
  return true;
};

axsBooksPreview.goToAboutPage = function(){
  var synopsisDiv =  document.getElementById('synopsis');
  var linksArray = synopsisDiv.getElementsByTagName('A');
  for (var i=0, link; link = linksArray[i]; i++){
    if (link.textContent == axsBooksPreview.ABOUT_STRING){
      axsBooksPreview.axsJAXObj.clickElem(link,false);
    }
  }
};



//************
//Functions for pages
//************
axsBooksPreview.generatePageNumberString = function(){
  var pageNum = parseInt(document.getElementById('jtp').value,10);
  if (isNaN(pageNum)){
    return '';
  }
  if (((pageNum%2) == 1) && axsBooksPreview.onLeftPage){
    pageNum = pageNum - 1;
  }
  if (((pageNum%2) === 0) && !axsBooksPreview.onLeftPage){
    pageNum = pageNum + 1;
  }
  return axsBooksPreview.PAGE_STRING + pageNum + '. ';
};

axsBooksPreview.speakLeftPage = function(){
  var viewport = document.getElementById('viewport');
  var thePage = viewport.getElementsByTagName('P')[0];
  axsBooksPreview.onLeftPage = true;
  var theMessage = axsBooksPreview.generatePageNumberString();
  if (thePage){
    theMessage = theMessage + thePage.textContent;
  }
  axsBooksPreview.axsJAXObj.speakTextViaNode(theMessage);
};

axsBooksPreview.speakRightPage = function(){
  var viewport = document.getElementById('viewport');
  var thePage = viewport.getElementsByTagName('P')[1];
  axsBooksPreview.onLeftPage = false;
  var theMessage = axsBooksPreview.generatePageNumberString();
  if (thePage){
    theMessage = theMessage + thePage.textContent;
  }
  axsBooksPreview.axsJAXObj.speakTextViaNode(theMessage);
};

axsBooksPreview.goToNextPage = function(){
  if (axsBooksPreview.onLeftPage){
    axsBooksPreview.speakRightPage();
  } else {
    axsBooksPreview.axsJAXObj.clickElem(document.getElementById('next_btn'),false);
  }
};


axsBooksPreview.goToPrevPage = function(){
  if (!axsBooksPreview.onLeftPage){
    axsBooksPreview.speakLeftPage();
  } else {
    axsBooksPreview.axsJAXObj.clickElem(document.getElementById('prev_btn'),false);
  }
};


//************
//Functions for search results
//************
axsBooksPreview.resultInsertionHandler = function(){
  axsBooksPreview.buildResultsArray();
  axsBooksPreview.goToNextResult();
};

axsBooksPreview.buildResultsArray = function(){
  axsBooksPreview.resultsArray = new Array();
  axsBooksPreview.resultsIndex = -1;
  var searchContent = document.getElementById('search_content');
  var divsArray = searchContent.getElementsByTagName('DIV');
  for (var i=0, currentDiv; currentDiv = divsArray[i]; i++){
    if (currentDiv.className == 'searchresult'){
      axsBooksPreview.resultsArray.push(currentDiv);
    }
  }
  if ( (axsBooksPreview.resultsArray.length === 0) &&
       (searchContent.firstChild.textContent) ){
    axsBooksPreview.resultsArray.push(searchContent.firstChild);
  }
};


axsBooksPreview.goToNextResult = function(){
  axsBooksPreview.resultsIndex++;
  if(axsBooksPreview.resultsIndex >= axsBooksPreview.resultsArray.length){
    axsBooksPreview.resultsIndex = 0;
  }
  var currentResultNode =
      axsBooksPreview.resultsArray[axsBooksPreview.resultsIndex];
  axsBooksPreview.axsJAXObj.goTo(currentResultNode);
};

axsBooksPreview.goToPrevResult = function(){
  axsBooksPreview.resultsIndex--;
  if(axsBooksPreview.resultsIndex < 0){
    axsBooksPreview.resultsIndex = axsBooksPreview.resultsArray.length - 1;
  }
  var currentResultNode =
      axsBooksPreview.resultsArray[axsBooksPreview.resultsIndex];
  axsBooksPreview.axsJAXObj.goTo(currentResultNode);
};

axsBooksPreview.actOnCurrentItem = function(shiftKey){
  var linkIndex = 0;
  var currentItem = axsBooksPreview.resultsArray[axsBooksPreview.resultsIndex];
  var currentLink = currentItem.getElementsByTagName('A')[linkIndex];
  if (currentLink){
    axsBooksPreview.axsJAXObj.clickElem(currentLink,shiftKey);
  }
};

/**
 * Expand everything that can be expanded on the page by clicking on all
 * the "more >>" links.
 * Note that only the "more" part is matched - matching for
 * the " >>" part causes problems.
 */
axsBooksPreview.expandAllMoreLinks = function(){
  var spansArray = document.body.getElementsByTagName('SPAN');
  for (var i=0,currentLink; currentLink = spansArray[i]; i++){
    if ( (currentLink.className == 'morelesslink') &&
         (currentLink.textContent.indexOf(axsBooksPreview.MORE_STRING) === 0) ){
      axsBooksPreview.axsJAXObj.clickElem(currentLink, false);
    }
  }
};

axsBooksPreview.keyCodeMap = {
13 : function() {axsBooksPreview.actOnCurrentItem(false);}, // enter (tvr: lost shift)
37 : axsBooksPreview.goToPrevPage, // left arrow
33 : axsBooksPreview.goToPrevPage, // Page up
39 : axsBooksPreview.goToNextPage, // down arrow
34 : axsBooksPreview.goToNextPage // Page Down
};

axsBooksPreview.charCodeMap = {
63 : function () {
    axsBooksPreview.axsJAXObj.speakTextViaNode(axsBooksPreview.HELP);}, // ?
97 : axsBooksPreview.goToAboutPage, // A
103 : axsBooksPreview.jumpToPage,  //g
106 : axsBooksPreview.goToNextResult, // j
107 : axsBooksPreview.goToPrevResult, // k
110: axsBooksPreview.goToNextPage, // n
112 : axsBooksPreview.goToPrevPage, //p
115 : axsBooksPreview.goFindInBook, //s 
47 : axsBooksPreview.goSearch
};


window.setTimeout(axsBooksPreview.init,500);

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
var axsBooksPreview = {};



//These are strings used to find specific links
axsBooksPreview.TWO_PAGES_STRING = 'Two pages';
axsBooksPreview.ABOUT_STRING = 'About this book';
axsBooksPreview.MORE_STRING = 'more';

//These are strings to be spoken to the user
axsBooksPreview.HELP_STRING =
    'The following shortcut keys are available. ' +
    'Right arrow or J, go to the next page. ' +
    'Left arrow or K, go to the previous page. ' +
    'S, jump to search in this book field. ' +
    'N, hear the next search result. ' +
    'P, hear the previous search result. ' +
    'Enter, go to the search result. ' +
    'G, jump to the go to a particular page field. ' +
    'Slash, jump to search for books field. ' +
    'Escape, leave search field. ' +
    'A, go to the about page for this book. ';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsBooksPreview.axsJAXObj = null;

axsBooksPreview.inputFocused = false;
axsBooksPreview.lastFocusedNode = null;

axsBooksPreview.onLeftPage = false;

axsBooksPreview.resultsArray = null;
axsBooksPreview.resultsIndex = 0;





axsBooksPreview.init = function(){
  axsBooksPreview.axsJAXObj = new AxsJAX(true);

  //Add event listeners
  document.addEventListener('keypress', axsBooksPreview.extraKeyboardNavHandler,
                             true);
  document.addEventListener('focus', axsBooksPreview.focusHandler, true);
  document.addEventListener('blur', axsBooksPreview.blurHandler, true);

  //Watch for when pages are changed
  var viewport = document.getElementById('viewport');
  viewport.addEventListener('DOMNodeInserted', axsBooksPreview.pageInsertionHandler,
                          true);
  
  //Watch for when search results show up
  var searchContent = document.getElementById('search_content');
  searchContent.addEventListener('DOMNodeInserted', axsBooksPreview.resultInsertionHandler,
                          true);

  //Switch to two page display with plain text
  axsBooksPreview.onLeftPage = false;
  var toolbarImages = document.getElementById('toolbar').getElementsByTagName('IMG');
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
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
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
 * @param {event} A Blur event
 */
axsBooksPreview.blurHandler = function (evt){
  axsBooksPreview.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsBooksPreview.inputFocused = false;
  }
};


axsBooksPreview.extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT. 
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsBooksPreview.lastFocusedNode.blur();
    return false;
  }

  if (axsBooksPreview.inputFocused){
    return true;
  }

  if (evt.charCode == 97){ // a
    axsBooksPreview.goToAboutPage();
    return false;
  }

  if (evt.charCode == 103){ // g
    // Focus on the jump to page blank
    document.getElementById('jtp').focus();
    document.getElementById('jtp').select(); //and select all text
    return false;
  }

  if ((evt.charCode == 106) || (evt.keyCode == 39)){ // j or right arrow
    axsBooksPreview.goToNextPage();
    return false;
  }
  if ((evt.charCode == 107) || (evt.keyCode == 37)){ // k or left arrow
    axsBooksPreview.goToPrevPage();
    return false;
  }
  if (evt.charCode == 110){ // n
    axsBooksPreview.goToNextResult();
    return false;
  }
  if (evt.charCode == 112){ // p
    axsBooksPreview.goToPrevResult();
    return false;
  }


  if (evt.charCode == 115){ // s
    var inputElems =
        document.getElementById('search_form').getElementsByTagName('INPUT');
    for (var i=0,input; input = inputElems[i]; i++){
      if (input.type == 'text'){
        input.focus();
        input.select();
        return false;
      }
    }
  }

  if (evt.keyCode == 13){ // Enter
    axsBooksPreview.actOnCurrentItem(evt.shiftKey);
  }


  if (evt.charCode == 47){ // / (slash symbol)
    // Focus on the top search blank
    document.getElementsByName('q')[0].focus();  
    document.getElementsByName('q')[0].select(); //and select all text
    return false;
  }


  if (evt.charCode == 63){ // ? (question mark)
    axsBooksPreview.axsJAXObj.speakText(axsBooksPreview.HELP_STRING);
    return false;
  }
  
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

axsBooksPreview.speakLeftPage = function(){
  var viewport = document.getElementById('viewport');
  var thePage = viewport.getElementsByTagName('P')[0];
  axsBooksPreview.onLeftPage = true;
  if (thePage){
    axsBooksPreview.axsJAXObj.speakNode(thePage);
  }
};

axsBooksPreview.speakRightPage = function(){
  var viewport = document.getElementById('viewport');
  var thePage = viewport.getElementsByTagName('P')[1];
  axsBooksPreview.onLeftPage = false;
  if (thePage){
    axsBooksPreview.axsJAXObj.speakNode(thePage);
  }
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
  if ((axsBooksPreview.resultsArray.length == 0) && (searchContent.firstChild.textContent)){
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
  var currentItem = axsBooksPreview.resultsArray[axsBooksPreview.resultsIndex]
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
      axsBooksPreview.axsJAXObj.clickElem(currentLink);
    }
  }
};

axsBooksPreview.init();

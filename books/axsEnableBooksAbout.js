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
var axsBooksAbout = {};

axsBooksAbout.categoryObj = function(){
  this.titleNode = null;
  this.mainContentNode = null;
  this.itemsArray = null;
  this.itemsIndex = null;
};



//These are strings used to find specific links
axsBooksAbout.MORE_STRING = 'more';

//These are strings to be spoken to the user
axsBooksAbout.HELP_STRING =
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
    'I, import the current result into a citation format. ' +
    'Page up, go to the previous page. ' +
    'Page down, go to the next page. ';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsBooksAbout.axsJAXObj = null;

axsBooksAbout.categoriesArray = null;
axsBooksAbout.categoriesIndex = 0;


axsBooksAbout.inputFocused = false;
axsBooksAbout.lastFocusedNode = null;


axsBooksAbout.init = function(){
  axsBooksAbout.axsJAXObj = new AxsJAX(true);

  //Add event listeners
  document.addEventListener('keypress', axsBooksAbout.extraKeyboardNavHandler,
                             true);
  document.addEventListener('focus', axsBooksAbout.focusHandler, true);
  document.addEventListener('blur', axsBooksAbout.blurHandler, true);

  //Setup the results array
  axsBooksAbout.expandAllMoreLinks();
  axsBooksAbout.buildCategoriesArray();

  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsBooksAbout.readTitleBar,100);
};



/**
 * Expand everything that can be expanded on the page by clicking on all
 * the "more >>" links.
 * Note that only the "more" part is matched - matching for
 * the " >>" part causes problems.
 */
axsBooksAbout.expandAllMoreLinks = function(){
  var spansArray = document.body.getElementsByTagName('SPAN');
  for (var i=0,currentLink; currentLink = spansArray[i]; i++){
    if ( (currentLink.className == 'morelesslink') &&
         (currentLink.textContent.indexOf(axsBooksAbout.MORE_STRING) === 0) ){
      axsBooksAbout.axsJAXObj.clickElem(currentLink);
    }
  }
};

/**
 * Reads the first thing on the page.
 */
axsBooksAbout.readTitleBar = function(){
  var titleBarNode = document.getElementById('titlebar');
  axsBooksAbout.axsJAXObj.goTo(titleBarNode);
};


/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsBooksAbout.focusHandler = function(evt){
  axsBooksAbout.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsBooksAbout.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsBooksAbout.blurHandler = function (evt){
  axsBooksAbout.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsBooksAbout.inputFocused = false;
  }
};


axsBooksAbout.extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT. 
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsBooksAbout.lastFocusedNode.blur();
    return false;
  }

  if (axsBooksAbout.inputFocused){
    return true;
  }

  if (evt.charCode == 106){ // j
    axsBooksAbout.goToNextItem();
    return false;
  }
  if (evt.charCode == 107){ // k
    axsBooksAbout.goToPrevItem();
    return false;
  }
  if (evt.charCode == 110){ // n
    axsBooksAbout.goToNextCategory();
    return false;
  }
  if (evt.charCode == 112){ // p
    axsBooksAbout.goToPrevCategory();
    return false;
  }


  if (evt.charCode == 47){ // / (slash symbol)
    // Focus on the top search blank
    document.getElementsByName('q')[0].focus();  
    document.getElementsByName('q')[0].select(); //and select all text
    return false;
  }



  if (evt.keyCode == 38){ // Up arrow
    axsBooksAbout.goToPrevCategory();
    return false;
  }
  if (evt.keyCode == 37){ // Left arrow
    axsBooksAbout.goToPrevItem();
    return false;
  }
  if (evt.keyCode == 40){ // Down arrow
    axsBooksAbout.goToNextCategory();
    return false;
  }
  if (evt.keyCode == 39){ // Right arrow
    axsBooksAbout.goToNextItem();
    return false;
  }
  if (evt.charCode == 63){ // ? (question mark)
    axsBooksAbout.axsJAXObj.speakText(axsBooksAbout.HELP_STRING);
    return false;
  }

  if (evt.keyCode == 13){ // Enter
    axsBooksAbout.actOnCurrentItem(evt.shiftKey);
  }



  return true;
};




//************
//Functions for results
//************
axsBooksAbout.buildCategoriesArray = function(){
  axsBooksAbout.categoriesArray = new Array();
  axsBooksAbout.categoriesIndex = -1;
  var cat = null;
  //Summary
  var myNode = document.getElementById('summary_content');
  if (myNode){
    cat = new axsBooksAbout.categoryObj();
    cat.titleNode = myNode.previousSibling;
    cat.mainContentNode = myNode;
    cat.itemsArray = new Array();
    cat.itemsIndex = -1;
    myNode = document.getElementById('coverandmetadata');
    if (myNode){
      cat.itemsArray.push(myNode);
    }
    myNode = document.getElementById('synopsistext');
    if (myNode){
      cat.itemsArray.push(myNode);
    }
    axsBooksAbout.categoriesArray.push(cat);
  }

  //Buy and Borrow Book
  myNode = document.getElementById('summary_content');
  myNode = myNode.childNodes[1];
  if (myNode){
    var tdArray = myNode.getElementsByTagName('TD');
    var cellIndex = 0;
    //Build the Buy category
    cat = new axsBooksAbout.categoryObj();
    cat.titleNode = tdArray[cellIndex];
    cat.mainContentNode = myNode;
    cat.itemsArray = new Array();
    cat.itemsIndex = -1;
    cellIndex++;
    while(tdArray[cellIndex] && (tdArray[cellIndex].className == 'btblinks')){
      cat.itemsArray.push(tdArray[cellIndex]);
      cellIndex++;
    }
    axsBooksAbout.categoriesArray.push(cat);
    //Build the Borrow Category
    cellIndex++;
    cat = new axsBooksAbout.categoryObj();
    cat.titleNode = tdArray[cellIndex];
    cat.mainContentNode = myNode;
    cat.itemsArray = new Array();
    cat.itemsIndex = -1;
    cellIndex++;
    while(tdArray[cellIndex] && (tdArray[cellIndex].className == 'btblinks')){
      cat.itemsArray.push(tdArray[cellIndex]);
      cellIndex++;
    }
    axsBooksAbout.categoriesArray.push(cat);
  }

  //Reviews
  myNode = document.getElementById('reviews');
  if (myNode){
    cat = new axsBooksAbout.categoryObj();
    cat.titleNode = myNode.previousSibling;
    cat.mainContentNode = myNode;
    cat.itemsArray = myNode.getElementsByTagName('TR');
    cat.itemsIndex = -1;
    axsBooksAbout.categoriesArray.push(cat);
  }

  //Key Terms

  //Popular Passages
  myNode = document.getElementById('quotes');
  if (myNode){
    axsBooksAbout.categoriesArray.push(axsBooksAbout.buildCategoryFromPanelParagraphStyle(myNode));
  }

  //Places Mentioned

  //References from Books
  myNode = document.getElementById('book_citations');
  if (myNode){
    axsBooksAbout.categoriesArray.push(axsBooksAbout.buildCategoryFromPanelBookStyle(myNode));
  }

  //References from Scholarly Works
  myNode = document.getElementById('scholar_citations');
  if (myNode){
    axsBooksAbout.categoriesArray.push(axsBooksAbout.buildCategoryFromPanelParagraphStyle(myNode));
  }

  //References from Web Pages
  myNode = document.getElementById('web_references');
  if (myNode){
    axsBooksAbout.categoriesArray.push(axsBooksAbout.buildCategoryFromPanelParagraphStyle(myNode));
  }
  
  //Other Editions
  myNode = document.getElementById('book_other_versions');
  if (myNode){
    axsBooksAbout.categoriesArray.push(axsBooksAbout.buildCategoryFromPanelBookStyle(myNode));
  }
  
  //Related Books
  myNode = document.getElementById('similarbooks');
  if (myNode){
    axsBooksAbout.categoriesArray.push(axsBooksAbout.buildCategoryFromPanelBookStyle(myNode));
  }


  //Sponsored Links

};



axsBooksAbout.buildCategoryFromPanelParagraphStyle = function(contentNode){
    var myNode = contentNode;
    var cat = new axsBooksAbout.categoryObj();
    cat.titleNode = myNode.previousSibling;
    cat.mainContentNode = myNode;
    cat.itemsArray = myNode.getElementsByTagName('P');
    cat.itemsIndex = -1;
    return cat;
}

axsBooksAbout.buildCategoryFromPanelBookStyle = function(contentNode){
    var myNode = contentNode;
    var trArray = myNode.getElementsByTagName('TR');
    var cat = new axsBooksAbout.categoryObj();
    cat.titleNode = myNode.previousSibling;
    cat.mainContentNode = myNode;
    cat.itemsArray = new Array();
    cat.itemsIndex = -1;
    for (var i=0, currentTr; currentTr = trArray[i]; i++){
      cat.itemsArray.push(currentTr.childNodes[1]);
    }
    return cat;
}



axsBooksAbout.goToNextCategory = function(){
  axsBooksAbout.categoriesIndex++;
  if(axsBooksAbout.categoriesIndex >= axsBooksAbout.categoriesArray.length){
    axsBooksAbout.categoriesIndex = 0;
  }
  var currentCategory = axsBooksAbout.categoriesArray[axsBooksAbout.categoriesIndex];
  axsBooksAbout.axsJAXObj.goTo(currentCategory.titleNode);
}


axsBooksAbout.goToPrevCategory = function(){
  axsBooksAbout.categoriesIndex--;
  if(axsBooksAbout.categoriesIndex < 0){
    axsBooksAbout.categoriesIndex = axsBooksAbout.categoriesArray.length - 1;
  }
  var currentCategory = axsBooksAbout.categoriesArray[axsBooksAbout.categoriesIndex];
  axsBooksAbout.axsJAXObj.goTo(currentCategory.titleNode);
}


axsBooksAbout.goToNextItem = function(){
  var currentCategory = axsBooksAbout.categoriesArray[axsBooksAbout.categoriesIndex];
  currentCategory.itemsIndex++;
  if(currentCategory.itemsIndex >= currentCategory.itemsArray.length){
    currentCategory.itemsIndex = 0;
  }
  var currentItem = currentCategory.itemsArray[currentCategory.itemsIndex];
  axsBooksAbout.axsJAXObj.goTo(currentItem);
}


axsBooksAbout.goToPrevItem = function(){
  var currentCategory = axsBooksAbout.categoriesArray[axsBooksAbout.categoriesIndex];
  currentCategory.itemsIndex--;
  if(currentCategory.itemsIndex < 0){
    currentCategory.itemsIndex = currentCategory.itemsArray.length - 1;
  }
  var currentItem = currentCategory.itemsArray[currentCategory.itemsIndex];
  axsBooksAbout.axsJAXObj.goTo(currentItem);
}

axsBooksAbout.actOnCurrentItem = function(shiftKey){
  var currentCategory = axsBooksAbout.categoriesArray[axsBooksAbout.categoriesIndex];
  var currentItem = currentCategory.itemsArray[currentCategory.itemsIndex];
  var currentLink = currentItem.getElementsByTagName('A')[0];
  if (currentLink){
    axsBooksAbout.axsJAXObj.clickElem(currentLink,shiftKey);
  }
}




axsBooksAbout.init();

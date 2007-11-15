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

//These are strings to be spoken to the user
axsBooksPreview.HELP_STRING =
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
axsBooksPreview.axsJAXObj = null;

axsBooksPreview.inputFocused = false;
axsBooksPreview.lastFocusedNode = null;

axsBooksPreview.onLeftPage = false;




axsBooksPreview.init = function(){
  axsBooksPreview.axsJAXObj = new AxsJAX(true);

  //Add event listeners
  document.addEventListener('keypress', axsBooksPreview.extraKeyboardNavHandler,
                             true);
  document.addEventListener('focus', axsBooksPreview.focusHandler, true);
  document.addEventListener('blur', axsBooksPreview.blurHandler, true);

  var viewport = document.getElementById('viewport');
  viewport.addEventListener('DOMNodeInserted', axsBooksPreview.domInsertionHandler,
                          true);

  //Switch to two page display with plain text
  axsBooksPreview.onLeftPage = false;
  var toolbarImages = document.getElementById('toolbar').getElementsByTagName('IMG');
  for (var i=0; i<toolbarImages.length; i++){
    if (toolbarImages[i].title == axsBooksPreview.TWO_PAGES_STRING){
      axsBooksPreview.axsJAXObj.clickElem(toolbarImages[i],false);
    }
  }

  axsBooksPreview.axsJAXObj.clickElem(document.getElementById('text_mode_text'),false);

};



axsBooksPreview.domInsertionHandler = function(evt){
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

  if (evt.charCode == 106){ // j
    axsBooksPreview.goToNextPage();
    return false;
  }
  if (evt.charCode == 107){ // k
    axsBooksPreview.goToPrevPage();
    return false;
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






//************
//Functions for pages
//************

axsBooksPreview.speakLeftPage = function(){
  var viewport = window.content.document.getElementById('viewport');
  axsBooksPreview.axsJAXObj.speakNode(viewport.getElementsByTagName('P')[0]);
  axsBooksPreview.onLeftPage = true;
};

axsBooksPreview.speakRightPage = function(){
  var viewport = window.content.document.getElementById('viewport');
  axsBooksPreview.axsJAXObj.speakNode(viewport.getElementsByTagName('P')[1]);
  axsBooksPreview.onLeftPage = false;
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





axsBooksPreview.init();

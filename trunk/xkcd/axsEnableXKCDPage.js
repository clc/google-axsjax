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
 * of xkcd.
 * Note that these are Greasemonkey scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */



// create namespace
var axsXKCD = {};




//These are strings used to find specific links


//These are strings to be spoken to the user
axsXKCD.HELP_STRING =
    'The following shortcut keys are available. ' +
    'Down arrow or N, go to the next comic. ' +
    'Up arrow or P, go to the previous comic. ' +
    '1, jump to the first comic. ' +
    '0, jump to the latest comic. ' +
    'R, jump to a random comic. ' +
    'Enter, repeat the current comic. ' +
    'Slash, jump to the comic search field. ' +
    'Escape, leave the search field. ';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsXKCD.axsJAXObj = null;

axsXKCD.inputFocused = false;
axsXKCD.lastFocusedNode = null;

axsXKCD.firstComicLink = null;
axsXKCD.prevComicLink = null;
axsXKCD.randomComicLink = null;
axsXKCD.nextComicLink = null;
axsXKCD.latestComicLink = null;

axsXKCD.init = function(){
  axsXKCD.axsJAXObj = new AxsJAX(true);

  //Add event listeners
  document.addEventListener('keypress', axsXKCD.extraKeyboardNavHandler,
                             true);
  document.addEventListener('focus', axsXKCD.focusHandler, true);
  document.addEventListener('blur', axsXKCD.blurHandler, true);
  
  //Add the title and transcription to the alt text of the image.
  axsXKCD.prepImage();
  
  axsXKCD.findLinks();
  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsXKCD.readComic,100);
};



/**
 * Reads the comic by setting focus to the image.
 */
axsXKCD.readComic = function(){
  var mainImage = axsXKCD.getMainImage();
  mainImage.blur();
  mainImage.focus();
};



/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsXKCD.focusHandler = function(evt){
  axsXKCD.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsXKCD.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsXKCD.blurHandler = function (evt){
  axsXKCD.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsXKCD.inputFocused = false;
  }
};


axsXKCD.extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT. 
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsXKCD.lastFocusedNode.blur();
    return false;
  }

  if (axsXKCD.inputFocused){
    return true;
  }
 
  if (evt.charCode == 110){ // n
    axsXKCD.axsJAXObj.clickElem(axsXKCD.nextComicLink,false);
    return false;
  }
  if (evt.charCode == 112){ // p
    axsXKCD.axsJAXObj.clickElem(axsXKCD.prevComicLink,false);
    return false;
  }

  if (evt.charCode == 47){ // / (slash symbol)
    // Focus on the top search blank
    document.getElementsByName('s')[0].focus();  
    document.getElementsByName('s')[0].select(); //and select all text
    return false;
  }

  if (evt.keyCode == 38){ // Up arrow
    axsXKCD.axsJAXObj.clickElem(axsXKCD.prevComicLink,false);
    return false;
  }
  if (evt.keyCode == 40){ // Down arrow
    axsXKCD.axsJAXObj.clickElem(axsXKCD.nextComicLink,false);
    return false;
  }
  if (evt.charCode == 63){ // ? (question mark)
    axsXKCD.axsJAXObj.speakThroughPixel(axsXKCD.HELP_STRING);
    return false;
  }

  if (evt.keyCode == 13){ // Enter
    axsXKCD.readComic(evt.shiftKey);
    return false;
  }
  return true;
};

axsXKCD.getMainImage = function(){
  var contentDiv = document.getElementById('middleContent');
  return contentDiv.getElementsByTagName('IMG')[0];
}

axsXKCD.prepImage = function(){
  var mainImage = axsXKCD.getMainImage();
  mainImage.setAttribute('tabindex',0);
};

axsXKCD.findLinks = function(){
  var contentDiv = document.getElementById('middleContent');
  var liArray = contentDiv.getElementsByTagName('LI');
  for (var i=0, currentLi; currentLi = liArray[i]; i++){
    if (currentLi.textContent == '|<'){
      axsXKCD.firstComicLink = currentLi.firstChild;
    } else if (currentLi.textContent == '< Prev'){
      axsXKCD.prevComicLink = currentLi.firstChild;
    }  else if (currentLi.textContent == 'Random'){
      axsXKCD.randomComicLink = currentLi.firstChild;
    }  else if (currentLi.textContent == 'Next >'){
      axsXKCD.nextComicLink = currentLi.firstChild;
    }  else if (currentLi.textContent == '>|'){
      axsXKCD.latestComicLink = currentLi.firstChild;
    }     
  }
};

axsXKCD.init();

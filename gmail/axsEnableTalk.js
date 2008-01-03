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
 * of Google Talk inside GMail.
 * Note that these are Greasemonkey scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */



// create namespace
var axsTalk = {};

//These are strings used to find specific links


//These are strings to be spoken to the user
axsTalk.HELP_STRING =
    'The following shortcut keys are available. ' +
    'Down arrow or N, go to the next result. ' +
    'Up arrow or P, go to the previous result. ' +
    'Right arrow or J, cycle to the next result. ' +
    'Left arrow or K, cycle to the previous result. ' +
    'G, toggle between the snippet provided by Google Image Search and the alt text from the source of image. ' +
    'Slash, jump to the search field. ' +
    'Escape, leave the search field. ';


axsTalk.translatorsTable  = {
  'ar2en' : 'en',
  'de2en' : 'en',
  'de2fr' : 'fr',
  'el2en' : 'en',
  'en2ar' : 'ar',
  'en2de' : 'de',
  'en2el' : 'el',
  'en2es' : 'es',
  'en2fr' : 'fr',
  'en2it' : 'it',
  'en2ja' : 'ja',
  'en2ko' : 'ko',
  'en2nl' : 'nl',
  'en2ru' : 'ru',
  'en2zh' : 'zh',
  'es2en' : 'en',
  'fr2de' : 'de',
  'fr2en' : 'en',
  'it2en' : 'en',
  'ja2en' : 'en',
  'ko2en' : 'en',
  'nl2en' : 'en',
  'ru2en' : 'en',
  'zh2en' : 'en'
};

axsTalk.itemsArray = null;
axsTalk.itemsIndex = 0;



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsTalk.axsJAXObj = null;


axsTalk.inputFocused = false;
axsTalk.lastFocusedNode = null;

axsTalk.init = function(){
  axsTalk.axsJAXObj = new AxsJAX(true);
  axsTalk.itemsArray = new Array();
  axsTalk.itemsIndex = -1;

  //Add event listeners
  document.addEventListener('keypress', axsTalk.extraKeyboardNavHandler,
                             true);
  document.addEventListener('focus', axsTalk.focusHandler, true);
  document.addEventListener('blur', axsTalk.blurHandler, true);

  document.addEventListener('DOMNodeInserted', axsTalk.domInsertionHandler, true);
  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
 // window.setTimeout(axsImageSearch.goToNextResult,100);
};





/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsTalk.focusHandler = function(evt){
  axsTalk.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsTalk.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsTalk.blurHandler = function (evt){
  axsTalk.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsTalk.inputFocused = false;
  }
};


axsTalk.extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT. 
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsTalk.lastFocusedNode.blur();
    return false;
  }

  if (evt.keyCode == 38){ // Up arrow
    axsTalk.goToPrevMessage();
    return false;
  }
  if (evt.keyCode == 40){ // Down arrow
    axsTalk.goToNextMessage();
    return false;
  }

  if (axsTalk.inputFocused){
    return true;
  }



  if (evt.charCode == 63){ // ? (question mark)
    axsTalk.axsJAXObj.speakTextViaNode(axsTalk.HELP_STRING);
    return false;
  }

  return true;
};

axsTalk.domInsertionHandler = function(evt){
  var target = evt.target;
  if ( (target.tagName == 'DIV') &&
       ( (target.className == 'RNCQof') ||
         (target.className == 'h8iICe') )  ){
    axsTalk.setMsgLang(target);
    axsTalk.axsJAXObj.speakNode(axsTalk.getMessageNode(target),true);
    axsTalk.recordMessage(target);
    }
};

axsTalk.recordMessage = function(messageDiv){
  if (messageDiv.getElementsByTagName('SPAN').length > 1){
    axsTalk.itemsArray.push(messageDiv.getElementsByTagName('SPAN')[0]);
    axsTalk.itemsArray.push(messageDiv.getElementsByTagName('SPAN')[1]);
  } else {
    axsTalk.itemsArray.push(messageDiv);
  }
};

axsTalk.setMsgLang = function(messageDiv){
  var userName = axsTalk.getUserName(messageDiv);
  var msgNode = axsTalk.getMessageNode(messageDiv);
  var lang = axsTalk.translatorsTable[userName];
  if (lang){
    msgNode.lang = lang;
  }
};

axsTalk.getUserName = function(messageDiv){
  var userName = "";
  if (messageDiv.getElementsByTagName('SPAN').length > 1){
    userName = messageDiv.getElementsByTagName('SPAN')[0].textContent;
  } else {
    userName = messageDiv.parentNode.getElementsByTagName('SPAN')[0].textContent;
  }
  userName = userName.substring(0,userName.indexOf(':'));
  return userName;
};

axsTalk.getMessageNode = function(messageDiv){
  if (messageDiv.getElementsByTagName('SPAN').length > 1){
    return messageDiv.getElementsByTagName('SPAN')[1];
  } else {
    return messageDiv;
  }
};

axsTalk.goToItem = function(itemNode){
  itemNode.scrollIntoView(true);
  axsTalk.axsJAXObj.speakNode(itemNode,true);
};

axsTalk.goToNextMessage = function(){
  axsTalk.itemsIndex++;
  if(axsTalk.itemsIndex >= axsTalk.itemsArray.length){
    axsTalk.itemsIndex = axsTalk.itemsArray.length - 1;
  }
  var currentItem = axsTalk.itemsArray[axsTalk.itemsIndex];
  axsTalk.goToItem(currentItem);
};


axsTalk.goToPrevMessage = function(){
  axsTalk.itemsIndex--;
  if(axsTalk.itemsIndex < 0){
    axsTalk.itemsIndex = 0;
  }
  var currentItem = axsTalk.itemsArray[axsTalk.itemsIndex];
  axsTalk.goToItem(currentItem);
};



axsTalk.init();

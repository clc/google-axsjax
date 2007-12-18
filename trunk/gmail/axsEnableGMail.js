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
 * of Google GMail.
 * Note that these are Greasemonkey scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */



// create namespace
var axsGMail = {};



//These are strings used to find specific links
axsGMail.EXPAND_ALL_STRING = "Expand all";


//These are strings to be spoken to the user
axsGMail.UNREAD_STRING = 'Unread. ';
axsGMail.READ_STRING = 'Red. ';
axsGMail.SELECTED_STRING = 'Selected. ';
axsGMail.STARRED_STRING = 'Starred. ';
axsGMail.NOT_STRING = 'Not ';
axsGMail.UNDO_MSG_STRING = "To undo, press Z.";

axsGMail.HELP_STRING =
    'The following shortcut keys are available. ' +
    'L, go to the quick nav select box for jumping to labels. ' +
    'J, go to the next conversation. ' +
    'K, go to the previous conversation. ' +
    'O, open the current conversation. ' +
    'N, go to the next message in the current conversation. ' +
    'P, go to the previous message in the current conversation. ' +
    'X, select conversation. ' +
    'S, star a message/conversation. ' +
    'Y, remove conversation from current view. ' +
    'M, mute conversation. ' +
    'Exclamation mark, report spam. ' +
    'Number sign, move to trash. ' +
    'Z, undo. ' +
    'C, compose. ' +
    'R, reply. ' +
    'A, reply all. ' +
    'F, forward message. ' +
    'Slash, jump to the search field. ' +
    'Escape, leave the search field. ' +
    'Period, more actions menu. ';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsGMail.axsJAXObj = null;

axsGMail.gMonkeyObj = null;

axsGMail.quickNavNode = null;

axsGMail.inputFocused = false;
axsGMail.lastFocusedNode = null;



axsGMail.TL_currentItem = null;
axsGMail.TL_needToSpeak = false;

axsGMail.CV_currentItem = null;
axsGMail.CV_needToSpeak = false;



axsGMail.init = function(gmObj){
  axsGMail.axsJAXObj = new AxsJAX(true);
  axsGMail.gMonkeyObj = gmObj;

  axsGMail.TL_currentItem = null;
  axsGMail.TL_needToSpeak = false;
  axsGMail.CV_currentItem = null;
  axsGMail.CV_needToSpeak = false;

  //Add event listeners
  document.addEventListener('keypress', axsGMail.extraKeyboardNavHandler,
                             true);
  document.addEventListener('focus', axsGMail.focusHandler, true);
  document.addEventListener('blur', axsGMail.blurHandler, true);

  //AxsJAX the canvas frame
  var canvasDoc = document.getElementById('canvas_frame').contentDocument;
  axsGMail.axsJAXObj.setActiveParent(canvasDoc.body);
  canvasDoc.addEventListener('DOMAttrModified', axsGMail.domAttrModifiedHandler, true);
  canvasDoc.addEventListener('DOMNodeInserted', axsGMail.domInsertionHandler, true);
  canvasDoc.addEventListener('keypress', axsGMail.canvas_extraKeyboardNavHandler,
                             true);
  canvasDoc.addEventListener('focus', axsGMail.focusHandler, true);
  canvasDoc.addEventListener('blur', axsGMail.blurHandler, true);

  //Add view change handlers
  axsGMail.gMonkeyObj.registerViewChangeCallback(axsGMail.viewChangeHandler);

  axsGMail.initQuickNav();
};




/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsGMail.focusHandler = function(evt){
  axsGMail.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsGMail.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsGMail.blurHandler = function (evt){
  axsGMail.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsGMail.inputFocused = false;
  }
};


axsGMail.extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT. 
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsGMail.lastFocusedNode.blur();
    return false;
  }


  if (axsGMail.inputFocused){
    return true;
  }

  return true;
};


axsGMail.canvas_extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT.
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsGMail.lastFocusedNode.blur();
    return false;
  }


  if (axsGMail.inputFocused){
    return true;
  }

 if (evt.charCode == 63){ // ? (question mark)
    axsGMail.axsJAXObj.speakThroughPixel(axsGMail.HELP_STRING);
    return false;
  }

  if (evt.charCode == 108){      // l
    axsGMail.quickNavNode.getElementsByTagName('SELECT')[0].focus();
  }
  
  var currentView = axsGMail.gMonkeyObj.getActiveViewType();

  if (currentView == 'tl'){
    //Don't activate more than one monitor
    if (!axsGMail.TL_needToSpeak){
      if((evt.charCode == 106) || (evt.charCode == 107)){    //j or k
        axsGMail.TL_needToSpeak = true;
        window.setTimeout(axsGMail.TL_needToSpeakMonitor,10);
        return true;
      }
    }
  }

  if (currentView == 'cv'){
    //Don't activate more than one monitor
    if (!axsGMail.CV_needToSpeak){
      if((evt.charCode == 110) || (evt.charCode == 112)){       //n or p
        axsGMail.CV_needToSpeak = true;
        window.setTimeout(axsGMail.CV_needToSpeakMonitor,10);
        return true;
      }
    }
  }
};



axsGMail.domAttrModifiedHandler = function(evt){
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;
  if ( (attrib == 'class') &&
       (oldVal == 'SenFne') &&
       (newVal == 'SenFne P0GJpc') ){
    target.setAttribute('tabindex',0);
    window.setTimeout(new function(){target.focus();},0);
    return;
  }


  if (axsGMail.gMonkeyObj.getActiveViewType() == 'tl'){
    axsGMail.TL_domAttrModifiedHandler(evt);
  }  else if (axsGMail.gMonkeyObj.getActiveViewType() == 'cv'){
    axsGMail.CV_domAttrModifiedHandler(evt);
  }
};

axsGMail.domInsertionHandler = function(evt){
  if (axsGMail.gMonkeyObj.getActiveViewType() == 'tl'){
    axsGMail.TL_domInsertionHandler(evt);
  }
};


axsGMail.viewChangeHandler = function(){
  var viewType = axsGMail.gMonkeyObj.getActiveViewType();
  if (viewType == 'tl'){
    return;
  } else if (viewType == 'cv'){
    axsGMail.CV_forceExpandAll();
    //Press n will turn on keyboard shortcuts for the conversation view
    axsGMail.axsJAXObj.sendKey(axsGMail.gMonkeyObj.getActiveViewElement(),'n',false,false,false);
  }
};

//************
//Functions for working with the threadlist ('tl') view (inbox)
//************
axsGMail.TL_domAttrModifiedHandler = function(evt){
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;

  //Going to a new message causes an arrow to become visible to the left of the message
  if ((attrib == 'style') && (newVal == 'visibility: visible;')){
    var tlItem = target.parentNode.parentNode;
    axsGMail.TL_speakItem(tlItem);
  }

  //Message selected
  if ((attrib == 'class') && (oldVal.indexOf('rfza3e') == -1) && (newVal.indexOf('rfza3e') != -1)){
    axsGMail.axsJAXObj.speakThroughPixel(axsGMail.SELECTED_STRING);
  }
  //Message deselected
  if ((attrib == 'class') && (oldVal.indexOf('rfza3e') != -1) && (newVal.indexOf('rfza3e') == -1)){
    axsGMail.axsJAXObj.speakThroughPixel(axsGMail.NOT_STRING + axsGMail.SELECTED_STRING);
  }
  //Message starred
  if ((attrib == 'class') && (oldVal.indexOf('n1QcP') == -1) && (newVal.indexOf('n1QcP') != -1)){
    axsGMail.axsJAXObj.speakThroughPixel(axsGMail.STARRED_STRING);
  }
  //Message unstarred
  if ((attrib == 'class') && (oldVal.indexOf('n1QcP') != -1) && (newVal.indexOf('n1QcP') == -1)){
    axsGMail.axsJAXObj.speakThroughPixel(axsGMail.NOT_STRING + axsGMail.STARRED_STRING);
  }

};

axsGMail.TL_domInsertionHandler = function(evt){
  var target = evt.target;
  //Process alerts
  if (target.parentNode.className == 'm14Grb'){
    var message = target.parentNode.firstChild.textContent;
    var undoLink = axsGMail.axsJAXObj.getActiveDocument().getElementById('link_undo');
    if (undoLink){
      axsGMail.axsJAXObj.markPosition(undoLink);
      message = message + axsGMail.UNDO_MSG_STRING;
    }
    axsGMail.axsJAXObj.speakThroughPixel(message);
  }
};



axsGMail.TL_isNew = function(tlItem){
  return (tlItem.className.indexOf('QhHSYc') != -1);
};

axsGMail.TL_isSelected = function(tlItem){
  var checkbox = tlItem.getElementsByTagName('INPUT')[0];
  return checkbox.checked;
};

axsGMail.TL_isStarred = function(tlItem){
  var star = tlItem.childNodes[1];
  return (star.className.indexOf('n1QcP') != -1);
};

axsGMail.TL_getSender = function(tlItem){
  return tlItem.childNodes[2];
};

axsGMail.TL_getSubject = function(tlItem){
  return tlItem.childNodes[4].firstChild;
};

axsGMail.TL_getSnippet = function(tlItem){
  return tlItem.childNodes[4].lastChild;
};

axsGMail.TL_getDate = function(tlItem){
  return tlItem.lastChild;
};


axsGMail.TL_speakItem = function(tlItem){
  axsGMail.TL_needToSpeak = false;
  var message = "";
  if (axsGMail.TL_isNew(tlItem)){
    message = message + axsGMail.UNREAD_STRING;
  } else {
    message = message + axsGMail.READ_STRING;
  }
  if (axsGMail.TL_isSelected(tlItem)){
    message = message + axsGMail.SELECTED_STRING;
  }
  if (axsGMail.TL_isStarred(tlItem)){
    message = message + axsGMail.STARRED_STRING;
  }
  message = message + axsGMail.TL_getSender(tlItem).textContent + '. ' +
            axsGMail.TL_getSubject(tlItem).textContent + '. ' +
            axsGMail.TL_getSnippet(tlItem).textContent + '. ' +
            axsGMail.TL_getDate(tlItem).textContent + '. ';
  axsGMail.axsJAXObj.speakThroughPixel(message);
  axsGMail.TL_currentItem = tlItem;
};

axsGMail.TL_repeatCurrentItem = function(){
  if (axsGMail.TL_currentItem){
    axsGMail.TL_speakItem(axsGMail.TL_currentItem);
  }
};

axsGMail.TL_needToSpeakMonitor = function(){
  if ((axsGMail.gMonkeyObj.getActiveViewType() == 'tl') && axsGMail.TL_needToSpeak){
    axsGMail.TL_repeatCurrentItem();
  }
};



//************
//Functions for working with the conversation ('cv') view (a thread of messages)
//************
axsGMail.CV_domAttrModifiedHandler = function(evt){
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;

  //Going to a new message causes an arrow to become visible to the left of the message
  if ((attrib == 'class') && (newVal.indexOf('NGQVAc') != -1)){
    var cvItem = target.nextSibling;
    if (cvItem.tagName == 'IMG'){
      cvItem = cvItem.nextSibling;
    }
    axsGMail.CV_goToItem(cvItem);
  }
  
  //Message starred
  if ((attrib == 'class') && (oldVal.indexOf('kJv9nb') == -1) && (newVal.indexOf('kJv9nb') != -1)){
    axsGMail.axsJAXObj.speakThroughPixel(axsGMail.STARRED_STRING);
  }
  //Message unstarred
  if ((attrib == 'class') && (oldVal.indexOf('kJv9nb') != -1) && (newVal.indexOf('kJv9nb') == -1)){
    axsGMail.axsJAXObj.speakThroughPixel(axsGMail.NOT_STRING + axsGMail.STARRED_STRING);
  }
};

axsGMail.CV_isStarred = function(cvItem){
  var star = axsGMail.CV_getStarImgNode(cvItem);
  return (star.className.indexOf('kJv9nb') != -1);
};

axsGMail.CV_getStarImgNode = function(cvItem){
  return cvItem.getElementsByTagName('IMG')[0];
};

axsGMail.CV_getSender = function(cvItem){
  var tdArray = cvItem.getElementsByTagName('TD');
  for (var i=0,currentTd; currentTd = tdArray[i]; i++){
    if (currentTd.className == 'zyVlgb XZlFIc'){
      return currentTd;
    }
  }
  return null;
};

axsGMail.CV_getSnippet = function(cvItem){
  var senderNode = axsGMail.CV_getSender(cvItem);
  if (senderNode && senderNode.nextSibling && (senderNode.nextSibling.className == 'zyVlgb XZlFIc')){
    return senderNode.nextSibling;
  }
  return null;
};

axsGMail.CV_getDate = function(cvItem){
  var tdArray = cvItem.getElementsByTagName('TD');
  for (var i=0,currentTd; currentTd = tdArray[i]; i++){
    if (currentTd.className == 'i8p5Ld'){
      return currentTd;
    }
  }
  return null;
};


axsGMail.CV_getContent = function(cvItem){
  if (cvItem.childNodes.length > 3){
    return cvItem.childNodes[3];
  }
  return null;
};


axsGMail.CV_forceExpandAll = function(){
  var uArray = document.getElementById('canvas_frame').contentDocument.getElementsByTagName('U');
  for (var i=0,currentU; currentU = uArray[i]; i++){
    if (currentU.textContent == axsGMail.EXPAND_ALL_STRING){
      axsGMail.axsJAXObj.clickElem(currentU.parentNode,false);
      return;
    }
  }
};

axsGMail.CV_goToItem = function(cvItem){
  axsGMail.CV_needToSpeak = false;
  var message = "";
  if (axsGMail.CV_isStarred(cvItem)){
    message = message + axsGMail.STARRED_STRING;
  }
  var senderNode = axsGMail.CV_getSender(cvItem);
  var snippetNode = axsGMail.CV_getSnippet(cvItem);
  var dateNode = axsGMail.CV_getDate(cvItem);
  var contentNode = axsGMail.CV_getContent(cvItem);
  if (senderNode){
    message = message + senderNode.textContent + '. ';
  }
  if (snippetNode){
    message = message + snippetNode.textContent + '. ';
  }
  if (dateNode){
    message = message + dateNode.textContent + '. ';
  }
  if (contentNode){
    message = message + contentNode.textContent + '. ';
  }
  axsGMail.axsJAXObj.speakThroughPixel(message,cvItem);
  axsGMail.CV_currentItem = cvItem;
};

axsGMail.CV_repeatCurrentItem = function(){
  if (axsGMail.CV_currentItem){
    axsGMail.CV_goToItem(axsGMail.CV_currentItem);
  }
};

axsGMail.CV_needToSpeakMonitor = function(){
  if ((axsGMail.gMonkeyObj.getActiveViewType() == 'cv') && axsGMail.CV_needToSpeak){
    axsGMail.CV_repeatCurrentItem();
  }
};


//
axsGMail.initQuickNav = function(){
  var quickNav = axsGMail.gMonkeyObj.addNavModule('Quick Nav');
  var labels = axsGMail.getLabels();
  var selectNode = document.createElement('select');
  for (var i=0, currentLabel; currentLabel = labels[i]; i++){
    var optionNode = document.createElement('option');
    optionNode.textContent = currentLabel.textContent;
    selectNode.appendChild(optionNode);
  }
  
  selectNode.addEventListener('keypress',axsGMail.quickNav_keyHandler, true);

  quickNav.appendChild(selectNode);
  axsGMail.quickNavNode = quickNav.getElement();
};

axsGMail.getLabels = function(){
  var navPane = axsGMail.gMonkeyObj.getNavPaneElement();
  var expression = ".//DIV[contains(concat(' ', @class, ' '), 'yyT6sf')]";
  return axsGMail.axsJAXObj.evalXPath(expression, navPane);
};

axsGMail.quickNav_keyHandler = function(evt){
  if (evt.keyCode == 13){
    axsGMail.jumpToSelectedQuickNavItem();
  }
};


axsGMail.jumpToSelectedQuickNavItem = function(){
  var labels = axsGMail.getLabels();
  var index = axsGMail.quickNavNode.getElementsByTagName('SELECT')[0].selectedIndex;
  axsGMail.axsJAXObj.clickElem(labels[index].firstChild,false);
};


// Initialize the AxsJAX script using GMail's GMonkey API
// http://code.google.com/p/gmail-greasemonkey/wiki/GmailGreasemonkey10API
gmonkey.load('1.0',axsGMail.init);
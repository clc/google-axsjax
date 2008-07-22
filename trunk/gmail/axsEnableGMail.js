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

/**
 * Collection of classnames
 * @type {Object}
 */
axsGMail.CLASS = {
  AUTOCOMPLETE_INACTIVE : 'ac-row',      //Contacts list
  AUTOCOMPLETE_ACTIVE : 'ac-row active',  
  LAYOUT_COMPONENT_ : 'XoqCub', // The chat window has this class
  HCONT_CHILD_ : 'EGSDee',      // The chat window has this class  
  APP_MENU_ITEM_ACTIVE_ : 'P0GJpc', //More actions menu item
  ROUNDED_BOX_CONTENT_ : 'm14Grb', //alerts ("conversation has been muted")
  NP_LABEL_ : 'yyT6sf',
  TL_UNREAD_ROW_ : 'QhHSYc',
  TL_STARRED_CELL_ : 'n1QcP',
  TL_FIN_CHECKED_ROW_ : 'rfza3e',
  CVF_STAR_ON_ICON_ : 'kyZrld',
  CV_CHEVRON_ : 'AG5mQe',
  CVF_HEADER_LEFT_CELL_ : 'zyVlgb',
  CVF_HEADER_TEXT_ : 'XZlFIc',
  CVF_RELATIVE_DATE_ : 'rziBod',
  CV_EXPANDED_ : 'HprMsc',
  CHAT_BACKGROUND_AVAILABLE_ : 'ilX2xb',
  CHAT_BACKGROUND_OFFLINE_ : 'OvtWcf'
};

//These are strings used to find specific links
/**
 * @type {string}
 */
axsGMail.EXPAND_ALL_STRING = 'Expand all';

//These are strings to be spoken to the user
/**
 * @type {string}
 */
axsGMail.LOADED_STRING = 'Messages loaded.';
/**
 * @type {string}
 */
axsGMail.UNREAD_STRING = 'Unread. ';
/**
 * @type {string}
 */
axsGMail.READ_STRING = 'Red. ';
/**
 * @type {string}
 */
axsGMail.SELECTED_STRING = 'Selected. ';
/**
 * @type {string}
 */
axsGMail.STARRED_STRING = 'Starred. ';
/**
 * @type {string}
 */
axsGMail.NOT_STRING = 'Not ';
/**
 * @type {string}
 */
axsGMail.UNDO_MSG_STRING = 'To undo, press Z.';
/**
 * @type {string}
 */
axsGMail.NEW_CHAT_FROM_STRING = 'New chat message from ';
/**
 * @type {string}
 */
axsGMail.NEW_CHAT_ACTIONS_STRING = 'Press escape to ignore the message. ' +
                                   'Press any other key to open a chat window.';

/**
 * @type {string}
 */
axsGMail.ONLINE_STRING = ', online.';
/**
 * @type {string}
 */
axsGMail.OFFLINE_STRING = ', offline.';
/**
 * @type {string}
 */
axsGMail.IDLE_STRING = ', idle.';
/**
 * @type {string}
 */
axsGMail.CHAT_BUDDIES_STRING = 'Chat buddies';

/**
 * @type {string}
 */
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
 * @type AxsJAX?
 */
axsGMail.axsJAXObj = null;

/**
 * The GMonkey object provided by GMail
 * http://code.google.com/p/gmail-greasemonkey/wiki/GmailGreasemonkey10API
 * @type Object?
 */
axsGMail.gMonkeyObj = null;

/**
 * The DOM node that provides quick navigation for the labels
 * @type Element?
 */
axsGMail.quickNavNode = null;

/**
 * The DOM node that provides an input field for typing 
  * in the name of the buddy the user wishes to chat with
 * @type Element?
 */
axsGMail.buddiesInputNode = null;


/**
 * The DOM node that is the current item in the threadlist view
 * @type Element?
 */
axsGMail.TL_currentItem = null;
/**
 * Whether or not the user has made some keyboard action which 
  * should receive spoken feedback in the threadlist view.
  * This is needed in case the user tries to go to the next thread
  * when they are on the last thread.
 * @type boolean
 */
axsGMail.TL_needToSpeak = false;

/**
 * The DOM node that is the current item in the conversation view
 * @type Element?
 */
axsGMail.CV_currentItem = null;
/**
 * Whether or not the user has made some keyboard action which 
  * should receive spoken feedback in the conversation view.
  * This is needed in case the user tries to go to the next message
  * when they are on the last message.
 * @type boolean
 */
axsGMail.CV_needToSpeak = false;

/**
 * Whether or not the user has made some keyboard action which 
  * should receive spoken feedback in the chat view.
 * @type boolean
 */
axsGMail.chat_needToSpeak = false;

/**
 * Initializes the AxsJAX script for GMail.
 * Note that this should not be done until after the GMonkey object is ready.
 * @param {Object} gmObj The GMonkey object for the page.
 */
axsGMail.init = function(gmObj){
  axsGMail.axsJAXObj = new AxsJAX(true);
  axsGMail.gMonkeyObj = gmObj;

  axsGMail.TL_currentItem = null;
  axsGMail.TL_needToSpeak = false;
  axsGMail.CV_currentItem = null;
  axsGMail.CV_needToSpeak = false;
  axsGMail.chat_needToSpeak = false;



  //Add event listeners
  var mainDoc = window.content.document;
  mainDoc.addEventListener('keypress', axsGMail.extraKeyboardNavHandler,
                             true);
  mainDoc.addEventListener('DOMNodeInserted',
                            axsGMail.mainDoc_domInsertionHandler,
                            true);

  //AxsJAX the canvas frame
  var canvasDoc = mainDoc.getElementById('canvas_frame').contentDocument;
  axsGMail.axsJAXObj.setActiveParent(canvasDoc.body);
  canvasDoc.addEventListener('DOMAttrModified',
                             axsGMail.domAttrModifiedHandler,
                             true);
  canvasDoc.addEventListener('DOMNodeInserted',
                             axsGMail.domInsertionHandler,
                             true);
  canvasDoc.addEventListener('keypress',
                             axsGMail.canvas_extraKeyboardNavHandler,
                             true);

  //Add view change handlers
  axsGMail.gMonkeyObj.registerViewChangeCallback(axsGMail.viewChangeHandler);

  axsGMail.initQuickNav();

  //Use a setTimeOut since chat area loads later
  window.setTimeout(function(){axsGMail.chat_prepChatField();}, 100);

  axsGMail.axsJAXObj.speakTextViaNode(axsGMail.LOADED_STRING, null);
};

/**
 * Provides keyboard handling for the main document.
 * @param {Object} evt A keypress event
 * @return {boolean} Indicates whether the keypress was handled
 */
axsGMail.extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT. 
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsGMail.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsGMail.axsJAXObj.inputFocused){
    return true;
  }

  return true;
};

/**
 * Provides handling for DOM node insertion events for the main document.
 * @param {Object} evt A DOM node insertion
 */
axsGMail.mainDoc_domInsertionHandler = function(evt){
  var target = evt.target;
  var className = target.className;
  if ((target.tagName == 'DIV') &&
      (className.indexOf(axsGMail.CLASS.LAYOUT_COMPONENT_) != -1) &&
      (className.indexOf(axsGMail.CLASS.HCONT_CHILD_) != -1)){
    window.setTimeout(function(){axsGMail.chatWindowHandler(target);}, 0);
  }
};


/**
 * Provides keyboard handling for the canvas area.
 * @param {Object} evt A keypress event
 * @return {boolean} Indicates whether the keypress was handled
 */
axsGMail.canvas_extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT.
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsGMail.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  //Reread the current user name the user is on if the user 
  //has reached the top/bottom of the list
  if (axsGMail.axsJAXObj.lastFocusedNode &&
      (axsGMail.axsJAXObj.lastFocusedNode == axsGMail.buddiesInputNode)){
    if (!axsGMail.chat_needToSpeak){
      if ((evt.keyCode == 38) ||
          (evt.keyCode == 40)){ // Up arrow
        axsGMail.chat_needToSpeak = true;
        window.setTimeout(axsGMail.chat_needToSpeakMonitor, 10);
        return true;
      }
    }
  }

  if (axsGMail.axsJAXObj.inputFocused){
    return true;
  }

 if (evt.charCode == 63){ // ? (question mark)
    axsGMail.axsJAXObj.speakTextViaNode(axsGMail.HELP_STRING);
    return false;
  }

  if (evt.charCode == 108){      // l
    axsGMail.quickNavNode.getElementsByTagName('SELECT')[0].focus();
  }

  var currentView = axsGMail.gMonkeyObj.getActiveViewType();

  if (currentView == 'tl'){
    //Don't activate more than one monitor
    if (!axsGMail.TL_needToSpeak){
      if ((evt.charCode == 106) || (evt.charCode == 107)){    //j or k
        axsGMail.TL_needToSpeak = true;
        window.setTimeout(axsGMail.TL_needToSpeakMonitor, 10);
        return true;
      }
    }
  }

  if (currentView == 'cv'){
    //Don't activate more than one monitor
    if (!axsGMail.CV_needToSpeak){
      if ((evt.charCode == 110) || (evt.charCode == 112)){       //n or p
        axsGMail.CV_needToSpeak = true;
        window.setTimeout(axsGMail.CV_needToSpeakMonitor, 10);
        return true;
      }
    }
  }
};

/**
 * Provides handling for DOM attribute modified events for the canvas area.
 * @param {Object} evt A DOM attribute modified event
 */
axsGMail.domAttrModifiedHandler = function(evt){
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;
  if ((attrib == 'class') &&
      (newVal.indexOf(axsGMail.CLASS.APP_MENU_ITEM_ACTIVE_) != -1)){  
    target.setAttribute('tabindex', 0);
    window.setTimeout(function(){target.focus();}, 0);
    return;
  }
  if ((attrib == 'class') &&
      (oldVal == axsGMail.CLASS.AUTOCOMPLETE_INACTIVE) &&
      (newVal == axsGMail.CLASS.AUTOCOMPLETE_ACTIVE)){
    if (!axsGMail.buddiesInputNode){
      axsGMail.chat_prepChatField();
      }
    axsGMail.chat_speakSelectedAutoComplete(target);
    return;
  }
  if (axsGMail.gMonkeyObj.getActiveViewType() == 'tl'){
    axsGMail.TL_domAttrModifiedHandler(evt);
  } else if (axsGMail.gMonkeyObj.getActiveViewType() == 'cv'){
    axsGMail.CV_domAttrModifiedHandler(evt);
  }
};

/**
 * Provides handling for DOM node insertion events for the canvas area.
 * @param {Object} evt A DOM node insertion
 */
axsGMail.domInsertionHandler = function(evt){
  if (axsGMail.gMonkeyObj.getActiveViewType() == 'tl'){
    axsGMail.TL_domInsertionHandler(evt);
  }
};

/**
 * When the view changes, the GMonkey object will call this function.
 * This function will send the 'n' key if the view has changed into the 
 * conversation view in order to activate the keyboard shortcuts for that view.
 */
axsGMail.viewChangeHandler = function(){
  var viewType = axsGMail.gMonkeyObj.getActiveViewType();
  if (viewType == 'tl'){
    return;
  } else if (viewType == 'cv'){
    axsGMail.CV_forceExpandAll();
    //Press n will turn on keyboard shortcuts for the conversation view
    var activeViewElem = axsGMail.gMonkeyObj.getActiveViewElement();
    axsGMail.axsJAXObj.sendKey(activeViewElem, 'n', false, false, false);
  }
};

//************
//Functions for working with the threadlist ('tl') view (inbox)
//************

/**
 * Provides handling for DOM attribute modified events 
 * when in the threadlist view.
 * @param {Object} evt A DOM attribute modified event
 */
axsGMail.TL_domAttrModifiedHandler = function(evt){
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;
  var message = '';

  //Going to a new message causes an arrow to become
  //visible to the left of the message
  if ((attrib == 'style') && (newVal == 'visibility: visible;')){
    var tlItem = target.parentNode.parentNode;
    axsGMail.TL_speakItem(tlItem);
  }

  //Message selected
  if ((attrib == 'class') &&
      (oldVal.indexOf(axsGMail.CLASS.TL_FIN_CHECKED_ROW_) == -1) &&
      (newVal.indexOf(axsGMail.CLASS.TL_FIN_CHECKED_ROW_) != -1)){
    axsGMail.axsJAXObj.speakTextViaNode(axsGMail.SELECTED_STRING);
  }
  //Message deselected
  if ((attrib == 'class') &&
      (oldVal.indexOf(axsGMail.CLASS.TL_FIN_CHECKED_ROW_) != -1) &&
      (newVal.indexOf(axsGMail.CLASS.TL_FIN_CHECKED_ROW_) == -1)){
    message = axsGMail.NOT_STRING + axsGMail.SELECTED_STRING;
    axsGMail.axsJAXObj.speakTextViaNode(message);
  }
  //Message starred
  if ((attrib == 'class') &&
      (oldVal.indexOf(axsGMail.CLASS.TL_STARRED_CELL_) == -1) &&
      (newVal.indexOf(axsGMail.CLASS.TL_STARRED_CELL_) != -1)){
    axsGMail.axsJAXObj.speakTextViaNode(axsGMail.STARRED_STRING);
  }
  //Message unstarred
  if ((attrib == 'class') &&
      (oldVal.indexOf(axsGMail.CLASS.TL_STARRED_CELL_) != -1) &&
      (newVal.indexOf(axsGMail.CLASS.TL_STARRED_CELL_) == -1)){
    message = axsGMail.NOT_STRING + axsGMail.STARRED_STRING;
    axsGMail.axsJAXObj.speakTextViaNode(message);
  }
};

/**
 * Provides handling for DOM node insertion events 
 * when in the threadlist view.
 * @param {Object} evt A DOM node insertion
 */
axsGMail.TL_domInsertionHandler = function(evt){
  var target = evt.target;
  //Process alerts
  if (target.parentNode.className == axsGMail.CLASS.ROUNDED_BOX_CONTENT_){
    var message = target.parentNode.firstChild.textContent;
    var activeDoc = axsGMail.axsJAXObj.getActiveDocument();
    var undoLink = activeDoc.getElementById('link_undo');
    if (undoLink){
      axsGMail.axsJAXObj.markPosition(undoLink);
      message = message + axsGMail.UNDO_MSG_STRING;
    }
    axsGMail.axsJAXObj.speakTextViaNode(message);
  }
};

/**
 * Given a threadlist item, determines if it is 
 * new or not.
 * @param {Element} tlItem A DOM node that is a threadlist item
 * @return {boolean} Whether the threadlist item is new or not
 */
axsGMail.TL_isNew = function(tlItem){
  return (tlItem.className.indexOf(axsGMail.CLASS.TL_UNREAD_ROW_) != -1);
};


/**
 * Given a threadlist item, determines if it is 
 * selected or not.
 * @param {Element} tlItem A DOM node that is a threadlist item
 * @return {boolean} Whether the threadlist item is selected or not
 */
axsGMail.TL_isSelected = function(tlItem){
  var checkbox = tlItem.getElementsByTagName('INPUT')[0];
  return checkbox.checked;
};

/**
 * Given a threadlist item, determines if it is 
 * starred or not.
 * @param {Element} tlItem A DOM node that is a threadlist item
 * @return {boolean} Whether the threadlist item is starred or not
 */
axsGMail.TL_isStarred = function(tlItem){
  var star = tlItem.childNodes[1];
  return (star.className.indexOf(axsGMail.CLASS.TL_STARRED_CELL_) != -1);
};

/**
 * Given a threadlist item, returns the DOM node that
 * contains the sender.
 * @param {Element} tlItem A DOM node that is a threadlist item
 * @return {Element} A DOM node that contains the sender
 */
axsGMail.TL_getSender = function(tlItem){
  return tlItem.childNodes[2];
};

/**
 * Given a threadlist item, returns the DOM node that
 * contains the subject.
 * @param {Element} tlItem A DOM node that is a threadlist item
 * @return {Element} A DOM node that contains the subject
 */
axsGMail.TL_getSubject = function(tlItem){
  return tlItem.childNodes[4].firstChild;
};

/**
 * Given a threadlist item, returns the DOM node that
 * contains the snippet.
 * @param {Element} tlItem A DOM node that is a threadlist item
 * @return {Element} A DOM node that contains the snippet
 */
axsGMail.TL_getSnippet = function(tlItem){
  return tlItem.childNodes[4].lastChild;
};

/**
 * Given a threadlist item, returns the DOM node that
 * contains the date.
 * @param {Element} tlItem A DOM node that is a threadlist item
 * @return {Element} A DOM node that contains the date
 */
axsGMail.TL_getDate = function(tlItem){
  return tlItem.lastChild;
};

/**
 * Causes the user's AT to speak the given threadlist item
 * @param {Element} tlItem A DOM node that is a threadlist item
 */
axsGMail.TL_speakItem = function(tlItem){
  if (!axsGMail.TL_needToSpeak){
    return;
  }
  axsGMail.TL_needToSpeak = false;
  var message = '';
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
  axsGMail.axsJAXObj.speakTextViaNode(message);
  axsGMail.TL_currentItem = tlItem;
};

/**
 * Causes the user's AT to speak the last spoken threadlist item again.
 */
axsGMail.TL_repeatCurrentItem = function(){
  if (axsGMail.TL_currentItem){
    axsGMail.TL_speakItem(axsGMail.TL_currentItem);
  }
};

/**
 * Monitor function that checks if spoken feedback needs to be given to the 
 * user. Since spoken feedback is given based on detecting className changes
 * and the class will not change if the user is on the first/last message and
 * trying to go to the prev/next message, there is a need to check for that
 * case and make sure the user gets some feedback.
 */
axsGMail.TL_needToSpeakMonitor = function(){
  if ((axsGMail.gMonkeyObj.getActiveViewType() == 'tl') &&
      axsGMail.TL_needToSpeak){
    axsGMail.TL_repeatCurrentItem();
  }
};


//************
//Functions for working with the conversation ('cv') view (a thread of messages)
//************
/**
 * Provides handling for DOM attribute modified events 
 * when in the conversation view.
 * @param {Object} evt A DOM attribute modified event
 */
axsGMail.CV_domAttrModifiedHandler = function(evt){
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;

  //Going to a new message causes an arrow to become 
  //visible to the left of the message
  if ((attrib == 'class') && (newVal == axsGMail.CLASS.CV_CHEVRON_)){
    var cvItem = target.nextSibling;
    if (cvItem.tagName == 'IMG'){
      cvItem = cvItem.nextSibling;
    }
    axsGMail.CV_goToItem(cvItem);
  }
  //Message starred
  if ((attrib == 'class') &&
      (oldVal.indexOf(axsGMail.CLASS.CVF_STAR_ON_ICON_) == -1) &&
      (newVal.indexOf(axsGMail.CLASS.CVF_STAR_ON_ICON_) != -1)){
    axsGMail.axsJAXObj.speakTextViaNode(axsGMail.STARRED_STRING);
  }
  //Message unstarred
  if ((attrib == 'class') &&
      (oldVal.indexOf(axsGMail.CLASS.CVF_STAR_ON_ICON_) != -1) &&
      (newVal.indexOf(axsGMail.CLASS.CVF_STAR_ON_ICON_) == -1)){
    var message = axsGMail.NOT_STRING + axsGMail.STARRED_STRING;
    axsGMail.axsJAXObj.speakTextViaNode(message);
  }
};

/**
 * Given a conversation item, determines if it is 
 * starred or not.
 * @param {Element} cvItem A DOM node that is a conversation item
 * @return {boolean} Whether the conversation item is starred or not
 */
axsGMail.CV_isStarred = function(cvItem){
  var star = axsGMail.CV_getStarImgNode(cvItem);
  return (star.className.indexOf(axsGMail.CLASS.CVF_STAR_ON_ICON_) != -1);
};

/**
 * Given a conversation item, returns the DOM node that
 * contains the star.
 * @param {Element} cvItem A DOM node that is a conversation item
 * @return {Element?} A DOM node that contains the star
 */
axsGMail.CV_getStarImgNode = function(cvItem){
  return cvItem.getElementsByTagName('IMG')[0];
};

/**
 * Given a conversation item, returns the DOM node that
 * contains the sender.
 * @param {Element} cvItem A DOM node that is a conversation item
 * @return {Element?} A DOM node that contains the sender
 */
axsGMail.CV_getSender = function(cvItem){
  var tdArray = cvItem.getElementsByTagName('TD');
  for (var i = 0, currentTd; currentTd = tdArray[i]; i++){
    var className = currentTd.className;
    if ((className.indexOf(axsGMail.CLASS.CVF_HEADER_LEFT_CELL_) != -1) && 
	    (className.indexOf(axsGMail.CLASS.CVF_HEADER_TEXT_) != -1)){
      return currentTd;
    }
  }
  return null;
};

/**
 * Given a conversation item, returns the DOM node that
 * contains the snippet.
 * @param {Element} cvItem A DOM node that is a conversation item
 * @return {Element?} A DOM node that contains the snippet
 */
axsGMail.CV_getSnippet = function(cvItem){
  var senderNode = axsGMail.CV_getSender(cvItem);
  if (!senderNode || !senderNode.nextSibling){
    return null;
  }
  var className = senderNode.nextSibling.className;
  if ((className.indexOf(axsGMail.CLASS.CVF_HEADER_LEFT_CELL_) != -1) && 
	  (className.indexOf(axsGMail.CLASS.CVF_HEADER_TEXT_) != -1)){ 
    return senderNode.nextSibling;
  }
  return null;
};

/**
 * Given a conversation item, returns the DOM node that
 * contains the date.
 * @param {Element} cvItem A DOM node that is a conversation item
 * @return {Element?} A DOM node that contains the date
 */
axsGMail.CV_getDate = function(cvItem){
  var spans = cvItem.getElementsByTagName('SPAN');
  for (var i = 0, currentSpan; currentSpan = spans[i]; i++){
    if (currentSpan.className == axsGMail.CLASS.CVF_RELATIVE_DATE_){
      return currentSpan;
    }
  }
  return null;
};

/**
 * Given a conversation item, returns the DOM node that
 * contains the content.
 * @param {Element} cvItem A DOM node that is a conversation item
 * @return {Element?} A DOM node that contains the content
 */
axsGMail.CV_getContent = function(cvItem){
  if (cvItem.childNodes.length > 3){
    return cvItem.childNodes[3];
  }
  return null;
};

/**
 * Activates the "expand all" link to load all the messages 
 * in the conversation.
 */
axsGMail.CV_forceExpandAll = function(){
  var canvasFrame = window.content.document.getElementById('canvas_frame');
  var uArray = canvasFrame.contentDocument.getElementsByTagName('U');
  for (var i = 0, currentU; currentU = uArray[i]; i++){
    if (currentU.textContent == axsGMail.EXPAND_ALL_STRING){
      axsGMail.axsJAXObj.clickElem(currentU.parentNode, false);
      return;
    }
  }
};

/**
 * Goes to the specified conversation item
 * @param {Element} cvItem A DOM node that is a conversation item
 */
axsGMail.CV_goToItem = function(cvItem){
  if (!axsGMail.CV_needToSpeak){
    return;
  }
  if (cvItem.parentNode.className == axsGMail.CLASS.CV_EXPANDED_){
    axsGMail.CV_needToSpeak = false;
  } else {
    axsGMail.CV_forceExpandAll();
  }
  var message = '';
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
  axsGMail.axsJAXObj.speakTextViaNode(message, cvItem);
  axsGMail.CV_currentItem = cvItem;
};

/**
 * Causes the user's AT to speak the last spoken conversation item again.
 */
axsGMail.CV_repeatCurrentItem = function(){
  if (axsGMail.CV_currentItem){
    axsGMail.CV_goToItem(axsGMail.CV_currentItem);
  }
};

/**
 * Monitor function that checks if spoken feedback needs to be given to the 
 * user. Since spoken feedback is given based on detecting className changes
 * and the class will not change if the user is on the first/last message and
 * trying to go to the prev/next message, there is a need to check for that
 * case and make sure the user gets some feedback.
 */
axsGMail.CV_needToSpeakMonitor = function(){
  if ((axsGMail.gMonkeyObj.getActiveViewType() == 'cv') &&
      axsGMail.CV_needToSpeak){
    axsGMail.CV_repeatCurrentItem();
  }
};

/**
 * Initializes the "Quick Nav" module that allows users to quickly 
 * navigate through their labels.
 */
axsGMail.initQuickNav = function(){
  var quickNav = axsGMail.gMonkeyObj.addNavModule('Quick Nav');
  var labels = axsGMail.getLabels();
  var selectNode = window.content.document.createElement('select');
  for (var i = 0, currentLabel; currentLabel = labels[i]; i++){
    var optionNode = window.content.document.createElement('option');
    optionNode.textContent = currentLabel.textContent;
    selectNode.appendChild(optionNode);
  }

  selectNode.addEventListener('keypress', axsGMail.quickNav_keyHandler, true);

  quickNav.appendChild(selectNode);
  axsGMail.quickNavNode = quickNav.getElement();
};

/**
 * Returns an array of all the labels that the user has.
 * @return {Array} An array of all the user's labels 
 */
axsGMail.getLabels = function(){
  var navPane = axsGMail.gMonkeyObj.getNavPaneElement();
  var expression = ".//DIV[contains(concat(' ', @class, ' '), '" + 
                   axsGMail.CLASS.NP_LABEL_ + 
                   "')]";
  return axsGMail.axsJAXObj.evalXPath(expression, navPane);
};

/**
 * Handles keypresses when the user is focused on the "Quick Nav" module.
 * @param {Object} evt A keypress event
 */
axsGMail.quickNav_keyHandler = function(evt){
  if (evt.keyCode == 13){
    axsGMail.jumpToSelectedQuickNavItem();
  }
};

/**
 * Opens the selected label.
 */
axsGMail.jumpToSelectedQuickNavItem = function(){
  var labels = axsGMail.getLabels();
  var quickNavSelect = axsGMail.quickNavNode.getElementsByTagName('SELECT')[0];
  var index = quickNavSelect.selectedIndex;
  axsGMail.axsJAXObj.clickElem(labels[index].firstChild, false);
};


//************
//Functions for working with chat
//************
/**
 * Prepares the input field used to type in the names of buddies 
 * and filter the buddy list.
 */
axsGMail.chat_prepChatField = function(){
  var canvasFrame = window.content.document.getElementById('canvas_frame');
  var canvasBody = canvasFrame.contentDocument.body;
  var xp = '//input[@label]';
  axsGMail.buddiesInputNode = axsGMail.axsJAXObj.evalXPath(xp, canvasBody)[0];
  axsGMail.buddiesInputNode.title = axsGMail.CHAT_BUDDIES_STRING;
};

/**
 * Causes the user's AT to speak the given autocomplete.
 * @param {Element} acRowDiv An autocomplete row.
 */
axsGMail.chat_speakSelectedAutoComplete = function(acRowDiv){
  axsGMail.chat_needToSpeak = false;
  var xpath = 'div/div[1]/div[1]';
  var statusDiv = axsGMail.axsJAXObj.evalXPath(xpath, acRowDiv)[0];
  var status = '';
  var className = statusDiv.firstChild.className;
  if (className.indexOf(axsGMail.CLASS.CHAT_BACKGROUND_AVAILABLE_) != -1){
    status = axsGMail.ONLINE_STRING;
  } else if (className.indexOf(axsGMail.CLASS.CHAT_BACKGROUND_OFFLINE_) != -1){
    status = axsGMail.OFFLINE_STRING;
  } else {
    status = axsGMail.IDLE_STRING;
  }
  var userDiv = axsGMail.axsJAXObj.evalXPath('div/div[1]/div[2]', acRowDiv)[0];
  axsGMail.axsJAXObj.speakText(userDiv.textContent + status);
};


/**
 * Monitor function that checks if spoken feedback needs to be given to the 
 * user. Since spoken feedback is given based on detecting className changes
 * and the class will not change if the user is on the first/last buddy and
 * trying to go to the prev/next buddy, there is a need to check for that
 * case and make sure the user gets some feedback.
 */
axsGMail.chat_needToSpeakMonitor = function(){
  if (axsGMail.chat_needToSpeak){
    var canvasFrame = window.content.document.getElementById('canvas_frame');
    var canvasBody = canvasFrame.contentDocument.body;
    var xpath = "//div[@class='" + axsGMail.CLASS.AUTOCOMPLETE_ACTIVE + "']";
    var acRowDiv = axsGMail.axsJAXObj.evalXPath(xpath, canvasBody)[0];
    axsGMail.chat_speakSelectedAutoComplete(acRowDiv);
  }
};

/**
 * When a chat window appears, this function gives the user a choice
 * of either dismissing the chat window by pressing ESC, or bringing up
 * the chat in a new popout window. If the user brings up the chat in a
 * new popout window, the AxsJAX script for GMail chat will be applied
 * in that new popout window.
 * @param {Element} chatWindowDiv A chat window
 */
axsGMail.chatWindowHandler = function(chatWindowDiv){
  var textArea = chatWindowDiv.getElementsByTagName('textarea')[0];
  textArea.addEventListener('keypress',
      function(evt){
        if (evt.keyCode == 27){ // ESC
          return true;
        }
        var popOutImg = chatWindowDiv.getElementsByTagName('img')[3];
        axsGMail.axsJAXObj.clickElem(popOutImg, false);
        return false;
      },
      true);
  textArea.focus();
  var userName = chatWindowDiv.getElementsByTagName('td')[1].textContent;
  var newChatMsg = axsGMail.NEW_CHAT_FROM_STRING +
                   userName +
                   axsGMail.NEW_CHAT_ACTIONS_STRING;
  axsGMail.axsJAXObj.speakText(newChatMsg);
};

/**
 * Initialize GMail's GMonkey object.
 * http://code.google.com/p/gmail-greasemonkey/wiki/GmailGreasemonkey10API
 * When the GMonkey object is ready, the AxsJAX script for GMail 
 * will be initialized.
 */
axsGMail.loader = function(){
  //Don't attempt loading on frames that do not contain the gmonkey object.
  if (typeof(gmonkey) == 'object'){
    gmonkey.load('1.0', axsGMail.init);
  }
};

window.addEventListener('load', axsGMail.loader, true);

// Copyright 2008 Google Inc.
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
 * @fileoverview AxsJAX to enhance accessibility
 * of Google Moderator.
 *
 * http://moderator.appspot.com
 *
 * @author clchen@google.com (Charles L. Chen)
 */
// create namespace
var axsModerator = {};

/**
 * The help string to be spoken to the user.
 * @type string
 */
axsModerator.HELP = 'The following shortcut keys are available. ';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsModerator.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsModerator.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsModerator.axsLensObj = null;

/**
 * The AxsSound object that will play earcons
 * @type AxsSound?
 */
axsModerator.axsSoundObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsModerator.magSize = 1.5;

/**
 * Initializes the AxsJAX script for News
 */
axsModerator.init = function(){
  axsModerator.axsJAXObj = new AxsJAX(true);
  axsModerator.axsNavObj = new AxsNav(axsModerator.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsModerator.keyHandler, true);

  var cnrString = '<cnr next="RIGHT l" prev="LEFT h">   ' +
                  '  <list title="Featured question" next="DOWN j" prev="UP k" type="dynamic">' +
                  '    <item count="1">' +
                  '      //div[contains(@class, "moderator-featured")]/../../..[not(contains(@style, "display: none"))]//div[contains(@class, "moderator-featured")]' +
                  '    </item>' +
                  '	<target title="Yes" hotkey="y" action="CALL:axsModerator.voteYes">' +
                  '	 .' +
                  '	</target>' +
                  '	<target title="No" hotkey="n" action="CALL:axsModerator.voteNo">' +
                  '	 .' +
                  '	</target>' +
                  '	<target title="Skip" hotkey="s" action="CALL:axsModerator.voteSkip">' +
                  '	 .' +
                  '	</target>' +
                  '	<target title="Repeat" hotkey="r" action="CALL:axsModerator.repeatFeaturedQuestion">' +
                  '	 .' +
                  '	</target>' +
                  '  </list>' +
                  '  <list title="Questions" next="DOWN j" prev="UP k" type="dynamic">' +
                  '    <item>' +
                  '      //div[contains(@class, "QuestionListPanel")]/table/tbody/tr' +
                  '    </item>' +
                  '	<target title="Yes" hotkey="y" action="CALL:axsModerator.voteYes">' +
                  '	 .' +
                  '	</target>' +
                  '	<target title="No" hotkey="n" action="CALL:axsModerator.voteNo">' +
                  '	 .' +
                  '	</target>' +
                  '  </list>' +
                  ' ' +
                  '  <list title="Topics" fwd="DOWN j" back="UP k" type="dynamic">' +
                  '    <item index="5">' +
                  '      //div[contains(@class, "link link-regular ")]' +
                  '    </item>' +
                  '	<target title="Go to topic" hotkey="ENTER" action="CALL:axsModerator.goToTopic">' +
                  '	 .//a' +
                  '	</target>' +
                  '  </list>' +
                  '	<target title="Ask a question" hotkey="a">' +
                  '	 //table[@class="AskMinimizedPanel"]//div[@class="goog-button-base-content"]' +
                  '	</target>' +
                  '</cnr>';

  axsModerator.axsNavObj.navInit(cnrString, null);

  axsModerator.axsLensObj = new AxsLens(axsModerator.axsJAXObj);
  axsModerator.axsNavObj.setLens(axsModerator.axsLensObj);
  axsModerator.axsLensObj.setMagnification(axsModerator.magSize);
  axsModerator.axsSoundObj = new AxsSound(true);
  axsModerator.axsNavObj.setSound(axsModerator.axsSoundObj);
  document.addEventListener('DOMAttrModified', axsModerator.domAttrModifiedHandler, true);

  axsModerator.axsNavObj.navListIdx = 2;
  axsModerator.axsNavObj.fwdItem();
  axsModerator.goToTopic(axsModerator.axsNavObj.currentItem());
};

/**
 * Refreshes the featured question that users are encouraged to vote on.
 * Moderator refreshes this with an AJAX call; refresh in the script keeps
 * everything synced + causes the new question to be spoken.
 */
axsModerator.refreshFeaturedQuestion = function(){
 if (axsModerator.axsNavObj.refreshList('Featured question')){
   axsModerator.axsNavObj.navListIdx = 0;
   axsModerator.axsNavObj.fwdItem();
   var featureQuestionNode = axsModerator.axsNavObj.currentItem().elem;
   featureQuestionNode.addEventListener('DOMNodeInserted', axsModerator.featuredQuestionChangeHandler, true);
   axsModerator.featuredQuestionChangeHandler(null);
 }
 axsModerator.axsNavObj.refreshList('Questions')
};

/**
 * Action handler for when the user tries to navigate to a topic.
 * @param {Object} topicItem AxsNav item object that holds the
 * link to the topic.
 */
axsModerator.goToTopic = function(topicItem){
  var targetNode = topicItem.elem;
  var activeDoc = axsModerator.axsJAXObj.getActiveDocument();
  //Send a mousedown
  var evt = activeDoc.createEvent('MouseEvents');
  evt.initMouseEvent('click', true, true, activeDoc.defaultView,
                     1, 0, 0, 0, 0, false, false, false, false, 0, null);
  //Use a try block here so that if the AJAX fails and it is a link,
  //it can still fall through and retry by setting the document.location.
  try{
    targetNode.dispatchEvent(evt);
  } catch (e){}
};

/**
 * Action handler for when the user votes YES on a question
 * @param {Object} questionItem AxsNav item object that holds the
 * YES button element.
 */
axsModerator.voteYes = function(questionItem){
  var questionElem = questionItem.elem;
  var xpath = './/div[contains(@class,"gwt-ToggleButton")]';
  var yesButton = axsModerator.axsJAXObj.evalXPath(xpath, questionElem)[0];
  axsModerator.axsJAXObj.clickElem(yesButton, false);
  axsModerator.axsJAXObj.speakTextViaNode('Press enter to confirm your yes vote.');
};

/**
 * Action handler for when the user votes NO on a question.
 * @param {Object} questionItem AxsNav item object that holds the
 * NO button element.
 */
axsModerator.voteNo = function(questionItem){
  var questionElem = questionItem.elem;
  var xpath = './/div[contains(@class,"gwt-ToggleButton")]';
  var noButton = axsModerator.axsJAXObj.evalXPath(xpath, questionElem)[1];
  axsModerator.axsJAXObj.clickElem(noButton, false);
  axsModerator.axsJAXObj.speakTextViaNode('Press enter to confirm your no vote.');
};

/**
 * Action handler for when the user skips a question.
 * @param {Object} questionItem AxsNav item object that holds the
 * SKIP button element.
 */
axsModerator.voteSkip = function(questionItem){
  var questionElem = questionItem.elem;
  var xpath = '//div[(@class = "goog-button-base-content") and (text()="Skip")]';
  var skipButton = axsModerator.axsJAXObj.evalXPath(xpath, questionElem)[0];
  axsModerator.axsJAXObj.clickElem(skipButton, false);
};

/**
 * DOM nodes are modified when the statusbox changes ("Saving...").
 * @param {Event} evt A DOM AttrModified event.
 */
axsModerator.domAttrModifiedHandler = function(evt){
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;
  if (target.className == 'qdb-StatusBox'){
    axsModerator.axsLensObj.view(null);
    axsModerator.axsJAXObj.speakTextViaNode(target.textContent);
    if (target.textContent.indexOf('Loading') === 0){
      window.setTimeout(axsModerator.refreshFeaturedQuestion, 500);
    }
  }
  else if (target.className == 'text text-error'){
    axsModerator.axsJAXObj.speakTextViaNode(target.textContent);
  }
  
};

/**
 * Handles the DOMNodeInsertion event when the featured question
 * changes.
 * @param {Event?} evt A DOM Node Insertion event - this isn't really used.
 */
axsModerator.featuredQuestionChangeHandler = function(evt){
  var fqElem = axsModerator.axsNavObj.currentItem().elem;
  axsModerator.axsNavObj.actOnItem(axsModerator.axsNavObj.currentItem());
  axsModerator.axsJAXObj.speakTextViaNode(fqElem.textContent.replace("Voting is closed", ""));
  axsModerator.axsLensObj.view(null);
};

/**
 * Action handler for repeating the currently featured question.
 */
axsModerator.repeatFeaturedQuestion = function(){
  axsModerator.featuredQuestionChangeHandler(null);
};

/**
 * Handles key events for keyboard shortcuts.
 * @param {Object} evt A keyboard event object.
 * @return {boolean} Whether the event should be passed on.
 */
axsModerator.keyHandler = function(evt){
  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27){ // ESC
    axsModerator.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsModerator.axsJAXObj.inputFocused) return true;

  var command = axsModerator.keyCodeMap[evt.keyCode] ||
                axsModerator.charCodeMap[evt.charCode];

  if (command) return command();

  return true;
};

/**
 * Map from key codes to functions.
 */
axsModerator.keyCodeMap = {
  // Map additional keyboard behavior that involves key codes here
};

/**
 * Map from character codes to functions.
 * @return {boolean} Always returns false to indicate
 *                   that the keycode has been handled.
 */
axsModerator.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // - (minus symbol)
  45 : function() {
         axsModerator.magSize -= 0.10;
         axsModerator.axsLensObj.setMagnification(axsModerator.magSize);
         return false;
       },
  // = (equal symbol)
  61 : function() {
         axsModerator.magSize += 0.10;
         axsModerator.axsLensObj.setMagnification(axsModerator.magSize);
         return false;
       },
  63 : function() {
         var helpStr = axsModerator.HELP +
                       axsModerator.axsNavObj.localHelpString() +
                       axsModerator.axsNavObj.globalHelpString();
         axsModerator.axsJAXObj.speakTextViaNode(helpStr);
         return false;
       },
  // / (slash symbol)
  47 : function() {
         var xpath = '//input';
         var search = axsModerator.axsJAXObj.evalXPath(xpath, document.body)[0];
         search.focus();
         search.select();
         return false;
       }
};


window.setTimeout(axsModerator.init, 1000);

//javascript/axsjax/common/AxsJAX.js
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
 * @fileoverview AxsJAX - JavaScript library for enhancing the accessibility 
 * of AJAX apps through WAI-ARIA.
 * Note that IE does not implement WAI-ARIA; thus these scripts are specific 
 * to Firefox.
 * @author clchen@google.com (Charles L. Chen)
 */

/**
 * Class of scripts for improving accessibility of Web 2.0  Apps.
 * @param {boolean} useTabKeyFix  Whether or not to try syncing to the last
 *                                marked position when the user presses the
 *                                tab key.
 * @constructor
 */
var AxsJAX = function(useTabKeyFix){
  this.ID_NUM_ = 0;
  this.tabbingStartPosNode = null;
  this.tabKeyFixOn = false;
  this.lastFocusedNode = null;
  this.inputFocused = false;

  var self = this;
  //Monitor focus and blur
  //These return "true" so that any page actions based on
  //focus and blur will still occur.
  var focusHandler = function(evt){
                       self.lastFocusedNode = evt.target;
                       if ((evt.target.tagName == 'INPUT') ||
                           (evt.target.tagName == 'SELECT') ||
                           (evt.target.tagName == 'TEXTAREA')){
                         self.inputFocused = true;
                       }
                       return true;
                     };
  document.addEventListener('focus', focusHandler, true);

  var blurHandler = function(evt){
                      self.removeAttributeOf(self.lastFocusedNode,
                                             'aria-activedescendant');
                      self.lastFocusedNode = null;
                      if ((evt.target.tagName == 'INPUT') ||
                          (evt.target.tagName == 'SELECT') ||
                          (evt.target.tagName == 'TEXTAREA')){
                        self.inputFocused = false;
                      }
                      return true;
                    };
  document.addEventListener('blur', blurHandler, true);

  //Activate the tab key fix if needed
  if (useTabKeyFix){
    this.tabKeyFixOn = true;
    document.addEventListener('keypress',
                              function(event){
                                self.tabKeyHandler(event, self);
                              },
                              true);
    // Record in a custom DOM property:
    document.body.AXSJAX_TABKEYFIX_ADDED = true;
  }
  this.activeParent = document.body;
};


/**
 * AxsJAX causes assistive technologies to speak by using the activedescendant
 * property. Usually, the activedescendant should be set on the document.body
 * object and this is the default if setActiveParent is never called. However,
 * if the node to be spoken is inside an iframe, then it can
 * not be referenced by its ID from the parent document. Thus activedescendant
 * will not work. The solution is to use setActiveParent to set the active
 * parent that AxsJAX is using to the child iframe's document.body.
 * @param {Node} targetNode The HTML node to be used as the active parent
 */
AxsJAX.prototype.setActiveParent = function(targetNode){
  this.activeParent = targetNode;
  var activeDoc = this.getActiveDocument();
  if (this.tabKeyFixOn && !activeDoc.body.AXSJAX_TABKEYFIX_ADDED){
    var self = this;
    activeDoc.addEventListener('keypress',
                               function(event){
                                 self.tabKeyHandler(event, self);
                               },
                               true);
    activeDoc.body.AXSJAX_TABKEYFIX_ADDED = true;
  }
};


/**
 * Gets the document for the active parent.
 * @return {Node} The document that is the ancestor for the active parent
 */
AxsJAX.prototype.getActiveDocument = function(){
  var activeDoc = this.activeParent;
  while (activeDoc.nodeType != 9){ // 9 == DOCUMENT_NODE
    activeDoc = activeDoc.parentNode;
  }
  return activeDoc;
};


/**
 * Triggers a DOMNodeInserted event on an HTML element node.
 * AT will respond by reading the content of the node.
 * This should NOT be called on any node which already has
 * live region markup as it will cause that markup to be overridden.
 * Note that any further modifications to this node will
 * also be spoken immediately.
 * This should be used in cases where the nodes are already loaded,
 * the user is navigating between the nodes, and it is desirable
 * to mirror the visual indication that a node is the current node
 * by speaking its contents as soon as as it becomes the current node.
 * @param {Node} targetNode The HTML node to be spoken.
 * @param {boolean} opt_noFocusChange  Specify if focus must move to targetNode
 */
AxsJAX.prototype.speakNode = function(targetNode, opt_noFocusChange){
  if (!targetNode.id){
    this.assignId(targetNode);
  }
  if (opt_noFocusChange){
    this.setAttributeOf(targetNode, 'live', 'rude');
    this.setAttributeOf(targetNode, 'atomic', 'true');
    var activeDoc = this.getActiveDocument();

    // It would be simpler to retain the dummyNode once it has been created
    // and change its textContent; however that fails to trigger the update
    // events we need. So we create a new node, taking care to remove any
    // previously created dummyNode.
    var dummyNode = activeDoc.createElement('div');
    dummyNode.textContent = ' ';
    dummyNode.name = 'AxsJAX_dummyNode';
    if (targetNode.lastChild &&
        targetNode.lastChild.name &&
        (targetNode.lastChild.name == dummyNode.name)){
      targetNode.removeChild(targetNode.lastChild);
    }
    targetNode.appendChild(dummyNode);
  } else {
    var oldRole = this.getAttributeOf(targetNode, 'role');
    this.setAttributeOf(targetNode, 'role', 'row');
    var currentFocusedNode = this.lastFocusedNode;
    // Use the body if there is no last focused node or
    // if the last focused node is the entire document.
    if ((!currentFocusedNode) || (currentFocusedNode.nodeType == 9)){
      this.activeParent.tabIndex = -1;
      currentFocusedNode = this.activeParent;
    }
    this.setAttributeOf(currentFocusedNode, 'activedescendant', null);
    currentFocusedNode.focus();
    this.setAttributeOf(currentFocusedNode, 'activedescendant', targetNode.id);
    //Restore the original role of the targetNode
    var self = this;
    window.setTimeout(
        function(){
          if (oldRole){
            self.setAttributeOf(targetNode, 'role', oldRole);
          } else {
            self.removeAttributeOf(targetNode, 'role');
          }
        }, 0);
  }
};


/**
 * Triggers a DOMNodeInserted event by inserting the text to be spoken
 * into a hidden node. AT will respond by reading the content of this new node.
 * This should be used in cases a message needs to be spoken
 * to give an auditory cue for something that is shown visually.
 * A good example would be when content has loaded or is changed from
 * being hidden to being displayed; it is visually obvious, but there may not
 * be any audio cue.
 * @param {String} textString The text to be spoken.
 */
AxsJAX.prototype.speakText = function(textString){
  //Use the main window's document directly here to ensure the AT
  //receives and processes the live region event correctly.
  //Since this is only a string, it is safe to do this without considering
  //the active document of the AxsJAX object.
  var doc = window.content.document;
  var audioNode = doc.createElement('span');
  audioNode.id = 'AxsJAX_audioNode';
  audioNode.style.visibility = 'hidden';
  this.setAttributeOf(audioNode, 'live', 'rude');
  var oldAudioNode = doc.getElementById(audioNode.id);
  if (oldAudioNode){
    doc.body.removeChild(oldAudioNode);
  }
  audioNode.textContent = textString;
  doc.body.appendChild(audioNode);
};

/**
 * This will insert a transparent pixel at the end of the page, put
 * the textString as the pixel's alt text, then use speakNode on the pixel.
 * This is way  of generating spoken feedback   when 
 * ARIA live region support is unavailable.
 * The advantage is that it is more compatible as few assistive technologies
 * currently support live regions.
 * The disadvantage (besides being a somewhat hacky way of doing things) is
 * that it may cause problems with things which rely on focus/blur as this
 * causes focus to be set somewhere on the page.
 *
 * If there is an anchorNode specified, this function will place the pixel
 * before the anchorNode and set focus to the pixel.
 *
 * This enables AT like screenreaders  resume reading at a given position.
 * If there is no anchorNode specified, this function will append the pixel
 * as the last child to the body of the active document and call speakNode on
 * the pixel.
 *
 * @param {String} textString The text to be spoken.
 * @param {Node} opt_anchorNode The node to insert the pixel in front of.
 *
 */
AxsJAX.prototype.speakTextViaNode = function(textString, opt_anchorNode){
  var pixelId = 'AxsJAX_pixelAudioNode';
  var pixelName = 'AxsJAX_pixelAudioNode';
  var encodedClearPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAA' +
                          'CH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
  var activeDoc = this.getActiveDocument();
  var pixelNode = null;
  if (opt_anchorNode){
    if (opt_anchorNode.previousSibling &&
        opt_anchorNode.previousSibling.name == pixelName){
      pixelNode = opt_anchorNode.previousSibling;
    } else {
      pixelNode = activeDoc.createElement('img');
      pixelNode.name = pixelName;
      pixelNode.setAttribute('tabindex', 0);
      pixelNode.style.outline = 'none';
      pixelNode.src = encodedClearPixel;
      opt_anchorNode.parentNode.insertBefore(pixelNode, opt_anchorNode);
      this.forceATSync(pixelNode);
    }
    pixelNode.setAttribute('alt', textString);
    pixelNode.setAttribute('title', textString);
    // Use a setTimeout here as Firefox attribute setting can be quirky
    // (tabIndex is not always set soon enough).
    window.setTimeout(function(){pixelNode.blur();pixelNode.focus();}, 0);
  } else {
    pixelNode = activeDoc.getElementById(pixelId);
    if (!pixelNode){
      pixelNode = activeDoc.createElement('img');
      pixelNode.id = pixelId;
      pixelNode.src = encodedClearPixel;
      activeDoc.body.appendChild(pixelNode);
    }
    pixelNode.setAttribute('alt', textString);
    pixelNode.setAttribute('title', textString);

    this.speakNode(pixelNode);
  }
};

/**
 * Puts alt='' for all images that are children of the target node that
 * have no alt text defined. This is a bandage fix to prevent screen readers
 * from rambling on by reading the URL string of the image.
 * A real fix for this problem should be to either use appropriate alt text for
 * the images or explicitly put alt='' for images that have no semantic value.
 * @param {Node} targetNode The target node of this operation.
 */
AxsJAX.prototype.putNullForNoAltImages = function(targetNode){
  var images = targetNode.getElementsByTagName('img');
  for (var i = 0, image; image = images[i]; i++) {
    if (!image.alt){
      image.alt = '';
    }
  }
};


/**
 * Dispatches a left click event on the element that is the targetNode.
 * Clicks go in the sequence of mousedown, mouseup, and click.
 * @param {Node} targetNode The target node of this operation.
 * @param {boolean} shiftKey Specifies if shift is held down.
 */
AxsJAX.prototype.clickElem = function(targetNode, shiftKey){
  var activeDoc = this.getActiveDocument();
  //Send a mousedown
  var evt = activeDoc.createEvent('MouseEvents');
  evt.initMouseEvent('mousedown', true, true, activeDoc.defaultView,
                     1, 0, 0, 0, 0, false, false, shiftKey, false, 0, null);
  //Use a try block here so that if the AJAX fails and it is a link,
  //it can still fall through and retry by setting the document.location.
  try{
    targetNode.dispatchEvent(evt);
  } catch(e){}
  //Send a mouse up
  evt = activeDoc.createEvent('MouseEvents');
  evt.initMouseEvent('mouseup', true, true, activeDoc.defaultView,
                     1, 0, 0, 0, 0, false, false, shiftKey, false, 0, null);
  //Use a try block here so that if the AJAX fails and it is a link,
  //it can still fall through and retry by setting the document.location.
  try{
    targetNode.dispatchEvent(evt);
  } catch(e){}
  //Send a click
  evt = activeDoc.createEvent('MouseEvents');
  evt.initMouseEvent('click', true, true, activeDoc.defaultView,
                     1, 0, 0, 0, 0, false, false, shiftKey, false, 0, null);
  //Use a try block here so that if the AJAX fails and it is a link,
  //it can still fall through and retry by setting the document.location.
  try{
    targetNode.dispatchEvent(evt);
  } catch(e){}
  //Clicking on a link does not cause traversal because of script
  //privilege limitations. The traversal has to be done by setting
  //document.location.
  if ((targetNode.tagName == 'A') &&
      targetNode.href &&
      ((targetNode.href.indexOf('http') === 0) ||
       (targetNode.href.indexOf('javascript:') === 0))){
    if (shiftKey){
      window.open(targetNode.href);
    } else {
      document.location = targetNode.href;
    }
  }
};

/**
 * Dispatches a key event on the element that is the targetNode.
 * @param {Node} targetNode The target node of this operation.
 * @param {String} theKey The key to use for this operation.
 *                        This can be any single printable character or ENTER.
 * @param {Boolean} holdCtrl Whether or not the Ctrl key should be held for
 *                        this operation.
 * @param {Boolean} holdAlt Whether or not the Alt key should be held for
 *                       this operation.
 * @param {Boolean} holdShift Whether or not the Shift key should be held
 *                         for this operation.
 */
AxsJAX.prototype.sendKey = function(targetNode, theKey,
                                    holdCtrl, holdAlt, holdShift){
  var keyCode = 0;
  var charCode = 0;
  if (theKey == 'ENTER'){
    keyCode = 13;
  }
  else if (theKey.length == 1){
    charCode = theKey.charCodeAt(0);
  }
  var activeDoc = this.getActiveDocument();
  var evt = activeDoc.createEvent('KeyboardEvent');
  evt.initKeyEvent('keypress', true, true, null, holdCtrl,
                   holdAlt, holdShift, false, keyCode, charCode);
  targetNode.dispatchEvent(evt);
};

/**
 * Assigns an ID to the targetNode.
 * If targetNode already has an ID, this is a no-op.
 * Always returns the ID of targetNode.
 * If targetNode is null, we return ''
 * @param {Node} targetNode The target node of this operation.
 * @param {String} opt_prefixString
 * Prefix to help ensure the uniqueness of the ID.
 * This is optional; if null, it will use "AxsJAX_ID_".
 * @return {String} The ID that the targetNode now has.
 */
AxsJAX.prototype.assignId = function(targetNode, opt_prefixString){
  if (!targetNode){
    return '';
  }
  if (targetNode.id){
    return targetNode.id;
  }
  var prefix = opt_prefixString || 'AxsJAX_ID_';
  targetNode.id = prefix + this.ID_NUM_++;
  return targetNode.id;
};

/**
 * Marks the current position by remembering what the last focusable node was.
 * The focusable node will be the targetNode if it has a focus() function, or
 * if it does not, the first descendent node that it has which does.
 * If the targetNode itself and all of its descendents have no focus() function,
 * this function will complete with failure.
 * If the AxsJAX.tabKeyHandler is used, then it will put the focus on this node.
 * @param {Node} targetNode The target node of this operation.
 * @return {Boolean} True if the position was marked successfully.
 *                   False if failed.
 */
AxsJAX.prototype.markPosition = function(targetNode){
  if (!targetNode){
    return false;
  }
  if ((targetNode.tagName == 'A') || (targetNode.tagName == 'INPUT')){
    this.tabbingStartPosNode = targetNode;
    return true;
  }
  var allDescendants = targetNode.getElementsByTagName('*');
  for (var i = 0, currentNode; currentNode = allDescendants[i]; i++){
    if ((currentNode.tagName == 'A') ||
        (currentNode.tagName == 'INPUT') ||
        (currentNode.hasAttribute('tabindex') &&
         (currentNode.tabIndex != -1))){
      this.tabbingStartPosNode = currentNode;
      return true;
    }
  }
  return false;
};

/**
 * Restores the focus .
 * Usage:
 *   var myAxsJAXObj = new AxsJAX();
 *   document.addEventListener('keypress',
 *       function(event){
 *         myAxsJAXObj.tabKeyHandler(event,myAxsJAXObj);
 *       },
 *       true);
 * @param {Event} evt The event
 * @param {Object} selfRef The AxsJAX object. A self reference is needed here
 *                         since this in an event handler does NOT refer to the
 *                         AxsJAX object.
 * @return {Boolean} Always returns true to pass the tab key along.
 */
AxsJAX.prototype.tabKeyHandler = function(evt, selfRef){
  if (!selfRef.tabKeyFixOn){
    return true;
  }
  if ((evt.keyCode == 9) && (selfRef.tabbingStartPosNode)){
    selfRef.tabbingStartPosNode.focus();
    selfRef.tabbingStartPosNode = null;
  }
  return true;
};

/**
 * Scrolls to the targetNode and speaks it.
 * This will automatically mark the position; this should be used if you are
 * navigating through content.
 * @param {Node} targetNode The HTML node to be spoken.
 */
AxsJAX.prototype.goTo = function(targetNode){
  this.speakNode(targetNode);
  targetNode.scrollIntoView(true);
  this.markPosition(targetNode);
};


/**
 * Sets the attribute of the targetNode to the value.
 * Use this rather than a direct set attribute to abstract away ARIA
 * naming changes.
 * @param {Node} targetNode The HTML node to have the attribute set on
 * @param {string} attribute The attribute to set.
 * @param {string} value The value the attribute should be set to.
 */
AxsJAX.prototype.setAttributeOf = function(targetNode, attribute, value){
  if (!targetNode){
    return;
  }
  //Add the aria- to attributes
  attribute = attribute.toLowerCase();
  switch (attribute){
    case 'live':
      attribute = 'aria-live';
      break;
    case 'activedescendant':
      attribute = 'aria-activedescendant';
      break;
    case 'atomic':
      attribute = 'aria-atomic';
      break;
    default:
      break;
  }
  targetNode.setAttribute(attribute, value);
};

/**
 * Gets the attribute of the targetNode.
 * Use this rather than a direct get attribute to abstract away ARIA
 * naming changes.
 * @param {Node} targetNode The HTML node to get the attribute of
 * @param {string} attribute The attribute to get the value of
 * @return {string} The value of the attribute of the targetNode
 */
AxsJAX.prototype.getAttributeOf = function(targetNode, attribute){
  return targetNode.getAttribute(attribute);
};

/**
 * Removes the attribute of the targetNode.
 * Use this rather than a direct remove attribute to abstract away ARIA
 * naming changes.
 * @param {Node} targetNode The HTML node to remove the attribute from
 * @param {string} attribute The attribute to be removed
 */
AxsJAX.prototype.removeAttributeOf = function(targetNode, attribute){
  if (targetNode && targetNode.removeAttribute){
    targetNode.removeAttribute(attribute);
  }
};

/**
 * Sets the location of the active document. This will force
 * assistive technologies that use a browse vs forms mode system
 * to be synced to the targetNode.
 * @param {Node} targetNode The HTML node to force the AT to sync to
 */
AxsJAX.prototype.forceATSync = function(targetNode){
  var id = this.assignId(targetNode);
  var activeDoc = this.getActiveDocument();
  var loc = activeDoc.baseURI;
  var indexOfHash = loc.indexOf('#');
  if (indexOfHash != -1){
    loc = loc.substring(0, indexOfHash);
  }
  activeDoc.location = loc + '#' + id;
};

/**
 * Given an XPath expression and rootNode, it returns an array of children nodes
 * that match. The code for this function was taken from Mihai Parparita's GMail
 * Macros Greasemonkey Script.
 * http://gmail-greasemonkey.googlecode.com/svn/trunk/scripts/gmail-new-macros.user.js
 * @param {string} expression The XPath expression to evaluate
 * @param {Node} rootNode The HTML node to start evaluating the XPath from
 * @return {Array} The array of children nodes that match
 */
AxsJAX.prototype.evalXPath = function(expression, rootNode) {
  try {
    var xpathIterator = rootNode.ownerDocument.evaluate(
      expression,
      rootNode,
      null, // no namespace resolver
      XPathResult.ORDERED_NODE_ITERATOR_TYPE,
      null); // no existing results
  } catch (err) {
    return [];
  }
  var results = [];
  // Convert result to JS array
  for (var xpathNode = xpathIterator.iterateNext();
       xpathNode;
       xpathNode = xpathIterator.iterateNext()) {
    results.push(xpathNode);
  }
  return results;
};





//javascript/axsjax/common/AxsNav.js
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
 * @fileoverview AxsNav - JavaScript library for enhancing the navigation
 * of content on web pages.
 * @author clchen@google.com (Charles L. Chen)
 */

/**
 * Class for managing navigation of website content
 * @param {Object} axsJAXObj  An instance of an AxsJAX object.
 * @constructor
 */
var AxsNav = function(axsJAXObj){
  this.nextListKeys = '';
  this.prevListKeys = '';
  this.navArray = new Array();
  this.navListIdx = 0;
  this.navItemIdxs = new Array();
  this.lastItem = null;
  this.targetsArray = new Array();
  this.topCharCodeMap = new Object();
  this.topKeyCodeMap = new Object();
  this.charCodeMaps = new Array();
  this.keyCodeMaps = new Array();
  this.axs_ = axsJAXObj;
  this.lens_ = null;
  this.snd_ = null;
  this.LIST_SND = 'list';
  this.ITEM_SND = 'item';
  this.WRAP_SND = 'wrap';
  this.keyHandler = null;
};

/**
 * Object that contains all string literals used by AxsNav.
 * @type {Object}
 */
AxsNav.str = {
  NEXTLIST : ', next list. ',
  PREVLIST : ', previous list. ',
  GOFORWARD : ', go forward. ',
  GOBACKWARDS : ', go backwards. ',
  CYCLENEXT : ', cycle next. ',
  CYCLEPREV : ', cycle previous. '
};

/**
 * Makes an array of items given a navigation list node and its index.
 * Elements associated with a list will be marked as such.
 * @param {Node} listNode The navigation list node
 * @return {Array} The array of items.
 */
AxsNav.prototype.makeItemsArray = function(listNode){
  var itemsArray = new Array();
  var cnrItems = listNode.getElementsByTagName('item');
  for (var i = 0, entry; entry = cnrItems[i]; i++){
    //Do this in a try-catch block since there are multiple
    //sets of cnrItems and even if one set does not exist as expected,
    //the other sets should still be available.
    try{
      //Strip all leading and trailing spaces from the xpath
      var xpath = entry.textContent;
      xpath = xpath.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      var htmlElem = this.axs_.getActiveDocument().documentElement;
      var elems = this.axs_.evalXPath(xpath, htmlElem);
      var idxStr = entry.getAttribute('index') || '0';
      var idx = parseInt(idxStr, 10);
      var count = elems.length - idx;
      var countStr = entry.getAttribute('count') || '*';
      if (countStr != '*'){
        count = parseInt(countStr, 10);
      }
      var end = count + idx;
      var action = entry.getAttribute('action') || null;
      while (idx < end){
        var item = new Object();
        item.action = action;
        item.elem = elems[idx];
        if (typeof(item.elem) != 'undefined'){
          if (typeof(item.elem.AxsNavInfo) == 'undefined'){
            item.elem.AxsNavInfo = new Object();
          }
          item.elem.AxsNavInfo[this.navArray.length] = itemsArray.length;
          itemsArray.push(item);
        }
        idx++;
      }
    }
    catch(err){ }
  }
  return itemsArray;
};

/**
 * Returns whether the specified navigation list is valid.
 * If the navigation list is dynamic and appears to not be valid,
 * this function will try to reload it and check whether or 
 * not it becomes valid.
 * @param {Object} navList The specified list object to check.
 * @return {boolean} Whether the specified list object is valid.
 */
AxsNav.prototype.validateList = function(navList) {
  var valid = true;
  //Reload dynamic lists  
  if ((navList.type == 'dynamic') && (navList.items.length === 0)){
    //Clear the lens to avoid its contents interfering with the xpath
    if (this.lens_ !== null){
      this.lens_.view(null);
    }
    navList.items = this.makeItemsArray(navList.cnrNode);
    navList.targets = this.makeTargetsArray(navList.cnrNode);
    this.navItemIdxs[this.navListIdx] = -1;
  }
  if ((navList.items.length === 0) && (navList.entryTarget === null)){
    valid = false;
  }
  return valid;
};

/**
 * Performs the specified action with a list is switched into.
 */
AxsNav.prototype.doListEntryActions = function() {
  var currentList = this.currentList();
  var target = currentList.entryTarget;
  var func = null;
  if (target !== null){
    this.actOnTarget(target);
    func = this.getCallbackFunction(target.action);
  }
  if (func === null){
    this.announceCurrentList();
    if (this.snd_ !== null){
      this.snd_.play(this.LIST_SND);
    }
  }
};

/**
 * Goes to the next navigation list and returns it
 * @return {Object?} The next navigation list.
 */
AxsNav.prototype.nextList = function(){
  if (this.navArray.length < 1){
    return null;
  }
  //Find the next list with items
  for (var i = 0, list; list = this.navArray[i]; i++) {
    this.navListIdx++;
    if (this.navListIdx >= this.navArray.length){
      this.navListIdx = 0;
    }
    if (this.validateList(this.navArray[this.navListIdx])) {
      break;
    }
  }
  return this.currentList();
};

/**
 * Goes to the previous navigation list and returns it
 * @return {Object?} The previous navigation list.
 */
AxsNav.prototype.prevList = function(){
  if (this.navArray.length < 1){
    return null;
  }
  //Find the next list with item 
  for (var i = 0, list; list = this.navArray[i]; i++) {
    this.navListIdx--;
    if (this.navListIdx < 0){
      this.navListIdx = this.navArray.length - 1;
    }
    if (this.validateList(this.navArray[this.navListIdx])) {
      break;
    }
  }
  return this.currentList();
};

/**
 * Returns the current navigation list.
 * @return {Object} The current navigation list.
 */
AxsNav.prototype.currentList = function(){
  return this.navArray[this.navListIdx];
};

/**
 * Speaks the title of the current list
 */
AxsNav.prototype.announceCurrentList = function(){
  this.axs_.speakTextViaNode(this.currentList().title);
};

/**
 * Goes to the next item and returns it; if there is no next item, this will
 * wrap to the first item in the list.
 * @return {Object?} The next item. Use item.elem to get at the DOM node.
 */
AxsNav.prototype.nextItem = function(){
  if (this.navArray.length < 1){
    return null;
  }
  var currentList = this.navArray[this.navListIdx];
  var items = currentList.items;
  if (items.length < 1){
    return null;
  }
  if (this.lastItem){
    var syncedIndex = this.lastItem.elem.AxsNavInfo[this.navListIdx];
    if (typeof(syncedIndex) != 'undefined'){
      this.navItemIdxs[this.navListIdx] = syncedIndex;
    }
  }
  this.navItemIdxs[this.navListIdx]++;
  var looped = false;
  if (this.navItemIdxs[this.navListIdx] >= items.length){
    this.navItemIdxs[this.navListIdx] = 0;
    looped = true;
  }
  var itemIndex = this.navItemIdxs[this.navListIdx];
  // Perform a validity check to determine if the xpaths should be re-evaluated
  if (items[itemIndex].elem.parentNode === null){
    //Clear the lens to avoid its contents interfering with the xpath
    if (this.lens_ !== null){
      this.lens_.view(null);
    }
    currentList.items = this.makeItemsArray(currentList.cnrNode);
    this.navItemIdxs[this.navListIdx] = 0;
    itemIndex = this.navItemIdxs[this.navListIdx];
  }
  this.lastItem = items[itemIndex];
  if (this.snd_ !== null){
    if (looped){
      this.snd_.play(this.WRAP_SND);
    } else {
      this.snd_.play(this.ITEM_SND);
    }
  }
  return this.lastItem;
};

/**
 * Goes to the next item and returns it; if this causes wrapping and
 * there is a tailTarget on the list, then this will act on that target
 * and return null instead.
 * @return {Object?} The next item. Use item.elem to get at the DOM node.
 */
AxsNav.prototype.fwdItem = function(){
  var list = this.navArray[this.navListIdx];
  var index = this.navItemIdxs[this.navListIdx];
  if ((list.tailTarget !== null) && (index + 1 >= list.items.length)){
    this.actOnTarget(list.tailTarget);
    this.navItemIdxs[this.navListIdx] = 0;
    return null;
  }
  var item = this.nextItem();
  return item;
};

/**
 * Goes to the previous item and returns it; if there is no previous item, this
 * will wrap to the last item in the list.
 * @return {Object?} The previous item. Use item.elem to get at the DOM node.
 */
AxsNav.prototype.prevItem = function(){
  if (this.navArray.length < 1){
    return null;
  }
  var currentList = this.navArray[this.navListIdx];
  var items = currentList.items;
  if (items.length < 1){
    return null;
  }
  if (this.lastItem){
    var syncedIndex = this.lastItem.elem.AxsNavInfo[this.navListIdx];
    if (typeof(syncedIndex) != 'undefined'){
      this.navItemIdxs[this.navListIdx] = syncedIndex;
    }
  }
  this.navItemIdxs[this.navListIdx]--;
  var looped = false;
  if (this.navItemIdxs[this.navListIdx] < 0){
    this.navItemIdxs[this.navListIdx] = items.length - 1;
    looped = true;
  }
  var itemIndex = this.navItemIdxs[this.navListIdx];
  // Perform a validity check to determine if the xpaths should be re-evaluated
  if (items[itemIndex].elem.parentNode === null){
    //Clear the lens to avoid its contents interfering with the xpath
    if (this.lens_ !== null){
      this.lens_.view(null);
    }
    currentList.items = this.makeItemsArray(currentList.cnrNode);
    this.navItemIdxs[this.navListIdx] = currentList.items.length;
    itemIndex = this.navItemIdxs[this.navListIdx];
  }
  this.lastItem = items[itemIndex];
  if (this.snd_ !== null){
    if (looped){
     this.snd_.play(this.WRAP_SND);
    } else {
     this.snd_.play(this.ITEM_SND);
    }
  }
  return this.lastItem;
};

/**
 * Goes to the previous item and returns it; if this causes wrapping and
 * there is a headTarget on the list, then this will act on that target
 * and return null instead.
 * @return {Object?} The previous item. Use item.elem to get at the DOM node.
 */
AxsNav.prototype.backItem = function(){
  var list = this.navArray[this.navListIdx];
  var index = this.navItemIdxs[this.navListIdx];
  if ((list.headTarget !== null) && (index - 1 <= -1)){
    this.actOnTarget(list.headTarget);
    this.navItemIdxs[this.navListIdx] = list.items.length;
    return null;
  }
  var item = this.prevItem();
  return item;
};

/**
 * Returns the current item.
 * @return {Object?} The current item. Use item.elem to get at the DOM node.
 */
AxsNav.prototype.currentItem = function(){
  if (this.navArray.length < 1){
    return null;
  }
  if (this.lastItem){
    var syncedIndex = this.lastItem.elem.AxsNavInfo[this.navListIdx];
    if (typeof(syncedIndex) != 'undefined'){
      this.navItemIdxs[this.navListIdx] = syncedIndex;
    }
  }
  var currentList = this.navArray[this.navListIdx];
  var items = currentList.items;
  var itemIndex = this.navItemIdxs[this.navListIdx];
  this.lastItem = items[itemIndex];
  return this.lastItem;
};

/**
 * Returns the callback function if the action is a valid callback;
 * returns null otherwise.
 * @param {String?} actionString The action string for an item or target
 * @return {Function?} The callback function if there is a valid one.
 */
AxsNav.prototype.getCallbackFunction = function(actionString){
  var callbackFunc = null;
  if ((actionString !== null) &&
      actionString.indexOf &&
      (actionString.indexOf('CALL:') === 0) &&
      (actionString.indexOf('(') === -1)){
    try{
      callbackFunc = eval(actionString.substring(5));
    } catch(e) { }
  }
  return callbackFunc;
};

/**
 * This function will act on the item based on what action was specified
 * in the Content Navigation Listing.
 *
 * @param {Object?} item The item to act on. 
 *      Use item.elem to get at the DOM node.
 */
AxsNav.prototype.actOnItem = function(item){
  if (item !== null){
    var self = this;
    var doAction = function(){
          var func = self.getCallbackFunction(item.action);
          if (func){
            func(item);
          } else {
            if (self.lens_ !== null){
              self.lens_.view(item.elem);
            }
            self.axs_.goTo(item.elem);
          }
        };
        // If there is a node that was focused, unfocus it so that
        // any keys the user presses after using the nav system will not
        // be sent to the wrong place.
        if (this.axs_.lastFocusedNode && this.axs_.lastFocusedNode.blur){
          var oldNode = this.axs_.lastFocusedNode;
          // Set the lastFocusedNode to null to prevent AxsJAX's blur handler 
          // from kicking in as that blur handler will conflict with the 
          // temporary blur handler which results in screen readers not
          // speaking properly due to how the eventing system works.
          // Because we are not allowing the regular blur handler to work,
          // we need to make sure that we do the same work of cleaning up.
          this.axs_.lastFocusedNode = null;
          if (oldNode.removeAttribute){
            this.axs_.removeAttributeOf(oldNode, 'aria-activedescendant');
          }
          // The action needs to be done inside a temporary blur handler
          // because otherwise, there is a timing issue of when the events
          // get sent and screen readers won't speak.
          var tempBlurHandler = function(evt){
            evt.target.removeEventListener('blur', tempBlurHandler, true);
            doAction();
          };
          oldNode.addEventListener('blur', tempBlurHandler, true);
          oldNode.blur();
        } else {
          doAction();
        }
  }
};

/**
 * This function creates the maps keypresses to a method on a given
 * char and key map.
 *
 * @param {Array} keyArray  Array of keys that will be associated with the
 *                          method
 *
 * @param {Object} charMap  Dictionary that maps character codes to methods
 *
 * @param {Object} keyMap  Dictionary that maps key codes to methods
 *
 * @param {Function} method  Method to be be associated with the array of keys
 */
AxsNav.prototype.assignKeysToMethod = function(keyArray, 
                                               charMap, 
                                               keyMap, 
                                               method){
  for (var i = 0; i < keyArray.length; i++){
    var key = keyArray[i];
    if (key == 'LEFT'){
      keyMap[37] = method;
    } else if (key == 'UP'){
      keyMap[38] = method;
    } else if (key == 'RIGHT'){
      keyMap[39] = method;
    } else if (key == 'DOWN'){
      keyMap[40] = method;
    } else if (key == 'PGUP'){
      keyMap[33] = method;
    } else if (key == 'PGDOWN'){
      keyMap[34] = method;
    } else if (key == 'ENTER'){
      keyMap[13] = method;
    } else if (key == 'DEL'){
      keyMap[46] = method;
    } else {
      charMap[key.charCodeAt(0)] = method;
    }
  }
};

/**
 * This function creates the mapping between keypresses and navigation behavior
 * for item keys. This mapping is only active when the user is in the
 * corresponding navList.
 *
 * @param {string} keyStr  String that indicates the keys to be used.
 *
 * @param {number} navListIdx  Index of the list that these keypresses are
 *                             associated with.
 *
 * @param {string}  navTaskStr  "next","prev","fwd","back"
 */
AxsNav.prototype.assignItemKeys = function(keyStr, navListIdx, navTaskStr){
  var keys = new Array();
  if (keyStr === ''){
    return;
  }
  keys = keyStr.split(' ');
  var self = this;
  if (navTaskStr == 'prev'){
    this.assignKeysToMethod(keys,
                            this.charCodeMaps[navListIdx],
                            this.keyCodeMaps[navListIdx],
                            function(){
                              self.actOnItem(self.prevItem());
                            });
  } else if (navTaskStr == 'next') {
    this.assignKeysToMethod(keys,
                            this.charCodeMaps[navListIdx],
                            this.keyCodeMaps[navListIdx],
                            function(){
                              self.actOnItem(self.nextItem());
                            });
  } else if (navTaskStr == 'back') {
    this.assignKeysToMethod(keys,
                            this.charCodeMaps[navListIdx],
                            this.keyCodeMaps[navListIdx],
                            function(){
                              self.actOnItem(self.backItem());
                            });
  } else {
    this.assignKeysToMethod(keys,
                            this.charCodeMaps[navListIdx],
                            this.keyCodeMaps[navListIdx],
                            function(){
                              self.actOnItem(self.fwdItem());
                            });
  }
};

/**
 * This function creates the mapping between keypresses and navigation behavior
 * for hotkeys. This mapping is active all the time, regardless of which navList
 * the user is in.
 *
 * @param {string} keyStr  String that indicates the keys to be used.
 *                         Pressing these keys will cause the user to jump to
 *                         the list that the key is associated with and read the
 *                         next item there.
 *
 * @param {number} navListIdx  Index of the list that these keypresses are
 *                             associated with.
 *
 * @param {string} emptyMsg  String to speak to the user if the list is
 *                           empty.
 */
AxsNav.prototype.assignHotKeys = function(keyStr, navListIdx, emptyMsg){
  var keys = new Array();
  if (keyStr === ''){
    return;
  }
  keys = keyStr.split(' ');
  var self = this;
  this.assignKeysToMethod(keys,
                          this.topCharCodeMap,
                          this.topKeyCodeMap,
                          function(){
                            if (!self.validateList(self.navArray[navListIdx])){
                              self.axs_.speakTextViaNode(emptyMsg);
                              return;
                            }
                            self.navListIdx = navListIdx;
                            self.actOnItem(self.nextItem());
                          });
};

/**
 * For all keys that map to lists with no items, those keys should
 * speak some message to let the user know that the function was called
 * but was unsuccessful because there is no content.
 *
 * @param {string} keyStr  String that indicates the keys to be used.
 *
 * @param {string} emptyMsg  The message that should be spoken when the user
 *                           presses the key(s) to let them know that there
 *                           is no content.
 */
AxsNav.prototype.assignEmptyMsgKeys = function(keyStr, emptyMsg){
  var keys = new Array();
  if (keyStr === ''){
    return;
  }
  keys = keyStr.split(' ');
  var self = this;
  this.assignKeysToMethod(keys,
                          this.topCharCodeMap,
                          this.topKeyCodeMap,
                          function(){
                            self.axs_.speakTextViaNode(emptyMsg);
                          });

};


/**
 * This function creates the mapping between keypresses and target nodes.
 * This mapping is active all the time, regardless of which navList
 * the user is in.
 *
 * @param {Object} target  Target object created from the <target> element
 * @param {Object} charMap  Dictionary that maps character codes to methods
 * @param {Object} keyMap  Dictionary that maps key codes to methods
 */
AxsNav.prototype.assignTargetKeys = function(target, charMap, keyMap){
  var keys = new Array();
  if (target.hotkeyStr === ''){
    return;
  }
  keys = target.hotkeyStr.split(' ');
  var self = this;
  this.assignKeysToMethod(keys,
                          charMap,
                          keyMap,
                          function(){
                            self.actOnTarget(target);
                          });
};

/**
 * This function will act on the target specified.
 *
 * @param {Object?} target The target to act on.
 */
AxsNav.prototype.actOnTarget = function(target){
  var xpath = target.xpath;
  var rootNode = this.axs_.getActiveDocument().documentElement;
  if (xpath.indexOf('.') === 0){
    rootNode = this.currentItem().elem;
  }
  var elems = this.axs_.evalXPath(xpath, rootNode);
  if (elems.length < 1){
    this.axs_.speakTextViaNode(target.emptyMsg);
  } else {
      var func = this.getCallbackFunction(target.action);
      if (func){
        var item = new Object();
        item.action = target.action;
        item.elem = elems[0];
        func(item);
    } else {
      this.axs_.clickElem(elems[0], false);
      elems[0].scrollIntoView(true);
    }
    this.axs_.markPosition(elems[0]);
  }
};


/**
 * This function attaches the default AxsJAX key handler for navigation.
 * @param {Node} cnrDOM  DOM of the Content Navigation Rule.
 * @param {Array} emptyLists  An array of lists which have zero items.
 */

AxsNav.prototype.setUpNavKeys = function(cnrDOM, emptyLists){
  var self = this;
  var cnrNode = cnrDOM.firstChild;
  var i;

  this.topCharCodeMap = new Object();
  this.topKeyCodeMap = new Object();
  this.charCodeMaps = new Array();
  this.keyCodeMaps = new Array();

  //Acting on global targets
  var target;
  for (i = 0, target; target = this.targetsArray[i]; i++){
    this.assignTargetKeys(target, this.topCharCodeMap, this.topKeyCodeMap);
  }

  //Moving through lists
  var keys = new Array();
  this.nextListKeys = cnrNode.getAttribute('next') || '';
  if (this.nextListKeys !== ''){
    keys = this.nextListKeys.split(' ');
  }
  this.assignKeysToMethod(keys,
                          this.topCharCodeMap,
                          this.topKeyCodeMap,
                          function(){
                            self.nextList();
                            self.doListEntryActions();
                          });

  keys = new Array();
  this.prevListKeys = cnrNode.getAttribute('prev') || '';
  if (this.prevListKeys !== ''){
    keys = this.prevListKeys.split(' ');
  }
  this.assignKeysToMethod(keys,
                          this.topCharCodeMap,
                          this.topKeyCodeMap,
                          function(){
                            self.prevList();
                            self.doListEntryActions();
                          });


  //Moving through items and handling per-list targets
  var list;
  for (i = 0, list; list = this.navArray[i]; i++){
    var charMap = new Object();
    var keyMap = new Object();
    this.charCodeMaps.push(charMap);
    this.keyCodeMaps.push(keyMap);
    this.assignItemKeys(list.nextKeys, i, 'next');
    this.assignItemKeys(list.prevKeys, i, 'prev');
    this.assignItemKeys(list.fwdKeys, i, 'fwd');
    this.assignItemKeys(list.backKeys, i, 'back');
    this.assignHotKeys(list.hotKeys, i, list.emptyMsg);
    var j;
    for (j = 0, target; target = list.targets[j]; j++){
      this.assignTargetKeys(target, charMap, keyMap);
    }
  }

  //Dealing with empty lists with hotkeys
  var emptyList;
  for (i = 0, emptyList; emptyList = emptyLists[i]; i++){
    this.assignEmptyMsgKeys(emptyList.hotKeys, emptyList.emptyMsg);
  }

  this.keyHandler = function(evt){
                     //None of these commands involve Ctrl.
                     //If Ctrl is held, it must be for some AT.
                     if (evt.ctrlKey) return true;
                     if (self.axs_.inputFocused) return true;
                     var idx = self.navListIdx;
                     var command = self.keyCodeMaps[idx][evt.keyCode] ||
                                   self.charCodeMaps[idx][evt.charCode];
                     if (command) return command();
                     command = self.topKeyCodeMap[evt.keyCode] ||
                               self.topCharCodeMap[evt.charCode];
                     if (command) return command();
                   };

  document.addEventListener('keypress', this.keyHandler, true);
};

/**
 * Returns an array of target objects for the given <list> node
 * @param {Object} listNode  A <list> node
 * @return {Array} An array of target objects
 */
AxsNav.prototype.makeTargetsArray = function(listNode){
  var targetsArray = new Array();
  var cnrTargets = listNode.getElementsByTagName('target');
  for (var i = 0, entry; entry = cnrTargets[i]; i++){
    var target = new Object();
    //Strip all leading and trailing spaces from the xpath
    target.xpath = entry.textContent;
    target.xpath = target.xpath.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    target.title = entry.getAttribute('title') || '';
    target.trigger = entry.getAttribute('trigger') || 'key';
    target.hotkeyStr = entry.getAttribute('hotkey') || '';
    target.action = entry.getAttribute('action') || 'click';
    target.emptyMsg = entry.getAttribute('onEmpty') || '';
    targetsArray.push(target);
  }
  return targetsArray;
};

/**
 * Builds up the navigation system of lists of items.
 * This system uses the idea of multiple cursors and the visitor pattern.
 *
 * @param {string} cnrString  An XML string that contains the information needed
 *                            to build up the content navigation rule.
 *
 * @notypecheck {Function?} opt_customNavMethod
 *                                A custom navigation method provided by
 *                                the caller. This navigation method will be
 *                                given the DOM created from the cnrString, the
 *                                navigation array of lists of items,
 *                                and an array of all the lists which had
 *                                zero items. If this is null, the default
 *                                AxsJAX nav handler will be used.
 */
AxsNav.prototype.navInit = function(cnrString, opt_customNavMethod){
  var parser = new DOMParser();
  var cnrDOM = parser.parseFromString(cnrString, 'text/xml');

  //Build up the navigation lists
  var lists = cnrDOM.getElementsByTagName('list');
  this.navArray = new Array();
  this.navListIdx = 0;
  this.navItemIdxs = new Array();

  var emptyLists = new Array();

  var i;
  var currentList;
  for (i = 0, currentList; currentList = lists[i]; i++){
    var navList = new Object();
    navList.cnrNode = currentList;
    navList.title = currentList.getAttribute('title') || '';
    navList.hotKeys = currentList.getAttribute('hotkey') || '';
    navList.nextKeys = currentList.getAttribute('next') || '';
    navList.prevKeys = currentList.getAttribute('prev') || '';
    navList.fwdKeys = currentList.getAttribute('fwd') || '';
    navList.backKeys = currentList.getAttribute('back') || '';
    navList.emptyMsg = currentList.getAttribute('onEmpty') || '';
    navList.type = currentList.getAttribute('type') || '';
    navList.tailTarget = null;
    navList.headTarget = null;
    navList.entryTarget = null;
    navList.items = this.makeItemsArray(currentList);
    navList.targets = this.makeTargetsArray(currentList);
    for (var j = 0, listTarget; listTarget = navList.targets[j]; j++){
      if (listTarget.trigger == 'listTail'){
        navList.tailTarget = listTarget;
      } else if (listTarget.trigger == 'listHead'){
        navList.headTarget = listTarget;
      } else if (listTarget.trigger == 'listEntry'){
        navList.entryTarget = listTarget;
      }
    }
    if (navList.items.length > 0 || navList.type == 'dynamic'){
      //Only add nav lists that have content to the array
      this.navArray.push(navList);
      this.navItemIdxs.push(-1);
    } else if (navList.hotKeys !== ''){
      //Record empty nav lists if the user can jump to them directly
      emptyLists.push(navList);
    }
  }

  //Build up the targets
  var targets = new Array();
  this.targetsArray = new Array();
  this.targetsIdx = 0;
  var currentNode;
  var cnrNode = cnrDOM.firstChild;
  for (i = 0, currentNode; currentNode = cnrNode.childNodes[i]; i++){
    if (currentNode.tagName == 'target'){
      var target = new Object();
      //Strip all leading and trailing spaces from the xpath
      target.xpath = currentNode.textContent;
      target.xpath = target.xpath.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
      target.title = currentNode.getAttribute('title') || '';
      target.trigger = currentNode.getAttribute('trigger') || 'key';
      target.hotkeyStr = currentNode.getAttribute('hotkey') || '';
      target.action = currentNode.getAttribute('action') || 'click';
      target.emptyMsg = currentNode.getAttribute('onEmpty') || '';
      this.targetsArray.push(target);
    }
  }

  //Remove the previous event listener if there was one
  if (this.keyHandler !== null){
    document.removeEventListener('keypress', this.keyHandler, true);
  }
  //Bind lists and targets to keys if there is no custom handler specified
  if ((opt_customNavMethod === null) ||
      (typeof(opt_customNavMethod) == 'undefined')){
    this.setUpNavKeys(cnrDOM, emptyLists);
  } else {
    opt_customNavMethod(cnrDOM, this.navArray, emptyLists, this.targetsArray);
  }
};

/**
 * Generates a help string for the globally available keys.
 * Keys which are specific to the current list are NOT included.
 *
 * @return {string} The help string for globally available keys.
 */
AxsNav.prototype.globalHelpString = function(){
  var helpStr = '';
  if (this.nextListKeys !== ''){
    helpStr = helpStr + this.nextListKeys + AxsNav.str.NEXTLIST;
  }
  if (this.prevListKeys !== ''){
    helpStr = helpStr + this.prevListKeys + AxsNav.str.PREVLIST;
  }
  var i = 0;
  var target = null;
  for (i = 0, target; target = this.targetsArray[i]; i++){
    if (target.hotkeyStr !== ''){
      helpStr = helpStr + target.hotkeyStr + ', ' + target.title + '. ';
    }
  }
  var list = null;
  for (i = 0, list; list = this.navArray[i]; i++){
    if (list.hotKeys !== ''){
      helpStr = helpStr + list.hotKeys + ', ' + list.title + '. ';
    }
  }
  return helpStr;
};

/**
 * Generates a help string for locally available keys.
 * Keys which are global are NOT included.
 *
 * @return {string} The help string for locally available keys.
 */
AxsNav.prototype.localHelpString = function(){
  var currentList = this.navArray[this.navListIdx];
  var helpStr = '';
  if (currentList.fwdKeys !== ''){
    helpStr = helpStr + currentList.fwdKeys + AxsNav.str.GOFORWARD;
  }
  if (currentList.backKeys !== ''){
    helpStr = helpStr + currentList.backKeys + AxsNav.str.GOBACKWARDS;
  }
  if (currentList.nextKeys !== ''){
    helpStr = helpStr + currentList.nextKeys + AxsNav.str.CYCLENEXT;
  }
  if (currentList.prevKeys !== ''){
    helpStr = helpStr + currentList.prevKeys + AxsNav.str.CYCLEPREV;
  }
  for (var i = 0, target; target = currentList.targets[i]; i++){
    if (target.hotkeyStr !== ''){
      helpStr = helpStr + target.hotkeyStr + ', ' + target.title + '. ';
    }
  }
  return helpStr;
};



/**
 * This function sets the lens to be used when going to an item's element.
 *
 * @param {Object?} lens  The AxsLens object to be used.
 *                        If null, no lens will be used.
 */
AxsNav.prototype.setLens = function(lens){
  this.lens_ = lens;
};


/**
 * This function sets the lens to be used when going to an item's element.
 *
 * @param {Object?} snd   The AxsSound object to be used.
 *                        The AxsSound object should already have its 
 *                        verbosity set and be initialized.
 *                        If null, no sound object will be used.
 */
AxsNav.prototype.setSound = function(snd){
  this.snd_ = snd;
};

/**
 * Refreshes the dynamic list with the specified title.
 * @param {string?} listTitle The title of the list that should be refreshed.
 * @return {boolean} True if the list was successfully refreshed.
 */
AxsNav.prototype.refreshList = function(listTitle){
  if (listTitle === null) {
    return false;
  }
  var reloaded = false;
  for (var i = 0, navList; navList = this.navArray[i]; i++) {
    if (navList.title == listTitle) {
      navList.items = new Array();
      navList.targets = new Array();
      reloaded = this.validateList(navList);
      break;
    }
  }
  return reloaded;
};

/**
 * Disables the default keyboard handler for the AxsNav object by detaching it 
 * from the keypress event listener for the current document.
 */
AxsNav.prototype.disableNavKeys = function() {
  if (this.keyHandler !== null){
    document.removeEventListener('keypress', this.keyHandler, true);
  }
};

/**
 * Re-enables the default keyboard handler for the AxsNav object by reattaching
 * it to the keypress event listener for the current document.
 * This function assumes AxsNav.prototype.setUpNavKeys has already been called
 * so that this.keyHandler is already setup and ready to go.
 */
AxsNav.prototype.enableNavKeys = function() {
  if (this.keyHandler !== null){
    // Remove it once so that the keyHandler is not accidentally added twice
    // just in case enableNavKeys has already been called.
    // If it has not already been added, this first removeEventListener call
    // is a no-op.
    document.removeEventListener('keypress', this.keyHandler, true);
    document.addEventListener('keypress', this.keyHandler, true);
  }
};

//javascript/axsjax/common/AxsLens.js
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
 * @fileoverview AxsLens - JavaScript library for applying a lens
 * to content on web pages.
 * @author clchen@google.com (Charles L. Chen)
 */

/**
 * Class for applying a lens to content on web pages.
 * Lenses can be used to magnify the content, change the font color,
 * change the background color, and more.
 * @param {Object} axsJAXObj  An instance of an AxsJAX object.
 * @constructor
 */
var AxsLens = function(axsJAXObj){
  this.multiplier = 1.5;

  var activeDoc = axsJAXObj.getActiveDocument();
  this.lens = activeDoc.createElement('span');

  this.lens.style.backgroundColor = '#CCE6FF';
  this.lens.style.borderColor = '#0000CC';
  this.lens.style.borderWidth = 'medium';
  this.lens.style.borderStyle = 'groove';
  this.lens.style.position = 'absolute';
  this.magnifyText();

  this.lens.style.display = 'none';
  activeDoc.body.appendChild(this.lens);
};

/**
 * View the targetNode through AxsLens.
 * This method will create a copy of the 
 * targetNode, apply the lens' transformation
 * to the copy, and place the copy in an
 * element floating above the targetNode.
 * If targetNode is set to null, the lens will stop being displayed.
 * @param {Object?} targetNode The DOM node to be viewed
 */
AxsLens.prototype.view = function(targetNode){
  while (this.lens.firstChild){
    this.lens.removeChild(this.lens.firstChild);
  }
  if (targetNode === null) {
    this.lens.style.display = 'none';
    return;
  }
  var left = 0;
  var top = 0;
  var obj = targetNode;
  if (obj.offsetParent) {
    left = obj.offsetLeft;
    top = obj.offsetTop;
    obj = obj.offsetParent;
    while (obj !== null) {
      left += obj.offsetLeft;
      top += obj.offsetTop;
      obj = obj.offsetParent;
    }
  }
  this.lens.appendChild(targetNode.cloneNode(true));

  this.magnifyText();
  this.enlargeImages();

  this.lens.style.top = top + 'px';
  this.lens.style.left = left + 'px';
  this.lens.style.zIndex = 999;
  this.lens.style.display = 'block';
};

/**
 * Sets the multiplication factor of the lens
 * @param {Number} multiplier The multiplication factor to be used 
 * by the lens when magnifying content
 */
AxsLens.prototype.setMagnification = function(multiplier){
  this.multiplier = multiplier;
  this.magnifyText();
  this.enlargeImages();
};

/**
 * Enlarges the images of the content being viewed in the lens.
 */
AxsLens.prototype.enlargeImages = function(){
  var images = this.lens.getElementsByTagName('img');
  for (var i = 0, image; image = images[i]; i++){
    if (!image.hasAttribute('Axs_OrigHeight')){
      image.setAttribute('Axs_OrigHeight', image.height);
      image.setAttribute('Axs_OrigWidth', image.width);
    }
    image.height = image.getAttribute('Axs_OrigHeight') * this.multiplier;
    image.width = image.getAttribute('Axs_OrigWidth') * this.multiplier;
  }
};

/**
 * Enlarges the text of the content being viewed in the lens.
 */
AxsLens.prototype.magnifyText = function(){
  // fontSizeAdjust is based on the aspect value of the font.
  // The default aspect value of Arial is .52
  var fontSizeAdjust = this.multiplier * 0.52;
  this.lens.style.fontSizeAdjust = fontSizeAdjust;
};

//javascript/axsjax/common/PowerKey.js
/**
 * @fileoverview PowerKey - JavaScript library for providing keyboard
 * enhancements for Web 2.0 applications. The scripts support IE 6+ and
 * Firefox 2.0+. AxsJAX support provided by PowerKey is currently limited
 * to Firefox 3.0+.
 * @author chaitanyag@google.com (Chaitanya P. Gharpure)
 */


/**
 * Javascript class for providing keyboard interface enhancements for
 * Web 2.0 applications.
 * @param {string} context The user specified string value, which is the
 *     starting context of the application. This can be changed later.
 * @param {Object} axsJAX The AxsJAX object provided by the user.
 * @constructor
 */
var PowerKey = function(context, axsJAX) {
  /**
   * Holds the current application context.
   * @type {string}
   */
  this.context = context;

  /**
   * The div element holding the completion text field.
   * @type {Element?}
   */
  this.cmpFloatElement = null;

  /**
   * The completion text field element.
   * @type {Element?}
   */
  this.cmpTextElement = null;

  /**
   * Element showing the PowerKey message/status string.
   * @type {Element?}
   */
  this.statusElement = null;

  /**
   * Variable to hold the completion mode prompt string.
   * @type {string}
   * @private
   */
  this.completionPromptStr_ = 'Enter Completion';

  /**
   * Variable to hold the completion mode prompt string when the completion
   * list is empty.
   * @type {string}
   * @private
   */
  this.noCompletionStr_ = 'No completions found';

  /**
   * AxsJAX object
   * @type {Object?}
   * @private
   */
  this.axsJAX_ = null;

  /**
   * The div element which holds the text of the selected list item.
   * @type {Element?}
   * @private
   */
  this.listElement_ = null;

  /**
   * The div element inside the completion div, holding the selected list item.
   * @type {Element?}
   * @private
   */
  this.cmpDivElement_ = null;

  /**
   * The list of completions to select from.
   * @type {Array}
   * @private
   */
  this.cmpList_ = [];

  /**
   * The navigation position in the list.
   * @type {number}
   * @private
   */
  this.listPos_ = -1;


  /**
   * Whether to hide completion field on blur.
   * @type {boolean}
   * @private
   */
  this.hideCmdFieldOnBlur_ = false;


  this.idMap = {};
  this.indexList_ = {};
  if (axsJAX && PowerKey.isGecko) {
    this.axsJAX_ = axsJAX;
  }
};


/**
 * The reg exp indicating the pattern of the parameter to a completion. It 
 * should start with '<', end wit '>' and contain only characters and numbers.
 * @type {RegExp}
 */
PowerKey.CMD_PARAM = /^\<[A-Z|a-z|0-9|\-|\_]+\>$/;


/**
 * The reg exp to check if there are spaces, new lines or carriage returns at
 * the beginning of a string.
 * @type {RegExp}
 */
PowerKey.LEFT_TRIMMABLE = /^(\s|\r|\n)+/;


/**
 * The reg exp to check if there are spaces, new lines or carriage returns at
 * the end of a string.
 * @type {RegExp}
 */
PowerKey.RIGHT_TRIMMABLE = /(\s|\r|\n)+$/;


/**
 * Attaches event listener and sets the user specified handler or the
 * default handler if the action map is provided.
 * @param {Element?} target The element to attach the event listerner to.
 * @param {string} event The event to listen for.
 * @param {Function?} handler The event handler.
 * @param {Object?} actionMap The HashMap which provides a context-based
 *     mapping from keys to functions.
 */
PowerKey.prototype.attachHandlerAndListen = function(target,
                                                     event,
                                                     handler,
                                                     actionMap) {
  // Firefox
  if (PowerKey.isGecko && handler) {
    target.addEventListener(event, handler, true);
  }
  // IE
  else if (PowerKey.isIE && handler) {
    target.attachEvent(event, function(event) {
      handler(event);});
  }
  // Use default handler if the action map is provided.
  if (actionMap) {
    var handlerObj = new PowerKey.DefaultHandler(actionMap);
    var pkObj = this;
    this.attachHandlerAndListen(target, event, function(evt) {
      handlerObj.handler(evt, handlerObj, pkObj);
    }, null);
  }
};


/**
 * Detaches event listener with the user specified event and handler.
 * @param {Element} target The element to detach the event listerner from.
 * @param {string} event The event to detach.
 * @param {Function} handler The event handler to stop calling.
 */
PowerKey.prototype.detachHandler = function(target, event, handler) {
  // Firefox
  if (PowerKey.isGecko) {
    target.removeEventListener(event, handler, true);
  }
  // IE
  else if (PowerKey.isIE) {
    target.detachEvent(event, handler);
  }
};


/**
 * Creates a floating element for holding the completion shell's text field.
 * @param {Element} parent The element whose child this element will be.
 * @param {number} size The size of the completion text field in # of 
 *     characters.
 * @param {Function?} handler The completion handler.
 *     handler = function(completion, index, elementId, args) {}
 * @param {Object?} actionMap The object consisting of completion strings as
 *     keys and functions as values.
 * @param {Array?} completionList The array of completions.
 * @param {boolean} browseOnly Whether the completion list is browse-only.
 */
PowerKey.prototype.createCompletionField = function(parent,
                                                 size,
                                                 handler,
                                                 actionMap,
                                                 completionList,
                                                 browseOnly) {
  var self = this;
  var floatId, fieldId, oldCmdNode, divId;
  // If the completion field already exists, remove it and create a new one.
  if (this.cmpFloatElement) {
    // TODO: remove the handlers attached to cmpTextElement before removing
    // the completion field. The inline handler needs to be moved outside.
    this.cmpFloatElement.parentNode.removeChild(this.cmpFloatElement);
  }
  do {
    floatId = 'completionField_' + Math.floor(Math.random() * 1001);
    fieldId = 'txt_' + floatId;
    divId = 'div_' + floatId;
    oldCmdNode = document.getElementById(floatId);
  } while (oldCmdNode);

  var cmpNode = document.createElement('div');
  cmpNode.id = floatId;
  cmpNode.style.position = 'absolute';

  var txtNode = document.createElement('input');

  txtNode.type = 'text';
  txtNode.id = fieldId;
  txtNode.size = size;
  txtNode.value = '';
  txtNode.setAttribute('onkeypress',
      'if (event.keyCode == PowerKey.keyCodes.TAB){return false;}');
  txtNode.readOnly = browseOnly;

  if (browseOnly) {
    txtNode.style.fontSize = 0;
  }

  var divNode = document.createElement('div');
  divNode.id = divId;
  divNode.setAttribute('tabindex', 0);
  divNode.setAttribute('role', 'row');

  cmpNode.appendChild(divNode);
  cmpNode.appendChild(txtNode);
  parent.appendChild(cmpNode);

  this.cmpFloatElement = cmpNode;
  this.cmpTextElement = txtNode;
  this.cmpDivElement_ = divNode;

  this.cmpFloatElement.className = 'pkHiddenStatus';
  this.cmpTextElement.className = 'pkOpaqueCompletionText';

  if (completionList) {
    this.cmpList_ = completionList;
    this.filterList_ = this.cmpList_;
    for (var i = 0, cmp; cmp = this.cmpList_[i]; i++) {
      this.indexList_[cmp.toLowerCase()] = i;
    }
    this.listPos_ = -1;
  }

  // filter the completion list on keyup if it is not UP or DOWN arrow.
  this.attachHandlerAndListen(this.cmpTextElement, PowerKey.Event.KEYUP,
      function(evt) {
        self.handleCompletionKeyUp_.call(self, evt, actionMap, handler);
      }, null);

  this.attachHandlerAndListen(this.cmpTextElement, PowerKey.Event.KEYDOWN,
      function(evt) {
        self.handleCompletionKeyDown_.call(self, evt);
      }, null);

  this.attachHandlerAndListen(this.cmpTextElement, 'blur',
      function(evt) {
        if (self.hideCmdFieldOnBlur_) {
          self.updateCompletionField('hidden');
        }
      }, null);
};


/**
 * Handle keyup events. If the key is not an arrow key, filter the list by the
 * contents of the completion text field.
 * @param {Object} evt The key event object.
 * @param {Object} actionMap The object consisting of completion strings as
 *     keys and functions as values.
 * @param {Function?} handler The completion handler.
 *     handler = function(completion, index, elementId, args) {}
 * @private
 */
PowerKey.prototype.handleCompletionKeyUp_ = function(evt,
                                                     actionMap,
                                                     handler) {
  if (this.cmpTextElement.value.length === 0) {
    this.filterList_ = this.cmpList_;
  }
  if (evt.keyCode != PowerKey.keyCodes.KEYUP &&
      evt.keyCode != PowerKey.keyCodes.KEYDOWN &&
      evt.keyCode != PowerKey.keyCodes.ENTER &&
      evt.keyCode != PowerKey.keyCodes.TAB) {

    if (this.cmpTextElement.value.length) {
      this.filterList_ = this.getWordFilterMatches_(this.cmpList_,
          this.cmpTextElement.value, 50);
      this.listPos_ = -1;
      if (this.filterList_.length > 0) {
        this.setListElement_(this.filterList_[0]);
        this.listPos_ = 0;
      } else {
        this.setListElement_(this.noCompletionStr_);
      }
    }
    else {
      this.setListElement_(this.completionPromptStr_);
    }
  }
  // Handle ENTER key pressed in the completion field.
  if (evt.keyCode == PowerKey.keyCodes.ENTER) {
    if (this.cmpTextElement.readOnly) {
      return;
    }
    // Select current filtered list item.
    if (this.filterList_ &&
        this.filterList_.length > 0 &&
        this.cmpTextElement.value != this.filterList_[this.listPos_] &&
        // Does not have parameters or is incomplete
        (this.filterList_[this.listPos_].indexOf('<') < 0 ||
            (this.filterList_[this.listPos_].indexOf('<') >= 0 &&
             this.filterList_[this.listPos_].split(' ').length >
                 this.cmpTextElement.value.split(' ').length))) {
      this.selectCurrentListItem_();
      return;
    }
    var str = this.cmpTextElement.value;
    var originalCmd = (PowerKey.isIE ? this.listElement_.innerText :
          this.listElement_.textContent).toLowerCase();
    // Change only the basic portion (non-argument) of the selection to lower
    // case. For ex: In 'Watch Video funnySeries', only 'Watch Video' is
    // changed to lower case.
    var pos = originalCmd.indexOf('<');
    var baseCmd;
    if (pos >= 0) {
      baseCmd = str.substr(0, pos - 1).toLowerCase();
      str = baseCmd + ' ' + str.substr(pos);
    } else {
      str = str.toLowerCase();
      baseCmd = str;
    }
    var handled = false;
    if (actionMap) {
      handled = this.actionHandler_.call(this, str,
          originalCmd, actionMap);
    }
    if (handler && !handled) {
      var args = this.getArguments_(str, originalCmd);
      handler(baseCmd, this.indexList_[originalCmd],
          this.idMap[originalCmd], args);
    }
    this.cmpTextElement.value = '';
  }
};


/**
 * Handle keydown events. If the key is an UP/DOWN arrow key, navigates to the
 *     previous and next item in the filtered list.
 * @param {Object} evt The key event object.
 * @private
 */
PowerKey.prototype.handleCompletionKeyDown_ = function(evt) {
  // Handle UP arrow key
  if (evt.keyCode == PowerKey.keyCodes.KEYUP &&
           this.filterList_ &&
           this.filterList_.length > 0) {
    this.prevListItem_();
  }
  // Handle DOWN arrow key
  else if (evt.keyCode == PowerKey.keyCodes.KEYDOWN &&
           this.filterList_ &&
           this.filterList_.length > 0) {
    this.nextListItem_();
  }
  // On TAB, keep the focus in the completion field.
  else if (evt.keyCode == PowerKey.keyCodes.TAB) {
    if (this.filterList_ && this.filterList_.length > 0) {
      this.selectCurrentListItem_();
    }
  }
};


/**
 * Tells whether to hide the completion field when focus is lost.
 * @param {boolean} hide If true, hide the completion field on blur.
 */
PowerKey.prototype.setAutoHideCompletionField = function(hide) {
  this.hideCmdFieldOnBlur_ = hide;
};


/**
 * Sets the label to be displayed and spoken, when the
 * completion field is made visible.
 * @param {string} str The string to display.
 */
PowerKey.prototype.setCompletionPromptStr = function(str) {
  this.completionPromptStr_ = str;
};


/**
 * Sets the label to be displayed and spoken, when there are no completions
 * in the completion list.
 * @param {string} str The string to display.
 */
PowerKey.prototype.setNoCompletionStr = function(str) {
  this.noCompletionStr_ = str;
};


/**
 * Sets the completion list.
 * @param {Array} list The array to be used as the completion list.
 */
PowerKey.prototype.setCompletionList = function(list) {
  this.cmpList_ = list;
  this.filterList_ = this.cmpList_;
  this.indexList_ = {};
  for (var i = 0, cmp; cmp = this.cmpList_[i]; i++) {
    this.indexList_[cmp.toLowerCase()] = i;
  }
  this.listPos_ = -1;
};


/**
 * Creates a floating element for displaying various PowerKey messages.
 * @param {Element} parent The element whose child this element will be.
 */
PowerKey.prototype.createStatusElement = function(parent) {
  if (!parent) {
    return;
  }
  // If the status element already exists, remove it and create a new one.
  if (this.statusElement) {
    this.statusElement.parentNode.removeChild(this.statusElement);
  }
  var statusId, statusTxtId, oldStatusNode = null;
  do {
    statusId = 'statusNode_' + Math.floor(Math.random() * 1001);
    statusTxtId = 'txt_' + statusId;
    oldStatusNode = document.getElementById(statusId);
  } while (oldStatusNode);

  var statusNode = document.createElement('div');
  statusNode.id = statusId;
  statusNode.setAttribute('class', 'pkHiddenStatus');
  statusNode.style.position = 'absolute';

  var txtNode = document.createElement('div');
  txtNode.id = statusTxtId;
  txtNode.setAttribute('class', 'pkOpaqueStatusText');

  statusNode.appendChild(txtNode);

  parent.appendChild(statusNode);
  this.statusElement = statusNode;
  this.statusTxtElement = txtNode;

  if (PowerKey.isGecko) {
    this.statusTxtElement.textContent = '';
  }
  else if (PowerKey.isIE) {
    this.statusTxtElement.innerText = '';
  }
};


/**
 * Updates the completion field element with the new visibility status
 * and location parameters.
 * @param {string} status Indicates whether the completion field should be
 *     made 'visible' or 'hidden'.
 * @param {boolean} opt_resize Indicates whether resizing is necessary.
 * @param {number} opt_top The y-coordinate pixel location of the top
 *     border of the element.
 * @param {number} opt_left The x-coordinate pixel location of the left
 *     border of the element.
 */
PowerKey.prototype.updateCompletionField = function(status,
                                                 opt_resize,
                                                 opt_top,
                                                 opt_left) {
  if (status == 'visible') {
    if (this.cmpFloatElement.className == 'pkHiddenStatus') {
      this.setListElement_(this.completionPromptStr_);
    }
    this.cmpFloatElement.className = 'pkVisibleStatus';
    // Need to do this for IE. Setting focus immediately after making it
    // visible generates an error. Hence have to set the timeout.
    var elem = this.cmpTextElement;
    window.setTimeout(function() {elem.focus();}, 0);
  }
  else if (status == 'hidden') {
    if (PowerKey.isIE && this.listElement_) {
      this.listElement_.innerText = '';
    }
    else if (this.listElement_) {
      this.listElement_.textContent = '';
    }
    this.cmpFloatElement.className = 'pkHiddenStatus';
    this.cmpTextElement.value = '';
    this.listPos_ = -1;
  }
  if (opt_resize) {
    var viewportSz = PowerKey.getViewportSize();
    if (!opt_top) {
      opt_top = viewportSz.height - this.cmpFloatElement.offsetHeight;
    }
    if (!opt_left) {
      opt_left = 0;
    }
    this.cmpFloatElement.style.top = opt_top;
    this.cmpFloatElement.style.left = opt_left;
  }
};


/**
 * Updates the status element with the new display text, visibility status
 * and location parameters.
 * @param {string} text The new display text.
 * @param {string} status Indicates whether the status element should be
 *     made 'visible' or 'hidden'.
 * @param {boolean} opt_resize Indicates whether resizing is necessary.
 * @param {number} opt_top The y-coordinate pixel location of the top
 *     border of the element.
 * @param {number} opt_left The x-coordinate pixel location of the left
 *     border of the element.
 */
PowerKey.prototype.updateStatusElement = function(text,
                                                  status,
                                                  opt_resize,
                                                  opt_top,
                                                  opt_left) {
  if (text) {
    if (PowerKey.isGecko) {
      this.statusTxtElement.textContent = text;
    }
    else if (PowerKey.isIE) {
      this.statusTxtElement.innerText = text;
    }
  }
  if (status) {
    if (status == 'visible') {
      this.statusElement.className = 'pkVisibleStatus';
      if (this.axsJAX_ && PowerKey.isGecko) {
        this.axsJAX_.speakNode(this.statusElement);
      }
    }
    else if (status == 'hidden') {
      this.statusElement.className = 'pkHiddenStatus';
    }
  }
  if (opt_resize) {
    var viewportSz = PowerKey.getViewportSize();
    if (!opt_top) {
      opt_top = viewportSz.height - this.statusElement.offsetHeight;
    }
    if (!opt_left) {
      opt_left = 0;
    }
    this.statusElement.style.top = opt_top;
    this.statusElement.style.left = opt_left;
  }
};


/**
 * Creates the list of completions from the text content of the elements
 * obtained from the xpath which satisfy the function func.
 * @param {string} tags The tags to be selected.
 * @param {Function} func Only those elements are considered for which
 *     this function returns true.
 * @param {boolean} newList If this is true, all entries in idMap
 *     are erased, and a new mapping of completions and IDs is created.
 * @return {Array} The array of completion strings.
 */
PowerKey.prototype.createCompletionList = function(tags, func, newList) {
  var cmpList = new Array();
  var tagArray = tags.split(/\s+/);
  if (newList) {
    delete this.idMap;
    this.idMap = new Object();
  }
  for (var j = 0, tag; tag = tagArray[j]; j++) {
    var nodeArray = document.getElementsByTagName(tag);
    for (var i = 0, node; node = nodeArray[i]; i++) {
      if (func(node)) {
        var label = PowerKey.isIE ?
            node.innerText : node.textContent;
        if (label) {
          label = PowerKey.rightTrim(PowerKey.leftTrim(label));
          label = label.replace(/\n/g, '');
          if (label.toLowerCase().indexOf('ctrl+') === 0) {
            label = label.substring(6);
          }
          cmpList.push(label);
          if (String(this.idMap[label.toLowerCase()]) == 'undefined') {
            this.idMap[label.toLowerCase()] = node.id;
          }
        }
      }
    }
  }
  return cmpList;
};


/**
 * Splits token into words and filters the rows by these words.
 * @param {Array} list An array of all completions.
 * @param {string} token Token to match.
 * @param {number} maxMatches Max number of matches to return.
 * @return {Array} matches Returns the array of matching rows.
 * @private
 */
PowerKey.prototype.getWordFilterMatches_ = function(list, token, maxMatches) {
  var matches = list;
  var rows = list;
  var words = token.split(' ');
  for (var i = 0, word; word = words[i]; i++) {
    rows = matches;
    matches = [];
    if (word !== '') {
      var escapedToken = PowerKey.regExpEscape(word);
      var matcher = new RegExp('(^|\\W+)' + escapedToken, 'i');
      for (var j = 0, row; row = rows[j]; j++) {
        if (String(row).match(matcher)) {
          matches.push(row);
        }
      }
    }
  }
  rows = list;
  for (j = 0; row = rows[j]; j++) {
    var parts = row.split(' ');
    var cmpArray = [];
    var part;
    for (i = 0; part = parts[i]; i++) {
      if (part.charAt(0) == '<') {
        break;
      }
      cmpArray.push(part);
    }
    var cmp = cmpArray.join(' ');
    if (token.indexOf(cmp) === 0) {
      matches.push(row);
    }
  }
  if (matches.length > maxMatches) {
    matches.slice(0, maxMatches - 1);
  }
  return matches;
};


/**
 * Compares the original and user-entered completion and returns the array
 * of arguments if any, otherwise returns null.
 * @param {String} str The string to parse for arguments.
 * @param {String} originalCmd The original completion.
 * @return {Array} Returns an array of completion arguments.
 * @private
 */
PowerKey.prototype.getArguments_ = function(str, originalCmd) {
  str = str.replace(/\s+/g, ' ');
  originalCmd = originalCmd.replace(/\s+/g, ' ');
  var pos = originalCmd.indexOf('<');
  if (pos < 0) {
    return [];
  }
  originalCmd = originalCmd.substr(pos);
  str = str.substr(pos);
  var strTokens = str.split(',');
  var ostrTokens = originalCmd.split(',');
  if (strTokens.length != ostrTokens.length) {
    return [];
  }
  var args = [];
  for (var i = 0, j = 0, token1, token2;
       (token1 = strTokens[i]) && (token2 = ostrTokens[i]);
       i++) {
    token1 = PowerKey.leftTrim(PowerKey.rightTrim(token1));
    token2 = PowerKey.leftTrim(PowerKey.rightTrim(token2));
    if (token2.match(PowerKey.CMD_PARAM)) {
      args.push(token1);
    }
  }
  return args;
};


/**
 * The default completion handler: executes the appropriate functions
 * by looking at the action map.
 * @param {string} act The action/selection to be handled.
 * @param {string} originalCmd The original format of the completion without
 *     the final parameter values.
 * @param {Object} actionMap The HashMap consisting of completion strings
 *     as keys and functions as values.
 * @return {boolean} Whether the completion was successfully handled.
 * @private
 */
PowerKey.prototype.actionHandler_ = function(act,
                                             originalCmd,
                                             actionMap) {
  var args = this.getArguments_(act, originalCmd);
  var actionObj = actionMap[originalCmd];
  if (actionObj && actionObj[this.context]) {
    var func = actionObj[this.context] + '(args);';
    window.setTimeout(func, 0);
    return true;
  }
  else
    return false;
};


/**
 * Displays the previous item in the filtered list, and speaks it.
 * @private
 */
PowerKey.prototype.prevListItem_ = function() {
  if (this.listPos_ < 0) {
    this.listPos_ = 0;
  }
  this.listPos_ = (this.listPos_ || this.filterList_.length) - 1;
  if (this.listPos_ >= 0) {
    this.setListElement_(this.filterList_[this.listPos_]);
  }
};


/**
 * Displays the next item in the filtered list, and speaks it.
 * @private
 */
PowerKey.prototype.nextListItem_ = function() {
  this.listPos_ = (this.listPos_ + 1) % this.filterList_.length;
  if (this.listPos_ < this.filterList_.length) {
    this.setListElement_(this.filterList_[this.listPos_]);
  }
};


/**
 * Selects the current completion from the list, displays it in the completion
 * text field and speaks it.
 * @private
 */
PowerKey.prototype.selectCurrentListItem_ = function() {
  this.cmpTextElement.value =
      this.filterList_[this.listPos_ >= 0 ? this.listPos_ : 0];
  this.filterList_ = this.getWordFilterMatches_(this.cmpList_,
      this.cmpTextElement.value, 50);
  if (this.axsJAX_ && PowerKey.isGecko) {
    this.axsJAX_.speakTextViaNode(this.cmpTextElement.value);
  }
  this.listPos_ = 0;
};


/**
 * Speaks the element of the filtered list which is currently selected.
 * @param {string} text The text to be displayed as the completion field's
 *     label (usually the selected list element itself).
 * @private
 */
PowerKey.prototype.setListElement_ = function(text) {
  if (!this.listElement_) {
    this.listElement_ = document.createElement('div');
    this.listElement_.id = 'listElem_' + Math.floor(Math.random() * 1001);
    this.cmpDivElement_.appendChild(this.listElement_);
  }
  if (PowerKey.isIE) {
    this.listElement_.innerText = text;
  }
  else {
    this.listElement_.textContent = text;
  }
  if (this.axsJAX_ && PowerKey.isGecko) {
    this.axsJAX_.speakNode(this.listElement_, false);
  }
};


// Methods in the PowerKey class end here.


/**
 * A class which creates an event handler with a pre-specified action map.
 * @param {Object} map A HashMap which holds key-function bindings.
 * @constructor
 */
PowerKey.DefaultHandler = function(map) {
  /**
   * HashMap holding the key-function bindings.
   * @type {Object}
   */
  this.actionMap = map;
};


/**
 * The event handler to be called called inside the original event handler.
 * @param {Object} evt The event object passed to the event handler.
 * @param {PowerKey.DefaultHandler} handlerObj A reference to this.
 * @param {PowerKey} pkObj An object of the PowerKey class.
 */
PowerKey.DefaultHandler.prototype.handler =
    function(evt, handlerObj, pkObj) {
  if (!handlerObj.actionMap) {
    return;
  }
  if (evt.keyCode) {
    var mapkeyCode = ''+evt.keyCode;
    var mapkeyChar = String.fromCharCode(evt.keyCode).toLowerCase();
    if (evt.ctrlKey) {
      mapkeyCode = 'Ctrl+' + mapkeyCode;
      mapkeyChar = 'Ctrl+' + mapkeyChar;
    }
    if (evt.altKey) {
      mapkeyCode = 'Alt+' + mapkeyCode;
      mapkeyChar = 'Alt+' + mapkeyChar;
    }
    if (evt.shiftKey) {
      mapkeyCode = 'Shift+' + mapkeyCode;
      mapkeyChar = 'Shift+' + mapkeyChar;
    }
    var actionObj = null;
    actionObj = handlerObj.actionMap[mapkeyChar];
    if (!actionObj) {
      actionObj = handlerObj.actionMap[mapkeyCode];
    }
    if (actionObj) {
      if (actionObj[pkObj.context]) {
        var func = actionObj[pkObj.context];
        func();
      }
    }
  }
};


/**
 * A class to store the height and width of the viewport.
 * @param {number} width The width of the browser viewport.
 * @param {number} height The height of the browser viewport,
 * @constructor
 */
PowerKey.ViewportSize = function(width, height) {
  this.width = width ? width : undefined;
  this.height = height ? height : undefined;
};


/**
 * Trims spaces and new lines from the left end of the string.
 * @param {string} str String to trim.
 * @return {string} The left-trimmed string.
 */
PowerKey.leftTrim = function(str) {
  return str.replace(PowerKey.LEFT_TRIMMABLE, '');
};


/**
 * Trims spaces and new lines from the right end of the string.
 * @param {string} str String to trim.
 * @return {string} The right-trimmed string.
 */
PowerKey.rightTrim = function(str) {
  return str.replace(PowerKey.RIGHT_TRIMMABLE, '');
};


/**
 * Escapes special characters in the string so that it can be matched against
 * a regular expression.
 * @param {string} s String from which to escape characters.
 * @return {string} Returns the escaped string.
 */
PowerKey.regExpEscape = function(s) {
  return String(s).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1').
                   replace(/\x08/g, '\\x08');
};


/**
 * Gets the size of the browser viewport.
 * @return {PowerKey.ViewportSize} Returns the size of the viewport.
 */
PowerKey.getViewportSize = function() {
  var myWidth = 0, myHeight = 0;
  if (typeof(window.innerWidth) == 'number') {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if (document.documentElement &&
             (document.documentElement.clientWidth ||
              document.documentElement.clientHeight)) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if (document.body &&
             (document.body.clientWidth ||
              document.body.clientHeight)) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  return new PowerKey.ViewportSize(myWidth, myHeight);
};


/**
 * Is the user agent Internet Explorer?
 * @type {boolean}
 */
PowerKey.isIE = false;


/**
 * Is the user agent Firefox?
 * @type {boolean}
 */
PowerKey.isGecko = false;


/**
 * Detects the browser type and version.
 */
PowerKey.setBrowser = function() {
  var agt = navigator.userAgent.toLowerCase();
  PowerKey.isGecko = (agt.indexOf('gecko') != -1);
  PowerKey.isIE = ((agt.indexOf('msie') != -1) &&
      (agt.indexOf('opera') == -1));
};
// Set browser type
PowerKey.setBrowser();


/**
 * Enumeration for events.
 * @enum {string}
 */
PowerKey.Event = {
  KEYUP: PowerKey.isIE ? 'onkeyup' : 'keyup',
  KEYDOWN: PowerKey.isIE ? 'onkeydown' : 'keydown',
  KEYPRESS: PowerKey.isIE ? 'onkeypress' : 'keypress',
  CLICK: PowerKey.isIE ? 'onclick' : 'click',
  RESIZE: PowerKey.isIE ? 'onresize' : 'resize',
  FOCUS: PowerKey.isIE ? 'onfocus' : 'focus',
  BLUR: 'blur'
};


/**
 * CSS styles.
 * @type {string}
 */
PowerKey.cssStr =
'.pkHiddenStatus {display: none; position: absolute;}'+
'.pkVisibleStatus {display: block; position: absolute; left: 2px; top: 2px; ' +
  'line-height: 1.2em; z-index: 10000; background-color: #000000; ' +
  'padding: 2px; color: #fff; font-family: Arial, Sans-serif; ' +
  'font-size: 20px; filter: alpha(opacity=85); -moz-opacity: .80;}' +
'.pkOpaqueStatusText { background-color: transparent; ' +
  'font-family: Arial, Helvetica, sans-serif; font-size: 30px; ' +
  'color: #fff;}' +
'.pkOpaqueCompletionText {border-style: none; background-color:transparent; ' +
  'font-family: Arial, Helvetica, sans-serif; font-size: 35px; ' +
  'font-weight: bold; color: #fff; width: 1000px; height: 50px;}';


/**
 * Adds the PowerKey CSS to the page.
 */
PowerKey.setDefaultCSSStyle = function() {
  var head, style;
  head = document.getElementsByTagName('head')[0];
  if (!head) {
    return;
  }
  style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = PowerKey.cssStr;
  head.appendChild(style);
};


/**
 * Constants for key codes.
 * @enum {number}
 */
PowerKey.keyCodes = {
  KEYUP : 38,
  KEYDOWN : 40,
  ENTER : 13,
  TAB : 9
};

//javascript/axsjax/finance/axsEnableFinanceStockScreener.js
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
 * @fileoverview AxsJAX script intended to enhance accessibility of
 * the Stock screener page of Google Finance.
 * 
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsStock = {};

/**
 * Object that contains all string literal used for enhancing the presentation
 * @type {Object}
 */
axsStock.str = {
  MIN : 'Min,',
  MAX : 'Max,',
  COMPANIES_FOUND : 'companies found',
  WIZ_OP_MSG : 'Criteria wizard opened',
  WIZ_CL_MSG : 'Criteria wizard closed',
  DESCENDING : 'descending',
  ASCENDING : 'ascending',
  RESULTS_FROM : 'results from',
  TO : 'to',
  STOCK_SCR : 'Stock screener',
  RESULTS : 'Results',
  CRIT_ALREADY : 'Criteria already added',
  CRIT_ADDED : 'Criteria added',
  NOT_ADDED : 'Not added',
  STATUS : 'Status',
  DEFINITION : 'Definition',
  UP : ' up by ',
  UP_ABR : '+',
  MINUS : ' minus ',
  MINUS_ABR : '-',
  PERCENT_ABR : '%',
  PERCENT : 'percent',
  MILION : ' million',
  MILLION_ABR : 'M',
  BILLION : ' billion',
  BILLION_ABR : 'B',
  EPS : 'E P S',
  EPS_ABR : 'EPS',
  WEEK_HIGH : 'Fifty two week high',
  WEEK_HIGH_ABR : '52w High',
  WEEK_QC : 'Quote change percent',
  WEEK_QC_ABR : 'Quote Change (%)',
  WEEK_LOW : 'Fifty two week low',
  WEEK_LOW_ABR : '52w Low',
  WEEK_PC : 'Fifty two week price change percent',
  WEEK_PC_ABR : '52w Price Change (%)',
  PE : 'P E ratio',
  PE_ABR : 'P/E Ratio',
  FWD_PE_ABR : '1y Fwd P/E',
  FWD_PE : 'One year forward P E',
  FIVE_YEAR_PE_ABR : '5y',
  FIVE_YEAR_PE : '5 year',
  TEN_YEAR_PE_ABR : '10y',
  TEN_YEAR_PE : '10 year',
  APP_NAME : 'Stock screener, ',
  CRITERIA : 'Criteria',
  DELETED : 'deleted',
  ST_SCR_CNR : 'Screener',
  RES_CNR : 'Results'
};

/**
 * String template
 * @type {string}
 */
axsStock.SORT_ORDER_STRING = 'Column {0} sorted in {1} order.';

/**
 * Top section of the Results CNR which is dynamically generated
 * @type {string}
 */
axsStock.CNR_RES_TOP_STRING = '<cnr next="RIGHT l" prev="LEFT h">' + '\n' +

    '<target title="Go to the stock screener section" hotkey="s" ' +
        'action="CALL:axsStock.loadStockScreenerCNRAndPosition">' +
      '/html' +
    '</target>' +

    '<target title="Search company" hotkey="f" ' +
        'action="CALL:axsStock.goToRow">' +
      '/html' +
    '</target>' +

    '<target title="Search criteria" hotkey="c" ' +
        'action="CALL:axsStock.goToColumn">' +
      '/html' +
    '</target>' +

    '<target title="Search column value" hotkey="v" ' +
        'action="CALL:axsStock.goToValueInColumn">' +
      '/html' +
    '</target>' +

    '<target title="Search row value" hotkey="z" ' +
        'action="CALL:axsStock.goToValueInRow">' +
      '/html' +
    '</target>';

/**
 * Bottom section of the Results CNR which is dynamically generated
 * @type {string}
 */
axsStock.CNR_RES_BTM_STRING = '</cnr>';

/**
 * Body section of the Results CNR which is a template applied for each column
 * @type {string}
 */
axsStock.CNR_RES_STRING = '<list title="{0}" fwd="DOWN j n" back="UP k p" ' +
    '        type="dynamic">' +

    '    <item action="CALL:axsStock.readResultCellValue">' +
    '      id("searchresults")/table[@class="results innermargi' +
    'n"]//tr/td[{1}]' +
    '          [not(@class="top_row") and not(@class="bottom_ro' +
    'w")]' +
    '    </item>' +

    '    <target title="Go to section" trigger="listEntry" ' +
    '        action="CALL:axsStock.readResultCellValueListEntry' +
    '">' +
    '      id("criteria_rows")' +
    '    </target>' +

    '    <target title="Go to link" hotkey="ENTER" onEmpty="No ' +
    'link available">' +
    '      .//a' +
    '    </target>' +

    '    <target title="Next page" trigger="listTail" ' +
    '        action="CALL:axsStock.wrapAround">' +
    '      id("searchresults")//td[position() > 1]//span[@class' +
    '="navb"]/..  ' +
    '           | //div[@class="footerLinks"]' +
    '    </target>' +

    '    <target title="Previous page" trigger="listHead" ' +
    '        action="CALL:axsStock.wrapAround">' +
    '      id("searchresults")//td[1]//span[@class="navb"]/.. ' +
    '          | //div[@class="footerLinks"]' +
    '    </target>' +

    '    <target title="Reverse sorting order" hotkey="r" onEmp' +
    'ty="This column is' +
    '        not sortable" action="CALL:axsStock.clickSortLinkA' +
    'ndGoTop">' +
    '      id("searchresults")//td[{1}]/a[@class="activelink"]' +
    '    </target>' +

    '    </list>';

/**
 * CNR String for the stock screener controls section
 * @type {string}
 */
axsStock.CNR_ST_SCR_STRING = '<cnr next="RIGHT l" prev="LEFT h">' +

    '    <target title="Go to the results section" hotkey="s" ' +
    '        action="CALL:axsStock.buildAndLoadResultTableCNR">' +
    '      /html' +
    '    </target>' +

    '    <target title="Open and close criteria wizard" hotkey=' +
    '"w" ' +
    '        action="CALL:axsStock.openCloseWizard">' +
    '      id("action_links")' +
    '    </target>' +

    '    <target title="Reset to default criteria" hotkey="d">' +
    '      id("action_links")//a[not(@class)]' +
    '    </target>' +

    '    <target title="Search company" hotkey="f" ' +
    '        action="CALL:axsStock.goToRow">' +
    '      /html' +
    '    </target>' +

    '    <target title="Search criteria" hotkey="c" ' +
    '        action="CALL:axsStock.goToColumn">' +
    '      /html' +
    '    </target>' +

    '    <target title="Search column value" hotkey="v" ' +
    '        action="CALL:axsStock.goToValueInColumn">' +
    '      /html' +
    '    </target>' +

    '    <target title="Search row value" hotkey="z" ' +
    '        action="CALL:axsStock.goToValueInRow">' +
    '      /html' +
    '    </target>' +

    '    <list title="Region" next="DOWN j" prev="UP k" fwd="n"' +
    ' back="p" ' +
    '        type="dynamic">' +

    '      <item action="CALL:axsStock.readDropDownListItem">' +
    '        id("regionselect")//option' +
    '      </item>' +

    '      <target title="Focus on region" trigger="listEntry" ' +
    '          action="CALL:axsStock.focusOnDropDownList">' +
    '        id("regionselect")' +
    '      </target>' +

    '      <target title="Select region" hotkey="ENTER" ' +
    '          action="CALL:axsStock.selectDropDownListOption">' +
    '        /html' +
    '      </target>' +

    '    </list>' +

    '    <list title="Exchange" next="DOWN j" prev="UP k" fwd="' +
    'n" back="p" ' +
    '        type="dynamic">' +

    '      <item action="CALL:axsStock.readDropDownListItem">' +
    '        id("exchangeselect")//option' +
    '      </item>' +

    '      <target title="Focus on exchange" trigger="listEntry' +
    '" ' +
    '          action="CALL:axsStock.focusOnDropDownList">' +
    '        id("exchangeselect")' +
    '      </target>' +

    '      <target title="Select exchange" hotkey="ENTER" ' +
    '          action="CALL:axsStock.selectDropDownListOption">' +
    '        /html' +
    '      </target>' +

    '    </list>' +

    '    <list title="Sector" next="DOWN j" prev="UP k" fwd="n"' +
    ' back="p" ' +
    '        type="dynamic">' +

    '      <item action="CALL:axsStock.readDropDownListItem">' +
    '        id("sectorselect")//option' +
    '      </item>' +

    '      <target title="Focus on sector" trigger="listEntry" ' +
    '          action="CALL:axsStock.focusOnDropDownList">' +
    '        id("sectorselect")' +
    '      </target>' +

    '      <target title="Select sector" hotkey="ENTER" ' +
    '          action="CALL:axsStock.selectDropDownListOption">' +
    '        /html' +
    '      </target>' +

    '    </list>' +

    '    <list title="Criteria list" next="DOWN j" prev="UP k" ' +
    'fwd="n" back="p" ' +
    '        type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaDesc">' +
    '        id("criteria_rows_tbody")/tr[not(.//b)]' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.refreshStockCriteriaCNRAnd' +
    'AnnounceList">' +
    '        id("criteria_rows")' +
    '      </target>' +

    '      <target title="Delete criteria" hotkey="DEL" onEmpty' +
    '="This element is ' +
    '          not a criteria" action="CALL:axsStock.removeCri' +
    'teria">' +
    '        .//img[not(@id) and @class="activelink"]' +
    '      </target>' +

    '      <target title="Edit criteria" hotkey="ENTER" onEmpty' +
    '="This element is ' +
    '          not a criteria" action="CALL:axsStock.focusOnCri' +
    'teriaRangeInput">' +
    '        /html' +
    '      </target>' +

    '      <target title="Explain criteria" hotkey="e" onEmpty=' +
    '"This element is ' +
    '          not a criteria and has no explanation" ' +
    '          action="CALL:axsStock.readCriteriaHelp">' +
    '        .//img[@id and @class="activelink"]/..' +
    '      </target>' +

    '    </list>' +

    '    <list title="Popular criteria" next="DOWN j" prev="UP ' +
    'k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("popular")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[1]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Price criteria" next="DOWN j" prev="UP k"' +
    ' fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("price")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[2]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Volume criteria" next="DOWN j" prev="UP k' +
    '" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("volume")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[3]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Valuation criteria" next="DOWN j" prev="U' +
    'P k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("valuation")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[4]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Dividend criteria" next="DOWN j" prev="UP' +
    ' k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("dividend")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[5]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Balance sheet criteria" next="DOWN j" pre' +
    'v="UP k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("balancesheetratios")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[6]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Stock metrics criteria" next="DOWN j" pre' +
    'v="UP k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("stockmetrics")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[7]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Margins criteria" next="DOWN j" prev="UP ' +
    'k" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("margins")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[8]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '    <list title="Growth criteria" next="DOWN j" prev="UP k' +
    '" fwd="n" ' +
    '        back="p" type="dynamic">' +

    '      <item action="CALL:axsStock.readCriteriaExplanation"' +
    '>' +
    '        id("growth")//a' +
    '      </item>' +

    '      <target title="Load CNR and go to section" trigger="' +
    'listEntry" ' +
    '          action="CALL:axsStock.readCurrentCrtieriaList">' +
    '        //table[@class="searchtabs"]//tr[9]//a' +
    '      </target>' +

    '      <target title="Add selected criteria" hotkey="ENTER"' +
    ' ' +
    '          action="CALL:axsStock.addCriteria">' +
    '        id("criteria_button")/button' +
    '      </target>' +

    '    </list>' +

    '  </cnr>';

/**
 * Stores the last position in the stock screener section to which 
 * the focus should return after leaving the results section.
 * @type {Object?}
 */
axsStock.lastStockScreenerPosition = null;

/**
 * Stores the last list index to enable handling the multiple list that compose 
 * the results as a table i.e. traversal is performed column by column on the 
 * same row (i.e. the current row does not change)
 */
axsStock.previousIdx = -1;

/**
 * Stores the last visited criteria row. Needed for reseting the row to its
 * default visual representation upon leaving the criteria list.
 * @type {Object?}
 */
axsStock.lastCriteriaRow = null;

/**
 * Buffer for queuing TTS messages 
 * @type {string} 
 */
axsStock.searchSummary = '';

/**
 * Array for presenting the stock screener description
 * @type {Array}
 */
axsStock.stockScreenerDescArray = new Array('',
                                            axsStock.str.MIN,
                                            axsStock.str.MAX);

/**
 * Flag indicating completion of the initial loading of the page
 * @type {boolean} 
 */
axsStock.initialLoadComplete = false;

/**
 * Indicates which CNR file is currently loaded (criteria or results) 
 * @type {string}
 */
axsStock.currentCNRfile = '';

/**
 * Map from phrases to phrases
 */
axsStock.phrasesMap = new Object();
axsStock.phrasesMap[axsStock.str.PE_ABR] = axsStock.str.PE;
axsStock.phrasesMap[axsStock.str.FWD_PE_ABR] = axsStock.str.FWD_PE;
axsStock.phrasesMap[axsStock.str.EPS_ABR] = axsStock.str.EPS;
axsStock.phrasesMap[axsStock.str.WEEK_HIGH_ABR] = axsStock.str.WEEK_HIGH;
axsStock.phrasesMap[axsStock.str.WEEK_QC_ABR] = axsStock.str.WEEK_QC;
axsStock.phrasesMap[axsStock.str.WEEK_LOW_ABR] = axsStock.str.WEEK_LOW;
axsStock.phrasesMap[axsStock.str.WEEK_PC_ABR] = axsStock.str.WEEK_PC;
axsStock.phrasesMap[axsStock.str.FIVE_YEAR_PE_ABR] = axsStock.str.FIVE_YEAR_PE;
axsStock.phrasesMap[axsStock.str.TEN_YEAR_PE_ABR] = axsStock.str.TEN_YEAR_PE;

/**
 * Map from prefix characters to strings
 * @type {Object}
 */
axsStock.charPrefixMap = new Object();
axsStock.charPrefixMap[axsStock.str.MINUS_ABR] = axsStock.str.MINUS;
axsStock.charPrefixMap[axsStock.str.UP_ABR] = axsStock.str.UP;

/**
 * Map from suffix characters to strings
 * @type {Object}
 */
axsStock.charSuffixMap = new Object();
axsStock.charSuffixMap[axsStock.str.BILLION_ABR] = axsStock.str.BILLION;
axsStock.charSuffixMap[axsStock.str.MILLION_ABR] = axsStock.str.MILION;
axsStock.charSuffixMap[axsStock.str.PERCENT_ABR] = axsStock.str.PERCENT;

/**
 * Map from watched nodes to methods
 */
axsStock.watchedNodeToFuncMap = new Object();

/**
 * Map for flags idicating if a handler for an event has been triggered
 */
axsStock.watchedNodeFuncEnabledMap = new Object();

/**
 * These are strings to be spoken to the user
 */
axsStock.HELP = 'The following shortcut keys are available. ';

/**
 * Time out for processing events accepted by watched nodes
 */
axsStock.EVT_HANDL_TIMEOUT_INT = 100;

/**
 * Interval for polling if the results have been loaded
 */
axsStock.WAIT_RESULTS_RETRY_INTERVAL_INT = 200;

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsStock.axsJAXObj = null;

/**
 * The AxsJAX navigation object. Provides page navigation.
 * av object that will handle navigation.
 * @type AxsNav?
 */
axsStock.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsStock.axsLensObj = null;

/**
 * The power key object used for quick search
 * @type {Object?} 
 */
axsStock.pkObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsStock.magSize = 2.5;

/**
 * Time out for announcing the initial results in ms.
 * @type number
 */
axsStock.initialResultsTimeout = 4000;

/**
 * Used to determine the direction of CNR inter list traversal. Since
 * AxsJAX still does not provide a mechanism for removing and adding lists,
 * the lists unrelated to the current section are skipped iteratively. 
 * @type string?
 */
axsStock.lastListNavigationKey = null;

/**
 * Flag idicating if the criteria wizxard is open. Some CNR lists 
 * are not relevant in teh context of open wizard and vice versa.
 * @type boolean
 */
axsStock.wizardOpened = false;

/**
 * Node observed for mutation event that occurs when the results are loaded
 * @type {Object} 
 */
axsStock.watchedNodeResults = new Object();

/**
 * Node observed for mutation event that occurs when the criteria 
 * list is loaded 
 * @type {Object}
 */
axsStock.watchedNodeCritList = new Object();

/**
 * Max timeout in wiating for data loading (obtained via AJAX call)
 * @type number
 */
axsStock.waitMaxTimeout = 2000;

/**
 * Initializes the AxsJAX script for Google finance - quotes page.
 */
axsStock.init = function() {
  //Initialie the AxsJAX framework utilities
  axsStock.axsJAXObj = new AxsJAX(true);
  axsStock.axsNavObj = new AxsNav(axsStock.axsJAXObj);
  axsStock.axsLensObj = new AxsLens(axsStock.axsJAXObj);
  axsStock.axsNavObj.setLens(axsStock.axsLensObj);
  axsStock.axsLensObj.setMagnification(axsStock.magSize);

  //Add event listeners
  document.addEventListener('keypress', axsStock.keyHandler, true);
  document.addEventListener('DOMNodeRemoved',
                            axsStock.nodeInsertedOrRemovedHandler,
                            true);
  document.addEventListener('DOMNodeInserted',
                            axsStock.nodeInsertedOrRemovedHandler,
                            true);
  document.addEventListener('DOMSubtreeModified',
                            axsStock.DOMSubtreeModifiedHandler,
                            true);

  axsStock.loadStockScreenerCNR();

  //Some nodes in the page are watched for specific events
  axsStock.loadWatchedNodes();

  //Some stylesheets are modified for improving presentantion
  axsStock.customizeStyleSheets();
};

/**
 * Handler for added and removed nodes in the document. If the node,
 * source of the event, is mapped to a function, the function is
 * executed. Otherwise, no action is taken.
 * @param {Event} evt DOMNodeRemoved or DOMNodeInserted event
 */
axsStock.nodeInsertedOrRemovedHandler = function(evt) {
  var target = evt.target;
  //Add listeners to the input fields of each added criteria row (node)
  if (evt.type == 'DOMNodeInserted' && target.tagName == 'TR') {

   var minInput = target.childNodes[1].firstChild;
    minInput.addEventListener('keypress',
                               axsStock.criteriaInputKeyHandler,
                               false);

    var maxInput = target.childNodes[3].firstChild;
    maxInput.addEventListener('keypress',
                              axsStock.criteriaInputKeyHandler,
                              false);

    minInput.addEventListener('focus', axsStock.focusEventHandler, false);

    //Change inputs' titles. The screen reader will read graspable text upon TAB
    var criteria = target.childNodes[0].textContent;
    criteria = axsStock.parseSpecChrsAndTkns(criteria) + ', ';
    minInput.title = criteria + ' ' + axsStock.str.MIN;
    maxInput.title = criteria + ' ' + axsStock.str.MAX;
  }

  var watchedNode = target.parentNode;
  var functionMapping = axsStock.watchedNodeToFuncMap[watchedNode];
  if (functionMapping) {
    axsStock.executeMappedFunc(functionMapping, evt);
  }
};

/**
 * Handler for the focus event of the min edit field of the criteria.
 * Needed for avoiding reading of the first input field upon the page
 * initialziation.
 * @param {Event} evt A focus event
 */
axsStock.focusEventHandler = function(evt) {
  if (!axsStock.initialLoadComplete) {
    //Iterrupt the screen reader
    axsStock.axsJAXObj.speakTextViaNode(' ');
    axsStock.axsJAXObj.lastFocusedNode.blur();
  }
};

/**
 * Hadles the ENTER key for finalizing the query i.e. to announce the search
 * resutls.
 * NOTE: These results are updated more often than are reported
 * @param {Event} evt A keypress event
 */
axsStock.criteriaInputKeyHandler = function(evt) {
  var target = evt.currentTarget;
  if (evt.keyCode == 13) { // ENTER
      axsStock.axsJAXObj.lastFocusedNode.blur();

      //We finalize after ENTER - the application finalizes on lost fucus
      window.setTimeout(function() {
                          axsStock.searchSummary = '';
                          axsStock.generateSummary();
                          axsStock.announceSummary();
                        },
                        200);
  }
};

/**
 * Handles the DOMSubtreeModified event.
 * This event happens when the selected node for the
 * auto-complete search box changes.
 * @param {Event} evt The DOMSubtreeModified event
 */
axsStock.DOMSubtreeModifiedHandler = function(evt) {
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;
  if (target.id == 'ac-list') {
    for (var i = 0, child; child = target.childNodes[i]; i++) {
      if (child.className == 'selected') {
        axsStock.axsJAXObj.speakNode(child);
      return;
      }
    }
  }
};

/**
 * Loads the CNR for the stock screener section and moves to
 * the last postition in the list (if such exist) or to the
 * beginning of the list.
 */
axsStock.loadStockScreenerCNRAndPosition = function() {
  axsStock.loadStockScreenerCNR();

  //Go to the last position in the Stock screener CNR
  axsStock.restoreLastPosition();
};

/**
 * This mehtod idnetifies and registers nodes watched for specific events.
 * For each watched node a mapping to a hadndling function is set.
 * NOTE: In this script we observe node removal and insertion events.
 */
axsStock.loadWatchedNodes = function() {
  //Watched node for the Stock Screener section
  var axsJAXObj = axsStock.axsJAXObj;
  var xpath = 'id("criteria_rows_tbody")';
  var stockScrParents = axsJAXObj.evalXPath(xpath, document.body);

  //Listeners which should be executed upon event in intervals 
  //(after a timeout)
  axsStock.watchedNodeResults = stockScrParents[0];
  var funcMapping = function() {
                          axsStock.refreshStockCriteria();
                        };
  axsStock.watchedNodeToFuncMap[axsStock.watchedNodeResults] = funcMapping;

  //Watched node for resuts change
  xpath = 'id("searchresultssummary")';
  var summaryParents = axsJAXObj.evalXPath(xpath, document.body);
  axsStock.watchedNodeCritList = summaryParents[0];

  funcMapping = function() {
                  if (axsStock.currentCNRfile == axsStock.str.RES_CNR) {
                    axsStock.refreshAllResultLists();
                  }

                  axsStock.generateSummary();
                  /*
                   * In the page init result summary is spoken as soon as
                   * it is generated. We explicitly control when the summary
                   * is spoken.
                   */
                  if (!axsStock.initialLoadComplete) {
                    axsStock.searchSummary = axsStock.str.APP_NAME +
                        axsStock.searchSummary;
                    axsStock.announceSummary();
                    axsStock.initialLoadComplete = true;
                  }
                };
  axsStock.watchedNodeToFuncMap[axsStock.watchedNodeCritList] = funcMapping;
};

/**
 * Change some properties of the stylesheets to improve 
 * presentation for people with reduced vision.
 */
axsStock.customizeStyleSheets = function() {
  var cssRule = document.styleSheets[0].cssRules[36];
  cssRule.style.font = '30px arial';
};

/**
 * Focuses on a drop down list and skips it if the list is not
 * relevant in the current context (if the criteria wizard is open).
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.focusOnDropDownList = function(item) {
  if (axsStock.wizardOpened) {
    axsStock.skipList();
    return;
  }
  var element = item.elem;
  axsStock.axsLensObj.view(element.parentNode);
  var listTitle = element.previousSibling.textContent;
  listTitle = axsStock.normalizeString(listTitle);
  axsStock.axsJAXObj.speakTextViaNode(listTitle);
  element.scrollIntoView(true);
  axsStock.axsJAXObj.markPosition(element);
};

/**
 * Reads the values in a drop down lists (Region, Exchange, Sector)
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readDropDownListItem = function(item) {
  //If the current list is irrelevant in the wizard context - skip it
  if (axsStock.wizardOpened) {
    axsStock.skipList();
    return;
  }
  var element = item.elem;
  axsStock.axsLensObj.view(element);
  axsStock.axsJAXObj.speakNode(element);
  element.scrollIntoView(true);
  axsStock.axsJAXObj.markPosition(element);
};

/**
 * Selects an option from a drop down list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.selectDropDownListOption = function(item) {
  var option = axsStock.axsNavObj.currentItem().elem;
  option.selected = true;
  axsStock.axsLensObj.view(null);
};

/**
 * Refreshes the Stock criteria list.
 */
axsStock.refreshStockCriteria = function() {
  axsStock.axsNavObj.refreshList(axsStock.str.STOCK_SCR);
  window.setTimeout(function() {
                      var lastFocusedNode = axsStock.axsJAXObj.lastFocusedNode;
                      if (lastFocusedNode && lastFocusedNode.blur) {
                        lastFocusedNode.blur();
                      }
                    },
                    0);

  axsStock.restoreLastPosition();
};

/**
 * Adds a new selected criteria to the criteria list
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.addCriteria = function(item) {
  var element = item.elem;
  //The button is not disabled and made invisible but is moved to (0, 0)
  var text = axsStock.str.CRIT_ALREADY;
  if (element.offsetTop > 0) {
    //We want to stay in the criteria wizard
    axsStock.lastStockScreenerPosition = null;

    axsStock.axsJAXObj.clickElem(element, false);
    axsStock.axsJAXObj.speakTextViaNode('');
    text = axsStock.str.CRIT_ADDED;
  }
  axsStock.searchSummary = text + ', ' + axsStock.searchSummary;

  var func = function() {
               axsStock.axsLensObj.view(null);
               axsStock.axsJAXObj.lastFocusedNode.blur();
               axsStock.announceSummary();
             };

  axsStock.executeAfterWatchedNodeMappedFunc(axsStock.watchedNodeCritList,
                                             new Date(),
                                             func);
};

/**
 * Removes a criteria and announces the deletion
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.removeCriteria = function(item) {
  axsStock.searchSummary = '';
  axsStock.lastStockScreenerPosition = null;

  var element = item.elem;
  axsStock.axsJAXObj.clickElem(element, false);
  var criteriaName = element.parentNode.parentNode.firstChild.textContent;

  var func = function() {
               axsStock.axsLensObj.view(null);
               var text = axsStock.str.CRITERIA;
               text = text + ' ' + criteriaName;
               text = text + ' ' + axsStock.str.DELETED + '. ';
               axsStock.searchSummary = text + ' ' + axsStock.searchSummary;
               axsStock.announceSummary();
             };

  axsStock.executeAfterWatchedNodeMappedFunc(axsStock.watchedNodeCritList,
                                             new Date(),
                                             func);
};

/**
 * Reads the description of a criteria from the criteria list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readCriteriaDesc = function(item) {
   //If the current list is irrelevant in the wizard context - skip it
  if (axsStock.wizardOpened) {
    axsStock.skipList();
    return;
  }

  var element = item.elem;

  axsStock.cacheLastPosition();

  //Remove the section explaining the criteria from the view (if present)
  axsStock.axsJAXObj.clickElem(element, false);

  //Rest the the last criteria row
  axsStock.resetCriteriaRow();
  axsStock.lastCriteriaRow = element;

  var criteria = element.childNodes[0].textContent;
  criteria = axsStock.parseSpecChrsAndTkns(criteria) + ', ';
  var min = element.childNodes[1].childNodes[0].value;
  min = axsStock.parseSpecChrsAndTkns(min) + ', ';
  var max = element.childNodes[3].childNodes[0].value;
  max = axsStock.parseSpecChrsAndTkns(max) + ', ';

  var columnsText = new Array(criteria, min, max);
  var rowText = axsStock.buildTableRowText(columnsText,
      axsStock.stockScreenerDescArray);
  axsStock.speakAndGo(element.firstChild, rowText);
};

/**
 * Reads the explanation of a certain criteria.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readCriteriaExplanation = function(item) {
  if (!axsStock.wizardOpened) {
    return;
  }

  axsStock.axsLensObj.view(null);
  var element = item.elem;
  var text = '';
  var xpath = 'id("add_criteria_wizard")//td[3]';
  axsStock.axsJAXObj.clickElem(element, false);
  var descriptions = axsStock.axsJAXObj.evalXPath(xpath, document.body);
  var descriptionSection = descriptions[0];
  var definition = document.getElementById('criteria_definition').textContent;
  var statusNode = descriptionSection.childNodes[5];
  var criteriaStatus = axsStock.str.NOT_ADDED;

  if (statusNode.className.indexOf('displaynone') == -1) {
    criteriaStatus = statusNode.textContent;
  }

  text = element.textContent + ' ';
  text = text + ' ' + axsStock.str.STATUS + ' ' + criteriaStatus;
  text = text + ', ' + axsStock.str.DEFINITION + ' ' + definition;
  axsStock.axsJAXObj.speakTextViaNode(text);
  axsStock.axsLensObj.view(descriptions[0]);
};

/**
 * Moves the focus in the input fields for the currently edited criteria.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.focusOnCriteriaRangeInput = function(item) {
  var rowElement = axsStock.axsNavObj.currentItem().elem;

  //Trigger the page event hadler for mouse over a criteria row
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('mouseover',
                       false,
                       false,
                       window,
                       1,
                       0,
                       0,
                       0,
                       0,
                       false,
                       false,
                       false,
                       false,
                       0,
                       null);
  rowElement.dispatchEvent(event);

  var minInput = rowElement.childNodes[1].firstChild;

  //Remove the section explaining the criteria from the view (if present)
  axsStock.axsJAXObj.clickElem(minInput, false);
  minInput.focus();
  minInput.select();

  //TODO: Refactor tab key fix
  axsStock.axsJAXObj.tabKeyFixOn = false;
};

/**
 * Reads the current criteria list (in the criteria wizard) and skips
 * lists irrelevant in the criteria wizard context
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readCurrentCrtieriaList = function(item) {
  //Reset the last criteria row (in the criteria list) to its default state
  axsStock.resetCriteriaRow();

  //Skip and do not announce lists not accessible if the wizard is closed
  if (!axsStock.wizardOpened) {
    axsStock.skipList();
    return;
  }

  var element = item.elem;
  axsStock.axsJAXObj.clickElem(element, false);
  var listTitle = axsStock.axsNavObj.currentList().title;
  axsStock.axsJAXObj.speakTextViaNode(listTitle);
  axsStock.axsLensObj.view(element.parentNode.parentNode);
};

/**
 * Resets the last visited criteria row (if such exists) to its default
 * visual representation which is modified when the user focuses on that row.
 */
axsStock.resetCriteriaRow = function() {
  //TODO: Refactor tab key fix
  axsStock.axsJAXObj.tabKeyFixOn = true;
  if (axsStock.lastCriteriaRow !== null) {
    axsStock.simulateMouseOutEvent(axsStock.lastCriteriaRow);
  }
};

/**
 * Reads the help (explanation) description for a criteria in the criteria list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readCriteriaHelp = function(item) {
  var element = item.elem;
  var descTitleNode = element.childNodes[0];
  var linkNode = element.childNodes[1];
  axsStock.axsJAXObj.clickElem(linkNode, false);
  var xpath = '//div[@class="definition_title"]';
  var explNodes = axsStock.axsJAXObj.evalXPath(xpath, document.body);
  for (var i = 0, node; node = explNodes[i]; i++) {
    var explTitleNode = explNodes[i].firstChild;
    var descTitleText = axsStock.normalizeString(descTitleNode.textContent);
    var explTitleText = axsStock.normalizeString(explTitleNode.textContent);
    if (descTitleText == explTitleText) {
      var explTextNode = explNodes[i].nextSibling;
      axsStock.axsJAXObj.speakTextViaNode(explTextNode.textContent);
      break;
    }
  }
};

/**
 * Refreshes the stock criteria list and announces its title.
 */
axsStock.refreshStockCriteriaCNRAndAnnounceList = function() {
  //Rest the the last criteria row - current row in the criteria list
  axsStock.resetCriteriaRow();

  //If the current list is irrelevant in the wizard context - skip it
  if (axsStock.wizardOpened) {
    axsStock.skipList();
    return;
  }

  var listTitle = axsStock.axsNavObj.currentList().title;
  axsStock.axsJAXObj.speakTextViaNode(listTitle);
  var xpath = 'id("criteria_rows_tbody")/tr[1]/td[1]';
  var critHeaders = axsStock.axsJAXObj.evalXPath(xpath, document.body);
  var critHeader = critHeaders[0];
  axsStock.axsLensObj.view(critHeader);
  critHeader.scrollIntoView(true);
  axsStock.axsJAXObj.markPosition(critHeader);
};

/**
 * Loads the CNR for the stock screener
 */
axsStock.loadStockScreenerCNR = function() {
  axsStock.currentCNRfile = axsStock.str.ST_SCR_CNR;
  axsStock.axsNavObj.navInit(axsStock.CNR_ST_SCR_STRING, null);
};

/**
 * Generates a summary of the search results.
 */
axsStock.generateSummary = function() {
  var axsJAXObj = axsStock.axsJAXObj;
  var xPath = 'id("searchresultssummary")';
  var summaryParents = axsJAXObj.evalXPath(xPath, document.body);
  var suffix = '';
  var summaryResult = summaryParents[0].childNodes[5];
  if (summaryResult == undefined) {
    summaryResult = summaryParents[0].childNodes[0];
  } else {
    suffix = axsStock.str.COMPANIES_FOUND + ', ';
    suffix = suffix + ' ' + axsStock.str.RESULTS_FROM;
    suffix = suffix + ' ' + summaryParents[0].childNodes[1].textContent;
    suffix = suffix + ' ' + axsStock.str.TO;
    suffix = suffix + ' ' + summaryParents[0].childNodes[3].textContent;
  }

  var text = summaryResult.textContent;
  text = axsStock.normalizeString(text + ' ' + suffix);
  axsStock.searchSummary = text + ', ' + axsStock.searchSummary;
};

/**
 * Reads the search summary message
 */
axsStock.announceSummary = function() {
  axsStock.axsJAXObj.speakTextViaNode(axsStock.searchSummary);
  axsStock.searchSummary = '';
};

/**
 * Executes a function mapped to a watched node. Since some events are generated
 * too frequently, taking actions on each occurence may cause significant
 * overhed. The method is setting a triggered flag after an execution of
 * the function is requested. The flag is cleared upon a certain timeout and
 * execution of the mapped function. During the timeout no further
 * execution requests for the same function are accepted.
 * @param {Function} handlingFunction The function to execute .
 * @param {Event} evt Event to be propageted to the handlingFunction.
 */
axsStock.executeMappedFunc = function(handlingFunction, evt) {
  var funcString = handlingFunction.toString();
  if (axsStock.watchedNodeFuncEnabledMap[funcString]) {
    return;
  }
  axsStock.watchedNodeFuncEnabledMap[funcString] = true;
  var delegatingFunction = function() {
    handlingFunction(evt);
    axsStock.watchedNodeFuncEnabledMap[funcString] = false;
  };
  window.setTimeout(delegatingFunction, axsStock.EVT_HANDL_TIMEOUT_INT);
};

/**
 * Executes a function after the function mapped to a watched node
 * has been executed.
 * @param {Object} node The watched DOM node.
 * @param {Date} time The time of the function call.
 * @param {Function} func The function to be executed.
 * NOTE: Passing the current time is necessary to avoid infinite looping.
 * due to incomplete execution of the function mapped to the watched node.
 */
axsStock.executeAfterWatchedNodeMappedFunc = function(node, time, func) {
  var mappedFunc = axsStock.watchedNodeToFuncMap[node];
  var completed = axsStock.watchedNodeFuncEnabledMap[mappedFunc.toString()];

  if ((completed === undefined || !completed) &&
      (new Date() - time <= axsStock.waitMaxTimeout)) {
    var selfFunc = function(){
          axsStock.executeAfterWatchedNodeMappedFunc(node, time, func);
        };
    window.setTimeout(selfFunc, axsStock.WAIT_RESULTS_RETRY_INTERVAL_INT);
  } else {
    window.setTimeout(func, 0);
  }
};

/**
 * Opens and closes the criteria wizard.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.openCloseWizard = function(item) {
  var element = item.elem;
  var visible = false;
  var text = axsStock.str.WIZ_OP_MSG;
  var xPath = 'id("action_links")/a[@class="activelink"]';
  axsStock.wizardOpened = true;

  if (element.style.display == 'none') {
     xPath = 'id("add_criteria_wizard")/div/a[1]';
     text = axsStock.str.WIZ_CL_MSG;
     axsStock.wizardOpened = false;
  }

  var links = axsStock.axsJAXObj.evalXPath(xPath, document.body);
  axsStock.axsJAXObj.clickElem(links[0], false);
  axsStock.axsJAXObj.speakTextViaNode(text);
  axsStock.axsLensObj.view(null);
};

/**
 * Builds dynamically a CNR for the result section. Each column is a list
 * and the order of criteria in the Stock criteria section detemines
 * (potentially changes) the order of columns in the result table.
 * @param {boolean} opt_readFirstResult If the first result in the table
 * should be read. If the paremeter is ommited the default behavior is
 * reading the first result.
 */
axsStock.buildAndLoadResultTableCNR = function(opt_readFirstResult) {
  axsStock.currentCNRfile = axsStock.str.RES_CNR;

  //Remeber the last position in the CNR before switching it
  axsStock.cacheLastPosition();

  //Build dynamically the CNR file
  var xpath = 'id("searchresults")/table/tbody';
  var tables = axsStock.axsJAXObj.evalXPath(xpath, document.body);
  
  if (tables[0] === undefined) {
  	return;
  }
  
  var topRow = tables[0].childNodes[0];
  var columns = topRow.childNodes;
  var cnrString = axsStock.CNR_RES_TOP_STRING;

  for (var i = 0, column; column = columns[i]; i++) {
    var columnCaption = axsStock.normalizeString(column.textContent);
    if (i == 1) {
       columnCaption = axsStock.addSpaceBetweenChars(columnCaption);
     }
     if (columnCaption.length > 0) {
      var values = new Array(column.textContent, i + 1);
      var filledTmpl;
      filledTmpl = axsStock.populateTemplate(axsStock.CNR_RES_STRING, values);
      cnrString = cnrString + filledTmpl;
     }
  }

  cnrString = cnrString + axsStock.CNR_RES_BTM_STRING;
  axsStock.axsNavObj.navInit(cnrString, null);

  if (opt_readFirstResult === undefined || opt_readFirstResult) {
    axsStock.readResultCellValue(axsStock.axsNavObj.nextItem());
  }
};

/**
 * Focuses on and reads the appropriate entry in the results table. Since each
 * columns is managesd as a list changing columns should keep the user
 * on the same row.
 */
axsStock.readResultCellValueListEntry = function() {
  //Rest the the last criteria row
  axsStock.resetCriteriaRow();

  //Lists are parallel and switching them should keep the current row
  var navListIdx = axsStock.axsNavObj.navListIdx;
  if (axsStock.previousIdx > -1) {
    axsStock.axsNavObj.navItemIdxs[navListIdx] = axsStock.previousIdx;
  }

  var element = axsStock.axsNavObj.currentItem().elem;
  var text = '';
  var columnValue = axsStock.getCellValue(element);
  var title = axsStock.axsNavObj.navArray[navListIdx].title;
  title = axsStock.parseSpecChrsAndTkns(title);
  text = title + ' ' + columnValue;
  axsStock.speakAndGo(element, text);
};

/**
 * Reads the value for a certain criteria from the results table.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.readResultCellValue = function(item) {
  var element = item.elem;
  var company = element.parentNode.childNodes[0].textContent;
  company = axsStock.normalizeString(company);
  var text = company;

  if (element != element.parentNode.childNodes[0]) {
    var columnValue = axsStock.getCellValue(element);
    text = text + ', ' + columnValue;
  }

  //Lists are parallel and switching them should keep the current row
  var navListIdx = axsStock.axsNavObj.navListIdx;
  axsStock.previousIdx = axsStock.axsNavObj.navItemIdxs[navListIdx];
  axsStock.speakAndGo(item.elem, text);
};

/**
 * Returns the current value in a table cell.
 * @param {Object} tdElement A DOM node object representing the table cell.
 * @return {string} The value of the table cell.
 */
axsStock.getCellValue = function(tdElement) {
  var columnValue = tdElement.textContent;
  if (tdElement == tdElement.parentNode.childNodes[1]) {
    columnValue = axsStock.addSpaceBetweenChars(columnValue);
  } else if (tdElement == tdElement.parentNode.childNodes[0]) {
    columnValue = axsStock.normalizeString(columnValue);
  } else {
    columnValue = axsStock.parseSpecChrsAndTkns(columnValue);
  }
  return columnValue;
};

/**
 * Clicks on the link for sorting the current column and positions at the 
 * top of the results list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.clickSortLinkAndGoTop = function(item) {
  var element = item.elem;
  axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx] = 0;
  axsStock.axsJAXObj.clickElem(element, false);

  //Wait until the new data is loaded
  var func = function() {
               //The result table is replaced => need locate the node
               var id = element.previousSibling.previousSibling.id;
               var sortImage = document.getElementById(id);
               var sortOrder = '';
               if (sortImage.src.indexOf('up') > -1) {
                 sortOrder = axsStock.str.ASCENDING;
               } else {
                 sortOrder = axsStock.str.DESCENDING;
               }

               var templateParameters = new Array(element.textContent,
                                                  sortOrder);
               var template = axsStock.SORT_ORDER_STRING;
               var text = axsStock.populateTemplate(template,
                                                    templateParameters);

               axsStock.searchSummary = text + ' ' + axsStock.searchSummary;
               axsStock.announceSummary();
             };

  axsStock.executeAfterWatchedNodeMappedFunc(axsStock.watchedNodeResults,
                                             new Date(),
                                             func);
};

/**
 * Positions the focus on the row with company name found by PowerKey.
 * We treat the company name as a row title.
 * NOTE: The column in which the user is does not change.
 */
axsStock.goToRow = function() {
  if (axsStock.currentCNRfile == axsStock.str.ST_SCR_CNR) {
    axsStock.buildAndLoadResultTableCNR(false);
  }
  var items = axsStock.axsNavObj.navArray[0].items;
  var elementNames = new Array();
  for (var i = 0, item; item = items[i]; i++) {
    elementNames[i] = item.elem.textContent;
  }
  axsStock.goToItem(axsStock.pkVerticalSearchHandler, elementNames);
};

/**
 * Positions the focus on the column with criteria name found by PowerKey.
 * We use the table column names.
 * NOTE: The row in which the user is does not change.
 */
axsStock.goToColumn = function() {
  if (axsStock.currentCNRfile == axsStock.str.ST_SCR_CNR) {
    axsStock.buildAndLoadResultTableCNR(false);
    //Initialize to the first item in the list
    axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx] = 0;
  }
  var xpath = 'id("searchresults")//tr[1]/td[@class="top_row"]';
  var elements = axsStock.axsJAXObj.evalXPath(xpath, document.body);
  var elementNames = new Array();
  for (var i = 0, element; element = elements[i]; i++) {
    elementNames[i] = element.textContent;
  }
  axsStock.goToItem(axsStock.pkHorizontalSearchHandler, elementNames);
};

/**
 * Positions the focus on a column cell with value found by PowerKey.
 * NOTE: The column in which the user is does not change.
 */
axsStock.goToValueInColumn = function() {
  if (axsStock.currentCNRfile == axsStock.str.ST_SCR_CNR) {
    axsStock.buildAndLoadResultTableCNR(false);
  }
  var items = axsStock.axsNavObj.currentList().items;
  var elementNames = new Array();
  for (var i = 0, item; item = items[i]; i++) {
    elementNames[i] = item.elem.textContent;
  }
  axsStock.goToItem(axsStock.pkVerticalSearchHandler, elementNames);
};

/**
 * Positions the focus on a row cell with value found by PowerKey.
 * NOTE: The row in which the user is does not change.
 */
axsStock.goToValueInRow = function() {
  if (axsStock.currentCNRfile == axsStock.str.ST_SCR_CNR) {
    axsStock.buildAndLoadResultTableCNR(false);
    axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx] = 0;
  }
  var rowIndex = axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx];
  var elementNames = new Array();
  for (var i = 0, list; list = axsStock.axsNavObj.navArray[i]; i++) {
    elementNames[i] = list.items[rowIndex].elem.textContent;
  }
  axsStock.goToItem(axsStock.pkHorizontalSearchHandler, elementNames);
};

/**
 * Enables PowerKey search from element names and in case of a successful
 * search delegates to a handler.
 * @param {Object} handler Hadler to process the found element.
 * @param {Array} elementNames The array of names searched by PowerKey.
 */
axsStock.goToItem = function(handler, elementNames) {
  //Initialize
  axsStock.pkObj = new PowerKey('list', axsStock.axsJAXObj);
  var body = axsStock.axsJAXObj.getActiveDocument().body;
  axsStock.pkObj.createCompletionField(body,
                                       30,
                                       handler,
                                       null,
                                       elementNames,
                                       false);
  axsStock.pkObj.setAutoHideCompletionField(true);
  PowerKey.setDefaultCSSStyle();
  axsStock.pkObj.updateCompletionField('visible', true, 40, 20);
};

/**
 * Positions the user in a result table column with index found by PowerKey
 * and at the same time keeps the current row.
 * @param {string} command A command mapped to the found element.
 * @param {number} index The array index of the found element.
 * @param {number} id The command id.
 * @param {Array} args The command arguments.
 */
axsStock.pkHorizontalSearchHandler = function(command, index, id, args) {
  axsStock.axsNavObj.lastItem = null;
  var itemIndex = axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx];
  axsStock.axsNavObj.navListIdx = index;
  axsStock.axsNavObj.navItemIdxs[index] = itemIndex;

  var item = axsStock.axsNavObj.currentItem();
  axsStock.axsNavObj.actOnItem(item);

  axsStock.pkObj.updateCompletionField('hidden', true, 40, 20);
};

/**
 * Positions the user in a row cell that contains value that found
 * during the power key search. (i.e. search by column value)
 * @param {string} command A command mapped to the found element.
 * @param {number} index The array index of the found element.
 * @param {number} id The command id.
 * @param {Array} args The command arguments.
 */
axsStock.pkVerticalSearchHandler = function(command, index, id, args) {
  axsStock.axsNavObj.lastItem = null;
  axsStock.axsNavObj.navItemIdxs[axsStock.axsNavObj.navListIdx] = index;

  var item = axsStock.axsNavObj.currentItem();
  axsStock.axsNavObj.actOnItem(item);

  axsStock.pkObj.updateCompletionField('hidden', true, 40, 20);
};

/**
 * Refreshes all lists in the CNR. Such an action is required upon
 * a dynamic change in the data presented by these lists.
 */
axsStock.refreshAllResultLists = function() {
  var navArray = axsStock.axsNavObj.navArray;
  for (var i = 0, list; list = navArray[i]; i++) {
    axsStock.axsNavObj.refreshList(list.title);
  }
};

/**
 * Wraps around an item list traversed with the fwd and back keys
 * @param {Object} item A wrapper for the current DOM node.
 */
axsStock.wrapAround = function(item) {
  var element = item.elem;
  if (element.tagName == 'A') {
    axsStock.axsJAXObj.clickElem(element, false);
  } else {
    item = axsStock.axsNavObj.currentItem();
    axsStock.axsNavObj.actOnItem(item);
  }
};

/**
 * Skips a list and goes to the next or previous one depending
 * on the last inter list navigation key which was pressed.
 */
axsStock.skipList = function() {
  if (axsStock.lastListNavigationKey === null){
    return;
  }
  var key = axsStock.lastListNavigationKey.charCodeAt(0);
  var method = axsStock.axsNavObj.topCharCodeMap[key];
  method();
};

/**
 * Caches the last position in the Stock screener section.
 */
axsStock.cacheLastPosition = function() {
  var listIndex = axsStock.axsNavObj.navListIdx;
  var itemIndex = axsStock.axsNavObj.navItemIdxs[listIndex];
  var lastPosition = new Object();
  lastPosition.listIndex = listIndex;
  lastPosition.itemIndex = itemIndex;
  axsStock.lastStockScreenerPosition = lastPosition;
};

/**
 * Restores the last position in the Stock screener section.
 */
axsStock.restoreLastPosition = function() {
  if (axsStock.lastStockScreenerPosition === null) {
    return;
  }

  var listIndex = axsStock.lastStockScreenerPosition.listIndex;
  var itemIndex = axsStock.lastStockScreenerPosition.itemIndex;

  axsStock.axsNavObj.lastItem = null;
  axsStock.axsNavObj.navListIdx = listIndex;
  axsStock.axsNavObj.navItemIdxs[listIndex] = itemIndex;

  var item = axsStock.axsNavObj.currentItem();
  if (item !== undefined) {
    axsStock.axsNavObj.actOnItem(item);
  } else {
    var currentList = axsStock.axsNavObj.navArray[listIndex];
    axsStock.axsNavObj.actOnTarget(currentList.entryTarget);
  }
};

/**
 * Populates a template replacing specail tokes (like {i} where is is an index)
 * with concrete values.
 * @param {string} template The template string to populate
 * @param {Array} values The array with replacement (concrete) values
 * @return {string} The string generated from populating the template
 */
axsStock.populateTemplate = function(template, values) {
  var populated = new String(template);
  for (var i = 0, value; i < values.length; i++) {
    var regExp = new RegExp('\{(' + i + ')\}', 'g');
    populated = populated.replace(regExp, values[i]);
  }
  return populated;
};

/**
 * Simulates a mouse out event.
 * @param {Object} targetNode The DOM node which is the target (source)
 * of the event.
 */
axsStock.simulateMouseOutEvent = function(targetNode) {
  var event = document.createEvent('MouseEvents');
  event.initMouseEvent('mouseout',
                        false,
                        false,
                        window,
                        1,
                        0,
                        0,
                        0,
                        0,
                        false,
                        false,
                        false,
                        false,
                        0,
                        null);
  targetNode.dispatchEvent(event);
};

/**
 * Adds white spaces beteen the characters of a string
 * @param {string} text The processed text.
 * @return {string} The processed text with white spaces added between its
 * characters.
 */
axsStock.addSpaceBetweenChars = function(text) {
  var textWithSpaces = '';
  for (var i = 0; i < text.length; i++) {
    textWithSpaces = textWithSpaces + text.charAt(i);
    if (i < text.length - 1) {
      textWithSpaces = textWithSpaces + ' ';
    }
  }
  return textWithSpaces;
};

/**
 * Speaks a text and positions the screen to an element.
 * @param {Node} element DOM node
 * @param {string} text The text to be spoken.
 * characters.
 */
axsStock.speakAndGo = function(element, text) {
  axsStock.axsLensObj.view(element);
  axsStock.axsJAXObj.speakTextViaNode(text);
  element.scrollIntoView(true);
  axsStock.axsJAXObj.markPosition(element);
};

/**
 * Builds a sentence for presenting (speaking) a table row. The sentence is
 * built by alternating a phrase and a column content.
 * @param {Array?} textContents Array with the contents of table columns.
 * @param {Array} columnDesc Array of phrases to be added between the
 * column values.
 * @return {string} The assembled sentence.
 */
axsStock.buildTableRowText = function(textContents, columnDesc) {
  //check inputs
  if (textContents === null) {
    return '';
  }

  //assemble text
  var rowText = '';
  for (var i = 0, textContent; textContent = textContents[i]; i++) {
    if (i < columnDesc.length) {
      rowText = rowText + ' ' + columnDesc[i];
    }
    rowText = rowText + ' ' + textContents[i];
  }
  if (i < columnDesc.length) {
    rowText = rowText + ' ' + columnDesc[i];
  }
  return rowText;
};

/**
 * Replaces phrases (i.e. the entire text), tokens (i.e. words), and symbols
 * (i.e. characters) of the processed text with predefined values (mappings).
 * built by alternating a phrase and a column content.
 * @param {string} text The text to be processed
 * @return {string} The text with replaced phrases/tokens/symbols.
 */
axsStock.parseSpecChrsAndTkns = function(text) {
  var parsedText = '';

  //check input
  if (text === '') {
    return text;
  }

  //remove leading and trailing spaces
  text = axsStock.normalizeString(text);

  //check for phrase word mapping
  var phraseMapping = axsStock.phrasesMap[text];
  if (phraseMapping != undefined) {
    return phraseMapping;
  }

  //process every word separately
  var tokens = text.split(' ');
  for (var i = 0, t; t = tokens[i]; i++) {
    var token = tokens[i];

    //check for whole word mapping
    var tokenMapping = axsStock.phrasesMap[token];
    if (tokenMapping != undefined) {
      token = tokenMapping;
    } else {

      //remove brackets
      if (token.length > 0 && token.charAt(0) === '(') {
          token = token.substring(1);
      }
      if (token.length > 1 && token.charAt(token.length - 1) === ')') {
        token = token.substring(0, token.length - 1);
      }

      //parse the first character
      var prefixMapping = axsStock.charPrefixMap[token.charAt(0)];
      if (prefixMapping != undefined) {
        token = prefixMapping + ' ' + token.substring(1);
      }

      //parse the last character
      var lastCharacter = token.charAt(token.length - 1);
      var suffixMapping = axsStock.charSuffixMap[lastCharacter];
      if (suffixMapping != undefined) {
        token = token.substring(0, token.length - 1) + ' ' + suffixMapping;
      }
    }
    parsedText = parsedText + ' ' + token;
  }
  return parsedText;
};

/**
 * Normalizes a string to enable correct presentation (i.e. speaking). All
 * leading and trailing spaces are truncated, all types of white space
 * characters are rplaced by ' ', and all carriage returns ('\r') and line
 * feeds(\n) are removed.
 * @param {string} text The text to be normalized.
 * @return {string} The normalized version of the text
 */
axsStock.normalizeString = function(text) {
  //remove leading and trailing spaces
  text = text.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
  //replace fancy space characters with normal space (code 32)
  text = text.replace(/\s+/g, ' ');
  //remove carriage return and new line characters
  return text.replace(/\n+/g, '').replace(/\r+/g, '');
};

/**
 * Handler for key events. 'ESC' unfocuses the current focused element and
 * 'q' reads (speaks) the current quote.
 * @param {Event} evt A keypress event
 * @return {boolean} If true, the event should be propagated.
 */
axsStock.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT.
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27) { // ESC
    axsStock.axsJAXObj.lastFocusedNode.blur();
    return false;
  } else if ((evt.charCode == 104) || (evt.charCode == 108)) { //h or l
    axsStock.lastListNavigationKey = String.fromCharCode(evt.charCode);
  }
  if (axsStock.axsJAXObj.inputFocused) {
    return true;
  }
  var command = axsStock.charCodeMap[evt.charCode];

  if (command) {
    return command();
  }
  return true;
};

/**
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate 
 *                   that the keycode has been handled.
 */
axsStock.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
 47 : function() {
       document.getElementById('searchbox').focus();
       document.getElementById('searchbox').select();
       return false;
     },
  // ? (question mark)
  63 : function() {
       var helpStr = axsStock.HELP + axsStock.axsNavObj.localHelpString() +
                     axsStock.axsNavObj.globalHelpString();
       axsStock.axsJAXObj.speakTextViaNode(helpStr);
       return false;
    }
};

//Run the initialization routine of the script
axsStock.init();


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

//javascript/axsjax/finance/axsEnableFinanceQuotes.js
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
 * @fileoverview AxsJAX script intended to enhance accessibility of the Quotes
 * page of Google Finance.
 * 
 * @author svetoslavganov@google.com (Svetoslav R. Ganov)
 */

// create namespace
var axsQuotes = {};

/**
 * Help string to be spoken to the user
 * @type string
 */
axsQuotes.HELP = 'The following shortcut keys are available. ';

/**
 * Strings for enhancing the presentation
 */
axsQuotes.str = {
  BIO : 'Bio',
  GT : '>',
  OR : ' or ',
  STATUS : '. Status',
  PRICE : ' Price ',
  DATE : ' Date ',
  UP : ' up by ',
  UP_ABBR : '+',
  DOWN : ' down by ',
  DOWN_ABBR : '-',
  PRCNT : ' percent',
  PRCNT_ABBR : '%',
  MLN : ' million',
  MLN_ABBR : 'M',
  BLN : ' billion',
  BLN_ABBR : 'B',
  EXCHANGE : '. Traded on ',
  SYMBOL : '. Symbol ',
  LAST_TRADE : '.  Last trade ',
  CHANGE : ' Change ',
  MKT_CAP : '. Market cap ',
  DELAY : ' Note that the last trade is delayed ' +
    'up to 20 minutes. ',
  USD : ' US dollars. ',
  TTM : 'TTM',
  TTM_SPACES : 'T T M',

//Strings for stock excahnges
  NYSE : 'New York Stock Exchange',
  NYSE_ABBR : 'NYSE',
  NASDAQ : 'NASDAQ Stock Market',
  NASDAQ_ABBR : 'NASDAQ',
  LON : 'London Stock Exchange',
  LON_ABBR : 'LON',
  OTC : 'Over the counter',
  OTC_ABBR : 'OTC',
  AMEX : 'American Stock Exchange',
  AMEX_ABBR : 'AMEX',
  EPA : 'Euronext Paris Stock Exchange',
  EPA_ABBR : 'EPA',
  ASX : 'Australian Securities Exchange',
  ASX_ABBR : 'ASX',

//Strings for market data
  MKT_CAP : 'Market cap',
  MKT_CAP_ABBR : 'Mkt Cap:',
  P_E : 'Price earnings ratio',
  P_E_ABBR : 'P/E:',
  F_P_E : 'Forward price to earnings ratio',
  F_P_E_ABBR : 'F P/E:',
  VOL : 'Volume',
  VOL_ABBR : 'Vol:',
  WEEKS : 'Fifty two week',
  WEEKS_ABBR : '52Wk',
  AVG_VOL : 'Average volume',
  AVG_ABR_VOL : 'Avg Vol:',
  NA_ABBR : '-',
  NA : 'Not available',
  INST_OWN : 'Institutional Ownership',
  INST_OWN_ABBR : 'Inst. Own:',
  EPS : 'E P S',
  EPS_ABBR : 'EPS:'
};

/**
 * XPath for retrieving the current quote
 * @type string
 */
axsQuotes.QUOTE_XPATH = "id('md')//span[@class='pr']/..";

/**
 * Array for building a sentence for the Data description section
 * @type Array
 */
axsQuotes.marketDataDescArray = new Array(axsQuotes.str.PRICE,
                                          axsQuotes.str.CHANGE,
                                          axsQuotes.str.OR,
                                          axsQuotes.str.DATE);
/**
 * Array for building a sentence for the Related companies section  
 * @type Array
 */
axsQuotes.relatedCompaniesDescArray = new Array('',
                                                axsQuotes.str.EXCHANGE,
                                                axsQuotes.str.SYMBOL,
                                                axsQuotes.str.LAST_TRADE,
                                                axsQuotes.str.CHANGE,
                                                axsQuotes.str.OR,
                                                axsQuotes.str.MKT_CAP,
                                                axsQuotes.str.USD);
/**
 * Array for building a sentence for the Financials section
 * @type Array
 */
axsQuotes.financialsDescArray = new Array();

/**
 * Array for building a sentence for the Ratios and Stats section
 * @type Array
 */
axsQuotes.ratAndStatDescArray = new Array();

/**
 * Map from abbreviated phrases to expanded phrases
 */
axsQuotes.phrasesMap = new Object();
axsQuotes.phrasesMap[axsQuotes.str.TTM] = axsQuotes.str.WEEKS;
axsQuotes.phrasesMap[axsQuotes.str.NYSE_ABBR] = axsQuotes.str.NYSE;
axsQuotes.phrasesMap[axsQuotes.str.NASDAQ_ABBR] = axsQuotes.str.NASDAQ;
axsQuotes.phrasesMap[axsQuotes.str.LON_ABBR] = axsQuotes.str.LON;
axsQuotes.phrasesMap[axsQuotes.str.OTC_ABBR] = axsQuotes.str.OTC;
axsQuotes.phrasesMap[axsQuotes.str.AMEX_ABBR] = axsQuotes.str.AMEX;
axsQuotes.phrasesMap[axsQuotes.str.EPA_ABBR] = axsQuotes.str.EPA;
axsQuotes.phrasesMap[axsQuotes.str.ASX_ABBR] = axsQuotes.str.ASX;
axsQuotes.phrasesMap[axsQuotes.str.MKT_CAP_ABBR] = axsQuotes.str.MKT_CAP;
axsQuotes.phrasesMap[axsQuotes.str.WEEKS_ABBR] = axsQuotes.str.WEEKS;
axsQuotes.phrasesMap[axsQuotes.str.NA_ABBR] = axsQuotes.str.NA;
axsQuotes.phrasesMap[axsQuotes.str.P_E_ABBR] = axsQuotes.str.P_E;
axsQuotes.phrasesMap[axsQuotes.str.F_P_E_ABBR] = axsQuotes.str.F_P_E;
axsQuotes.phrasesMap[axsQuotes.str.VOL_ABBR] = axsQuotes.str.VOL;
axsQuotes.phrasesMap[axsQuotes.str.AVG_VOL_ABBR] = axsQuotes.str.AVG_VOL;
axsQuotes.phrasesMap[axsQuotes.str.INST_OWN_ABBR] = axsQuotes.INST_OWN;
axsQuotes.phrasesMap[axsQuotes.str.EPS_ABBR] = axsQuotes.str.EPS;

/**
 * Map from prefix characters to strings 
 */
axsQuotes.charPrefixMap = new Object();
axsQuotes.charPrefixMap[axsQuotes.str.DOWN_ABBR] = axsQuotes.str.DOWN;
axsQuotes.charPrefixMap[axsQuotes.str.UP_ABBR] = axsQuotes.str.UP;

/**
 * Map from suffix characters to strings 
 */
axsQuotes.charSuffixMap = new Object();
axsQuotes.charSuffixMap[axsQuotes.str.BLN_ABBR] = axsQuotes.str.BLN;
axsQuotes.charSuffixMap[axsQuotes.str.MLN_ABBR] = axsQuotes.str.MLN;
axsQuotes.charSuffixMap[axsQuotes.str.PRCNT_ABBR] = axsQuotes.str.PRCNT;

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsQuotes.axsJAXObj = null;

/**
 * The AxsJAX navigation object. Provides page navigation.
 * av object that will handle navigation.
 * @type AxsNav?
 */
axsQuotes.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsQuotes.axsLensObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsQuotes.magSize = 2.5;

/**
 * Flag indicating if the page is initialized
 * @type boolean
 */
axsQuotes.searchBoxFocusEnabled = false;

/**
 * Initializes the AxsJAX script for Google finance - quotes page.
 */
axsQuotes.init = function(){
  axsQuotes.axsJAXObj = new AxsJAX(true);
  axsQuotes.axsNavObj = new AxsNav(axsQuotes.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsQuotes.keyHandler, true);
  document.addEventListener('DOMSubtreeModified',
                            axsQuotes.DOMSubtreeModifiedHandler,
                            true);

  //Content navigation rule is hardcoded for efficiency
  var cnrString = '<cnr next="RIGHT l" prev="LEFT h">' +
                  '  <target title="Stock screener" hotkey="s">' +
                  '    //a[@href="/finance/stockscreener"]' +
                  '  </target>' +
                  '  <list title="Market data" next="DOWN j" prev="UP k" fwd=' +
                  '"n" back="p">' +
                  '    <item action="CALL:axsQuotes.readCurrentQuote">' +
                  '      id("md")//span[@class="pr"]/..' +
                  '    </item>' +
                  '    <item action="CALL:axsQuotes.readMarketDataRow">' +
                  '      id("md")//tr' +
                  '    </item>' +
                  '    <item action="CALL:axsQuotes.readAfterHours">' +
                  '      id("md")//tr//nobr' +
                  '    </item>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("companyheader")' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="News" next="DOWN j" prev="UP k" fwd="n" bac' +
                  'k="p">' +
                  '    <item action="CALL:axsQuotes.readNewsDesc">' +
                  '      id("newsmovingdiv")//div[@class="inner"]//tbody' +
                  '    </item>' +
                  '    <item>' +
                  '      id("older_news_link")//following-sibling::a[not(./im' +
                  'g)]' +
                  '    </item>' +
                  '    <target title="Go to link" hotkey="ENTER">' +
                  '      .//ancestor-or-self::a' +
                  '    </target>' +
                  '    <target title="Related articles" hotkey="r" onEmpty="N' +
                  'o related ' +
                  '        articles available">' +
                  '      .//a[@class="g bld" or @class="rl" or @class="rg"]' +
                  '    </target>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("companyheader")' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="Related companies" next="DOWN j" prev="UP k' +
                  '" fwd="n" ' +
                  '      back="p">' +
                  '    <item action="CALL:axsQuotes.readRelCompDesc">' +
                  '      id("related")//tbody//tr' +
                  '    </item>' +
                  '    <target title="Go to link" hotkey="ENTER">' +
                  '       .//a' +
                  '    </target>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("related")/div[@class="hdg"]' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="Discussions" next="DOWN j" prev="UP k" fwd=' +
                  '"n" back="p">' +
                  '    <item>' +
                  '      id("groups")//div[@class="item"]' +
                  '    </item>' +
                  '    <target title="Go to link" hotkey="ENTER">' +
                  '      .//a' +
                  '    </target>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("groups")/div[@class="hdg"]' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="Blog posts" next="DOWN j" prev="UP k" fwd="' +
                  'n" back="p">' +
                  '    <item>' +
                  '      id("blogs")//div[@class="item"]' +
                  '    </item>' +
                  '    <target title="Go to link" hotkey="ENTER" onEmpty="No ' +
                  'link available.">' +
                  '      .//a' +
                  '    </target>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("blogs")/div[@class="hdg"]' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="Events" next="DOWN j" prev="UP k" fwd="n" b' +
                  'ack="p">' +
                  '    <item action="CALL:axsQuotes.readEventsDesc">' +
                  '      id("events")//tr' +
                  '    </item>' +
                  '    <item>' +
                  '      id("events")/following-sibling::*//a' +
                  '    </item>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("blogs")/following-sibling::div[@class="content"]' +
                  '/div[@class="hdg"]' +
                  '    </target>' +
                  '    <target title="Go to link" hotkey="ENTER" onEmpty="No ' +
                  'link available.">' +
                  '      .//descendant-or-self::a' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="Summary" next="DOWN j" prev="UP k" fwd="n" ' +
                  'back="p">' +
                  '    <item action="CALL:axsQuotes.readSummaryTextCompDesc">' +
                  '      id("summary")//div[@class="item companySummary"]' +
                  '    </item>' +
                  '    <item>' +
                  '      id("summary")//div[@class="content"]//td[1]' +
                  '    </item>' +
                  '    <item action="CALL:axsQuotes.readSummarylinksCompDesc"' +
                  '>' +
                  '      id("summary")//div[@class="content"]//a[contains(@id' +
                  ',"fs-")]' +
                  '    </item>' +
                  '    <target title="Go to link" hotkey="ENTER" onEmpty="No ' +
                  'link available.">' +
                  '      .//descendant-or-self::a' +
                  '    </target>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("summary")/div[@class="hdg"]' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="Income statement in millions of US dollars"' +
                  ' next="DOWN j" ' +
                  '      prev="UP k" fwd="n" back="p">' +
                  '    <item index="1" count="4" action="CALL:axsQuotes.readF' +
                  'inancialCompDesc">' +
                  '      id("fd")//tr' +
                  '    </item>' +
                  '    <target title="Income statement section" trigger="list' +
                  'Entry">' +
                  '      id("fd")//tr[1]//td[1]axsQuotes.str.BIO' +
                  '    </target>' +
                  '    <target title="Go to link" hotkey="ENTER">' +
                  '      ./../tr[1]//a' +
                  '    </target>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("fd")//tr[1][//a]' +
                  '    </target>' +
                  '  </list>  ' +
                  '  <list title="Balance sheet in millions of US dollars" ' +
                  '      next="DOWN j" prev="UP k" fwd="n" back="p">' +
                  '    <item index="7" count="5" action="CALL:axsQuotes.readF' +
                  'inancialCompDesc">' +
                  '      id("fd")//tr' +
                  '    </item>' +
                  '    <target title="Go to link" hotkey="ENTER">' +
                  '      ./../tr[6]//a' +
                  '    </target>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("fd")//tr[6][//a]' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="Cash flow in millions of US dollars" next="' +
                  'DOWN j" ' +
                  '      prev="UP k" fwd="n" back="p">' +
                  '    <item index="12" count="5" action="CALL:axsQuotes.read' +
                  'FinancialCompDesc">' +
                  '      id("fd")//tr' +
                  '    </item>' +
                  '    <target title="Go to link" hotkey="ENTER">' +
                  '      ./../tr[12]//a' +
                  '    </target>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("fd")//tr[12][//a]' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="Key statistics and ratios" next="DOWN j" pr' +
                  'ev="UP k" ' +
                  '      fwd="n" back="p">' +
                  '    <item action="CALL:axsQuotes.readRatAndStatsCompDesc">' +
                  '      id("keyratios")//tr[@class]' +
                  '    </item>' +
                  '    <item>' +
                  '      id("keyratios")//a' +
                  '    </item>' +
                  '    <target title="More ratios" hotkey="ENTER" onEmpty="No' +
                  ' link available.">' +
                  '      .' +
                  '    </target>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("keyratios")/div[@class="hdg"]' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="More resources" next="DOWN j" prev="UP k" f' +
                  'wd="n" back="p">' +
                  '    <item>' +
                  '      id("m-analyst")/.. | id("m-sec")/.. | id("m-hold")/.' +
                  '. | ' +
                  '          id("m-options")/.. | id("m-research")/.. | id("m' +
                  '-wiki")/.. | ' +
                  '          id("m-transcripts")/..' +
                  '    </item>' +
                  '    <target title="Go to link" hotkey="ENTER">' +
                  '      .//a' +
                  '    </target>' +
                  '    <target title="Go to section" trigger="listEntry" >' +
                  '      id("keyratios")/following-sibling::div[@class="hdg"]' +
                  '    </target>' +
                  '  </list>' +
                  '  <list title="Officers and directors" next="DOWN j" prev=' +
                  '"UP k" fwd="n" ' +
                  '      back="p">' +
                  '    <item action="CALL:axsQuotes.readManagementDescription' +
                  '">' +
                  '      id("management")//tr[not(@id="hide") and @id]' +
                  '    </item>' +
                  '    <item>' +
                  '      id("management")//td/a' +
                  '    </item>' +
                  '    <target title="Biography and compensation" hotkey="b">' +
                  '      .//following-sibling::tr[1]//a[@id="e-p"]' +
                  '    </target>' +
                  '    <target title="Trading activity" hotkey="t" onEmpty="N' +
                  'o trading ' +
                  '        activity available.">' +
                  '      .//following-sibling::tr[1]//a[@id="e-t"]' +
                  '    </target>' +
                  '    <target title="Go to link" hotkey="ENTER" onEmpty="No ' +
                  'link available.">' +
                  '      .' +
                  '    </target>' +
                  '    <target title="Go to section" trigger="listEntry">' +
                  '      id("mgmtdiv")' +
                  '    </target>' +
                  '  </list>' +
                  '  </cnr>';

  axsQuotes.axsNavObj.navInit(cnrString, null);
  axsQuotes.axsLensObj = new AxsLens(axsQuotes.axsJAXObj);
  axsQuotes.axsNavObj.setLens(axsQuotes.axsLensObj);
  axsQuotes.axsLensObj.setMagnification(axsQuotes.magSize);

  //Table columns are static for the page but change over time
  axsQuotes.populateFinancialsDescArray();
  axsQuotes.populateRatAndStatDescArray();

  //Handle the focus in the search box performed by the page script during init
  var searchBox = document.getElementById('searchbox');
  searchBox.addEventListener('focus', axsQuotes.searchBoxKeyHandler, false);

  //read the current quote
  window.setTimeout(axsQuotes.speakIntroduction, 200);
};

/**
 * Handles the DOMSubtreeModified event. 
 * This event happens when the selected node for the 
 * auto-complete search box changes.
 * @param {Event} evt The DOMSubtreeModified event
 */
axsQuotes.DOMSubtreeModifiedHandler = function(evt){
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;
  if (target.id == 'ac-list'){
    for (var i = 0, child; child = target.childNodes[i]; i++){
      if (child.className == 'selected'){
        axsQuotes.axsJAXObj.speakNode(child);
        return;
      }
    }
  }
};

/**
 * Handles the focus event of the searchbox. Avoids focusing of
 * this element performed by the page scripts
 * @param {Event} evt The focus event
 */
axsQuotes.searchBoxKeyHandler = function(evt) {
  if (!axsQuotes.searchBoxFocusEnabled) {
    axsQuotes.axsJAXObj.speakTextViaNode(' ');
    evt.target.blur();
  }
};

/**
 * Reads the company name and the current quote.
 */
axsQuotes.speakIntroduction = function() {
    var text = '';
    var xpath = 'id("companyheader")//h1';
    var headerElems = axsQuotes.axsJAXObj.evalXPath(xpath, document.body);
    var quoteElems = axsQuotes.axsJAXObj.evalXPath(axsQuotes.QUOTE_XPATH,
        document.body);

    text = headerElems[0].textContent + ' ';
    text = text + axsQuotes.parseCurrentQuote(quoteElems[0]);

    axsQuotes.speakAndGo(quoteElems[0], text);
};

/**
 * Populates the array used for building a sentence for presenting the
 * 'Balance sheet in millions of US dollars', Cash flow in millions
 * of US dollars' lists (Financial section). 
 * NOTE: The array is built dynamically since the captions of the Financials
 * table vary over time.
 */
axsQuotes.populateFinancialsDescArray = function() {
  var xpath = 'id("fd")//tr[1]';
  var elements = axsQuotes.axsJAXObj.evalXPath(xpath, document.body);
  var tableRow = elements[0];
  var currentCaption = tableRow.childNodes[3].textContent;
  currentCaption = currentCaption.replace('(', ' ').replace(')', ' ');
  currentCaption = axsQuotes.normalizeString(currentCaption) + ', ';
  var oneYearOldCaption = tableRow.childNodes[5].textContent;
  oneYearOldCaption = oneYearOldCaption.replace('(', ' ').replace(')', ' ');
  oneYearOldCaption = axsQuotes.normalizeString(oneYearOldCaption) + ', ';
  var twoYearsOldCaption = tableRow.childNodes[7].textContent;
  twoYearsOldCaption = twoYearsOldCaption.replace('(', ' ').replace(')', ' ');
  twoYearsOldCaption = axsQuotes.normalizeString(twoYearsOldCaption) + ', ';

  axsQuotes.financialsDescArray = new Array('',
                                            currentCaption,
                                            oneYearOldCaption,
                                            twoYearsOldCaption);
};

/**
 * Populates the array used for building a sentence for presenting the
 * 'Key statistics and ratios' list section (Key Stats & Ratios). 
 * NOTE: The array is built dynamically since the captions of the 'Key Stats & 
 * Ratios' table vary over time.
 */
axsQuotes.populateRatAndStatDescArray = function() {
  var xpath = 'id("keyratios")//tr[1]';
  var elements = axsQuotes.axsJAXObj.evalXPath(xpath, document.body);
  var tableRow = elements[0];
  var currentCaption = tableRow.childNodes[3].textContent;
  currentCaption = currentCaption.replace('(', ' ').replace(')', ' ');
  currentCaption = axsQuotes.normalizeString(currentCaption) + ', ';
  var oneYearCaption = tableRow.childNodes[5].textContent;
  oneYearCaption = oneYearCaption.replace('(', ' ').replace(')', ' ');
  oneYearCaption = axsQuotes.normalizeString(oneYearCaption) + ', ';
  var twoYearsCaption = tableRow.childNodes[7].textContent;
  twoYearsCaption = twoYearsCaption.replace('(', ' ').replace(')', ' ');
  twoYearsCaption = axsQuotes.normalizeString(twoYearsCaption) + ', ';
  if (twoYearsCaption.indexOf(axsQuotes.str.TTM) != -1) {
    twoYearsCaption = twoYearsCaption.replace(axsQuotes.str.TTM,
                                              axsQuotes.str.TTM_SPACES);
  }
  axsQuotes.ratAndStatDescArray = new Array('',
                                            currentCaption,
                                            oneYearCaption,
                                            twoYearsCaption);
};

/**
 * Callback handler for reading rows of data in the 'Market data' list.
 * @param {Object?} item A wrapper for the current DOM node.
 */
axsQuotes.readMarketDataRow = function(item) {
  var element = item.elem;
  var text = '';
  var xpath = './td[@class="key" or @class="val"]';
  var columns = axsQuotes.axsJAXObj.evalXPath(xpath, element);
  var firstPhrase = '';
  var secondPhrase = '';
  for (var i = 0; i < columns.length; i = i + 2) {
    firstPhrase = columns[i].textContent;
    firstPhrase = axsQuotes.parseSpecChrsAndTkns(firstPhrase);
    secondPhrase = columns[i + 1].textContent;
    secondPhrase = axsQuotes.parseSpecChrsAndTkns(secondPhrase);
    text = text + firstPhrase + ' ' + secondPhrase + '. ';
  }
  axsQuotes.speakAndGo(element, text);
};

/**
 * Callback handler for reading the after hours information in 
 * the 'Market data' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readAfterHours = function(item) {
  var text = '';
  var element = item.elem;
  var afterHours = element.childNodes[0].textContent;
  afterHours = axsQuotes.parseSpecChrsAndTkns(afterHours);
  afterHours = afterHours + ' ' + axsQuotes.str.OR + ' ';
  var percent = element.childNodes[2].textContent;
  percent = axsQuotes.parseSpecChrsAndTkns(percent);
  percent = percent + ', ';
  var time = element.childNodes[4].textContent;
  text = afterHours + percent + time;

  axsQuotes.speakAndGo(element, text);
};

/**
 * Reads the current quote.
 */
axsQuotes.readCurrentQuote = function() {
  var elements = axsQuotes.axsJAXObj.evalXPath(axsQuotes.QUOTE_XPATH,
      document.body);
  var text = axsQuotes.parseCurrentQuote(elements[0]);
  axsQuotes.speakAndGo(elements[0], text);
};

/**
 * Parses the current quote (the first element in the first and second items 
 * in the Market data list and read via pressing the 'q' key) and generates
 * a readable string.
 * @param {Node} element The current DOM node 
 * @return {string} The readable text generated from the quote 
 */
axsQuotes.parseCurrentQuote = function(element) {
  var text = '';
  var rate = element.childNodes[1].textContent;
  rate = axsQuotes.parseSpecChrsAndTkns(rate) + ', ';

  var change = element.childNodes[4].textContent;
  change = axsQuotes.parseSpecChrsAndTkns(change) + ' ';

  var percent = element.childNodes[6].textContent;
  percent = axsQuotes.parseSpecChrsAndTkns(percent) + ', ';

  var dateAndStatus = element.childNodes[8].textContent;
  dateAndStatus = dateAndStatus.replace(' -', axsQuotes.str.STATUS);
  dateAndStatus = axsQuotes.parseSpecChrsAndTkns(dateAndStatus) + ', ';

  var time = '';
  if (element.childNodes.length > 9) {
    time = element.childNodes[9].textContent;
  }

  var docTextPhrases = new Array(rate, change, percent, dateAndStatus, time);
  text = axsQuotes.buildTableRowText(docTextPhrases,
      axsQuotes.marketDataDescArray);

  return text;
};

/**
 * Callback handler for reading the 'News' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readNewsDesc = function(item) {
  var element = item.elem;
  var text = '';
  var xpath = './/td[@class="title" or @class="source"]';
  var contents = axsQuotes.axsJAXObj.evalXPath(xpath, element);
  text = contents[0].textContent + '. ';
  text = text + contents[1].childNodes[0].textContent;
  text = text + contents[1].childNodes[1].textContent;
  axsQuotes.speakAndGo(item.elem, text);
};

/**
 * Callback handler for reading the 'Related companies' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readRelCompDesc = function(item) {
  var element = item.elem;
  var rowColumns = element.childNodes;
  var companyName = axsQuotes.normalizeString(rowColumns[1].textContent);
  var exchange = axsQuotes.normalizeString(rowColumns[5].textContent);
  var exchangeFullName = axsQuotes.phrasesMap[exchange];
  if (exchangeFullName !== undefined) {
    exchange = exchangeFullName;
  }
  var symbol = axsQuotes.normalizeString(rowColumns[7].textContent);
  symbol = axsQuotes.addSpaceBetweenChars(symbol);
  var lastTrade = axsQuotes.normalizeString(rowColumns[9].textContent);
  var note = '';
  if (rowColumns[11].textContent.indexOf('*') != -1) {
    note = axsQuotes.str.DELAY;
  }
  var index = rowColumns[13].textContent.indexOf('(');
  var absoluteChange = rowColumns[13].textContent.substring(0, index);
  absoluteChange = axsQuotes.parseSpecChrsAndTkns(absoluteChange);
  var relativeChange = rowColumns[13].textContent.substring(index);
  relativeChange = axsQuotes.parseSpecChrsAndTkns(relativeChange);
  var marketCap = axsQuotes.parseSpecChrsAndTkns(rowColumns[15].textContent);
  var docTextPhrases = new Array(companyName,
                                 exchange,
                                 symbol,
                                 lastTrade,
                                 absoluteChange,
                                 relativeChange,
                                 marketCap,
                                 note);
  var rowText = axsQuotes.buildTableRowText(docTextPhrases,
      axsQuotes.relatedCompaniesDescArray);
  axsQuotes.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the 'Income statement in millions of
 * US dollars', 'Balance sheet in millions of US dollars', Cash flow in
 * millions of US dollars' lists.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readFinancialCompDesc = function(item) {
  var element = item.elem;

  var metricName = element.childNodes[1].textContent;
  metricName = axsQuotes.normalizeString(metricName) + ', ';

  var currentValue = element.childNodes[3].textContent;
  currentValue = axsQuotes.normalizeString(currentValue) + ', ';

  var oneYearValue = element.childNodes[5].textContent;
  oneYearValue = axsQuotes.normalizeString(oneYearValue) + ', ';

  var twoYearsValue = element.childNodes[7].textContent;
  twoYearsValue = axsQuotes.normalizeString(twoYearsValue) + ', ';

  var columnsText = new Array(metricName,
                              currentValue,
                              oneYearValue,
                              twoYearsValue);

  var rowText = axsQuotes.buildTableRowText(columnsText,
      axsQuotes.financialsDescArray);

  axsQuotes.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the 'Key ratios and stats' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readRatAndStatsCompDesc = function(item) {
  var element = item.elem;
  var metricName = element.childNodes[1].textContent;
  metricName = axsQuotes.parseSpecChrsAndTkns(metricName) + ', ';
  var currentValue = element.childNodes[3].textContent;
  currentValue = axsQuotes.parseSpecChrsAndTkns(currentValue) + ', ';
  var oneYearValue = element.childNodes[5].textContent;
  oneYearValue = axsQuotes.parseSpecChrsAndTkns(oneYearValue) + ', ';
  var twoYearsValue = element.childNodes[7].textContent;
  twoYearsValue = axsQuotes.parseSpecChrsAndTkns(twoYearsValue) + ', ';

  var columnsText = new Array(metricName,
                              currentValue,
                              oneYearValue,
                              twoYearsValue);

  var rowText = axsQuotes.buildTableRowText(columnsText,
                                         axsQuotes.ratAndStatDescArray);

  axsQuotes.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the names and information of the people
 * in the 'Officers and directors' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readManagementDescription = function(item) {
  var element = item.elem;
  var personName = element.childNodes[1].textContent;
  personName = personName.replace(axsQuotes.str.GT, '');
  var position = element.childNodes[3].textContent;
  var info = element.nextSibling.nextSibling.textContent;
  var index = info.indexOf(axsQuotes.str.BIO);
  info = info.substring(0, index);
  info = axsQuotes.normalizeString(info);
  var columnsText = new Array(personName, position, info);
  var rowText = axsQuotes.buildTableRowText(columnsText, null);
  axsQuotes.speakAndGo(element, rowText);
};

/**
 * Callback handler for reading the events in the 'Events' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readEventsDesc = function(item) {
  var element = item.elem;
  var text = '';
  var dateAndTime = element.childNodes[1].textContent;
  dateAndTime = axsQuotes.normalizeString(dateAndTime);
  var eventName = element.childNodes[3].childNodes[0].textContent;
  eventName = axsQuotes.normalizeString(eventName);
  text = dateAndTime + ', ' + eventName;
  axsQuotes.speakAndGo(element, text);
};

/**
 * Callback handler for reading the company website links in the 'Summary' 
 * list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readSummarylinksCompDesc = function(item) {
  var element = item.elem;
  var text = axsQuotes.normalizeString(element.textContent);
  axsQuotes.speakAndGo(element, text);
};

/**
 * Callback handler for reading the company description in the 'Summary' list.
 * @param {Object} item A wrapper for the current DOM node.
 */
axsQuotes.readSummaryTextCompDesc = function(item) {
  var element = item.elem;
  var text = element.childNodes[0].textContent;
  axsQuotes.speakAndGo(element, text);
};

/**
 * Adds white spaces beteen the characters of a string
 * @param {string} text The processed text.
 * @return {string} The processed text with white spaces added between its 
 * characters.
 */
axsQuotes.addSpaceBetweenChars = function(text) {
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
axsQuotes.speakAndGo = function(element, text) {
  axsQuotes.axsLensObj.view(element);
  axsQuotes.axsJAXObj.speakTextViaNode(text);
  element.scrollIntoView(true);
  axsQuotes.axsJAXObj.markPosition(element);
};

/**
 * Builds a sentence for presenting (speaking) a table row. The sentence is
 * built by alternating a phrase and a column content. 
 * @param {Array?} textContents Array with the contents of table columns. 
 * @param {Array?} columnDesc Array of phrases to be added between the
 * column values.
 * @return {string} The assembled sentence.
 */
axsQuotes.buildTableRowText = function(textContents, columnDesc) {
  //check inputs
  if (textContents === null) {
    return '';
  }
  //assemble text
  var rowText = '';
  for (var i = 0, textContent; textContent = textContents[i]; i++) {
    if (columnDesc !== null && i < columnDesc.length) {
       rowText = rowText + ' ' + columnDesc[i];
    }
    rowText = rowText + ' ' + textContents[i];
  }
  if (columnDesc !== null && i < columnDesc.length) {
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
axsQuotes.parseSpecChrsAndTkns = function(text) {
  var parsedText = '';
  //check input
  if (text === '') {
    return text;
  }
  //remove leading and trailing spaces
  text = axsQuotes.normalizeString(text);
  //check for phrase word mapping
  var phraseMapping = axsQuotes.phrasesMap[text];
  if (phraseMapping != undefined) {
    return phraseMapping;
  }
  //process every word separately
  var tokens = text.split(' ');
  for (var i = 0, token; token = tokens[i]; i++) {
    //check for whole word mapping
    var tokenMapping = axsQuotes.phrasesMap[token];
    if (tokenMapping != undefined) {
      token = tokenMapping;
    } else {
      //remove parentheses
      if (token.length > 0 && token.charAt(0) === '(') {
        token = token.substring(1);
      }
      if (token.length > 1 && token.charAt(token.length - 1) === ')') {
        token = token.substring(0, token.length - 1);
      }
      //parse the first character
      var prefixMapping = axsQuotes.charPrefixMap[token.charAt(0)];
      if (prefixMapping != undefined) {
        token = prefixMapping + ' ' + token.substring(1);
      }
      //parse the last character
      var lastCharacter = token.charAt(token.length - 1);
      var suffixMapping = axsQuotes.charSuffixMap[lastCharacter];
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
axsQuotes.normalizeString = function(text) {
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
 * @return {boolean} If true, indicates that the event should be propagated.
 */
axsQuotes.keyHandler = function(evt) {
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27) { // ESC
    axsQuotes.axsJAXObj.lastFocusedNode.blur();
    return false;
  }
  if (axsQuotes.axsJAXObj.inputFocused) {
    return true;
  }
  if (evt.charCode == 113) { // q
    axsQuotes.readCurrentQuote();
    return false;
  }
  var command = axsQuotes.charCodeMap[evt.charCode];

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
axsQuotes.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // / (slash symbol)
 47 : function() {
       axsQuotes.searchBoxFocusEnabled = true;
       document.getElementById('searchbox').focus();
       document.getElementById('searchbox').select();
       return false;
     },
  // ? (question mark)
  63 : function() {
       var helpStr = axsQuotes.HELP + axsQuotes.axsNavObj.localHelpString() +
                     axsQuotes.axsNavObj.globalHelpString();
       axsQuotes.axsJAXObj.speakTextViaNode(helpStr);
       return false;
    }
};

//Run the initialization routine of the script
axsQuotes.init();


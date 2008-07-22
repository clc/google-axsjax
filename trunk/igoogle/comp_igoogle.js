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

//javascript/axsjax/igoogle/axsEnableIGoogle.js
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
 * of iGoogle.
 * Note that these  scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsIG = {};

//These are strings used to find specific nodes
axsIG.unavailableInfoXPath = './/*[text() == "Information is temporarily unavailable."]';

//These are strings to be spoken to the user
axsIG.HELP_STRING = 'The following shortcut keys are available. ' +
                    'N, next gadget. ' +
                    'P, previous gadget. ' +
                    'Slash, jump to search field. ' +
                    'Escape, leave the search field. ' +
                    'Equals, increase magnification. ' +
                    'Minus, decrease magnification. ';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsIG.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsIG.axsNavObj = null;

axsIG.axsLensObj = null;

axsIG.magSize = 1.5;


axsIG.init = function(){
  axsIG.axsJAXObj = new AxsJAX(true);
  axsIG.axsNavObj = new AxsNav(axsIG.axsJAXObj);
  axsIG.axsLensObj = new AxsLens(axsIG.axsJAXObj);
  axsIG.axsNavObj.setLens(axsIG.axsLensObj);
  axsIG.axsLensObj.setMagnification(axsIG.magSize);

  var cnrString = "<cnr next='' prev=''>" +
                  "<list title='Gadgets' hotkey='' next='' prev=''>" +
                  "<item>" +
                  "id('modules')//div[@class='modbox']" +
                  "</item>" +
                  "</list>" +
                  "</cnr>";

  axsIG.axsNavObj.navInit(cnrString, null);

  //Add event listeners
  document.addEventListener('keypress', axsIG.keyHandler,
                             true);


  // Speak the first gadget
  // Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsIG.goToNextGadget,100);
};




axsIG.keyHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT.
    return true;
  }

  if (evt.keyCode == 27){ // ESC
    axsIG.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsIG.axsJAXObj.inputFocused){
    return true;
  }

  if (evt.charCode == 47){ // / (slash symbol)
    // Focus on the top search blank
    document.getElementsByName('q')[0].focus();
    document.getElementsByName('q')[0].select(); //and select all text
    return false;
  }

  if (evt.charCode == 45){ // - (minus symbol)
    axsIG.decreaseMagnification();
    return false;
  }

  if (evt.charCode == 61){ // = (equals symbol)
    axsIG.increaseMagnification();
    return false;
  }

  if (evt.charCode == 110){ // n
    axsIG.goToNextGadget();
    return false;
  }

  if (evt.charCode == 112){ // p
    axsIG.goToPrevGadget();
    return false;
  }

  if (evt.charCode == 63){ // ? (question mark)
    axsIG.axsJAXObj.speakTextViaNode(axsIG.HELP_STRING);
    return false;
  }

  return true;
};


axsIG.increaseMagnification = function(){
  axsIG.magSize += 0.10;
  axsIG.axsLensObj.setMagnification(axsIG.magSize);
};

axsIG.decreaseMagnification = function(){
  axsIG.magSize -= 0.10;
  axsIG.axsLensObj.setMagnification(axsIG.magSize);
};


axsIG.cleanUpGadgetTextInLens = function(){
  var menuControl = axsIG.axsJAXObj.evalXPath(".//a[@class='ddbox']",axsIG.axsLensObj.lens)[0];
  var minControl = axsIG.axsJAXObj.evalXPath(".//a[@class='minbox']",axsIG.axsLensObj.lens)[0];
  var delControl = axsIG.axsJAXObj.evalXPath(".//a[@class='delbox']",axsIG.axsLensObj.lens)[0];
  menuControl.tabIndex = -1;
  minControl.tabIndex = -1;
  delControl.tabIndex = -1;
  var garbageNodes = axsIG.axsJAXObj.evalXPath(axsIG.unavailableInfoXPath,axsIG.axsLensObj.lens);
  if (garbageNodes === null){
    return;
  }
  for (var i=0, node; node=garbageNodes[i]; i++){
    node.textContent = "";
  }
};



axsIG.goToNextGadget = function(){
  var gadget = axsIG.axsNavObj.nextItem().elem;
  axsIG.axsLensObj.view(gadget);
  axsIG.cleanUpGadgetTextInLens();
  axsIG.axsJAXObj.goTo(axsIG.axsLensObj.lens);
};  


axsIG.goToPrevGadget = function(){
  var gadget = axsIG.axsNavObj.prevItem().elem;
  axsIG.axsLensObj.view(gadget);
  axsIG.cleanUpGadgetTextInLens();
  axsIG.axsJAXObj.goTo(axsIG.axsLensObj.lens);
};

window.setTimeout("axsIG.init();",1000);


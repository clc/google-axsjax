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
  this.htmlNode = null;
  this.origBody = null;
  this.drillDownBody = null;
  this.currentView = 0;
  this.ID_NUM_ = 0;
  this.tabbingStartPosNode = null;
  this.tabKeyFixOn = false;
  this.lastFocusedNode = null;
  this.inputFocused = false;
  this.navArray = new Array();
  this.navListIdx = 0;
  this.navItemIdxs = new Array();
  this.lastItem = null;
  this.topCharCodeMap = new Object();
  this.topKeyCodeMap = new Object();
  this.charCodeMaps = new Array();
  this.keyCodeMaps = new Array();

  var self = this;
  //Monitor focus and blur
  //These return "true" so that any page actions based on
  //focus and blur will still occur.
  document.addEventListener('focus', 
                            function(evt){
                              self.lastFocusedNode = evt.target;
                              if ((evt.target.tagName == 'INPUT') ||
                                  (evt.target.tagName == 'TEXTAREA')){
                                self.inputFocused = true;
                              }                              
                              return true; 
                            }, true);
  document.addEventListener('blur', 
                            function(evt){
                              self.lastFocusedNode = null;
                              if ((evt.target.tagName == 'INPUT') ||
                                  (evt.target.tagName == 'TEXTAREA')){
                                self.inputFocused = false;
                              }
                              return true;
                            }, true);
  
  //Activate the tab key fix if needed
  if (useTabKeyFix){
    this.tabKeyFixOn = true;
    document.addEventListener('keypress',
                              function(event){self.tabKeyHandler(event,self);},
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
                               function(event){self.tabKeyHandler(event,self);},
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
 * @param {boolean}opt_noFocusChange  Specify if focus should move to targetNode
 */
AxsJAX.prototype.speakNode = function(targetNode, opt_noFocusChange){
  if (!targetNode.id){
    this.assignId(targetNode);
  }
  if (opt_noFocusChange){
    this.setAttributeOf(targetNode,'live','rude');
    this.setAttributeOf(targetNode,'atomic','true');
    var activeDoc = this.getActiveDocument();

    // It would be simpler to retain the dummyNode once it has been created
    // and change its textContent; however that fails to trigger the update
    // events we need. So we create a new node, taking care to remove any
    // previously created dummyNode.
    var dummyNode = activeDoc.createElement('div');
    dummyNode.textContent = ' ';
    dummyNode.name = 'AxsJAX_dummyNode';
    if ( targetNode.lastChild &&
         targetNode.lastChild.name &&
         (targetNode.lastChild.name == dummyNode.name) ){
      targetNode.removeChild(targetNode.lastChild);
    }
    targetNode.appendChild(dummyNode);
  } else {
    var oldRole = this.getAttributeOf(targetNode,'role');
    this.setAttributeOf(targetNode,'role','row');
    this.activeParent.tabIndex = -1;
    this.activeParent.blur();
    this.setAttributeOf(this.activeParent,'activedescendant',null);
    this.activeParent.focus();
    this.setAttributeOf(this.activeParent,'activedescendant',targetNode.id);
    //Restore the original role of the targetNode
    var self = this;
    window.setTimeout(
        function(){
          if (oldRole){
            self.setAttributeOf(targetNode,'role',oldRole);
          } else {
            self.removeAttributeOf(targetNode,'role');
          }
        },0);
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
  var doc =  window.content.document;
  var audioNode = doc.createElement('span');
  audioNode.id = 'AxsJAX_audioNode';
  audioNode.style.visibility = 'hidden';
  this.setAttributeOf(audioNode,'live','rude');
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
  var encodedClearPixel = 'data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==';
  var activeDoc = this.getActiveDocument();
  var pixelNode = null;
  if (opt_anchorNode)  {
    if ( opt_anchorNode.previousSibling &&
         opt_anchorNode.previousSibling.name == pixelName ){
      pixelNode = opt_anchorNode.previousSibling;
    } else {
      pixelNode = activeDoc.createElement('img');
      pixelNode.name = pixelName;
      pixelNode.setAttribute('tabindex',0);
      pixelNode.style.outline = 'none';
      pixelNode.src = encodedClearPixel;
      opt_anchorNode.parentNode.insertBefore(pixelNode, opt_anchorNode);
      this.forceATSync(pixelNode);
    }
    pixelNode.alt = textString;
    // Use a setTimeout here as Firefox attribute setting can be quirky
    // (tabIndex is not always set soon enough).
    window.setTimeout(function(){pixelNode.blur();pixelNode.focus();},0);
  } else {
    pixelNode = activeDoc.getElementById(pixelId);
    if (!pixelNode){
      pixelNode = activeDoc.createElement('img');
      pixelNode.id = pixelId;
      pixelNode.src = encodedClearPixel;
      activeDoc.body.appendChild(pixelNode);
    }
    pixelNode.alt = textString;
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
 * @param {Node} targetNode The target node of this operation.
 * @param {boolean} shiftKey Specifies if shift is held down.
 */
AxsJAX.prototype.clickElem = function(targetNode, shiftKey){
  var activeDoc = this.getActiveDocument();
  var evt = activeDoc.createEvent('MouseEvents');
  evt.initMouseEvent('click',true,true,activeDoc.defaultView,
                     1,0,0,0,0,false,false,shiftKey,false,0,null);
  //Use a try block here so that if the AJAX fails and it is a link,
  //it can still fall through and retry by setting the document.location.
  try{
    targetNode.dispatchEvent(evt);
  } catch(e){}
  //Clicking on a link does not cause traversal because of script
  //privilege limitations. The traversal has to be done by setting
  //document.location.
  if ( !targetNode.onclick &&
       (targetNode.tagName == 'A') &&
       targetNode.href &&
       (targetNode.href.indexOf('http') === 0) ){
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
  if (theKey == "ENTER"){
    keyCode = 13;
  }
  else if (theKey.length == 1){
    charCode = theKey.charCodeAt(0);
  }
  var activeDoc = this.getActiveDocument();
  var evt = activeDoc.createEvent('KeyboardEvent');
  evt.initKeyEvent('keypress',true,true,null,holdCtrl,
                   holdAlt,holdShift,false,keyCode,charCode);
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
AxsJAX.prototype.assignId = function(targetNode,opt_prefixString){
  if (!targetNode){
    return '';
  }
  if (targetNode.id){
    return targetNode.id;
  }
  var prefix =  opt_prefixString ||  'AxsJAX_ID_';
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
    if ( (currentNode.tagName == 'A') ||
         (currentNode.tagName == 'INPUT') ||
         ( currentNode.hasAttribute('tabindex') &&
           (currentNode.tabIndex != -1) )  ){
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
  if ((evt.keyCode == 9) && (this.tabbingStartPosNode)){
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
  targetNode.scrollIntoView(true);
  this.speakNode(targetNode);
  this.markPosition(targetNode);
};


/**
 * Sets the attribute of the targetNode to the value.
 * Use this rather than a direct set attribute to abstract away ARIA
 * naming changes.
 * @param {Node} targetNode The HTML node to be spoken.
 */
AxsJAX.prototype.setAttributeOf = function(targetNode, attribute, value){
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
  //Add the wairole: to values
  if (value && value.toLowerCase){
    //Do not directly assign lowercased value to value as it may not be valid
    var lcValue = value.toLowerCase();
    switch (lcValue){
      case 'group':
        value = 'wairole:group';
        break;
      case 'row':
        value = 'wairole:row';
        break;
      case 'button':
        value = 'wairole:button';
        break;
      default:
        break;
    }
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
  targetNode.removeAttribute(attribute);
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
    loc = loc.substring(0,indexOfHash);
  }
  activeDoc.location = loc + '#' + id;
};

/**
 * Given an XPath expression and rootNode, it returns an array of children nodes
 * that match. The code for this function was taken from Mihai Parparita's GMail
 * Macros Greasemonkey Script.
 * http://gmail-greasemonkey.googlecode.com/svn/trunk/scripts/gmail-new-macros.user.js
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
    return null;
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




/**
 * Makes an array of items given a navigation list node and its index.
 * Elements associated with a list will be marked as such.
 * @param {Node} listNode The navigation list node
 * @param {number} listIdx The index of the navigation list node 
 * @return {Array} The array of items.
 */
AxsJAX.prototype.makeItemsArray = function(listNode, listIdx){
  var itemsArray = new Array();
  var cnlItems = listNode.getElementsByTagName('item');
  var debug;
  for (var i=0,entry; entry = cnlItems[i]; i++){
    //Do this in a try-catch block since there are multiple
    //sets of cnlItems and even if one set does not exist as expected,
    //the other sets should still be available.
    try{
      var startNode = entry.getElementsByTagName('startNode')[0];
      var xpath = startNode.textContent;
      var htmlElem = this.getActiveDocument().getElementsByTagName('html')[0];
      var elems = this.evalXPath(xpath, htmlElem);

      var idxStr = startNode.getAttribute('index');
      var idx = parseInt(idxStr,10);
      var count = elems.length - idx;
      var countStr = startNode.getAttribute('count');
      if (countStr != '*'){
        count = parseInt(countStr,10);
      }
      var end = count + idx;
      var action = entry.getAttribute('action');
      var ancestorCountStr = startNode.getAttribute('ancestor');
      var ancestorCount = parseInt(ancestorCountStr,10);

      while (idx < end){
        var item = new Object();
        item.action = action;
        item.elem = elems[idx];
        if (typeof(item.elem) != 'undefined'){
          for (var j=0; j<ancestorCount; j++){
            item.elem = item.elem.parentNode;
          }
          if (typeof(item.elem.AxsJAXNavInfo) == 'undefined'){
            item.elem.AxsJAXNavInfo = new Object();
          }
          item.elem.AxsJAXNavInfo[listIdx] = idx;
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
 * Goes to the next navigation list and returns it
 * @return {Object?} The next navigation list.
 */
AxsJAX.prototype.nextList = function(){
  if (this.navArray.length < 1){
    return null;
  }
  this.navListIdx++;
  if (this.navListIdx >= this.navArray.length){
    this.navListIdx = 0;
  }
  return this.navArray[this.navListIdx];
};

/**
 * Goes to the previous navigation list and returns it
 * @return {Object?} The previous navigation list.
 */
AxsJAX.prototype.prevList = function(){
  if (this.navArray.length < 1){
    return null;
  }
  this.navListIdx--;
  if (this.navListIdx < 0){
    this.navListIdx = this.navArray.length - 1;
  }
  return this.navArray[this.navListIdx];
};

/**
 * Returns the current navigation list.
 * @return {Object} The current navigation list.
 */
AxsJAX.prototype.currentList = function(){
  return this.navArray[this.navListIdx];
};

/**
 * Speaks the title of the current list
 */
AxsJAX.prototype.announceCurrentList = function(){
  this.speakTextViaNode(this.currentList().title);
};

/**
 * Goes to the next item and returns it
 * @return {Object?} The next item. Use item.elem to get at the DOM node.
 */
AxsJAX.prototype.nextItem = function(){
  if (this.navArray.length < 1){
    return null;
  }
  var currentList = this.navArray[this.navListIdx];
  var items = currentList.items;
  if (items.length < 1){
    return null;
  }
  if (this.lastItem){
    var syncedIndex = this.lastItem.elem.AxsJAXNavInfo[this.navListIdx];
    if (typeof(syncedIndex) != 'undefined'){
      this.navItemIdxs[this.navListIdx] = syncedIndex;
    }
  }
  this.navItemIdxs[this.navListIdx]++;
  if (this.navItemIdxs[this.navListIdx] >= items.length){
    this.navItemIdxs[this.navListIdx] = 0;
  }
  var itemIndex = this.navItemIdxs[this.navListIdx];
  this.lastItem = items[itemIndex];
  return this.lastItem;
};

/**
 * Goes to the previous item and returns it
 * @return {Object?} The previous item. Use item.elem to get at the DOM node.
 */
AxsJAX.prototype.prevItem = function(){
  if (this.navArray.length < 1){
    return null;
  }
  var currentList = this.navArray[this.navListIdx];
  var items = currentList.items;
  if (items.length < 1){
    return null;
  }
  if (this.lastItem){
    var syncedIndex = this.lastItem.elem.AxsJAXNavInfo[this.navListIdx];
    if (typeof(syncedIndex) != 'undefined'){
      this.navItemIdxs[this.navListIdx] = syncedIndex;
    }
  }
  this.navItemIdxs[this.navListIdx]--;
  if (this.navItemIdxs[this.navListIdx] < 0){
    this.navItemIdxs[this.navListIdx] = items.length - 1;
  }
  var itemIndex = this.navItemIdxs[this.navListIdx];
  this.lastItem = items[itemIndex];
  return this.lastItem;
};

/**
 * Returns the current item.
 * @return {Object?} The current item. Use item.elem to get at the DOM node.
 */
AxsJAX.prototype.currentItem = function(){
  if (this.navArray.length < 1){
    return null;
  }
  if (this.lastItem){
    var syncedIndex = this.lastItem.elem.AxsJAXNavInfo[this.navListIdx];
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
 * This function will act on the current item based on what action was specified
 * in the Content Navigation Listing.
 */
AxsJAX.prototype.actOnCurrentItem = function(){
  var currentItem = this.currentItem();
  if (currentItem !== null){
    if (currentItem.action == 'click'){
      this.clickElem(currentItem.elem, false);
    } else {
      this.goTo(currentItem.elem);
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
AxsJAX.prototype.assignKeysToMethod = function(keyArray, charMap, keyMap, method){
  for (var i=0; i<keyArray.length; i++){
    var key = keyArray[i];
    if (key == 'LEFT'){
      keyMap[37] = method;
    } else if (key == 'UP'){
      keyMap[38] = method;
    } else if (key == 'RIGHT'){
      keyMap[39] = method;
    } else if (key == 'DOWN'){
      keyMap[40] = method;
    } else {
      charMap[key.charCodeAt(0)] = method;
    }
  }
};

/**
 * This function creates the mapping between keypresses and navigation behavior.
 *
 * @param {string} keyStr  String that indicates the keys to be used. Keys are
 *                         separated by the | symbol and any key with * in front
 *                         is a key that will cause the user to swap to the list
 *                         that the key is associated with and read the
 *                         next/prev item there. Otherwise, the keypress will
 *                         only be active is the user's current list is the
 *                         list indicated by navListIdx.
 *
 * @param {number} navListIdx  Index of the list that these keypresses are
 *                             associated with.
 *
 * @param {number} direction  Negative indicates moving backwards,
 *                            zero or positive indicates moving forward.
 */
AxsJAX.prototype.assignItemKeys = function(keyStr, navListIdx, direction){
  var keys = new Array();
  if (keyStr !== ''){
    keys = keyStr.split('|');
  }
  var superKeys = new Array();
  var regularKeys = new Array();
  for (var i=0, key; key = keys[i]; i++){
    if (key.charAt(0) == '*'){
      key = key.substring(1);
      superKeys.push(key);
    } else {
      regularKeys.push(key);
    }
  }
  var self = this;
  if (direction < 0){
    this.assignKeysToMethod( superKeys,
                             this.topCharCodeMap,
                             this.topKeyCodeMap,
                             function(){
                               self.navListIdx = navListIdx;
                               self.prevItem();
                               self.actOnCurrentItem();
                             } );
    this.assignKeysToMethod( regularKeys,
                             this.charCodeMaps[navListIdx],
                             this.keyCodeMaps[navListIdx],
                             function(){
                               self.prevItem();
                               self.actOnCurrentItem();
                             } );
  } else {
    this.assignKeysToMethod( superKeys,
                             this.topCharCodeMap,
                             this.topKeyCodeMap,
                             function(){
                               self.navListIdx = navListIdx;
                               self.nextItem();
                               self.actOnCurrentItem();
                             } );
    this.assignKeysToMethod( regularKeys,
                             this.charCodeMaps[navListIdx],
                             this.keyCodeMaps[navListIdx],
                             function(){
                               self.nextItem();
                               self.actOnCurrentItem();
                             } );
  }
};

/**
 * For all keys that map to lists with no items, those keys should
 * speak some message to let the user know that the function was called
 * but was unsuccessful because there is no content.
 * @param {string} keyStr  String that indicates the keys to be used.
 *
 * @param {string} emptyMsg  The message that should be spoken when the user
 *                           presses the key(s) to let them know that there
 *                           is no content.
 */
AxsJAX.prototype.assignEmptyMsgKeys = function(keyStr, emptyMsg){
  var keys = new Array();
  if (keyStr !== ''){
    keys = keyStr.split('|');
  }
  var superKeys = new Array();
  for (var i=0, key; key = keys[i]; i++){
    if (key.charAt(0) == '*'){
      key = key.substring(1);
      superKeys.push(key);
    }
  }
  var self = this;
  this.assignKeysToMethod( superKeys,
                           this.topCharCodeMap,
                           this.topKeyCodeMap,
                           function(){
                             self.speakTextViaNode(emptyMsg);
                           } );

};



/**
 * This function attaches the default AxsJAX key handler for navigation.
 * @param {Node} cnlDOM  DOM of the Content Navigation Listing.
 * @param {Array} emptyLists  An array of lists which have zero items.
 */

AxsJAX.prototype.setUpNavKeys = function(cnlDOM, emptyLists){
  var self = this;
  var cnlNode = cnlDOM.firstChild;

  this.topCharCodeMap = new Object();
  this.topKeyCodeMap = new Object();
  this.charCodeMaps = new Array();
  this.keyCodeMaps = new Array();

  var nextListKeys = new Array();
  var nextListStr = cnlNode.getAttribute('next');
  if (nextListStr !== ''){
    nextListKeys = nextListStr.split('|');
  }
  this.assignKeysToMethod( nextListKeys,
                           this.topCharCodeMap,
                           this.topKeyCodeMap,
                           function(){
                             self.nextList();
                             self.announceCurrentList();
                           } );

  var prevListKeys = new Array();
  var prevListStr = cnlNode.getAttribute('prev');
  if (prevListStr !== ''){
    prevListKeys = prevListStr.split('|');
  }
  this.assignKeysToMethod( prevListKeys,
                           this.topCharCodeMap,
                           this.topKeyCodeMap,
                           function(){
                             self.prevList();
                             self.announceCurrentList();
                           } );

  var i;
  var list;
  for (i=0, list; list = this.navArray[i]; i++){
    var charMap = new Object();
    var keyMap = new Object();
    this.charCodeMaps.push(charMap);
    this.keyCodeMaps.push(keyMap);
    this.assignItemKeys(list.nextKeys, i, 1);
    this.assignItemKeys(list.prevKeys, i, -1);
  }

  var emptyList;
  for (i=0, emptyList; emptyList = emptyLists[i]; i++){
    this.assignEmptyMsgKeys(emptyList.nextKeys, emptyList.emptyMsg);
    this.assignEmptyMsgKeys(emptyList.prevKeys, emptyList.emptyMsg);
  }  

  var keyHandler = function(evt){
                     //None of these commands involve Ctrl.
                     //If Ctrl is held, it must be for some AT.
                     if (evt.ctrlKey) return true;
                     if (self.inputFocused) return true;
                     var command =  self.topKeyCodeMap[evt.keyCode] ||
                                    self.topCharCodeMap[evt.charCode];
                     if (command) return command();
                     var idx = self.navListIdx;
                     command =  self.keyCodeMaps[idx][evt.keyCode] ||
                                self.charCodeMaps[idx][evt.charCode];
                     if (command) return command();
                   };

  document.addEventListener('keypress', keyHandler, true);
};

/**
 * Builds up the navigation system of lists of items.
 * This system uses the idea of multiple cursors and the visitor pattern.
 * @param {string} cnlString  An XML string that contains the information needed
 *                            to build up the content navigation listings.
 *
 * @notypecheck {Function?} opt_customNavMethod  A custom navigation method provided
 *                                by the caller. This navigation method will be
 *                                given the DOM created from the cnlString, the
 *                                navigation array of lists of items,
 *                                and an array of all the lists which had
 *                                zero items. If this is null, the default
 *                                AxsJAX nav handler will be used.
 */
AxsJAX.prototype.navInit = function(cnlString, opt_customNavMethod){
  var parser = new DOMParser();
  var cnlDOM = parser.parseFromString(cnlString, 'text/xml');
  var lists = cnlDOM.getElementsByTagName('list');
  this.navArray = new Array();
  this.navListIdx = 0;
  this.navItemIdxs = new Array();

  var emptyLists = new Array();

  for (var i=0, currentList; currentList = lists[i]; i++){
    var navList = new Object();
    navList.title = currentList.getAttribute('title');
    navList.nextKeys = currentList.getAttribute('next');
    navList.prevKeys = currentList.getAttribute('prev');
    navList.emptyMsg = currentList.getAttribute('emptyMsg');
    navList.items = this.makeItemsArray(currentList,i);

    if (navList.items.length > 0){
      //Only add nav lists that have content to the array
      this.navArray.push(navList);
      this.navItemIdxs.push(-1);
    } else if ( (navList.nextKeys.indexOf('*') != -1) ||
                (navList.prevKeys.indexOf('*') != -1) ){
      //Record empty nav lists if the user can jump to them directly
      emptyLists.push(navList);
    }
  }
  if ( (opt_customNavMethod === null) ||
       (typeof(opt_customNavMethod) == 'undefined') ){
    this.setUpNavKeys(cnlDOM,emptyLists);
  } else {
    opt_customNavMethod(cnlDOM,this.navArray,emptyLists);
  }
};
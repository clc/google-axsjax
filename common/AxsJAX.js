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
 * Class of scripts for improving accessibility of Google Apps.
 * @param {boolean} useTabKeyFix  Whether or not to try syncing to the last
 *                                marked position when the user presses the
 *                                tab key.
 * @constructor
 */
AxsJAX = function(useTabKeyFix){
  this.ID_NUM_ = 0;
  //Empty node used for tickling existing nodes into speaking
  this.EMPTY_NODE_ = new function(){
    var emptyNode = document.createElement('span');
    emptyNode.textContent = ' ';
    return emptyNode;
  };
  //Activate the tab key fix if needed
  this.tabbingStartPosNode = null;
  this.tabKeyFixOn = false;
  var self = this;
  if (useTabKeyFix){
    this.tabKeyFixOn = true;
    document.addEventListener('keypress', function(event){self.tabKeyHandler(event,self);}, true);
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
    activeDoc.addEventListener('keypress', function(event){self.tabKeyHandler(event,self);}, true);
    activeDoc.body.AXSJAX_TABKEYFIX_ADDED = true;
  }
};


/**
 * Gets the document for the active parent.
 * @return {Node} The document that is the ancestor for the active parent
 */
AxsJAX.prototype.getActiveDocument = function(){
  var activeDoc = this.activeParent;
  while (activeDoc.nodeType != 9){
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
 */
AxsJAX.prototype.speakNode = function(targetNode){
  if (!targetNode.id){
    this.assignId(targetNode);
  }
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
};


/**
 * Triggers a DOMNodeInserted event by inserting the text to be spoken
 * into a hidden node. AT will respond by reading the content of this new node.
 * This should be used in cases a message needs to be spoken
 * to give an auditory cue to something that is shown visually.
 * A good example would be when content has loaded or is changed from
 * being hidden to being displayed; it is visually obvious, but there may not
 * be any audio cue.
 * @param {String} textString The text to be spoken.
 */
AxsJAX.prototype.speakText = function(textString){
  var audioNode = document.createElement('span');
  audioNode.id = 'AxsJAX_audioNode';
  audioNode.style.visibility = 'hidden';
  this.setAttributeOf(audioNode,'live','rude');
  var oldAudioNode = document.getElementById(audioNode.id);
  if (oldAudioNode){
    document.body.removeChild(oldAudioNode);
  }
  audioNode.textContent = textString;
  document.body.appendChild(audioNode);
};

/**
 * This will insert a transparent pixel to the end of the page, put
 * the textString as the pixel's alt text, then use speakNode on the pixel.
 * This is an alternative way of speaking text that does not rely on
 * ARIA live regions.
 * The advantage is that it is more compatible as few assistive technologies
 * currently support live regions.
 * The disadvantage (besides being a somewhat hacky way of doing things) is
 * that it may cause problems with things which rely on focus/blur as this
 * causes focus to be set somewhere on the page.
 *
 * If there is an anchorNode specified, this function will place the pixel
 * before the anchorNode and set focus to the pixel.
 *
 * If there is no anchorNode specified, this function will append the pixel
 * as the last child to the body of the active document and call speakNode on
 * the pixel.
 *
 * @param {String} textString The text to be spoken.
 * @param {Node} anchorNode The node to insert the pixel in front of.
 *
 */
AxsJAX.prototype.speakThroughPixel = function(textString, anchorNode){
  var pixelId = 'AxsJAX_pixelAudioNode';
  var pixelName = 'AxsJAX_pixelAudioNode';
  var activeDoc = this.getActiveDocument();
  var pixelNode = null;
  if (anchorNode)  {
    if (anchorNode.previousSibling && anchorNode.previousSibling.name == pixelName){
      pixelNode = anchorNode.previousSibling;
    } else {
      pixelNode = activeDoc.createElement('img');
      pixelNode.name = pixelName;
      pixelNode.setAttribute('tabindex',0);
      pixelNode.style.outline = 'none';
      pixelNode.src = 'http://google-axsjax.googlecode.com/svn/trunk/common/res/images/blank.gif';
      anchorNode.parentNode.insertBefore(pixelNode, anchorNode);
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
      pixelNode.src = 'http://google-axsjax.googlecode.com/svn/trunk/common/res/images/blank.gif';
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
  if (!targetNode.onclick && (targetNode.tagName == 'A') && targetNode.href && (targetNode.href.indexOf('http') === 0)){
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
 * @param {Bool} holdCtrl Whether or not the Ctrl key should be held for
 *                        this operation.
 * @param {Bool} holdAlt Whether or not the Alt key should be held for
 *                       this operation.
 * @param {Bool} holdShift Whether or not the Shift key should be held
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
 * Assigns an ID to the targetNode and returns the ID that the node has after
 * the operation. If the targetNode already has an ID, that ID will not
 * be changed; the returned ID will be the original ID.
 * @param {Node} targetNode The target node of this operation.
 * @param {String} opt_prefixString
 * Prefix to help ensure the uniqueness of the ID.
 *This is optional; if null, it will use "AxsJAX_ID_".
 * @return {String} The ID that the targetNode now has.
 */
AxsJAX.prototype.assignId = function(targetNode,prefixString){
  if (!targetNode){
    return '';
  }
  if (targetNode.id){
    return targetNode.id;
  }
  if (!prefixString){
    prefixString = "AxsJAX_ID_";
  }
  targetNode.id = prefixString + this.ID_NUM_++;        
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
    if ((currentNode.tagName == 'A') || (currentNode.tagName == 'INPUT') || (currentNode.hasAttribute('tabindex') && (currentNode.tabIndex != -1))){
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
 * trying to do navigation.
 * @param {Node} targetNode The HTML node to be spoken.
 */
AxsJAX.prototype.goTo = function(targetNode){
  targetNode.scrollIntoView(true);
  this.speakNode(targetNode);
  this.markPosition(targetNode);
//  this.forceATSync(targetNode);
//  var self = this;
//  window.setTimeout(function(){self.speakNode(targetNode);},0);
};


/**
 * Sets the attribute of the targetNode to the value.
 * Use this rather than a direct set attribute to abstract away ARIA
 * naming changes.
 * @param {Node} targetNode The HTML node to be spoken.
 */
AxsJAX.prototype.setAttributeOf = function(targetNode, attribute, value){
  //Add the aria- to attributes
  if (attribute.toLowerCase() == 'live'){
    attribute = 'aria-live';
  } else if (attribute.toLowerCase() == 'activedescendant'){
    attribute = 'aria-activedescendant';
  }
  //Add the wairole: to values
  if (value && value.toLowerCase){
    if (value.toLowerCase() == 'group'){
      value = 'wairole:group';
    } else if (value.toLowerCase() == 'row'){
      value = 'wairole:row';
    } else if (value.toLowerCase() == 'button'){
      value = 'wairole:button';
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
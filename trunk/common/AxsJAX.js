// Copyright 2007 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview AxsJAX - JavaScript library for enhancing the accessibility 
 * of AJAX apps through WAI-ARIA.
 * Note that IE does not implement WAI-ARIA; thus these scripts are specific 
 * to Firefox.
 * @author clchen@google.com (Charles L. Chen)
 */

/**
 * Class of scripts for improving accessibility of Google Apps.
 * @constructor
 */
AxsJAX = function(){
  this.ARIA_NAMESPACE_STRING_ = 'http://www.w3.org/2005/07/aaa';
  this.ARIA_LIVE_STRING_ = 'live';
  this.ARIA_RUDE_STRING_ = 'rude';
  this.ID_NUM_ = 0;
  //Empty node used for tickling existing nodes into speaking
  this.EMPTY_NODE_ = new function(){
    var emptyNode = document.createElement('span');
    emptyNode.textContent = ' ';
    return emptyNode;
  };
}


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
//---------
  /*Something to try for Firefox 3 once it stabilizes.*/
  /*Theoretically, this code should work better as active descendant will set
    focus and make it work for JAWS and Window Eyes. However, Firefox 2 does
    not handle this correctly yet. Therefore, hold off on using this code until
    Firefox 3 is ready. Use Live Regions for now as that works on Fire Vox.*/
  /**
  if (!targetNode.id){
    this.assignId(targetNode);
  }
  var theBody = window.content.document.body;
  theBody.tabIndex = 0;
  theBody.blur();
  theBody.setAttribute("role","wairole:listbox")
  theBody.setAttributeNS(this.ARIA_NAMESPACE_STRING_, "activedescendant", '');
  theBody.focus();
  theBody.setAttributeNS(this.ARIA_NAMESPACE_STRING_, "activedescendant", targetNode.id);
  **/
//--------------
  targetNode.setAttributeNS(this.ARIA_NAMESPACE_STRING_,
      this.ARIA_LIVE_STRING_, this.ARIA_RUDE_STRING_);
  targetNode.setAttributeNS(this.ARIA_NAMESPACE_STRING_, 'atomic', 'true');
  targetNode.appendChild(this.EMPTY_NODE_);
  targetNode.removeChild(this.EMPTY_NODE_);
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
  audioNode.setAttributeNS(this.ARIA_NAMESPACE_STRING_,
      this.ARIA_LIVE_STRING_, this.ARIA_RUDE_STRING_);
  var oldAudioNode = document.getElementById(audioNode.id);
  if (oldAudioNode){
    document.body.removeChild(oldAudioNode);
  }
  audioNode.textContent = textString;
  document.body.appendChild(audioNode);
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
AxsJAX.prototype.clickElem = function(targetNode){
  var evt = document.createEvent('MouseEvents');
  evt.initMouseEvent('click',true,true,document.defaultView,
                     1,0,0,0,0,false,false,false,false,0,null);
  targetNode.dispatchEvent(evt);
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
  var evt = document.createEvent('KeyboardEvent');
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
                            Prefix to help ensure the uniqueness of the ID.
 *                          This is optional; if null, it will use "AxsJAX_ID_".
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
}
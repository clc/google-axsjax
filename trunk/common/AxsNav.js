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
  this.navArray = new Array();
  this.navListIdx = 0;
  this.navItemIdxs = new Array();
  this.lastItem = null;
  this.topCharCodeMap = new Object();
  this.topKeyCodeMap = new Object();
  this.charCodeMaps = new Array();
  this.keyCodeMaps = new Array();
  this.axs_ = axsJAXObj;
};

/**
 * Makes an array of items given a navigation list node and its index.
 * Elements associated with a list will be marked as such.
 * @param {Node} listNode The navigation list node
 * @param {number} listIdx The index of the navigation list node
 * @return {Array} The array of items.
 */
AxsNav.prototype.makeItemsArray = function(listNode, listIdx){
  var itemsArray = new Array();
  var cnlItems = listNode.getElementsByTagName('item');
  for (var i=0,entry; entry = cnlItems[i]; i++){
    //Do this in a try-catch block since there are multiple
    //sets of cnlItems and even if one set does not exist as expected,
    //the other sets should still be available.
    try{
      var locator = entry.getElementsByTagName('locator')[0];
      var xpath = locator.textContent;
      var htmlElem = this.axs_.getActiveDocument().documentElement;
      var elems = this.axs_.evalXPath(xpath, htmlElem);
      var idxStr = locator.getAttribute('index');
      var idx = parseInt(idxStr,10);      
      var count = elems.length - idx;
      var countStr = locator.getAttribute('count');
      if (countStr != '*'){
        count = parseInt(countStr,10);
      }
      var end = count + idx;
      var action = entry.getAttribute('action');
      while (idx < end){
        var item = new Object();
        item.action = action;
        item.elem = elems[idx];
        if (typeof(item.elem) != 'undefined'){
          if (typeof(item.elem.AxsNavInfo) == 'undefined'){
            item.elem.AxsNavInfo = new Object();
          }
          item.elem.AxsNavInfo[listIdx] = itemsArray.length;
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
AxsNav.prototype.nextList = function(){
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
AxsNav.prototype.prevList = function(){
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
 * Goes to the next item and returns it
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
 * This function will act on the current item based on what action was specified
 * in the Content Navigation Listing.
 */
AxsNav.prototype.actOnCurrentItem = function(){
  var currentItem = this.currentItem();

  if (currentItem !== null){
    if (currentItem.action == 'click'){
      this.axs_.clickElem(currentItem.elem, false);
    } else {
      this.axs_.goTo(currentItem.elem);
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
AxsNav.prototype.assignKeysToMethod = function(keyArray, charMap, keyMap, method){
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
AxsNav.prototype.assignItemKeys = function(keyStr, navListIdx, direction){
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
AxsNav.prototype.assignEmptyMsgKeys = function(keyStr, emptyMsg){
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
                             self.axs_.speakTextViaNode(emptyMsg);
                           } );

};



/**
 * This function attaches the default AxsJAX key handler for navigation.
 * @param {Node} cnlDOM  DOM of the Content Navigation Listing.
 * @param {Array} emptyLists  An array of lists which have zero items.
 */

AxsNav.prototype.setUpNavKeys = function(cnlDOM, emptyLists){
  var self = this;
  var cnlNode = cnlDOM.firstChild;

  this.topCharCodeMap = new Object();
  this.topKeyCodeMap = new Object();
  this.charCodeMaps = new Array();
  this.keyCodeMaps = new Array();

  var nextListKeys = new Array();
  var nextListStr = cnlNode.getAttribute('next') || '';
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
  var prevListStr = cnlNode.getAttribute('prev') || '';
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
                     if (self.axs_.inputFocused) return true;
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
 * @notypecheck {Function?} opt_customNavMethod
 *                                A custom navigation method provided by
 *                                the caller. This navigation method will be
 *                                given the DOM created from the cnlString, the
 *                                navigation array of lists of items,
 *                                and an array of all the lists which had
 *                                zero items. If this is null, the default
 *                                AxsJAX nav handler will be used.
 */
AxsNav.prototype.navInit = function(cnlString, opt_customNavMethod){
  var parser = new DOMParser();
  var cnlDOM = parser.parseFromString(cnlString, 'text/xml');
  var lists = cnlDOM.getElementsByTagName('list');
  this.navArray = new Array();
  this.navListIdx = 0;
  this.navItemIdxs = new Array();

  var emptyLists = new Array();

  for (var i=0, currentList; currentList = lists[i]; i++){
    var navList = new Object();
    navList.title = currentList.getAttribute('title') || '';
    navList.nextKeys = currentList.getAttribute('next') || '';
    navList.prevKeys = currentList.getAttribute('prev') || '';
    navList.emptyMsg = currentList.getAttribute('onEmpty') || '';
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
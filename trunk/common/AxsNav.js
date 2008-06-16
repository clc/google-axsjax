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
  this.LIST_SND_URL = 'http://google-axsjax.googlecode.com/svn/trunk/common/earcons/list.mp3';
  this.ITEM_SND_URL = 'http://google-axsjax.googlecode.com/svn/trunk/common/earcons/item.mp3';
  this.LOOP_SND_URL = 'http://google-axsjax.googlecode.com/svn/trunk/common/earcons/loop.mp3';
};

//Constant strings to be internationalized
AxsNav.NEXTLIST_STRING = ', next list. ';
AxsNav.PREVLIST_STRING = ', previous list. ';
AxsNav.GOFORWARD_STRING = ', go forward. ';
AxsNav.GOBACKWARDS_STRING = ', go backwards. ';
AxsNav.CYCLENEXT_STRING = ', cycle next. ';
AxsNav.CYCLEPREV_STRING = ', cycle previous. ';

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
      var xpath = entry.textContent;
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

AxsNav.prototype.validateList = function(navList) {
  var valid = true;
  //Reload dynamic lists  
  if ((navList.type == 'dynamic') && (navList.items.length === 0)){
    navList.items = this.makeItemsArray(navList.cnrNode);;
    navList.targets = this.makeTargetsArray(navList.cnrNode);
    this.navItemIdxs[this.navListIdx] = -1;
  }
  if (navList.items.length === 0) {
    valid = false;
  } 
  return valid;
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
  var currentList = this.navArray[this.navListIdx]; 
  if (currentList.entryTarget !== null){
    this.actOnTarget(currentList.entryTarget);
  }
  if (this.snd_ !== null){
    this.snd_.play(this.LIST_SND_URL);
  }
  return currentList;
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
  var currentList = this.navArray[this.navListIdx];
  if (currentList.entryTarget !== null){
    this.actOnTarget(currentList.entryTarget);
  }
  if (this.snd_ !== null){
    this.snd_.play(this.LIST_SND_URL);
  }
  return currentList;
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
	currentList.items = this.makeItemsArray(currentList.cnrNode);
	this.navItemIdxs[this.navListIdx] = 0;
	itemIndex = this.navItemIdxs[this.navListIdx];
  }  
  this.lastItem = items[itemIndex];
  if (this.snd_ !== null){
    if (looped){
	  this.snd_.play(this.LOOP_SND_URL);
	} else {
      this.snd_.play(this.ITEM_SND_URL);
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
  var currentList = this.navArray[this.navListIdx];
  var oldIndex = this.navItemIdxs[this.navListIdx];
  var item = this.nextItem();
  var newIndex = this.navItemIdxs[this.navListIdx];
  if ((currentList.tailTarget !== null) && (newIndex <= oldIndex)){
    this.actOnTarget(currentList.tailTarget);
    return null;
  }
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
	currentList.items = this.makeItemsArray(currentList.cnrNode);
	this.navItemIdxs[this.navListIdx] = currentList.items.length;
	itemIndex = this.navItemIdxs[this.navListIdx];
  }  
  this.lastItem = items[itemIndex];
  if (this.snd_ !== null){
    if (looped){
	  this.snd_.play(this.LOOP_SND_URL);
	} else {
      this.snd_.play(this.ITEM_SND_URL);
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
  var currentList = this.navArray[this.navListIdx];
  var oldIndex = this.navItemIdxs[this.navListIdx];
  var item = this.prevItem();
  var newIndex = this.navItemIdxs[this.navListIdx];
  if ((currentList.headTarget !== null) && (newIndex >= oldIndex)){
    this.actOnTarget(currentList.headTarget);
    return null;
  }
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
        if ((item.action !== null) &&
            (item.action.indexOf('CALL:') === 0) &&
            (item.action.indexOf('(') === -1)){
	      var func = eval(item.action.substring(5));
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
	    evt.target.removeEventListener('blur',tempBlurHandler,true);
		doAction();
      };
	  oldNode.addEventListener('blur',tempBlurHandler,true);
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
  var elems = this.axs_.evalXPath(xpath,rootNode);
  if (elems.length < 1){
    this.axs_.speakTextViaNode(target.emptyMsg);
  } else {	
    if (target.action.indexOf('CALL:') === 0  
          && target.action.indexOf('(') === -1) {
      var func = eval(target.action.substring(5));     
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
                            self.announceCurrentList();
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
                            self.announceCurrentList();
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



  var keyHandler = function(evt){
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

  document.addEventListener('keypress', keyHandler, true);
};


AxsNav.prototype.makeTargetsArray = function(listNode){
  var targetsArray = new Array();
  var cnrTargets = listNode.getElementsByTagName('target');
  for (var i = 0, entry; entry = cnrTargets[i]; i++){
    var target = new Object();
    target.xpath = entry.textContent;
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
      target.xpath = currentNode.textContent;
      target.title = currentNode.getAttribute('title') || '';
      target.trigger = currentNode.getAttribute('trigger') || 'key';
      target.hotkeyStr = currentNode.getAttribute('hotkey') || '';
      target.action = currentNode.getAttribute('action') || 'click';
      target.emptyMsg = currentNode.getAttribute('onEmpty') || '';
      this.targetsArray.push(target);
    }
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
    helpStr = helpStr + this.nextListKeys + AxsNav.NEXTLIST_STRING;
  }
  if (this.prevListKeys !== ''){
    helpStr = helpStr + this.prevListKeys + AxsNav.PREVLIST_STRING;
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
    helpStr = helpStr + currentList.fwdKeys + AxsNav.GOFORWARD_STRING;
  }
  if (currentList.backKeys !== ''){
    helpStr = helpStr + currentList.backKeys + AxsNav.GOBACKWARDS_STRING;
  }
  if (currentList.nextKeys !== ''){
    helpStr = helpStr + currentList.nextKeys + AxsNav.CYCLENEXT_STRING;
  }
  if (currentList.prevKeys !== ''){
    helpStr = helpStr + currentList.prevKeys + AxsNav.CYCLEPREV_STRING;
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






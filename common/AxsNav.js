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
 * 
 * @param {Object}
 *            axsJAXObj An instance of an AxsJAX object.
 * @constructor
 */
var AxsNav = function(axsJAXObj) {
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
	this.pk_ = null;
	this.snd_ = null;
	this.LIST_SND = 'list';
	this.ITEM_SND = 'item';
	this.WRAP_SND = 'wrap';
	this.keyHandler = null;
};

/**
 * Object that contains all string literals used by AxsNav.
 * 
 * @type {Object}
 */
AxsNav.str = {
	NEXT_LIST : 'next list',
	PREV_LIST : 'previous list',
	GO_FORWARD : 'go forward',
	GO_BACKWARDS : 'go backwards',
	CYCLE_NEXT : 'cycle next',
	CYCLE_PREV : 'cycle previous',
	SELECT_ACTION : 'Select available action',
	NO_AVAILABLE_ACTION : 'No available actions',
	PGUP : 'Page up',
	PGDOWN : 'Page down',
	ENTER : 'Enter',
	ESC : 'Escape',
	DEL : 'Delete',
	UP : 'Up',
	DOWN : 'Down',
	LEFT : 'Left',
	RIGHT : 'Right'
};

/**
 * Set the PowerKey object used for displaying the valid actions in a given
 * context. The PowerKey auto completion input element is invoked via a
 * shortcutKey.
 * 
 * @param {Object}
 *            powerKeyObj A PowerKey object.
 * @param {string}
 *            shortcutKey A key for invoking PowerKey.
 */
AxsNav.prototype.setPowerKey = function(powerKeyObj, shortcutKey) {
	if (shortcutKey) {
		this.pk_ = powerKeyObj;
		// Initialize the PowerKey object if it has not been initialized yet
		if (this.pk_.cmpTextElement === null) {
			this.defaultInitPowerKeyObj();
		}
		var self = this;
		var keyArray = new Array(shortcutKey);
		this.assignKeysToMethod(keyArray, this.topCharCodeMap,
				this.topKeyCodeMap, function() {
					self.showAvailableActionsSelector();
				});
	}
};

/**
 * Returns whether the specified navigation list is valid. If the navigation
 * list is dynamic and appears to not be valid, this function will try to reload
 * it and check whether or not it becomes valid.
 * 
 * @param {Object}
 *            navList The specified list object to check.
 * @return {boolean} Whether the specified list object is valid.
 */
AxsNav.prototype.validateList = function(navList) {
	var valid = true;
	// Reload dynamic lists
	if ((navList.type == 'dynamic') && (navList.items.length === 0)) {
		// Clear the lens to avoid its contents interfering with the xpath
		if (this.lens_ !== null) {
			this.lens_.view(null);
		}
		navList.items = this.makeItemsArray(navList.origListObj);
		navList.targets = this.makeTargetsArray(navList.origListObj);
		// Reset the nav index of the list being validated.
		// Most of the time, the list being validated is the same
		// as the current list.
		if (this.navArray[this.navListIdx] === navList) {
			this.navItemIdxs[this.navListIdx] = -1;
		} else {
			for ( var i = 0, tempList; tempList = this.navArray[i]; i++) {
				if (tempList === navList) {
					this.navItemIdxs[i] = -1;
					break;
				}
			}
		}
	}
	if ((navList.items.length === 0) && (navList.entryTarget === null)) {
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
	if (target !== null) {
		this.actOnTarget(target);
		func = this.getCallbackFunction(target.action);
	}
	if (func === null) {
		this.announceCurrentList();
		if (this.snd_ !== null) {
			this.snd_.play(this.LIST_SND);
		}
	}
};

/**
 * Goes to the next navigation list and returns it
 * 
 * @return {Object?} The next navigation list.
 */
AxsNav.prototype.nextList = function() {
	if (this.navArray.length < 1) {
		return null;
	}
	// Find the next list with items
	for ( var i = 0, list; list = this.navArray[i]; i++) {
		this.navListIdx++;
		if (this.navListIdx >= this.navArray.length) {
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
 * 
 * @return {Object?} The previous navigation list.
 */
AxsNav.prototype.prevList = function() {
	if (this.navArray.length < 1) {
		return null;
	}
	// Find the next list with item
	for ( var i = 0, list; list = this.navArray[i]; i++) {
		this.navListIdx--;
		if (this.navListIdx < 0) {
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
 * 
 * @return {Object} The current navigation list.
 */
AxsNav.prototype.currentList = function() {
	return this.navArray[this.navListIdx];
};

/**
 * Speaks the title of the current list
 */
AxsNav.prototype.announceCurrentList = function() {
	this.axs_.speakTextViaNode(this.currentList().title);
};

/**
 * Goes to the next item and returns it; if there is no next item, this will
 * wrap to the first item in the list.
 * 
 * @return {Object?} The next item. Use item.elem to get at the DOM node.
 */
AxsNav.prototype.nextItem = function() {
	if (this.navArray.length < 1) {
		return null;
	}
	var currentList = this.navArray[this.navListIdx];
	var items = currentList.items;
	if (items.length < 1) {
		return null;
	}
	if (this.lastItem) {
		var currentListId = this.getListId(currentList);
		var syncedIndex = this.lastItem.elem.AxsNavInfo[currentListId];
		if (typeof (syncedIndex) != 'undefined') {
			this.navItemIdxs[this.navListIdx] = syncedIndex;
		}
	}
	this.navItemIdxs[this.navListIdx]++;
	var looped = false;
	if (this.navItemIdxs[this.navListIdx] >= items.length) {
		this.navItemIdxs[this.navListIdx] = 0;
		looped = true;
	}
	var itemIndex = this.navItemIdxs[this.navListIdx];
	// Perform a validity check to determine if the xpaths should be
	// re-evaluated
	if (items[itemIndex].elem.parentNode === null) {
		// Clear the lens to avoid its contents interfering with the xpath
		if (this.lens_ !== null) {
			this.lens_.view(null);
		}
		currentList.items = this.makeItemsArray(currentList.origListObj);
		this.navItemIdxs[this.navListIdx] = 0;
		itemIndex = this.navItemIdxs[this.navListIdx];
	}
	this.lastItem = items[itemIndex];
	if (this.snd_ !== null) {
		if (looped) {
			this.snd_.play(this.WRAP_SND);
		} else {
			this.snd_.play(this.ITEM_SND);
		}
	}
	return this.lastItem;
};

/**
 * Goes to the next item and returns it; if this causes wrapping and there is a
 * tailTarget on the list, then this will act on that target and return null
 * instead.
 * 
 * @return {Object?} The next item. Use item.elem to get at the DOM node.
 */
AxsNav.prototype.fwdItem = function() {
	var list = this.navArray[this.navListIdx];
	var index = this.navItemIdxs[this.navListIdx];
	if ((list.tailTarget !== null) && (index + 1 >= list.items.length)) {
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
 * 
 * @return {Object?} The previous item. Use item.elem to get at the DOM node.
 */
AxsNav.prototype.prevItem = function() {
	if (this.navArray.length < 1) {
		return null;
	}
	var currentList = this.navArray[this.navListIdx];
	var items = currentList.items;
	if (items.length < 1) {
		return null;
	}
	if (this.lastItem) {
		var currentListId = this.getListId(currentList);
		var syncedIndex = this.lastItem.elem.AxsNavInfo[currentListId];
		if (typeof (syncedIndex) != 'undefined') {
			this.navItemIdxs[this.navListIdx] = syncedIndex;
		}
	}
	this.navItemIdxs[this.navListIdx]--;
	var looped = false;
	if (this.navItemIdxs[this.navListIdx] < 0) {
		this.navItemIdxs[this.navListIdx] = items.length - 1;
		looped = true;
	}
	var itemIndex = this.navItemIdxs[this.navListIdx];
	// Perform a validity check to determine if the xpaths should be
	// re-evaluated
	if (items[itemIndex].elem.parentNode === null) {
		// Clear the lens to avoid its contents interfering with the xpath
		if (this.lens_ !== null) {
			this.lens_.view(null);
		}
		currentList.items = this.makeItemsArray(currentList.origListObj);
		this.navItemIdxs[this.navListIdx] = currentList.items.length;
		itemIndex = this.navItemIdxs[this.navListIdx];
	}
	this.lastItem = items[itemIndex];
	if (this.snd_ !== null) {
		if (looped) {
			this.snd_.play(this.WRAP_SND);
		} else {
			this.snd_.play(this.ITEM_SND);
		}
	}
	return this.lastItem;
};

/**
 * Goes to the previous item and returns it; if this causes wrapping and there
 * is a headTarget on the list, then this will act on that target and return
 * null instead.
 * 
 * @return {Object?} The previous item. Use item.elem to get at the DOM node.
 */
AxsNav.prototype.backItem = function() {
	var list = this.navArray[this.navListIdx];
	var index = this.navItemIdxs[this.navListIdx];
	if ((list.headTarget !== null) && (index <= 0)) {
		this.actOnTarget(list.headTarget);
		this.navItemIdxs[this.navListIdx] = list.items.length - 1;
		return null;
	}
	var item = this.prevItem();
	return item;
};

/**
 * Returns the current item.
 * 
 * @return {Object?} The current item. Use item.elem to get at the DOM node.
 */
AxsNav.prototype.currentItem = function() {
	if (this.navArray.length < 1) {
		return null;
	}
	var currentList = this.navArray[this.navListIdx];
	if (this.lastItem) {
		var currentListId = this.getListId(currentList);
		var syncedIndex = this.lastItem.elem.AxsNavInfo[currentListId];
		if (typeof (syncedIndex) != 'undefined') {
			this.navItemIdxs[this.navListIdx] = syncedIndex;
		}
	}
	var items = currentList.items;
	var itemIndex = this.navItemIdxs[this.navListIdx];
	this.lastItem = items[itemIndex];
	return this.lastItem;
};

/**
 * Returns the callback function if the action is a valid callback; returns null
 * otherwise.
 * 
 * @param {String?}
 *            actionString The action string for an item or target.
 * @return {Function?} The callback function if there is a valid one.
 */
AxsNav.prototype.getCallbackFunction = function(actionString) {
	var callbackFunc = null;
	if ((actionString !== null) && actionString.indexOf
			&& (actionString.indexOf('CALL:') === 0)
			&& (actionString.indexOf('(') === -1)) {
		try {
			callbackFunc = /** @type {Function} */
			(eval(actionString.substring(5)));
		} catch (e) {
		}
	}
	return callbackFunc;
};

/**
 * This function will act on the item based on what action was specified in the
 * Content Navigation Listing.
 * 
 * @param {Object?}
 *            item The item to act on. Use item.elem to get at the DOM node.
 */
AxsNav.prototype.actOnItem = function(item) {
	if (item !== null) {
		var self = this;
		var doAction = function() {
			var func = self.getCallbackFunction(item.action);
			if (func) {
				func(item);
			} else {
				if (self.lens_ !== null) {
					self.lens_.view(item.elem);
				}
				self.axs_.goTo(item.elem);
			}
		};
		// If there is a node that was focused, unfocus it so that
		// any keys the user presses after using the nav system will not
		// be sent to the wrong place.
		if (this.axs_.lastFocusedNode && this.axs_.lastFocusedNode.blur) {
			var oldNode = this.axs_.lastFocusedNode;
			// Set the lastFocusedNode to null to prevent AxsJAX's blur handler
			// from kicking in as that blur handler will conflict with the
			// temporary blur handler which results in screen readers not
			// speaking properly due to how the eventing system works.
			// Because we are not allowing the regular blur handler to work,
			// we need to make sure that we do the same work of cleaning up.
			this.axs_.lastFocusedNode = null;
			if (oldNode.removeAttribute) {
				this.axs_.removeAttributeOf(oldNode, 'aria-activedescendant');
			}
			// The action needs to be done inside a temporary blur handler
			// because otherwise, there is a timing issue of when the events
			// get sent and screen readers won't speak.
			var tempBlurHandler = function(evt) {
				evt.target.removeEventListener('blur', tempBlurHandler, true);
				doAction();
			};
			oldNode.addEventListener('blur', tempBlurHandler, true);
			oldNode.blur();
		} else {
			doAction();
		}
	} else {
		var currentList = this.navArray[this.navListIdx];
		if (currentList.type == 'dynamic') {
			this.axs_.speakTextViaNode(currentList.onEmpty);
		}
	}
};

/**
 * This function creates the maps keypresses to a method on a given char and key
 * map.
 * 
 * @param {Array}
 *            keyArray Array of keys that will be associated with the method.
 * 
 * @param {Object}
 *            charMap Dictionary that maps character codes to methods.
 * 
 * @param {Object}
 *            keyMap Dictionary that maps key codes to methods.
 * 
 * @param {Function}
 *            method Method to be be associated with the array of keys.
 */
AxsNav.prototype.assignKeysToMethod = function(keyArray, charMap, keyMap,
		method) {
	for ( var i = 0, key; key = keyArray[i]; i++) {
		if (key == 'LEFT') {
			keyMap[37] = method;
		} else if (key == 'UP') {
			keyMap[38] = method;
		} else if (key == 'RIGHT') {
			keyMap[39] = method;
		} else if (key == 'DOWN') {
			keyMap[40] = method;
		} else if (key == 'PGUP') {
			keyMap[33] = method;
		} else if (key == 'PGDOWN') {
			keyMap[34] = method;
		} else if (key == 'ENTER') {
			keyMap[13] = method;
		} else if (key == 'ESC') {
			keyMap[27] = method;
		} else if (key == 'DEL') {
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
 * @param {string}
 *            keyStr String that indicates the keys to be used.
 * 
 * @param {number}
 *            navListIdx Index of the list that these keypresses are associated
 *            with.
 * 
 * @param {string}
 *            navTaskStr "next","prev","fwd","back".
 */
AxsNav.prototype.assignItemKeys = function(keyStr, navListIdx, navTaskStr) {
	var keys = new Array();
	if (keyStr === '') {
		return;
	}
	keys = keyStr.split(' ');
	var self = this;
	if (navTaskStr == 'prev') {
		this.assignKeysToMethod(keys, this.charCodeMaps[navListIdx],
				this.keyCodeMaps[navListIdx], function() {
					self.actOnItem(self.prevItem());
				});
	} else if (navTaskStr == 'next') {
		this.assignKeysToMethod(keys, this.charCodeMaps[navListIdx],
				this.keyCodeMaps[navListIdx], function() {
					self.actOnItem(self.nextItem());
				});
	} else if (navTaskStr == 'back') {
		this.assignKeysToMethod(keys, this.charCodeMaps[navListIdx],
				this.keyCodeMaps[navListIdx], function() {
					var backItem = self.backItem();
					if (backItem !== null) {
						self.actOnItem(backItem);
					}
				});
	} else {
		this.assignKeysToMethod(keys, this.charCodeMaps[navListIdx],
				this.keyCodeMaps[navListIdx], function() {
					var fwdItem = self.fwdItem();
					if (fwdItem != null) {
						self.actOnItem(fwdItem);
					}
				});
	}
};

/**
 * This function creates the mapping between keypresses and navigation behavior
 * for hotkeys. This mapping is active all the time, regardless of which navList
 * the user is in.
 * 
 * @param {string}
 *            keyStr String that indicates the keys to be used. Pressing these
 *            keys will cause the user to jump to the list that the key is
 *            associated with and read the next item there.
 * 
 * @param {number}
 *            navListIdx Index of the list that these keypresses are associated
 *            with.
 * 
 * @param {string}
 *            emptyMsg String to speak to the user if the list is empty.
 */
AxsNav.prototype.assignHotKeys = function(keyStr, navListIdx, emptyMsg) {
	var keys = new Array();
	if (keyStr === '') {
		return;
	}
	keys = keyStr.split(' ');
	var self = this;
	this.assignKeysToMethod(keys, this.topCharCodeMap, this.topKeyCodeMap,
			function() {
				if (!self.validateList(self.navArray[navListIdx])) {
					self.axs_.speakTextViaNode(emptyMsg);
					return;
				}
				self.navListIdx = navListIdx;
				self.actOnItem(self.nextItem());
			});
};

/**
 * For all keys that map to lists with no items, those keys should speak some
 * message to let the user know that the function was called but was
 * unsuccessful because there is no content.
 * 
 * @param {string}
 *            keyStr String that indicates the keys to be used.
 * 
 * @param {string}
 *            emptyMsg The message that should be spoken when the user presses
 *            the key(s) to let them know that there is no content.
 */
AxsNav.prototype.assignEmptyMsgKeys = function(keyStr, emptyMsg) {
	var keys = new Array();
	if (keyStr === '') {
		return;
	}
	keys = keyStr.split(' ');
	var self = this;
	this.assignKeysToMethod(keys, this.topCharCodeMap, this.topKeyCodeMap,
			function() {
				self.axs_.speakTextViaNode(emptyMsg);
			});

};

/**
 * This function creates the mapping between keypresses and target nodes. This
 * mapping is active all the time, regardless of which navList the user is in.
 * 
 * @param {Object}
 *            target Target object created from the <target> element.
 * @param {Object}
 *            charMap Dictionary that maps character codes to methods.
 * @param {Object}
 *            keyMap Dictionary that maps key codes to methods.
 */
AxsNav.prototype.assignTargetKeys = function(target, charMap, keyMap) {
	var keys = new Array();
	if (target.hotkey === '') {
		return;
	}
	keys = target.hotkey.split(' ');
	var self = this;
	this.assignKeysToMethod(keys, charMap, keyMap, function() {
		self.actOnTarget(target);
	});
};

/**
 * This function will act on the target specified.
 * 
 * @param {?Object}
 *            target The target to act on.
 */
AxsNav.prototype.actOnTarget = function(target) {
	if (target.action == 'click') {
		this.clickOnTarget(target);
	} else {
		this.callActionOnTarget(target);
	}
};

/**
 * Calls the appropriate action on a target.
 * 
 * @param {Object}
 *            target the target to act upon.
 */
AxsNav.prototype.callActionOnTarget = function(target) {
	var elems = this.getElementsForTarget(target);
	if (elems.length < 1) {
		this.axs_.speakTextViaNode(target.onEmpty);
	} else {
		var func = this.getCallbackFunction(target.action);
		if (func) {
			var item = new Object();
			item.action = target.action;
			item.elem = elems[0];
			func(item);
			this.axs_.markPosition(elems[0]);
		} else {
			throw new Error('Invalid action: ' + target.action);
		}
	}
};

/**
 * Performs the click action of a target.
 * 
 * @param {Object}
 *            target the target to act upon.
 */
AxsNav.prototype.clickOnTarget = function(target) {
	var elems = this.getElementsForTarget(target);
	if (elems.length < 1) {
		this.axs_.speakTextViaNode(target.onEmpty);
	} else {
		this.axs_.clickElem(elems[0], false);
		elems[0].scrollIntoView(true);
		this.axs_.markPosition(elems[0]);
	}
};

/**
 * Returns the elements referenced by a target
 * 
 * @param {?Object}
 *            target a target element.
 * @return {Array} an array of elements.
 */
AxsNav.prototype.getElementsForTarget = function(target) {
	var xpath = target.xpath;
	var rootNode = this.axs_.getActiveDocument().documentElement;
	if (xpath.indexOf('.') === 0) {
		rootNode = this.currentItem().elem;
	}
	return this.axs_.evalXPath(xpath, rootNode);
};

/**
 * Returns a function mapped to a key.
 * 
 * @param {number}
 *            keyCode A key code.
 * @param {number}
 *            charCode A char code.
 * @return {Function?} A function mapped to the keyCode or charCode, undefined
 *         if the mapping does not exist.
 */
AxsNav.prototype.getFunctionForKey = function(keyCode, charCode) {
	var command = null;
	var idx = this.navListIdx;
	if (idx < this.keyCodeMaps.length) {
		command = this.keyCodeMaps[idx][keyCode]
				|| this.charCodeMaps[idx][charCode] || null;
	}
	if (command === null) {
		command = this.topKeyCodeMap[keyCode] || this.topCharCodeMap[charCode];
	}
	return command;
};

/**
 * Builds up the navigation system of lists of items. This system uses the idea
 * of multiple cursors and the visitor pattern.
 * 
 * @param {string}
 *            cnrString An XML string that contains the information needed to
 *            build up the content navigation rule.
 * 
 * @notypecheck {Function?} opt_customNavMethod.
 * 
 * @param {Function?}
 *            opt_customNavMethod A custom navigation method provided by the
 *            caller. This navigation method will be given the DOM created from
 *            the cnrString, the navigation array of lists of items, an array of
 *            all the lists which had zero items, and an an array of targets. If
 *            this is null, the default AxsJAX nav handler will be used.
 */
AxsNav.prototype.navInit = function(cnrString, opt_customNavMethod) {
	var cnrJson = new Object();
	cnrJson.lists = new Array();

	var parser = new DOMParser();
	var cnrDOM = parser.parseFromString(cnrString, 'text/xml');

	// Build up the navigation lists
	var lists = cnrDOM.getElementsByTagName('list');

	var i;
	var listNode;
	for (i = 0, listNode; listNode = lists[i]; i++) {
		var navList = new Object();
		navList.title = listNode.getAttribute('title');
		navList.hotkey = listNode.getAttribute('hotkey');
		navList.next = listNode.getAttribute('next');
		navList.prev = listNode.getAttribute('prev');
		navList.fwd = listNode.getAttribute('fwd');
		navList.back = listNode.getAttribute('back');
		navList.onEmpty = listNode.getAttribute('onEmpty');
		navList.type = listNode.getAttribute('type');

		var j;
		var entry;
		var k;
		var attributes;
		var length;
		// Parse items to JSON
		navList.items = new Array();
		var cnrItems = listNode.getElementsByTagName('item');
		for (j = 0; entry = cnrItems[j]; j++) {
			var item = new Object();
			item.xpath = entry.textContent;
			if (entry.attributes instanceof NamedNodeMap) {
				attributes = entry.attributes;
				length = attributes.length;
				for (k = 0; k < length; k++) {
					var attrib = attributes.item(k);
					item[attrib.nodeName] = attrib.value;
				}
			}
			navList.items.push(item);
		}
		// Parse targets to JSON
		navList.targets = new Array();
		var cnrTargets = listNode.getElementsByTagName('target');
		for (j = 0; entry = cnrTargets[j]; j++) {
			var target = new Object();
			target.xpath = entry.textContent;
			if (entry.attributes instanceof NamedNodeMap) {
				attributes = entry.attributes;
				length = attributes.length;
				for (k = 0; k < length; k++) {
					var attrib = attributes.item(k);
					target[attrib.nodeName] = attrib.value;
				}
			}
			navList.targets.push(target);
		}
		cnrJson.lists.push(navList);
	}

	// Build up the targets
	cnrJson.targets = new Array();
	var currentNode;
	var cnrNode = cnrDOM.firstChild;
	for (i = 0, currentNode; currentNode = cnrNode.childNodes[i]; i++) {
		if (currentNode.tagName == 'target') {
			var target = new Object();
			target.xpath = currentNode.textContent;
			if (currentNode.attributes instanceof NamedNodeMap) {
				attributes = currentNode.attributes;
				length = attributes.length;
				for (k = 0; k < length; k++) {
					var attrib = attributes.item(k);
					target[attrib.nodeName] = attrib.value;
				}
			}
			cnrJson.targets.push(target);
		}
	}

	// Get the next/prev list keys
	cnrJson.next = cnrNode.getAttribute('next');
	cnrJson.prev = cnrNode.getAttribute('prev');

	if ((opt_customNavMethod === null)
			|| (typeof (opt_customNavMethod) == 'undefined')) {
		this.navInitJson(cnrJson, opt_customNavMethod);
	} else {
		// Wrapper function that will invoke the user's opt_customNavMethod
		// This will be called when navInitJson is done processing
		var func = new function(dummyJson, navArray, emptyLists, targetsArray) {
			opt_customNavMethod(cnrNode, navArray, emptyLists, targetsArray);
		}
		this.navInitJson(cnrJson, func);
	}
};

/**
 * Generates a help string for the globally available keys. Keys which are
 * specific to the current list are NOT included.
 * 
 * @return {string} The help string for globally available keys.
 */
AxsNav.prototype.globalHelpString = function() {
	var globalActions = this.getGlobalActions();

	var helpStr = '';
	for ( var i = 0, action; action = globalActions[i]; i++) {
		helpStr = helpStr + action.keys + ', ' + action.title + '. ';
	}

	helpStr = helpStr + this.nextListKeys + ', ' + AxsNav.str.NEXT_LIST;
	helpStr = helpStr + this.prevListKeys + ', ' + AxsNav.str.PREV_LIST;

	// Make the keys sound nicer when spoken
	helpStr = helpStr.replace('PGUP', AxsNav.str.PGUP);
	helpStr = helpStr.replace('PGDOWN', AxsNav.str.PGDOWN);
	helpStr = helpStr.replace('ENTER', AxsNav.str.ENTER);
	helpStr = helpStr.replace('DEL', AxsNav.str.DELETE);
	helpStr = helpStr.replace('UP', AxsNav.str.UP);
	helpStr = helpStr.replace('DOWN', AxsNav.str.DOWN);
	helpStr = helpStr.replace('LEFT', AxsNav.str.LEFT);
	helpStr = helpStr.replace('RIGHT', AxsNav.str.RIGHT);

	return helpStr;
};

/**
 * Generates a help string for locally available keys.
 * 
 * @return {string} The help string for locally available keys.
 */
AxsNav.prototype.localHelpString = function() {
	var localActions = this.getLocalActions();

	var helpStr = '';
	for ( var i = 0, action; action = localActions[i]; i++) {
		helpStr = helpStr + action.keys + ', ' + action.title + '. ';
	}

	var list = this.currentList();
	if (list.nextKeys !== '') {
		helpStr = helpStr + list.nextKeys + ', ' + AxsNav.str.CYCLE_NEXT + '. ';
	}
	if (list.prevKeys !== '') {
		helpStr = helpStr + list.prevKeys + ', ' + AxsNav.str.CYCLE_PREV + '. ';
	}
	if (list.fwdKeys !== '') {
		helpStr = helpStr + list.fwdKeys + ', ' + AxsNav.str.GO_FORWARD + '. ';
	}
	if (list.backKeys !== '') {
		helpStr = helpStr + list.backKeys + ', ' + AxsNav.str.GO_BACKWARDS
				+ '. ';
	}

	// Make the keys sound nicer when spoken
	helpStr = helpStr.replace('PGUP', AxsNav.str.PGUP);
	helpStr = helpStr.replace('PGDOWN', AxsNav.str.PGDOWN);
	helpStr = helpStr.replace('ENTER', AxsNav.str.ENTER);
	helpStr = helpStr.replace('DEL', AxsNav.str.DELETE);
	helpStr = helpStr.replace('UP', AxsNav.str.UP);
	helpStr = helpStr.replace('DOWN', AxsNav.str.DOWN);
	helpStr = helpStr.replace('LEFT', AxsNav.str.LEFT);
	helpStr = helpStr.replace('RIGHT', AxsNav.str.RIGHT);

	return helpStr;
};

/**
 * This function sets the lens to be used when going to an item's element.
 * 
 * @param {Object?}
 *            lens The AxsLens object to be used. If null, no lens will be used.
 */
AxsNav.prototype.setLens = function(lens) {
	this.lens_ = lens;
};

/**
 * This function sets the lens to be used when going to an item's element.
 * 
 * @param {Object?}
 *            snd The AxsSound object to be used. The AxsSound object should
 *            already have its verbosity set and be initialized. If null, no
 *            sound object will be used.
 */
AxsNav.prototype.setSound = function(snd) {
	this.snd_ = snd;
};

/**
 * Refreshes the dynamic list with the specified title.
 * 
 * @param {string?}
 *            listTitle The title of the list that should be refreshed.
 * @return {boolean} True if the list was successfully refreshed.
 */
AxsNav.prototype.refreshList = function(listTitle) {
	if (listTitle === null) {
		return false;
	}
	var reloaded = false;
	var listId = this.findListIndexByTitle(listTitle);
	if (listId > -1) {
		var navList = this.navArray[listId];
		navList.items = new Array();
		navList.targets = new Array();
		reloaded = this.validateList(navList);
	}
	return reloaded;
};

/**
 * Disables the default keyboard handler for the AxsNav object by detaching it
 * from the keypress event listener for the current document.
 */
AxsNav.prototype.disableNavKeys = function() {
	if (this.keyHandler !== null) {
		document.removeEventListener('keypress', this.keyHandler, true);
	}
};

/**
 * Re-enables the default keyboard handler for the AxsNav object by reattaching
 * it to the keypress event listener for the current document. This function
 * assumes AxsNav.prototype.setUpNavKeys has already been called so that
 * this.keyHandler is already setup and ready to go.
 */
AxsNav.prototype.enableNavKeys = function() {
	if (this.keyHandler !== null) {
		// Remove it once so that the keyHandler is not accidentally added twice
		// just in case enableNavKeys has already been called.
		// If it has not already been added, this first removeEventListener call
		// is a no-op.
		document.removeEventListener('keypress', this.keyHandler, true);
		document.addEventListener('keypress', this.keyHandler, true);
	}
};

/**
 * Shows a PowerKey input box for selecting an available action. Available
 * actions are those that have nodes when their xPaths are evaluated when this
 * function is called.
 */
AxsNav.prototype.showAvailableActionsSelector = function() {
	// Fail silently if the PowerKey object is not set
	if (this.pk_ === null) {
		return;
	}

	var globalActions = this.getGlobalActions();
	var localActions = this.getLocalActions();

	if ((globalActions.length + localActions.length) === 0) {
		this.axs_.speakTextViaNode(AxsNav.str.NO_AVAILABLE_ACTION);
		return;
	}

	var actionTitles = new Array();
	var i = 0;
	var action = '';
	for (i = 0; action = localActions[i]; i++) {
		actionTitles.push(action.title);
	}
	for (i = 0; action = globalActions[i]; i++) {
		actionTitles.push(action.title);
	}

	this.pk_.setCompletionList(actionTitles);
	this.pk_.updateCompletionField('visible', true, 40, 20);
};

/**
 * Gets the global available actions in the current context. Each action has a
 * "title" member and a "keys" member.
 * 
 * @return {Array} An array of the globally available actions.
 */
AxsNav.prototype.getGlobalActions = function() {
	var globalActions = new Array();

	var action;

	// global list actions
	for ( var i = 0, list; list = this.navArray[i]; i++) {
		if (list.hotKeys !== '') {
			action = new Object();
			action.title = list.title;
			action.keys = list.hotKeys;
			globalActions.push(action);
		}
	}

	// global targets
	for ( var j = 0, target; target = this.targetsArray[j]; j++) {
		if (this.isValidTargetAction(target)) {
			action = new Object();
			action.title = target.title;
			action.keys = target.hotkey;
			globalActions.push(action);
		}
	}

	return globalActions;
};

/**
 * Gets the locally available actions in the current context. Each action has a
 * "title" member and a "keys" member.
 * 
 * @return {Array} An array of the locally available actions.
 */
AxsNav.prototype.getLocalActions = function() {
	var localActions = new Array();

	// local targets
	var currentList = this.currentList();
	for ( var i = 0, target; target = currentList.targets[i]; i++) {
		if (this.isValidTargetAction(target)) {
			var action = new Object();
			action.title = target.title;
			action.keys = target.hotkey;
			localActions.push(action);
		}
	}

	return localActions;
};

/**
 * Initializes the PowerKey instance that presents the valid actions. This
 * method initializes the PowerKey object with reasonable default values.
 */
AxsNav.prototype.defaultInitPowerKeyObj = function() {
	var parentElement = this.axs_.getActiveDocument().body;

	// handles the selected action
	var self = this;

	var handler = function(completion, index, elementId, args) {
		var localActions = self.getLocalActions();
		var globalActions = self.getGlobalActions();
		var allActions = localActions.concat(globalActions);

		var hotkeyStr = allActions[index].keys;
		var key = hotkeyStr.split(' ')[0];
		var keyCode = -1;
		var charCode = -1;

		if (key == 'LEFT') {
			keyCode = 37;
		} else if (key == 'UP') {
			keyCode = 38;
		} else if (key == 'RIGHT') {
			keyCode = 39;
		} else if (key == 'DOWN') {
			keyCode = 40;
		} else if (key == 'PGUP') {
			keyCode = 33;
		} else if (key == 'PGDOWN') {
			keyCode = 34;
		} else if (key == 'ENTER') {
			keyCode = 13;
		} else if (key == 'DEL') {
			keyCode = 46;
		} else if (key == 'ESC') {
			keyCode = 27;
		} else {
			charCode = key.charCodeAt(0);
		}

		self.pk_.cmpTextElement.blur();
		var command = self.getFunctionForKey(keyCode, charCode);
		if (command) {
			command();
		}
	};

	this.pk_.createCompletionField(parentElement, 50, handler, null,
			this.availableActionArray, false);

	this.pk_.setCompletionPromptStr(AxsNav.str.SELECT_ACTION);
	this.pk_.setAutoHideCompletionField(true);
	this.pk_.setDefaultCSSStyle();
};

/**
 * Returns true if the xPath of this target. evaluates to a non empty set of
 * nodes.
 * 
 * @param {Object}
 *            target A target object.
 * @return {boolean} Whether the target action is valid.
 */
AxsNav.prototype.isValidTargetAction = function(target) {
	var valid = false;

	if (target.hotkey !== '') {
		var xPath = target.xpath;
		var rootNode = this.axs_.getActiveDocument().body;

		// Handle relative XPath
		if (xPath.indexOf('.') === 0) {
			var currentItem = this.currentItem();
			if (currentItem) {
				rootNode = currentItem.elem;
			}
		}

		// Find xPaths that return non empty set of nodes
		var nodes = this.axs_.evalXPath(xPath, rootNode);
		if (nodes.length > 0) {
			valid = true;
		}
	}
	return valid;
};

/**
 * Builds up the navigation system of lists of items. This system uses the idea
 * of multiple cursors and the visitor pattern.
 * 
 * @param {Object}
 *            cnrJson The CNR as a JSON.
 * 
 * @notypecheck {Function?} opt_customNavMethod.
 * 
 * @param {Function?}
 *            opt_customNavMethod A custom navigation method provided by the
 *            caller. This navigation method will be given the original cnrJson,
 *            the navigation array of lists of items, an array of all the lists
 *            which had zero items, and an array of targets. If this is null,
 *            the default AxsJAX nav handler will be used.
 */
AxsNav.prototype.navInitJson = function(cnrJson, opt_customNavMethod) {
	this.navArray = new Array();
	this.navListIdx = 0;
	this.navItemIdxs = new Array();

	var emptyLists = new Array();

	var i;
	var currentList;
	for (i = 0, currentList; currentList = cnrJson.lists[i]; i++) {
		var navList = new Object();
		currentList.listId = i; // create an id for the list
		navList.cnrNode = null;
		navList.origListObj = currentList;
		navList.title = currentList.title || '';
		navList.hotKeys = currentList.hotkey || '';
		navList.nextKeys = currentList.next || '';
		navList.prevKeys = currentList.prev || '';
		navList.fwdKeys = currentList.fwd || '';
		navList.backKeys = currentList.back || '';
		navList.onEmpty = currentList.onEmpty || '';
		navList.type = currentList.type || '';
		navList.tailTarget = null;
		navList.headTarget = null;
		navList.entryTarget = null;
		navList.items = this.makeItemsArray(currentList);
		navList.targets = this.makeTargetsArray(currentList);
		for ( var j = 0, listTarget; listTarget = navList.targets[j]; j++) {
			if (listTarget.trigger == 'listTail') {
				navList.tailTarget = listTarget;
			} else if (listTarget.trigger == 'listHead') {
				navList.headTarget = listTarget;
			} else if (listTarget.trigger == 'listEntry') {
				navList.entryTarget = listTarget;
			}
		}
		if (navList.items.length > 0 || navList.type == 'dynamic') {
			// Only add nav lists that have content to the array
			this.navArray.push(navList);
			this.navItemIdxs.push(-1);
		} else if (navList.hotKeys !== '') {
			// Record empty nav lists if the user can jump to them directly
			emptyLists.push(navList);
		}
	}

	// Build up the targets
	var targets = new Array();
	this.targetsArray = new Array();
	this.targetsIdx = 0;
	var currentTarget;
	if (cnrJson.targets) {
		for (i = 0, currentTarget; currentTarget = cnrJson.targets[i]; i++) {
			var target = new Object();
			// Strip all leading and trailing spaces from the xpath
			target.xpath = currentTarget.xpath;
			target.xpath = target.xpath.replace(/^\s\s*/, '').replace(/\s\s*$/,
					'');
			target.title = currentTarget.title || '';
			target.trigger = currentTarget.trigger || 'key';
			target.hotkey = currentTarget.hotkey || '';
			target.action = currentTarget.action || 'click';
			target.onEmpty = currentTarget.onEmpty || '';
			this.targetsArray.push(target);
		}
	}

	// Remove the previous event listener if there was one
	if (this.keyHandler !== null) {
		document.removeEventListener('keypress', this.keyHandler, true);
	}
	// Bind lists and targets to keys if there is no custom handler specified
	if ((opt_customNavMethod === null)
			|| (typeof (opt_customNavMethod) == 'undefined')) {
		this.setUpNavKeys(cnrJson, emptyLists);
	} else {
		opt_customNavMethod(cnrJson, this.navArray, emptyLists,
				this.targetsArray);
	}
};

/**
 * Makes an array of items given a navigation list node and its index. Elements
 * associated with a list will be marked as such.
 * 
 * @param {Object}
 *            jsonListObj The navigation list node.
 * @return {Array} The array of items.
 */
AxsNav.prototype.makeItemsArray = function(jsonListObj) {
	var itemsArray = new Array();
	if (!jsonListObj.items) {
		return itemsArray;
	}
	for ( var i = 0, entry; entry = jsonListObj.items[i]; i++) {
		// Do this in a try-catch block since there are multiple
		// sets of items and even if one set does not exist as expected,
		// the other sets should still be available.
		try {
			// Strip all leading and trailing spaces from the xpath
			var xpath = entry.xpath.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			var htmlElem = this.axs_.getActiveDocument().documentElement;
			var elems = this.axs_.evalXPath(xpath, htmlElem);
			var idxStr = entry.index || '0';
			var idx = parseInt(idxStr, 10);
			var count = elems.length - idx;
			var countStr = entry.count || '*';
			if (countStr != '*') {
				count = parseInt(countStr, 10);
			}
			var end = count + idx;
			var action = entry.action || null;
			while (idx < end) {
				var item = new Object();
				item.action = action;
				item.elem = elems[idx];
				if (typeof (item.elem) != 'undefined') {
					if (typeof (item.elem.AxsNavInfo) == 'undefined') {
						item.elem.AxsNavInfo = new Object();
					}
					if (typeof (jsonListObj.listId) == 'undefined') {
						throw new Error('list does not have an id');
					}
					item.elem.AxsNavInfo[jsonListObj.listId] = itemsArray.length;
					itemsArray.push(item);
				}
				idx++;
			}
		} catch (err) {
		}
	}
	return itemsArray;
};

/**
 * Returns an array of target objects for the given <list> node.
 * 
 * @param {Object}
 *            jsonListObj A <list> node.
 * @return {Array} An array of target objects.
 */
AxsNav.prototype.makeTargetsArray = function(jsonListObj) {
	var targetsArray = new Array();
	if (!jsonListObj.targets) {
		return targetsArray;
	}
	for ( var i = 0, entry; entry = jsonListObj.targets[i]; i++) {
		var target = new Object();
		// Strip all leading and trailing spaces from the xpath
		target.xpath = entry.xpath.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		target.title = entry.title || '';
		target.trigger = entry.trigger || 'key';
		target.hotkey = entry.hotkey || '';
		target.action = entry.action || 'click';
		target.onEmpty = entry.onEmpty || '';
		targetsArray.push(target);
	}
	return targetsArray;
};

/**
 * This function attaches the default AxsJAX key handler for navigation.
 * 
 * @param {Object}
 *            cnrJson The CNR as a JSON.
 * @param {Array}
 *            emptyLists An array of lists which have zero items.
 */
AxsNav.prototype.setUpNavKeys = function(cnrJson, emptyLists) {
	var self = this;
	var i;

	this.topCharCodeMap = new Object();
	this.topKeyCodeMap = new Object();
	this.charCodeMaps = new Array();
	this.keyCodeMaps = new Array();

	// Acting on global targets
	var target;
	for (i = 0, target; target = this.targetsArray[i]; i++) {
		this.assignTargetKeys(target, this.topCharCodeMap, this.topKeyCodeMap);
	}

	// Moving through lists
	var keys = new Array();
	this.nextListKeys = cnrJson.next || '';
	if (this.nextListKeys !== '') {
		keys = this.nextListKeys.split(' ');
	}
	this.assignKeysToMethod(keys, this.topCharCodeMap, this.topKeyCodeMap,
			function() {
				self.nextList();
				self.doListEntryActions();
			});

	keys = new Array();
	this.prevListKeys = cnrJson.prev || '';
	if (this.prevListKeys !== '') {
		keys = this.prevListKeys.split(' ');
	}
	this.assignKeysToMethod(keys, this.topCharCodeMap, this.topKeyCodeMap,
			function() {
				self.prevList();
				self.doListEntryActions();
			});

	// Moving through items and handling per-list targets
	var list;
	for (i = 0, list; list = this.navArray[i]; i++) {
		var charMap = new Object();
		var keyMap = new Object();
		this.charCodeMaps.push(charMap);
		this.keyCodeMaps.push(keyMap);
		this.assignItemKeys(list.nextKeys, i, 'next');
		this.assignItemKeys(list.prevKeys, i, 'prev');
		this.assignItemKeys(list.fwdKeys, i, 'fwd');
		this.assignItemKeys(list.backKeys, i, 'back');
		this.assignHotKeys(list.hotKeys, i, list.onEmpty);
		var j;
		for (j = 0, target; target = list.targets[j]; j++) {
			this.assignTargetKeys(target, charMap, keyMap);
		}
	}

	// Dealing with empty lists with hotkeys
	var emptyList;
	for (i = 0, emptyList; emptyList = emptyLists[i]; i++) {
		this.assignEmptyMsgKeys(emptyList.hotKeys, emptyList.onEmpty);
	}

	this.keyHandler = function(evt) {
		// None of these commands involve Ctrl.
		// If Ctrl is held, it must be for some AT.
		if (evt.ctrlKey)
			return true;
		if (self.axs_.inputFocused)
			return true;

		var command = self.getFunctionForKey(evt.keyCode, evt.charCode);

		if (command) {
			return command();
		}

		// TEMPORARY FOR TESTING TEST
		event.preventDefault();
		//END
	};

	document.addEventListener('keypress', this.keyHandler, true);
};

/**
 * Returns the id of a given list
 * 
 * @param {Object}
 *            list a list.
 * @return {Number} the id of the list.
 */
AxsNav.prototype.getListId = function(list) {
	return list.origListObj.listId;
};

/**
 * Takes the cursor before the beginning of the specified list.
 * 
 * @param {Number}
 *            listIndex the index of the given list.
 */
AxsNav.prototype.goToListHead = function(listIndex) {
	if (this.navArray.length < 1) {
		return;
	}
	// Clear the last item
	this.lastItem = null;
	// Set the current list
	this.navListIdx = listIndex;
	// Update the list
	this.validateList(this.navArray[listIndex]);
	this.doListEntryActions();
	// Set the item at the top
	this.navItemIdxs[listIndex] = -1;
};

/**
 * Takes the cursor to the end of the specified list.
 * 
 * @param {Number}
 *            listIndex the index of the given list.
 */
AxsNav.prototype.goToListTail = function(listIndex) {
	if (this.navArray.length < 1) {
		return;
	}
	this.goToListHead(listIndex);
	// The navList object
	var list = this.navArray[listIndex];
	// Set the item at the bottom
	this.navItemIdxs[listIndex] = list.items.length - 1;
};

/**
 * Finds a list id given it's name
 * 
 * @param {String}
 *            listTitle the name of the list.
 * @return {number} The index of the list with the given title or -1 if no list
 *         with the given title exists.
 */
AxsNav.prototype.findListIndexByTitle = function(listTitle) {
	for ( var i = 0; i < this.navArray.length; i++) {
		var list = this.navArray[i];
		if (list.title == listTitle) {
			break;
		}
	}
	if (i < this.navArray.length) {
		return i;
	} else {
		return -1;
	}
};

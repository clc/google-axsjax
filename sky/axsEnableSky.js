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
 * of Google Sky.
 * Note that these  scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsSky = {};

//These are strings used to find specific links

/**
 * These are strings to be spoken to the user
 * @type string
 */
axsSky.HELP_STRING = 'The following shortcut keys are available. ' +
                     'N, go to the next item. ' +
                     'P, go to the previous item. ' +
                     'Enter, open the current item. ' +
                     'T, go to the top menu. ' +
                     'Escape, stop the podcast that is currently playing. ';
/**
 * @type string
 */
axsSky.ITEMS_LOADED = 'Items loaded.';

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsSky.axsJAXObj = null;

/**
 * The AxsSound object that will play earcons
 * @type AxsSound?
 */
axsSky.axsSoundObj = null;

/**
 * Array for holding the items in the menu
 * @type Array
 */
axsSky.itemsArray = new Array();

/**
 * Index for the array of items in the menu
 * @type number
 */
axsSky.itemsIndex = -1;

/**
 * The current item that is active in the menu
 * @type Node
 */
axsSky.currentItem = null;

/**
 * Podcasts have multiple insertion events; 
 * don't act on the first insertion.
 * @type number
 */
axsSky.insertCount = 0;

/**
 * Initializes the script
 */
axsSky.init = function(){
  axsSky.axsJAXObj = new AxsJAX(true);
  axsSky.axsSoundObj = new AxsSound(false);
  axsSky.axsSoundObj.init();
  //Add event listeners
  document.addEventListener('keypress', axsSky.keyHandler, true);

  window.addEventListener('DOMNodeInserted', axsSky.domInsertionHandler, true);

  axsSky.getItems();
};

/**
 * When popouts happen, they are DOM insertions.
 * @param {Object} evt A DOMNodeInserted event
 */
axsSky.domInsertionHandler = function(evt){
  var target = evt.target;
  if (target.firstChild && (target.firstChild.id == 'infoScrollDiv')){
    var rootNode = document.getElementById('infoScrollDiv');
    var xpath = './/a[contains(@href,".mp3")]';
    var podcastLink = axsSky.axsJAXObj.evalXPath(xpath, rootNode)[0];
    // Play the podcast if the info window contains a podcast
    if (podcastLink && axsSky.insertCount > 0){
      axsSky.axsSoundObj.play(podcastLink.href);
      axsSky.insertCount = 0;
    } else if (podcastLink){
      axsSky.insertCount++;
    // If there is no podcast, just read the text in the info window  
    } else {
      xpath = './/td';
      var tds = axsSky.axsJAXObj.evalXPath(xpath, rootNode);
      var content = '';
      for (var i = 0, td; td = tds[i]; i++){
        content = content + td.textContent + '. ';
      }
      axsSky.axsJAXObj.speakTextViaNode(content);
    }
  }
  else if (target.className == 'slideTable'){
    axsSky.getItems();
  }
  else if (target.parentNode && (target.parentNode.id == 'myTooltip')){
    axsSky.axsJAXObj.speakTextViaNode(target.textContent);
  }
};

/**
 * Populates the array of menu items
 */
axsSky.getItems = function(){
  var rootNode = document.getElementById('slider');
  var xpath = './/span';
  axsSky.itemsArray = axsSky.axsJAXObj.evalXPath(xpath, rootNode);
  axsSky.itemsIndex = -1;
  axsSky.axsJAXObj.speakTextViaNode(axsSky.ITEMS_LOADED);
};

/**
 * Goes to the next menu item
 */
axsSky.nextItem = function(){
  axsSky.axsSoundObj.stop();
  axsSky.itemsIndex++;
  if (axsSky.itemsIndex >= axsSky.itemsArray.length){
      axsSky.itemsIndex = 0;
  }
  axsSky.goToCurrentItem();
};

/**
 * Goes to the previous menu item
 */
axsSky.prevItem = function(){
  axsSky.axsSoundObj.stop();
  axsSky.itemsIndex--;
  if (axsSky.itemsIndex < 0){
      axsSky.itemsIndex = axsSky.itemsArray.length - 1;
  }
  axsSky.goToCurrentItem();
};


/**
 * Goes to the current menu item by setting the highlight 
 * effect caused by mouseover
 */
axsSky.goToCurrentItem = function(){
  var activeDoc = axsSky.axsJAXObj.getActiveDocument();

  //Mouseout the previous item to take away the highlight
  var evt = activeDoc.createEvent('MouseEvents');
  evt.initMouseEvent('mouseout', true, true, activeDoc.defaultView,
                     1, 0, 0, 0, 0, false, false, false, false, 0, null);
  try{
    axsSky.currentItem.dispatchEvent(evt);
  } catch(e){}

  //Find the current item
  axsSky.currentItem = axsSky.itemsArray[axsSky.itemsIndex];

  //Mouseover the current item to put on the highlight
  evt = activeDoc.createEvent('MouseEvents');
  evt.initMouseEvent('mouseover', true, true, activeDoc.defaultView,
                     1, 0, 0, 0, 0, false, false, false, false, 0, null);
  try{
    axsSky.currentItem.dispatchEvent(evt);
  } catch(e){}

  //Speak the current item
  if (axsSky.currentItem.lastChild.tagName == 'DIV'){
    axsSky.axsJAXObj.speakTextViaNode(axsSky.currentItem.lastChild.textContent);
  }
};


/**
 * Activates the current menu item
 */
axsSky.activateItem = function(){
  axsSky.axsJAXObj.clickElem(axsSky.currentItem, false);
};

/**
 * Goes to the Home Menu
 */
axsSky.goToHome = function(){
  axsSky.axsSoundObj.stop();
  var rootNode = document.getElementById('sliderHeader');
  var xpath = ".//span[@class='fakeLinkWS']";
  var homeLink = axsSky.axsJAXObj.evalXPath(xpath, rootNode)[0];
  axsSky.axsJAXObj.clickElem(homeLink, false);
};

/**
 * Keyboard handler
 * @param {Object} evt A keypress event
 * @return {boolean} Indicates whether the keypress was handled
 */
axsSky.keyHandler = function(evt){
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;

  if (evt.keyCode == 27){ // ESC
    axsSky.axsSoundObj.stop();
    axsSky.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsSky.axsJAXObj.inputFocused) return true;

  if (axsSky.axsJAXObj.lastFocusedNode.tagName == 'A'){
    return true;
  }

  var command = axsSky.keyCodeMap[evt.keyCode] ||
                axsSky.charCodeMap[evt.charCode];

  if (command) return command();

  return true;
};

/**
 * Map from character codes to functions
 */
axsSky.keyCodeMap = {
  13 : axsSky.activateItem
};

/**
 * Map from character codes to functions
 * @return {boolean} Always returns false to indicate 
 *                   that the keycode has been handled.
 */
axsSky.charCodeMap = {
   63 : function(){
          axsSky.axsJAXObj.speakTextViaNode(axsSky.HELP_STRING);
          return false;
        },
  110 : axsSky.nextItem,
  112 : axsSky.prevItem,
  116 : axsSky.goToHome
};

window.setTimeout(axsSky.init, 500);

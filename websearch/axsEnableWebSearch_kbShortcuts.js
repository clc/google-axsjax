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
 * @fileoverview Greasemonkey JavaScript to enhance accessibility
 * of Google Web Search. 
 * Note that these are Greasemonkey scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */



// create namespace
var axsWebSearch = {};


//These are strings to be spoken to the user
axsWebSearch.NO_ONE_BOX_STRING = 'There is no one box on this page.';
axsWebSearch.NO_ADS_STRING = 'There are no advertisments on this page.';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsWebSearch.axsJAXObj = null;


axsWebSearch.adAreaId = null;
axsWebSearch.adIndex = 0;
axsWebSearch.inputFocused = false;

axsWebSearch.currentLink = null;





axsWebSearch.init = function(){
  axsWebSearch.axsJAXObj = new AxsJAX();
  //If the keyboard shortcut experiment is not running, run it
  var locationString = window.content.document.location.toString();
  if (locationString.indexOf('http://www.google.com/search') !== 0){
    window.content.document.location =
        'http://www.google.com/search?hl=en&esrch=BetaShortcuts&q=google&btnG=Search';
  }
  if ( (locationString.indexOf('http://www.google.com/search') === 0) &&
       (locationString.indexOf('&esrch=BetaShortcuts') == -1) ){
    window.content.document.location = locationString + '&esrch=BetaShortcuts';
  }

  //Add event listeners
  document.addEventListener('DOMAttrModified',
                            axsWebSearch.domAttrModifiedHandler,
                            true);
  document.addEventListener('keypress',
                            axsWebSearch.extraKeyboardNavHandler,
                            true);
  document.addEventListener('focus', axsWebSearch.focusHandler, true);
  document.addEventListener('blur', axsWebSearch.blurHandler, true);

  //Do any necessary preparations for browsing here
  axsWebSearch.formatAdsArea();
};

/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsWebSearch.focusHandler = function(evt){
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsWebSearch.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsWebSearch.blurHandler = function (evt){
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsWebSearch.inputFocused = false;
  }
};

axsWebSearch.domAttrModifiedHandler = function(evt){
  var attrib = evt.attrName;
  var newVal = evt.newValue;
  var oldVal = evt.prevValue;
  var target = evt.target;
  if ((target.tagName == 'IMG') &&
      (newVal.indexOf('visibility: visible') != -1)){
    axsWebSearch.axsJAXObj.putNullForNoAltImages(target.parentNode);
    axsWebSearch.axsJAXObj.speakNode(target.parentNode);
    axsWebSearch.currentLink =
        target.parentNode.getElementsByTagName('a')[0].href;
  }
};


axsWebSearch.extraKeyboardNavHandler = function(evt){
  if (axsWebSearch.inputFocused){
    return;
  }
  if (evt.charCode == 49){ // 1
    axsWebSearch.readOneBox();
  }
  if (evt.charCode == 97){ // a
    axsWebSearch.cycleThroughAds();
  }
  if ((evt.keyCode == 13) && axsWebSearch.currentLink){ // Enter
    if (evt.shiftKey){
      axsWebSearch.goToCurrentLinkInNewWindow();    
    } else{
      axsWebSearch.goToCurrentLink();
    }

  }
};


axsWebSearch.readOneBox = function(){
  if (document.getElementById('res').childNodes[1].tagName == 'P'){
    axsWebSearch.axsJAXObj.speakNode(
        document.getElementById('res').childNodes[1]);
  } else{
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_ONE_BOX_STRING);
  }
};





axsWebSearch.formatAdsArea = function(){
  var adTable = window.content.document.getElementById('mbEnd');
  var adArea = null; //This is the FONT tag that contains all the ads
                     //However, it is non-trivial to locate as the TR
                     //that it is under is not always the same TR.
                     //There are also very few identifiers here to key off of.
  //This is an ugly way to find the adArea, but it works reliably.
  var spanArray = adTable.getElementsByTagName('SPAN');
  for (var i=0; i<spanArray.length; i++){
    if (spanArray[i].className == 'a'){
      adArea = spanArray[i].parentNode;
      break;
    }
  }
  if (!adArea){
    return;
  }

  var currentAdAnchor = adArea.firstChild;
  var adSpan = window.content.document.createElement('span');

  while (currentAdAnchor){
    var nextAnchor = currentAdAnchor.nextSibling;
    if (currentAdAnchor.tagName &&  currentAdAnchor.tagName == 'FONT'){
      var newAdSpan = window.content.document.createElement('span');
      newAdSpan.appendChild(currentAdAnchor.cloneNode(true));
      adArea.replaceChild(adSpan,currentAdAnchor);
      adSpan = newAdSpan;
    } else {
      adSpan.appendChild(currentAdAnchor.cloneNode(true));
      adArea.removeChild(currentAdAnchor);
    }
    currentAdAnchor = nextAnchor;
  }
  adArea.appendChild(adSpan);
  //Clean up by deleting the first child which is a blank node
  adArea.removeChild(adArea.firstChild);
  axsWebSearch.adAreaId = axsWebSearch.axsJAXObj.assignId(adArea);
  axsWebSearch.adIndex = -1;
};


axsWebSearch.cycleThroughAds = function(){
  if (!axsWebSearch.adAreaId){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_ADS_STRING);
    return;
  }
  var adArea = document.getElementById(axsWebSearch.adAreaId);
  axsWebSearch.adIndex++;
  if (axsWebSearch.adIndex >= adArea.childNodes.length){
    axsWebSearch.adIndex = 0;
  }  
  var currentAd = adArea.childNodes[axsWebSearch.adIndex];
  axsWebSearch.currentLink = currentAd.getElementsByTagName('a')[0].href;
  axsWebSearch.axsJAXObj.speakNode(currentAd);
};


axsWebSearch.goToCurrentLink = function(){
  document.location = axsWebSearch.currentLink;
};

axsWebSearch.goToCurrentLinkInNewWindow = function(){
  window.open(axsWebSearch.currentLink);
};

axsWebSearch.init();

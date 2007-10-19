// Copyright 2007 Google Inc.
// All Rights Reserved.

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





axsWebSearch.init = function(){
  axsWebSearch.axsJAXObj = new AxsJAX();
  //If the keyboard shortcut experiment is not running, run it
  var locationString = window.content.document.location.toString();
  if (locationString.indexOf('http://www.google.com/search') != 0){
    window.content.document.location = 'http://www.google.com/search?hl=en&esrch=BetaShortcuts&q=google&btnG=Search';
  }
  if ( (locationString.indexOf('http://www.google.com/search') == 0) &&
       (locationString.indexOf('&esrch=BetaShortcuts') == -1) ){
    window.content.document.location = locationString + '&esrch=BetaShortcuts';
  }

  //Add event listeners
  window.addEventListener('DOMAttrModified', axsWebSearch.domAttrModifiedHandler, true);
  window.addEventListener('keypress', axsWebSearch.extraKeyboardNavHandler, true);
  window.addEventListener('focus', axsWebSearch.focusHandler, true);
  window.addEventListener('blur', axsWebSearch.blurHandler, true);

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
  if ((target.tagName == 'IMG') && (newVal.indexOf('visibility: visible') != -1)){
    axsWebSearch.axsJAXObj.putNullForNoAltImages(target.parentNode);
    axsWebSearch.axsJAXObj.speakNode(target.parentNode);
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
};


axsWebSearch.readOneBox = function(){
  if (document.getElementById('res').childNodes[1].tagName == 'P'){
    axsWebSearch.axsJAXObj.speakNode(document.getElementById('res').childNodes[1]);
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
};


axsWebSearch.cycleThroughAds = function(){
  if (!axsWebSearch.adAreaId){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_ADS_STRING);
    return;
  }
  var adArea = document.getElementById(axsWebSearch.adAreaId);
  if (axsWebSearch.adIndex >= adArea.childNodes.length){
    axsWebSearch.adIndex = 0;
  }  
  var currentAd = adArea.childNodes[axsWebSearch.adIndex++];
  axsWebSearch.axsJAXObj.speakNode(currentAd);
};



axsWebSearch.init();
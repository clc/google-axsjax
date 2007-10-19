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
axsWebSearch.NO_NEXT_PAGE_STRING = 'There is no next page.';
axsWebSearch.NO_PREV_PAGE_STRING = 'There is no previous page.';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsWebSearch.axsJAXObj = null;

axsWebSearch.resultsArray = null;
axsWebSearch.resultsIndex = 0;

axsWebSearch.adAreaId = null;
axsWebSearch.adIndex = 0;
axsWebSearch.inputFocused = false;
axsWebSearch.lastFocusedNode = null;



axsWebSearch.init = function(){
  axsWebSearch.axsJAXObj = new AxsJAX();

  //Add event listeners
  document.addEventListener('keypress', axsWebSearch.extraKeyboardNavHandler, true);
  document.addEventListener('focus', axsWebSearch.focusHandler, true);
  document.addEventListener('blur', axsWebSearch.blurHandler, true);

  //Do any necessary preparations for browsing here
  axsWebSearch.buildResultsArray();
  axsWebSearch.formatAdsArea();
};

/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsWebSearch.focusHandler = function(evt){
  axsWebSearch.lastFocusedNode = evt.target;
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
  axsWebSearch.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsWebSearch.inputFocused = false;
  }
};


axsWebSearch.extraKeyboardNavHandler = function(evt){
  if (evt.keyCode == 27){ // ESC
    axsWebSearch.lastFocusedNode.blur();
  }
  if (axsWebSearch.inputFocused){
    return;
  }
  if (evt.charCode == 49){ // 1
    axsWebSearch.readOneBox();
  }
  if (evt.charCode == 97){ // a
    axsWebSearch.cycleThroughAds();
  }
  if (evt.charCode == 106){ // j
    axsWebSearch.goToNextResult();
  }
  if (evt.charCode == 107){ // k
    axsWebSearch.goToPrevResult();
  }  
  if (evt.charCode == 47){ // / (slash symbol)
    document.getElementsByName('q')[0].focus();  //Focus on the top search blank
  }

};


axsWebSearch.readOneBox = function(){
  if (document.getElementById('res').childNodes[1].tagName == 'P'){
    var oneBox = document.getElementById('res').childNodes[1];
    oneBox.scrollIntoView(true);
    axsWebSearch.axsJAXObj.speakNode(oneBox);
  } else{
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_ONE_BOX_STRING);
  }
};



//************
//Functions for Ads
//************

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
  currentAd.scrollIntoView(true);
  currentAd.getElementsByTagName('a')[0].focus();
  axsWebSearch.axsJAXObj.speakNode(currentAd);
};



//************
//Functions for results
//************

axsWebSearch.buildResultsArray = function(){
  axsWebSearch.resultsArray = new Array();
  axsWebSearch.resultsIndex = -1;
  var resDiv = window.content.document.getElementById('res');
  var divsArray = resDiv.getElementsByTagName('DIV');
  for (var i=0; i<divsArray.length; i++){
    if (divsArray[i].className == 'g'){
      axsWebSearch.resultsArray.push(divsArray[i]);
    }
  }
};

axsWebSearch.goToNextResult = function(){
  axsWebSearch.resultsIndex++;
  if(axsWebSearch.resultsIndex >= axsWebSearch.resultsArray.length){
    axsWebSearch.resultsIndex = axsWebSearch.resultsArray.length - 1;
    axsWebSearch.goToNextPage();
  } else {
    var currentResult = axsWebSearch.resultsArray[axsWebSearch.resultsIndex];
    currentResult.scrollIntoView(true);
    currentResult.getElementsByTagName('a')[0].focus();
    axsWebSearch.axsJAXObj.speakNode(currentResult);
  }
};

axsWebSearch.goToPrevResult = function(){
  axsWebSearch.resultsIndex--;
  if(axsWebSearch.resultsIndex < 0){
    axsWebSearch.resultsIndex = 0;
    axsWebSearch.goToPrevPage();
  } else {
    var currentResult = axsWebSearch.resultsArray[axsWebSearch.resultsIndex];
    currentResult.scrollIntoView(true);
    currentResult.getElementsByTagName('a')[0].focus();
    axsWebSearch.axsJAXObj.speakNode(currentResult);
  }
};



axsWebSearch.goToNextPage = function(){
  var nextPageDiv = document.getElementById('nn');
  if (!nextPageDiv){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_NEXT_PAGE_STRING);
    return;
  }
  document.location = nextPageDiv.parentNode.href;
};

axsWebSearch.goToPrevPage = function(){
  var prevPageDiv = document.getElementById('np');
  if (!prevPageDiv){
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_PREV_PAGE_STRING);
    return;
  }
  document.location = prevPageDiv.parentNode.href;
};


axsWebSearch.init();
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
 * of Google Image Search.
 * Note that these are Greasemonkey scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */



// create namespace
var axsImageSearch = {};


axsImageSearch.SRCTEXT_STRING = 'AxsJAX_srcText';
axsImageSearch.ORIGTEXT_STRING = 'AxsJAX_origText';


//These are strings used to find specific links


//These are strings to be spoken to the user
axsImageSearch.NO_NEXT_PAGE_STRING = 'There is no next page.';
axsImageSearch.NO_PREV_PAGE_STRING = 'There is no previous page.';
axsImageSearch.HELP_STRING =
    'The following shortcut keys are available. ' +
    'Down arrow or N, go to the next result. ' +
    'Up arrow or P, go to the previous result. ' +
    'Right arrow or J, cycle to the next result. ' +
    'Left arrow or K, cycle to the previous result. ' +
    'G, toggle between the snippet provided by Google Image Search and the alt text from the source of image. ' +
    'Slash, jump to the search field. ' +
    'Escape, leave the search field. ';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsImageSearch.axsJAXObj = null;

axsImageSearch.resultsArray = null;
axsImageSearch.resultsIndex = 0;


axsImageSearch.inputFocused = false;
axsImageSearch.lastFocusedNode = null;

axsImageSearch.busyFetching = false;
axsImageSearch.altTextFrame = null; 


axsImageSearch.init = function(){
  axsImageSearch.axsJAXObj = new AxsJAX(true);

  //Add event listeners
  document.addEventListener('keypress', axsImageSearch.extraKeyboardNavHandler,
                             true);
  document.addEventListener('focus', axsImageSearch.focusHandler, true);
  document.addEventListener('blur', axsImageSearch.blurHandler, true);

  //Setup the results array
  axsImageSearch.buildResultsArray();
  axsImageSearch.busyFetching = false;

  //Read the first thing on the page.
  //Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsImageSearch.goToNextResult,100);
};





/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsImageSearch.focusHandler = function(evt){
  axsImageSearch.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsImageSearch.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsImageSearch.blurHandler = function (evt){
  axsImageSearch.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsImageSearch.inputFocused = false;
  }
};


axsImageSearch.extraKeyboardNavHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT. 
    return true;
  }
  if (evt.keyCode == 27){ // ESC
    axsImageSearch.lastFocusedNode.blur();
    return false;
  }

  if (axsImageSearch.inputFocused){
    return true;
  }

  if (evt.charCode == 106){ // j
    axsImageSearch.goToNextResult(true);
    return false;
  }
  if (evt.charCode == 107){ // k
    axsImageSearch.goToPrevResult(true);
    return false;
  }
  if (evt.charCode == 110){ // n
    axsImageSearch.goToNextResult(false);
    return false;
  }
  if (evt.charCode == 112){ // p
    axsImageSearch.goToPrevResult(false);
    return false;
  }


  if (evt.charCode == 47){ // / (slash symbol)
    // Focus on the top search blank
    document.getElementsByName('q')[0].focus();  
    document.getElementsByName('q')[0].select(); //and select all text
    return false;
  }


  if (evt.charCode == 103){ // g
    var currentImage = axsImageSearch.resultsArray[axsImageSearch.resultsIndex];
    if (currentImage.alt == currentImage.getAttribute(axsImageSearch.ORIGTEXT_STRING)){
      axsImageSearch.fetchSrcAltText();
    } else {
      currentImage.alt = currentImage.getAttribute(axsImageSearch.ORIGTEXT_STRING);
      currentImage.parentNode.blur();
      currentImage.parentNode.focus();
    }                                  
    return false;
  }


  if (evt.keyCode == 33){ // Page Up
    axsImageSearch.goToPrevPage();
    return false;
  }
  if (evt.keyCode == 34){ // Page Down
    axsImageSearch.goToNextPage();
    return false;
  }
  if (evt.keyCode == 38){ // Up arrow
    axsImageSearch.goToPrevResult(false);
    return false;
  }
  if (evt.keyCode == 37){ // Left arrow
    axsImageSearch.goToPrevResult(true);
    return false;
  }
  if (evt.keyCode == 40){ // Down arrow
    axsImageSearch.goToNextResult(false);
    return false;
  }
  if (evt.keyCode == 39){ // Right arrow
    axsImageSearch.goToNextResult(true);
    return false;
  }
  if (evt.charCode == 63){ // ? (question mark)
    axsImageSearch.axsJAXObj.speakTextViaNode(axsImageSearch.HELP_STRING);
    return false;
  }




  return true;
};




//************
//Functions for scraping the About page
//and breaking it into categories
//************
axsImageSearch.buildResultsArray = function(){
  axsImageSearch.resultsArray = new Array();
  axsImageSearch.resultsIndex = -1;
  var imgContentDiv = document.getElementById('ImgContent');
  var imageCells = axsImageSearch.axsJAXObj.evalXPath("table/tbody/tr[*]/td[contains(@id,'tDataImage')]",imgContentDiv);
  var textSnippets = axsImageSearch.axsJAXObj.evalXPath("table/tbody/tr[*]/*[contains(@id,'tDataText')]",imgContentDiv);
  for (var i=0, currentImageCell; currentImageCell = imageCells[i]; i++){
    var currentImage = currentImageCell.firstChild.firstChild;
    currentImage.setAttribute(axsImageSearch.ORIGTEXT_STRING, textSnippets[i].textContent);
    currentImage.setAttribute(axsImageSearch.SRCTEXT_STRING, '');
    currentImage.alt = textSnippets[i].textContent;
    axsImageSearch.resultsArray.push(currentImage);
  }
};


axsImageSearch.goToNextResult = function(cycleBool){
  axsImageSearch.resultsIndex++;
  if(axsImageSearch.resultsIndex >= axsImageSearch.resultsArray.length){
    if (!cycleBool){
      axsImageSearch.resultsIndex = -1;
      axsImageSearch.goToNextPage();
      return;
    } else{
      axsImageSearch.resultsIndex = 0;
    }
  }
  var currentResult = axsImageSearch.resultsArray[axsImageSearch.resultsIndex];
  currentResult.parentNode.focus();
};


axsImageSearch.goToPrevResult = function(cycleBool){
  axsImageSearch.resultsIndex--;
  if(axsImageSearch.resultsIndex < 0){
    if (!cycleBool){
      axsImageSearch.goToPrevPage();
      return;
    } else{
      axsImageSearch.resultsIndex = axsImageSearch.resultsArray.length-1;
    }
  }
  var currentResult = axsImageSearch.resultsArray[axsImageSearch.resultsIndex];
  currentResult.parentNode.focus();
};


axsImageSearch.goToNextPage = function(){
  var nextPageDiv = document.getElementById('nn');
  if (!nextPageDiv){
    axsImageSearch.axsJAXObj.speakTextViaNode(axsImageSearch.NO_NEXT_PAGE_STRING);
    return;
  }
  document.location = nextPageDiv.parentNode.href;
};

axsImageSearch.goToPrevPage = function(){
  var prevPageDiv = document.getElementById('np');
  if (!prevPageDiv){
    axsImageSearch.axsJAXObj.speakTextViaNode(axsImageSearch.NO_PREV_PAGE_STRING);
    return;
  }
  document.location = prevPageDiv.parentNode.href;
};



axsImageSearch.fetchSrcAltText = function(){
  var currentImage = axsImageSearch.resultsArray[axsImageSearch.resultsIndex];
  if (currentImage.getAttribute(axsImageSearch.SRCTEXT_STRING)){
    currentImage.alt = currentImage.getAttribute(axsImageSearch.SRCTEXT_STRING);
    currentImage.parentNode.blur();
    currentImage.parentNode.focus();
    return;
  }
  if (axsImageSearch.busyFetching){
    return;
  }
  axsImageSearch.busyFetching = true;
  var url = currentImage.parentNode.href;
  var imgUrlMarker = '/imgres?imgurl=';
  var imgRefUrlMarker = '&imgrefurl=';
  var heightMarker = '&h=';
  var imageUrl = url.substring(url.indexOf(imgUrlMarker) + imgUrlMarker.length, url.indexOf(imgRefUrlMarker));
  var srcUrl = url.substring(url.indexOf(imgRefUrlMarker) + imgRefUrlMarker.length, url.indexOf(heightMarker));
  axsImageSearch.altTextFrame = document.createElement('iframe');
  axsImageSearch.altTextFrame.src = srcUrl + '#AxsJAX_Cmd=GetImgText(AxsJAX_Img=' + imageUrl + ',AxsJAX_ParentURL=' + document.location;
  document.body.appendChild(axsImageSearch.altTextFrame);
  window.setTimeout(function(){axsImageSearch.attachFetchedSrcAltText(currentImage);}, 100);
};

axsImageSearch.attachFetchedSrcAltText = function(targetImg){
  if (!document.location.hash){
    window.setTimeout(function(){axsImageSearch.attachFetchedSrcAltText(targetImg);}, 100);
    return;
  }
  var fetchedText = unescape(document.location.hash);
  if (fetchedText == '#NULL'){
    fetchedText = 'No alt text available.';
  }
  fetchedText = fetchedText.substr(1);
  document.location.hash = '#';
  document.body.removeChild(axsImageSearch.altTextFrame);
  axsImageSearch.altTextFrame = null;
  targetImg.setAttribute(axsImageSearch.SRCTEXT_STRING, fetchedText);
  targetImg.alt = fetchedText;
  targetImg.parentNode.blur();
  targetImg.parentNode.focus();
  axsImageSearch.busyFetching = false;
};



axsImageSearch.init();

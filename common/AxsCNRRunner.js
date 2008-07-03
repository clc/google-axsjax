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
 * @fileoverview This is a script to run generic CNRs.
 * It will look up a list of available CNRs on the web, and if a CNR in that list
 * matches the current page, it will use that CNR for the current page.
 *
 * @author clchen@google.com (Charles L. Chen)
 */
// create namespace
var axsCNRRunner = {};

axsCNRRunner.CNR_SRC = 'http://clcworld.blogspot.com/atom.xml';
axsCNRRunner.SRC_TYPE = 'blogger';

//These are strings to be spoken to the user
axsCNRRunner.HELP = 'The following shortcut keys are available. ';
axsCNRRunner.LOADED = 'The CNR for this page has been loaded. ';


/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsCNRRunner.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsCNRRunner.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsCNRRunner.axsLensObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsCNRRunner.magSize = 1.5;

axsCNRRunner.useCNR = function(cnrString){
  axsCNRRunner.axsJAXObj = new AxsJAX(true);
  axsCNRRunner.axsNavObj = new AxsNav(axsCNRRunner.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsCNRRunner.keyHandler, true);

  axsCNRRunner.axsNavObj.navInit(cnrString, null);

  axsCNRRunner.axsLensObj = new AxsLens(axsCNRRunner.axsJAXObj);
  axsCNRRunner.axsNavObj.setLens(axsCNRRunner.axsLensObj);
  axsCNRRunner.axsLensObj.setMagnification(axsCNRRunner.magSize);
  axsCNRRunner.axsSoundObj = new AxsSound(true);
  axsCNRRunner.axsNavObj.setSound(axsCNRRunner.axsSoundObj);

  axsCNRRunner.axsJAXObj.speakTextViaNode(axsCNRRunner.LOADED);
};


/**
 * Increases the magnification by 10%
 */
axsCNRRunner.increaseMagnification = function(){
  axsCNRRunner.magSize += 0.10;
  axsCNRRunner.axsLensObj.setMagnification(axsCNRRunner.magSize);
};

/**
 * Decreases the magnification by 10%
 */
axsCNRRunner.decreaseMagnification = function(){
  axsCNRRunner.magSize -= 0.10;
  axsCNRRunner.axsLensObj.setMagnification(axsCNRRunner.magSize);
};


axsCNRRunner.keyHandler = function(evt){
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;
  
  if (evt.keyCode == 27){ // ESC
    axsCNRRunner.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsCNRRunner.axsJAXObj.inputFocused) return true;
  
  var command =  axsCNRRunner.keyCodeMap[evt.keyCode] ||
                 axsCNRRunner.charCodeMap[evt.charCode];

  if (command)  return  command();
  return true;
  
};

axsCNRRunner.keyCodeMap = {
  // Map additional keyboard behavior that involves key codes here
};

axsCNRRunner.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // - (minus symbol)
  45 : function () {
         axsCNRRunner.decreaseMagnification();
	     return false;
       }, 
  // = (equal symbol) 	   
  61 : function () {
         axsCNRRunner.increaseMagnification();
	     return false;
       }, 
  // ? (question mark)	   
  63 : function () {
         var helpStr = axsCNRRunner.HELP +
                       axsCNRRunner.axsNavObj.localHelpString() +
					   axsCNRRunner.axsNavObj.globalHelpString();
         axsCNRRunner.axsJAXObj.speakTextViaNode(helpStr);
	     return false;
       }
};


axsCNRRunner.urlMatcher = function(cnrArray){
  for (var i=0, cnrObj; cnrObj = cnrArray[i]; i++){
    var regexWildcard = '.*?';
    var originalString = cnrObj.url;
    var regexStr = originalString.replace(/\*/g, regexWildcard);
  
    var regexMatcher = new RegExp(regexStr);
    if (regexMatcher.exec(document.location.toString()) !== null){
      axsCNRRunner.useCNR(cnrObj.rule);
    }
  }
};


axsCNRRunner.init = function(){
  AxsCNRLoader.load(axsCNRRunner.CNR_SRC, axsCNRRunner.SRC_TYPE, axsCNRRunner.urlMatcher);
};

axsCNRRunner.init();
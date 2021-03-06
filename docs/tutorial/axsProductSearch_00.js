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
 * of Skel. 
 *
 * This is a skeleton AxsJAX script - when you start using it,
 * you should do a global replace of "axsProductSearch" with 
 * "axsWhateverYourAppNameIs" and update this fileoverview.
 *
 * @author clchen@google.com (Charles L. Chen)
 */
// create namespace
var axsProductSearch = {};

//These are strings to be spoken to the user
axsProductSearch.HELP = 'The following shortcut keys are available. ';


/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsProductSearch.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsProductSearch.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsProductSearch.axsLensObj = null;

/**
 * The AxsSound object that will play earcons
 * @type AxsSound?
 */
axsProductSearch.axsSoundObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsProductSearch.magSize = 1.5;

axsProductSearch.init = function(){
  axsProductSearch.axsJAXObj = new AxsJAX(true);
  axsProductSearch.axsNavObj = new AxsNav(axsProductSearch.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsProductSearch.keyHandler, true);
  
  var cnrString = '<cnr next="RIGHT l" prev="LEFT h">' +
                  '  <list title="Cycle Results" next="DOWN j" prev="UP k" fw' +
                  'd="n" back="p">' +
                  '    <item>' +
                  '      /html/body/table[3]/tbody/tr[not(@class)]' +
                  '    </item>' +
                  '  </list>' +
                  '</cnr>';

  axsProductSearch.axsNavObj.navInit(cnrString, null);

  axsProductSearch.axsLensObj = new AxsLens(axsProductSearch.axsJAXObj);
  axsProductSearch.axsNavObj.setLens(axsProductSearch.axsLensObj);
  axsProductSearch.axsLensObj.setMagnification(axsProductSearch.magSize);
  axsProductSearch.axsSoundObj = new AxsSound(true);
  axsProductSearch.axsNavObj.setSound(axsProductSearch.axsSoundObj);
};



axsProductSearch.keyHandler = function(evt){
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;
  
  if (evt.keyCode == 27){ // ESC
    axsProductSearch.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsProductSearch.axsJAXObj.inputFocused) return true;
  
  var command =  axsProductSearch.keyCodeMap[evt.keyCode] ||
                 axsProductSearch.charCodeMap[evt.charCode];

  if (command)  return  command();
  return true;  
};

axsProductSearch.keyCodeMap = {
  // Map additional keyboard behavior that involves key codes here
};

axsProductSearch.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  // - (minus symbol)
  45 : function () {
         axsProductSearch.magSize -= 0.10;
         axsProductSearch.axsLensObj.setMagnification(axsProductSearch.magSize);
	     return false;
       },
  // = (equal symbol) 	   
  61 : function () {
         axsProductSearch.magSize += 0.10;
         axsProductSearch.axsLensObj.setMagnification(axsProductSearch.magSize);
	     return false;
       },
  63 : function () {
         var helpStr = axsProductSearch.HELP +
                       axsProductSearch.axsNavObj.localHelpString() +
					   axsProductSearch.axsNavObj.globalHelpString();
         axsProductSearch.axsJAXObj.speakTextViaNode(helpStr);
	     return false;
       }
};

axsProductSearch.init();

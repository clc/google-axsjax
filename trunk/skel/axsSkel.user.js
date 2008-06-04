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

//Inject the necessary AxsJAX scripts

var theLib = document.createElement('script');
theLib.type = 'text/javascript';
theLib.src = 'http://google-axsjax.googlecode.com/svn/trunk/common/AxsJAX.js';
var navLib = document.createElement('script');
navLib.type = 'text/javascript';
navLib.src = 'http://google-axsjax.googlecode.com/svn/trunk/common/AxsNav.js';
var lensLib = document.createElement('script');
lensLib.type = 'text/javascript';
lensLib.src = 'http://google-axsjax.googlecode.com/svn/trunk/common/AxsLens.js';

document.getElementsByTagName('head')[0].appendChild(theLib);	
document.getElementsByTagName('head')[0].appendChild(navLib);	
document.getElementsByTagName('head')[0].appendChild(lensLib);	


/**
 * @fileoverview AxsJAX to enhance accessibility
 * of Skel. 
 *
 * This is a skeleton AxsJAX script - when you start using it,
 * you should do a global replace of "axsSkel" with 
 * "axsWhateverYourAppNameIs" and update this fileoverview.
 *
 * Note that this skeleton assumes you are developing by 
 * writing straight into a Greasemonkey script.
 * If you are developing with a script chooser and that is
 * already injecting the AxsJAX libraries, you should delete
 * lines 15-29 of this skeleton script.
 *
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsSkel = {};

//These are strings to be spoken to the user
axsSkel.HELP = 'The following shortcut keys are available. ';


/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsSkel.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsSkel.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsSkel.axsLensObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsSkel.magSize = 1.5;

axsSkel.init = function(){
  axsSkel.axsJAXObj = new AxsJAX(true);
  axsSkel.axsNavObj = new AxsNav(axsSkel.axsJAXObj);

  //Add event listeners
  document.addEventListener('keypress', axsSkel.keyHandler, true);
  
  var cnrString = "PUT THE CNR XML HERE";

  axsSkel.axsNavObj.navInit(cnrString, null);

  axsSkel.axsLensObj = new AxsLens(axsSkel.axsJAXObj);
  axsSkel.axsNavObj.setLens(axsSkel.axsLensObj);
  axsSkel.axsLensObj.setMagnification(axsSkel.magSize);
};



axsSkel.keyHandler = function(evt){
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;
  
  if (evt.keyCode == 27){ // ESC
    axsSkel.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsSkel.axsJAXObj.inputFocused) return true;
  
  var command =  axsSkel.keyCodeMap[evt.keyCode] ||
                 axsSkel.charCodeMap[evt.charCode];

  if (command)  return  command();
  return true;
  
};

axsSkel.keyCodeMap = {
  // Map additional keyboard behavior that involves key codes here
};

axsSkel.charCodeMap = {
  // Map additional keyboard behavior that involves char codes here
  63 : function () {
         var helpStr = axsSkel.HELP +
                       axsSkel.axsNavObj.localHelpString() +
					   axsSkel.axsNavObj.globalHelpString();
         axsSkel.axsJAXObj.speakTextViaNode(helpStr);
	     return false;
       }
};

axsSkel.init();

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
 * of iGoogle.
 * Note that these  scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsIG = {};

//These are strings used to find specific nodes
axsIG.unavailableInfoXPath = './/*[text() == "Information is temporarily unavailable."]';

//These are strings to be spoken to the user
axsIG.HELP_STRING = 'The following shortcut keys are available. ' +
                    'N, next gadget. ' +
                    'P, previous gadget. ' +
                    'Slash, jump to search field. ' +
                    'Escape, leave the search field. ' +
                    'Equals, increase magnification. ' +
                    'Minus, decrease magnification. ';



/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsIG.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsIG.axsNavObj = null;

axsIG.axsLensObj = null;

axsIG.magSize = 1.5;


axsIG.init = function(){
  axsIG.axsJAXObj = new AxsJAX(true);
  axsIG.axsNavObj = new AxsNav(axsIG.axsJAXObj);
  axsIG.axsLensObj = new AxsLens(axsIG.axsJAXObj);
  axsIG.axsNavObj.setLens(axsIG.axsLensObj);
  axsIG.axsLensObj.setMagnification(axsIG.magSize);

  var cnrString = "<cnr next='' prev=''>" +
                  "<list title='Gadgets' hotkey='' next='' prev=''>" +
                  "<item>" +
                  "id('modules')//div[@class='modbox']" +
                  "</item>" +
                  "</list>" +
                  "</cnr>";

  axsIG.axsNavObj.navInit(cnrString, null);

  //Add event listeners
  document.addEventListener('keypress', axsIG.keyHandler,
                             true);


  // Speak the first gadget
  // Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsIG.goToNextGadget,100);
};




axsIG.keyHandler = function(evt){
  if (evt.ctrlKey){ //None of these commands involve Ctrl.
                    //If Ctrl is held, it must be for some AT.
    return true;
  }

  if (evt.keyCode == 27){ // ESC
    axsIG.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsIG.axsJAXObj.inputFocused){
    return true;
  }

  if (evt.charCode == 47){ // / (slash symbol)
    // Focus on the top search blank
    document.getElementsByName('q')[0].focus();
    document.getElementsByName('q')[0].select(); //and select all text
    return false;
  }

  if (evt.charCode == 45){ // - (minus symbol)
    axsIG.decreaseMagnification();
    return false;
  }

  if (evt.charCode == 61){ // = (equals symbol)
    axsIG.increaseMagnification();
    return false;
  }

  if (evt.charCode == 110){ // n
    axsIG.goToNextGadget();
    return false;
  }

  if (evt.charCode == 112){ // p
    axsIG.goToPrevGadget();
    return false;
  }

  if (evt.charCode == 63){ // ? (question mark)
    axsIG.axsJAXObj.speakTextViaNode(axsIG.HELP_STRING);
    return false;
  }

  return true;
};


axsIG.increaseMagnification = function(){
  axsIG.magSize += 0.10;
  axsIG.axsLensObj.setMagnification(axsIG.magSize);
};

axsIG.decreaseMagnification = function(){
  axsIG.magSize -= 0.10;
  axsIG.axsLensObj.setMagnification(axsIG.magSize);
};


axsIG.cleanUpGadgetTextInLens = function(){
  var menuControl = axsIG.axsJAXObj.evalXPath(".//a[@class='ddbox']",axsIG.axsLensObj.lens)[0];
  var minControl = axsIG.axsJAXObj.evalXPath(".//a[@class='minbox']",axsIG.axsLensObj.lens)[0];
  var delControl = axsIG.axsJAXObj.evalXPath(".//a[@class='delbox']",axsIG.axsLensObj.lens)[0];
  menuControl.tabIndex = -1;
  minControl.tabIndex = -1;
  delControl.tabIndex = -1;
  var garbageNodes = axsIG.axsJAXObj.evalXPath(axsIG.unavailableInfoXPath,axsIG.axsLensObj.lens);
  if (garbageNodes === null){
    return;
  }
  for (var i=0, node; node=garbageNodes[i]; i++){
    node.textContent = "";
  }
};



axsIG.goToNextGadget = function(){
  var gadget = axsIG.axsNavObj.nextItem().elem;
  axsIG.axsLensObj.view(gadget);
  axsIG.cleanUpGadgetTextInLens();
  axsIG.axsJAXObj.goTo(axsIG.axsLensObj.lens);
};  


axsIG.goToPrevGadget = function(){
  var gadget = axsIG.axsNavObj.prevItem().elem;
  axsIG.axsLensObj.view(gadget);
  axsIG.cleanUpGadgetTextInLens();
  axsIG.axsJAXObj.goTo(axsIG.axsLensObj.lens);
};

window.setTimeout("axsIG.init();",1000);

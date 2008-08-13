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
 * @fileoverview AxsJAX to enhance accessibility
 * of Weather.com. 
 *
 * @author reema@google.com (Reema Sardana)
 */
// create namespace
var axsWeather = {};

//These are strings to be spoken to the user
axsWeather.HELP_STRING = 'The following shortcut keys are available. ' +
  's, to go to the search bar.' +
  't, to go to the text view.' +
  'y - Go to yesterday\'s forecast.' +
  'd - Go to today\'s forecast.' +
  'r - Go to radar view.' +
  'u - Go to and Hour-By-Hour forecast.' +
  'w - Go to weekend\'s forecast.' +
  'n - Go to Ten Day forecast.' +
  'o - Go to tomorrow\'s forecast.' +
  'v - Go to video view.' +
  'a - Go to averages.' +
  'm - Go to more detailed forecast.' +
  'j - Go to the next result.' +
  'k - Go the the previous result.' +
  '+ - Increase the magnification.' +
  '- - Decrease the magnification.';


/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsWeather.axsJAXObj = null;
/**
 * The AxsNav object that will handle navigation.
 * @type AxsNav?
 */
axsWeather.axsNavObj = null;

/**
 * The AxsLens object that will magnify content.
 * @type AxsLens?
 */
axsWeather.axsLensObj = null;

/**
 * The AxsSound object that will play earcons
 * @type AxsSound?
 */
axsWeather.axsSoundObj = null;

/**
 * The magnification factor for the AxsLens object.
 * @type number
 */
axsWeather.magSize = 1.5;

axsWeather.init = function(){
  axsWeather.axsJAXObj = new AxsJAX(true);
  axsWeather.axsNavObj = new AxsNav(axsWeather.axsJAXObj);
  
  //Add event listeners
  document.addEventListener('keypress', axsWeather.keyHandler, true);
  
  var cnrString = '<cnr next="RIGHT l" prev="LEFT h">' +
                  '  <list title="Cycle Results" next="DOWN j" prev="UP k" f' +
                  'wd="n" back="p">' +
                  '    <item>' +
                  '      /html/body/center/div/table/tbody/tr[6]/td/table/tb' +
                  'ody/tr/td/div/table/tbody/tr/td/table[not(@class)]' +
                  '    </item>' +
                  '  </list>' +
                  '  <target title="Yesterdays forecast" hotkey="y" onEmpty=' +
                  '"Yesterdays forecast is not available">' +
                  '    id("TFbuttonZ")//a[contains(@href,"/weather/pastweath' +
                  'er/")]' +
                  '  </target>' +
                  '  <target title="Todays forecast" hotkey="d" onEmpty="Tod' +
                  'ays forecast is not available">' +
                  '    id("TFbuttonZ")//a[contains(@href,"/weather/local/")]' +
                  '  </target>' +
                  '  <target title="Tomorrows forecast" hotkey="o" onEmpty="' +
                  'Todays forecast is not available">' +
                  '    id("TFbuttonZ")//a[contains(@href,"?dayNum=1")]' +
                  '  </target>' +
                  '  <target title="Radar view" hotkey="r" onEmpty="Radar vi' +
                  'ew is not available">' +
                  '    id("TFbuttonZ")//a[contains(@href,"/weather/map/inter' +
                  'active/")]' +
                  '  </target>' +
                  '  <target title="Hour-by-hour forecast" hotkey="u" onEmpt' +
                  'y="Hour-by-hour forecast is not available">' +
                  '    id("TFbuttonZ")//a[contains(@href,"/weather/hourbyhou' +
                  'r/")]' +
                  '  </target>' +
                  '  <target title="Weekend forecast" hotkey="w" onEmpty="We' +
                  'ekend forecast is not available">' +
                  '    id("TFbuttonZ")//a[contains(@href,"/weather/weekend/"' +
                  ')]' +
                  '  </target>' +
                  '  <target title="Ten day forecast" hotkey="n" onEmpty="Te' +
                  'n day forecast is not available">' +
                  '    id("TFbuttonZ")//a[contains(@href,"/weather/tenday/")' +
                  ']' +
                  '  </target>' +
                  '  <target title="Text view" hotkey="t" onEmpty="Text view' +
                  ' is not available">' +
                  '    id("TFbuttonB")//a[contains(@href,"/weather/narrative' +
                  '")]' +
                  '  </target>' +
                  '  <target title="More details" hotkey="m" onEmpty="More d' +
                  'etails are not available">' +
                  '    id("TFbuttonB")//a[contains(@href,"/weather/wxdetail/' +
                  '")]' +
                  '  </target>' +
                  '  <target title="Video" hotkey="v" onEmpty="Video is not ' +
                  'available">' +
                  '    id("TFbuttonB")//a[contains(@href,"/multimedia/")]' +
                  '  </target>' +
                  '  <target title="Averages" hotkey="a" onEmpty="Averages a' +
                  're not available">' +
                  '    id("TFbuttonB")//a[contains(@href,"/weather/wxclimato' +
                  'logy/")]' +
                  '  </target>' +
                  '</cnr>';

  axsWeather.axsNavObj.navInit(cnrString, null);
  axsWeather.axsLensObj = new AxsLens(axsWeather.axsJAXObj);
  axsWeather.axsNavObj.setLens(axsWeather.axsLensObj);
  axsWeather.axsLensObj.setMagnification(axsWeather.magSize);
  axsWeather.axsSoundObj = new AxsSound(true);
  axsWeather.axsNavObj.setSound(axsWeather.axsSoundObj);
};

/**
 * When an input blank has focus, the keystrokes should go into the blank
 * and should not trigger hot key commands.
 * @param {event} A Focus event
 */
axsWeather.focusHandler = function(evt){
  axsWeather.lastFocusedNode = evt.target;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsWeather.inputFocused = true;
  }
};

/**
 * When no input blanks have focus, the keystrokes should trigger hot key
 * commands.
 * @param {event} A Blur event
 */
axsWeather.blurHandler = function (evt){
  axsWeather.lastFocusedNode = null;
  if ((evt.target.tagName == 'INPUT') ||
      (evt.target.tagName == 'TEXTAREA')){
    axsWeather.inputFocused = false;
  }
};

/**
 * Handle key presses
 */
axsWeather.keyHandler = function(evt) {
  if (evt.ctrlKey) {
    return true;
  }

  if (evt.keyCode == 27) { // ESC
    axsWeather.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsWeather.axsJAXObj.inputFocused) return true;

  var command = axsWeather.charCodeMap[evt.charCode];
  if (command)  return  command();
  return true;
};

axsWeather.charCodeMap = {
  45 : function () { // - (minus symbol)
    axsWeather.magSize -= 0.10;
    axsWeather.axsLensObj.setMagnification(axsWeather.magSize);
    return false;
  },
  61 : function () { // = symbol
    axsWeather.magSize += 0.10;
    axsWeather.axsLensObj.setMagnification(axsWeather.magSize);
    return false;
  },
  63 : function () {
    var helpStr = axsWeather.HELP_STRING;
    axsWeather.axsJAXObj.speakTextViaNode(helpStr);
    return false;
  },
  115 : function () { // s - Go to search bar.
    document.getElementById('whatwhereForm').focus();
    document.getElementById('whatwhereForm').select();
    return false;
  }
};

axsWeather.init();

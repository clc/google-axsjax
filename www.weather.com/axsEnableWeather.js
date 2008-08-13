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
  'h - Go to and Hour-By-Hour forecast.' +
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

axsWeather.searchBar = null;
axsWeather.today = null;
axsWeather.tomorrow = null;
axsWeather.yesterday = null;
axsWeather.radar = null;
axsWeather.hourByHour = null;
axsWeather.weekend = null;
axsWeather.tenDay = null;
axsWeather.month = null;
axsWeather.details = null;
axsWeather.video = null;
axsWeather.textViewLink = null;
axsWeather.averages = null;

axsWeather.init = function(){
  axsWeather.axsJAXObj = new AxsJAX(true);
  axsWeather.axsNavObj = new AxsNav(axsWeather.axsJAXObj);
  
  //Add event listeners
  document.addEventListener('keypress', axsWeather.keyHandler, true);
  
  var cnrString = '<cnr next="RIGHT l" prev="LEFT h">' +
          '  <list title="Cycle Results" next="DOWN j" prev="UP k" fw' +
          'd="n" back="p">' +
          '    <item>' +
          '   /html/body/center/div/table/tbody/tr[6]/td/table/tbod' +
          'y/tr/td/div/table/tbody/tr/td/table[not(@class)]' +
          '    </item>' +
          '  </list>' +
          '</cnr>'; 

  axsWeather.axsNavObj.navInit(cnrString, null);
  axsWeather.axsLensObj = new AxsLens(axsWeather.axsJAXObj);
  axsWeather.axsNavObj.setLens(axsWeather.axsLensObj);
  axsWeather.axsLensObj.setMagnification(axsWeather.magSize);
  axsWeather.axsSoundObj = new AxsSound(true);
  axsWeather.axsNavObj.setSound(axsWeather.axsSoundObj);
  
  axsWeather.getShortcutLinks();
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
    axsWeather.axsJAXObj.clickElem(axsWeather.searchBar, false);
    axsWeather.searchBar.focus();
    return false;
  },
  116 : function() { // t - Go to the text view.
    axsWeather.axsJAXObj.clickElem(axsWeather.textViewLink, false);
    return false;
  },
  121 : function() { // y - Go to yesterday's forecast 
    axsWeather.axsJAXObj.clickElem(axsWeather.yesterday, false);
    return false;
  },
  100 : function() { // d - Go to today's forecast 
    axsWeather.axsJAXObj.clickElem(axsWeather.today, false);
    return false;
  },  
  114 : function() { // r - Go to radar view
    axsWeather.axsJAXObj.clickElem(axsWeather.radar, false);
    return false;
  },
  104 : function() { // h - Go to and Hour-By-Hour forecast 
    axsWeather.axsJAXObj.clickElem(axsWeather.hourByHour, false);
    return false;
  },
  119 : function() { // w - Go to weekend's forecast 
    axsWeather.axsJAXObj.clickElem(axsWeather.weekend, false);
    return false;
  },
  110 : function() { // n - Go to Ten Day forecast 
    axsWeather.axsJAXObj.clickElem(axsWeather.tenDay, false);
    return false;
  },
  111: function() { // o - Go to tomorrow's forecast
    axsWeather.axsJAXObj.clickElem(axsWeather.tomorrow, false);
    return false;
  },
  118 : function() { // v - Go to video view 
    axsWeather.axsJAXObj.clickElem(axsWeather.video, false);
    return false;
  },
  97 : function() { // a - Go to averages 
    axsWeather.axsJAXObj.clickElem(axsWeather.averages, false);
    return false;
  },
  109 : function() { // m - Go to more detailed forecast
    axsWeather.axsJAXObj.clickElem(axsWeather.details, false);
    return false;
  }
};

/**
 * Get the links for all the shortcuts that you want to support.
 */
axsWeather.getShortcutLinks = function() {
  axsWeather.searchBar = document.getElementById('whatwhereForm');
  var mainNavBar = document.getElementById("TFbuttonZ");
  if (!(mainNavBar == null)) {
    if (!(typeof(mainNavBar) == 'undefined')) {
      var parent = mainNavBar.getElementsByTagName('td');
      axsWeather.yesterday = parent[0].firstChild;
      axsWeather.today = parent[1].firstChild;
      axsWeather.tomorrow = parent[2].firstChild;
      axsWeather.radar = parent[3].firstChild;
      axsWeather.hourByHour = parent[4].firstChild;
      axsWeather.weekend = parent[5].firstChild;
      axsWeather.tenDay = parent[6].firstChild;
      axsWeather.month = parent[7].firstChild;
    }
  }
  var forecastNavBar = document.getElementById("TFbuttonB");
  if (!(forecastNavBar == null)) {
    if (!(typeof(forecastNavBar) == 'undefined')) {
      var parent = forecastNavBar.getElementsByTagName('td');
      axsWeather.details = parent[0].firstChild;
      axsWeather.video = parent[1].firstChild;
      axsWeather.textViewLink = parent[2].firstChild;
      axsWeather.averages = parent[3].firstChild;
			
			// By default, go to the table view instead of graph view. 
      if (typeof(axsWeather.averages.href) != 'undefined' ) {
        axsWeather.averages.href = axsWeather.averages.href.replace(
          'graph/', '');
      }
    }
  }
}

axsWeather.init();

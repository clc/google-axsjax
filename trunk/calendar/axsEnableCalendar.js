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
 * of Google Calendar.
 * Note that these  scripts for Firefox and are not intended
 * to work for other browsers.
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsCal = {};

// These are strings used to find specific links

// These are strings to be spoken to the user
axsCal.HELP_STRING = 'The following shortcut keys are available. ' +
    'T, today. ' +
    'N or J, next day. ' +
    'P or K, previous day. ' +
    'Down arrow, next event. ' +
    'Up arrow, previous event. ' +
    'I, information about the current event. ' +
    'Q, quickly add an event. ' +
    'C, create event. ' +
    'G, get a friends calendar. ' +
    'L, next calendar. ' +
    'H, previous calendar. ' +
    'F, filter calendars. ' +
    'Space, toggle calendar selection. ';

axsCal.TODAY_STRING = 'Today. ';
axsCal.EVENTS_STRING = ' events. ';
axsCal.NOEVENTS_STRING = 'No events.';
axsCal.NOTSELECTED_STRING = 'Not selected. ';
axsCal.SELECTED_STRING = 'Selected. ';

// Areas of the calendar
axsCal.AREAS = {
  CALENDAR_LIST : 0,
  MAIN_CALENDAR : 1
};

axsCal.currentArea = axsCal.AREAS.MAIN_CALENDAR;

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX?
 */
axsCal.axsJAXObj = null;

axsCal.pkObj = null;

axsCal.eventsIndex = -1;
axsCal.eventsArray = new Array();

axsCal.calendarsIndex = -1;
axsCal.calendarsArray = new Array();


axsCal.init = function(){
  axsCal.axsJAXObj = new AxsJAX(true);

  //Add event listeners
  document.addEventListener('keypress', axsCal.keyHandler, true);

  axsCal.eventsIndex = -1;
  axsCal.eventsArray = new Array();

  window.addEventListener('DOMNodeInserted', axsCal.domInsertionHandler,
                          true);

  //Initialize PowerKey						  
  axsCal.pkObj = new PowerKey('calendarList', axsCal.axsJAXObj);
  var body = axsCal.axsJAXObj.getActiveDocument().body;
  var pkCalListHandler = function(cmd, index, id, args){
        axsCal.pkObj.updateCommandField('hidden', true, 40, 20);
		axsCal.axsJAXObj.lastFocusedNode.blur();
        axsCal.calendarsIndex = index - 1;
        axsCal.goToNextCalendar();
      };
  axsCal.pkObj.createCommandField(body, 30, pkCalListHandler, null, null, false);
  axsCal.pkObj.setAutoHideCommandField(true);
  PowerKey.setDefaultCSSStyle();
  
  // Switch to the Day view
  // Use a set time out just in case the browser is not entirely ready yet.
  window.setTimeout(axsCal.switchToDayMode,100);
};

axsCal.switchToDayMode = function(){
  var dayModeTab = document.getElementById('mode-day');
  axsCal.axsJAXObj.clickElem(dayModeTab, false);
};

/**
 * DOM nodes are inserted when a day is loaded, when an alert message is shown,
 * and when the infowindow is shown.
 * @param evt {event} A DOM Node Insertion event
 */
axsCal.domInsertionHandler = function(evt){
  var target = evt.target;
  var parentId = target.parentNode.id;
  // A new day has been loaded
  if (parentId == 'dateunderlay'){
    axsCal.eventsIndex = -1;
    axsCal.updateEventsArray();
    axsCal.summarizeDay();
  // An alert message has been shown
  } else if (parentId == 'nt2'){
    axsCal.axsJAXObj.speakTextViaNode(target.parentNode.textContent);
  // The infowindow has been activated  
  } else if (target.parentNode.parentNode.parentNode.id == 'infowindow'){
    axsCal.readEventInfo();
  }
};

/* Functions for working with the Calendars List */
axsCal.getCalendars = function(){
  var rootNode = document.getElementById('todrawfav');
  var xpath = "//div[@class='calListRow']";
  axsCal.calendarsArray = axsCal.axsJAXObj.evalXPath(xpath, rootNode);
};

axsCal.speakCurrentCalendar = function(){
  var currentCalendar = axsCal.calendarsArray[axsCal.calendarsIndex];
  var selected = axsCal.NOTSELECTED_STRING;
  if (currentCalendar.getElementsByTagName('input')[0].checked){
    selected = axsCal.SELECTED_STRING;
  }
  axsCal.axsJAXObj.speakTextViaNode(selected + currentCalendar.textContent);
};

axsCal.goToNextCalendar = function(){
  axsCal.currentArea = axsCal.AREAS.CALENDAR_LIST;
  if (axsCal.calendarsArray.length === 0){
    axsCal.getCalendars();
  }
  axsCal.calendarsIndex++;
  if(axsCal.calendarsIndex >= axsCal.calendarsArray.length){
    axsCal.calendarsIndex = 0;
  }
  axsCal.speakCurrentCalendar();
  return false;
};

axsCal.goToPrevCalendar = function(){
  axsCal.currentArea = axsCal.AREAS.CALENDAR_LIST;
  if (axsCal.calendarsArray.length === 0){
    axsCal.getCalendars();
  }
  axsCal.calendarsIndex--;
  if(axsCal.calendarsIndex < 0){
    axsCal.calendarsIndex = axsCal.calendarsArray.length;
  }
  axsCal.speakCurrentCalendar();
  return false;
};

axsCal.toggleCalendarSelection = function(){
  axsCal.getCalendars();
  var rootNode = axsCal.calendarsArray[axsCal.calendarsIndex];
  var xpath = ".//div[@class='calMenuLabel']";
  var calendarLabel = axsCal.axsJAXObj.evalXPath(xpath, rootNode)[0];
  if (calendarLabel){
    axsCal.axsJAXObj.clickElem(calendarLabel,false);
  } else {
    var checkBox = rootNode.getElementsByTagName('input')[0];
    axsCal.axsJAXObj.clickElem(checkBox,false);
  }
  axsCal.speakCurrentCalendar();
  return false;
};

axsCal.openAddFriendCalendar = function(){
  var addMenu = document.getElementById('addP');
  if (!addMenu){
    axsCal.axsJAXObj.clickElem(document.getElementById('addPT'),false);
	window.setTimeout(axsCal.openAddFriendCalendar,100);
    return false;
  }
  var addFriendCalendarDiv = addMenu.childNodes[2];
  axsCal.axsJAXObj.clickElem(addFriendCalendarDiv,false);  
  return false;
};


/* Functions for working with the events on the current calendar */
axsCal.updateEventsArray = function(){
  var rootNode = document.getElementById('allDayGrid');
  var xpath = ".//div[@class='adc']";
  var allDayEvents = axsCal.axsJAXObj.evalXPath(xpath, rootNode); 
  
  rootNode = document.getElementById('grid');
  xpath = ".//div[@class='chip']";
  var regularEvents = axsCal.axsJAXObj.evalXPath(xpath, rootNode);
  
  axsCal.eventsArray = new Array();
  var i = 0;
  var event = null;
  for (; event = allDayEvents[i]; i++){
    axsCal.eventsArray.push(event);
  }
  i = 0;
  event = null;
  for (; event = regularEvents[i]; i++){
    axsCal.eventsArray.push(event);
  }
};

axsCal.summarizeDay = function(){
  var today = "";
  if (document.getElementById('todayButton').hasAttribute('disabled')){
    today = axsCal.TODAY_STRING;
  }

  var day = document.getElementById('chead0').textContent + ' ';
  var date = document.getElementById('dateunderlay').textContent + '. ';


  var summary = today + day + date +
                axsCal.eventsArray.length + axsCal.EVENTS_STRING;

  axsCal.axsJAXObj.speakTextViaNode(summary);
};

axsCal.goToNextEvent = function(){
  axsCal.currentArea = axsCal.AREAS.MAIN_CALENDAR;
  if (axsCal.eventsArray.length === 0){
    axsCal.axsJAXObj.speakTextViaNode(axsCal.NOEVENTS_STRING);
    return false;
  }
  axsCal.eventsIndex++;
  if(axsCal.eventsIndex >= axsCal.eventsArray.length){
      axsCal.eventsIndex = 0;
  }
  var currentEvent = axsCal.eventsArray[axsCal.eventsIndex];
  axsCal.axsJAXObj.speakTextViaNode(currentEvent.textContent);
  return false;
};

axsCal.goToPrevEvent = function(){
  axsCal.currentArea = axsCal.AREAS.MAIN_CALENDAR;
  if (axsCal.eventsArray.length === 0){
    axsCal.axsJAXObj.speakTextViaNode(axsCal.NOEVENTS_STRING);
    return false;
  }
  axsCal.eventsIndex--;
  if(axsCal.eventsIndex < 0){
      axsCal.eventsIndex = axsCal.eventsArray.length;
  }
  var currentEvent = axsCal.eventsArray[axsCal.eventsIndex];
  axsCal.axsJAXObj.speakTextViaNode(currentEvent.textContent);
  return false;
};

/* Functions for working with the infowindow */
axsCal.readEventInfo = function(){
  var eventTitle = document.getElementById('mtb');
  var node = eventTitle.parentNode.parentNode.nextSibling;

  var info = eventTitle.textContent + '. ';
  for ( ; node.className != 'bubbleSeparator'; node = node.nextSibling){
    info = info + node.textContent + '. ';
  }
  axsCal.axsJAXObj.speakTextViaNode(info);
};

axsCal.activateInfowindow = function(){
  axsCal.updateEventsArray();
  
  if (axsCal.eventsArray.length === 0){
    axsCal.axsJAXObj.speakTextViaNode(axsCal.NOEVENTS_STRING);
    return false;
  }
  if (axsCal.eventsIndex < 0){
    axsCal.eventsIndex = 0;
  }
  var currentEvent = axsCal.eventsArray[axsCal.eventsIndex];

  var activeDoc = axsCal.axsJAXObj.getActiveDocument();
  //Generate a click event and send it to the target
  var evt = activeDoc.createEvent('MouseEvents');
  evt.initMouseEvent('click',true,true,activeDoc.defaultView,
                     1,0,0,0,0,false,false,false,false,0,null);
  //Use a try block here so that if the AJAX fails and it is a link,
  //it can still fall through and retry by setting the document.location.
  try{
    currentEvent.dispatchEvent(evt);
  } catch(e){}
  return false;
};

axsCal.deleteEventInfowindow = function(){
  var rootNode = document.getElementById('infowindow');
  var xpath = ".//font/a[text()='Delete']";
  var deleteLink = axsCal.axsJAXObj.evalXPath(xpath, rootNode)[0];
  axsCal.axsJAXObj.clickElem(deleteLink,false);  
};

axsCal.goToCalendarList = function(){  
  axsCal.currentArea = axsCal.AREAS.CALENDAR_LIST;
  if (axsCal.calendarsArray.length === 0){
    axsCal.getCalendars();
  }
  var calendarNames = new Array();
  for (var i=0,cal; cal = axsCal.calendarsArray[i]; i++){
    calendarNames.push(cal.textContent);
  }
  axsCal.pkObj.setCommandList(calendarNames);
  axsCal.pkObj.updateCommandField('visible', true, 40, 20);
};


/*
 * Keyboard handler for Calendar
 */
axsCal.keyHandler = function(evt){
  //If Ctrl is held, it must be for some AT. 
  if (evt.ctrlKey) return true;
  
  if (evt.keyCode == 27){ // ESC
    axsCal.axsJAXObj.lastFocusedNode.blur();
    return false;
  }

  if (axsCal.axsJAXObj.inputFocused) return true;

  var command = null;

  if (axsCal.currentArea === axsCal.AREAS.CALENDAR_LIST){
    command =  axsCal.keyCodeMapCL[evt.keyCode] ||
               axsCal.charCodeMapCL[evt.charCode];
  }
  if (command)  return  command();

  command =  axsCal.keyCodeMap[evt.keyCode] ||
             axsCal.charCodeMap[evt.charCode];

  if (command)  return  command();

  return true;
};


axsCal.keyCodeMapCL = {

};

axsCal.charCodeMapCL = {
  32 : axsCal.toggleCalendarSelection // SPACE
};

axsCal.keyCodeMap = {
  46 : axsCal.deleteEventInfowindow, // DELETE
  40 : axsCal.goToNextEvent,  // Down
  38 : axsCal.goToPrevEvent   // Up
};

axsCal.charCodeMap = {
   63 : function () {axsCal.axsJAXObj.speakTextViaNode(axsCal.HELP_STRING); return false;}, // ?
  103 : axsCal.openAddFriendCalendar,  // g
  105 : axsCal.activateInfowindow,  // i
  102 : axsCal.goToCalendarList,  // f
  108 : axsCal.goToNextCalendar,  // l
  104 : axsCal.goToPrevCalendar // h
};

window.setTimeout(axsCal.init,100);

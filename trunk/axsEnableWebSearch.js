
// create namespace
var axsWebSearch = {};

/**
 * The AxsJAX object that will do the tickling and speaking.
 * @type AxsJAX
 */
axsWebSearch.axsJAXObj = null;

axsWebSearch.inputFocused = false;

axsWebSearch.NO_ONE_BOX_STRING = 'There is no one box on this page.';



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

  window.addEventListener('DOMAttrModified', axsWebSearch.domAttrModifiedHandler, true);
  window.addEventListener('keypress', axsWebSearch.extraKeyboardNavHandler, true);
  window.addEventListener('focus', axsWebSearch.focusHandler, true);
  window.addEventListener('blur', axsWebSearch.blurHandler, true);
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
};


axsWebSearch.readOneBox = function(){
  if (document.getElementById('res').childNodes[1].tagName == 'P'){
    axsWebSearch.axsJAXObj.speakNode(document.getElementById('res').childNodes[1]);
  } else{
    axsWebSearch.axsJAXObj.speakText(axsWebSearch.NO_ONE_BOX_STRING);
  }
};




axsWebSearch.init();
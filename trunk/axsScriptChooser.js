// ==UserScript==
// @name          Google Accessibility Improvement
// @namespace     http://www.google.com/accessible/
// @description   Uses WAI-ARIA to enhance accessibility for Google
// @include       http://www.google.com/*
// ==/UserScript==

function pickScript(){
  var theLib = document.createElement('script');
  theLib.type = 'text/javascript';
  theLib.src = 'http://www.corp.google.com/~clchen/AxsJAX/AxsJAX.js';
  var shouldInsertScripts = false;
  var theScript = document.createElement('script');
  theScript.type = 'text/javascript';
  var currentURL = document.baseURI;
  if (currentURL.indexOf('http://www.google.com/reader/') == 0){
    theScript.src = 'http://www.corp.google.com/~clchen/AxsJAX/axsEnableReader.js';
    shouldInsertScripts = true;
  }
  if ((currentURL == 'http://www.google.com/') || (currentURL.indexOf('http://www.google.com/search') == 0)){
    theScript.src = 'http://www.corp.google.com/~clchen/AxsJAX/axsEnableWebSearch.js';
    shouldInsertScripts = true;    
  }
  if (shouldInsertScripts){
    document.getElementsByTagName('head')[0].appendChild(theLib);
    document.getElementsByTagName('head')[0].appendChild(theScript);
  }
}

pickScript();
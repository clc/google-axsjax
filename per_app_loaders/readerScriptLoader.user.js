// ==UserScript==
// @name          Google Reader Accessibility Improvement
// @namespace     http://www.google.com/accessible/
// @description   Uses WAI-ARIA live regions to enhance Google Reader accessibility in Fire Vox.
// @include       http://www.google.com/reader/*
// ==/UserScript==

function loadScript(){
  var theScript = document.createElement('script');
  theScript.type = 'text/javascript';
  theScript.src = 'http://www.corp.google.com/~clchen/AxsJAX/axsEnableReader.js';
  document.getElementsByTagName('head')[0].appendChild(theScript);
}

loadScript();
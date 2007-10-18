// ==UserScript==
// @name          Google Accessibility Enhancements
// @namespace     http://www.google.com/accessible/
// @description   Uses WAI-ARIA to enhance accessibility for Google
// @include       http://www.google.com/*
// ==/UserScript==

function loadScript(){
  var theScript = document.createElement('script');
  theScript.type = 'text/javascript';
  theScript.src = 'http://google-axsjax.googlecode.com/svn/trunk/common/axsScriptChooser.js';
  document.getElementsByTagName('head')[0].appendChild(theScript);
}

loadScript();
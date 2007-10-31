// Copyright 2007 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview The Google Script Loader Greasemonkey script will load
 * this script which will pick the appropriate scripts to load
 * for the Google app that the user is currently using.
 * @author clchen@google.com (Charles L. Chen)
 */



function pickScript(){
  var theLib = document.createElement('script');
  theLib.type = 'text/javascript';
  theLib.src =
      'http://google-axsjax.googlecode.com/svn/trunk/common/AxsJAX.js';
  //Do not insert anything if the scripts are already inserted.
  var scriptArray = document.getElementsByTagName('script');
  for (var i=0; i<scriptArray.length; i++){
    if(scriptArray[i].src == theLib.src){
      return;
    }
  }
  var shouldInsertScripts = false;
  var theScript = document.createElement('script');
  theScript.type = 'text/javascript';
  var currentURL = document.baseURI;
  if (currentURL.indexOf('http://www.google.com/reader/') == 0){
    theScript.src =
        'http://google-axsjax.googlecode.com/svn/trunk/reader/axsEnableReader.js';
    shouldInsertScripts = true;
  }
  if ((currentURL == 'http://www.google.com/')
      || (currentURL.indexOf('http://www.google.com/search') == 0)
      || (currentURL.indexOf('http://www.google.com/custom') == 0)){
    theScript.src =
        'http://google-axsjax.googlecode.com/svn/trunk/websearch/axsEnableWebSearch.js';
    shouldInsertScripts = true;    
  }
  if (shouldInsertScripts){
    document.getElementsByTagName('head')[0].appendChild(theLib);
    document.getElementsByTagName('head')[0].appendChild(theScript);
  }
}

pickScript();

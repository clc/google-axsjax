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
 * @fileoverview The Google Script Loader Greasemonkey script will load
 * this script which will pick the appropriate scripts to load
 * for the Google app that the user is currently using.
 * @author clchen@google.com (Charles L. Chen)
 */



function pickScript(){
  var baseURL = 'http://google-axsjax.googlecode.com/svn/trunk/';
  var theLib = document.createElement('script');
  theLib.type = 'text/javascript';
  theLib.src = baseURL + 'common/AxsJAX.js';
  var navLib = document.createElement('script');
  navLib.type = 'text/javascript';
  navLib.src = baseURL + 'common/AxsNav.js';

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

  //Check for commands
  if (currentURL.indexOf('#AxsJAX_Cmd=GetImgText') != -1){
    theScript.src = baseURL + 'common/cmd/imgText-exp.js';
    shouldInsertScripts = true;
  }

  //Check for Google
  else if(urlIsGoogle()){
    var path = document.location.pathname;
    var prefix = document.location.host;
    prefix = prefix.substring(0,prefix.indexOf('.'));
    if (path.indexOf('/reader/') === 0){
      theScript.src = baseURL + 'reader/axsEnableReader.js';
      shouldInsertScripts = true;
    }
    else if ((prefix == 'www')
        || (path.indexOf('/search') === 0)
        || (path.indexOf('/custom') === 0)
        || (path.indexOf('/cse') === 0)){
      theScript.src = baseURL + 'websearch/axsEnableWebSearch.js';
      shouldInsertScripts = true;
    }
    else if ( (prefix == 'images') && (path.indexOf('/images') === 0 ) ){
      theScript.src = baseURL + 'imagesearch/axsEnableImageSearch.js';
      shouldInsertScripts = true;
    }
    else if (prefix == 'books'){
      theScript.src = baseURL + 'books/axsEnableBooks.js';
      shouldInsertScripts = true;
    }
    else if ( (prefix == 'scholar') && (path.indexOf('/scholar') === 0 ) ){
      theScript.src = baseURL + 'scholar/axsEnableScholar.js';
      shouldInsertScripts = true;
    }
    else if (prefix == 'mail'){
      if (currentURL.indexOf('&view=cw&fs=1&tf=1&ver=4z1ea2of9ihcy9k8lkip018ww#') != -1){
        theScript.src = baseURL + 'gmail/axsEnableTalk.js';
      } else {
        theScript.src = baseURL + 'gmail/axsEnableGMail.js';
      }
      shouldInsertScripts = true;
    }
  }
  else if (currentURL === 'http://www.minijuegosgratis.com/juegos/jawbreaker/jawbreaker.htm'){
    theScript.src = baseURL + 'jawbreaker/axsEnableJawbreaker.js';
    shouldInsertScripts = true;
  }
  else if ((currentURL.indexOf('http://www.xkcd.com') === 0) || (currentURL.indexOf('http://xkcd.com') === 0)){
    theScript.src = baseURL + 'xkcd/axsEnableXKCD.js';
    shouldInsertScripts = true;
  }
  else if ( (currentURL.indexOf('http://www.ohnorobot.com/transcribe.pl?comicid=apKHvCCc66NMg') === 0) &&
            (currentURL.indexOf('#AxsJAX_Cmd') != -1)){
    theScript.src = baseURL + 'xkcd/axsEnableXKCD_TranscriptFetcher.js';
    shouldInsertScripts = true;
  }


  if (shouldInsertScripts){
    document.getElementsByTagName('head')[0].appendChild(theLib);
    document.getElementsByTagName('head')[0].appendChild(navLib);
    document.getElementsByTagName('head')[0].appendChild(theScript);
  }
}

function urlIsGoogle(){
  var pattern0 = /^\w{0,}\.google\.com$/;          // *.google.com
  var pattern1 = /^\w{0,}\.google\.\w{2}$/;        // *.google.XX
  var pattern2 = /^\w{0,}\.google\.\w{2}\.\w{2}$/; // *.google.XX.XX

  var hostUrl = document.location.host;

  if (pattern0.test(hostUrl)){
    return true;
  }
  if (pattern1.test(hostUrl)){
    return true;
  }
  if (pattern2.test(hostUrl)){
    return true;
  }
  return false
}


pickScript();

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
 * @fileoverview This script decides which of the XKCD comic pages
 * the user is on and loads the appropriate transcript set.
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsXKCD = {};


axsXKCD.getComicNumber = function(){
  var h3Array = document.getElementsByTagName('H3');
  for (var i=0, currentH3; currentH3 = h3Array[i]; i++){
    if (currentH3.innerHTML.indexOf('Permanent link to this comic: http://xkcd.com/') === 0){
      var numString = currentH3.innerHTML.substring(46,currentH3.innerHTML.length-1);
      return parseInt(numString);
    }
  }
};

axsXKCD.pickXKCDScript = function(){
  var baseURL = 'http://google-axsjax.googlecode.com/svn/trunk/';
  var theScript = document.createElement('script');
  theScript.type = 'text/javascript';
  theScript.src = baseURL + 'xkcd/axsEnableXKCDPage.js';
  var theTranscript = document.createElement('script');
  theTranscript.type = 'text/javascript';
  var comicNumber = axsXKCD.getComicNumber();
  
  if (comicNumber <= 30){
    theTranscript.src = baseURL + 'xkcd/transcripts/xkcd_transcriptions_30.js';
  } else if (comicNumber <= 61){
    theTranscript.src = baseURL + 'xkcd/transcripts/xkcd_transcriptions_61.js';
  }  else if (comicNumber <= 92){
    theTranscript.src = baseURL + 'xkcd/transcripts/xkcd_transcriptions_92.js';
  }  else if (comicNumber <= 122){
    theTranscript.src = baseURL + 'xkcd/transcripts/xkcd_transcriptions_122.js';
  }   else if (comicNumber <= 152){
    theTranscript.src = baseURL + 'xkcd/transcripts/xkcd_transcriptions_152.js';
  } 
  
  document.getElementsByTagName('head')[0].appendChild(theTranscript);
  document.getElementsByTagName('head')[0].appendChild(theScript);  
};

axsXKCD.pickXKCDScript();

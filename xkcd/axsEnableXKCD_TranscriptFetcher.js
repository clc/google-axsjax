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
 * @fileoverview This script is used to fetch the transcripts
 * from ohnorobot.com
 * @author clchen@google.com (Charles L. Chen)
 */

// create namespace
var axsXKCD_TranscriptFetcher = {};



axsXKCD_TranscriptFetcher.run = function(){
  var transcript = "";
  if (document.getElementsByTagName('TEXTAREA')[0]){
    transcript = document.getElementsByTagName('TEXTAREA')[0].value;
  } else {
    transcript = document.getElementsByTagName('P')[0].textContent;
  }
  if (transcript == ''){
    transcript = 'NULL';
  }
  var url = document.location.toString();
  var parentNum = url.substr(url.indexOf('#AxsJAX_Cmd=') + 12);

  parent.location = 'http://xkcd.com/' + parentNum + '/#' + transcript;
}

axsXKCD_TranscriptFetcher.run();
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
 * @fileoverview AxsCNRLoader - JavaScript library for loading
 * CNR files from the web
 * @author clchen@google.com (Charles L. Chen)
 */

/**
 * Class for managing loading of CNRs
 * @constructor
 */
var AxsCNRLoader = {}

AxsCNRLoader.init = function(){
  AxsCNRLoader.ready = false;
  AxsCNRLoader.busy = false;
  var self = this;
    
  var script = document.createElement('script');
  script.src = 'http://www.google.com/jsapi?callback=AxsCNRLoader.googleLoadHandler';
  script.type = 'text/javascript';
  document.getElementsByTagName('head')[0].appendChild(script);
};

AxsCNRLoader.googleLoadHandler = function(){
  google.load('feeds', '1', {callback: AxsCNRLoader.feedsReadyHandler});
}

AxsCNRLoader.feedsReadyHandler = function(){
  AxsCNRLoader.ready = true;
};

AxsCNRLoader.load = function(url, srcType, callback){
  if (!AxsCNRLoader.ready || AxsCNRLoader.busy){
    var tempFunc = function(){
                     AxsCNRLoader.load(url, srcType, callback);
                   };
    window.setTimeout(tempFunc,100);
    return;
  }
  AxsCNRLoader.busy = true;
  if (srcType == 'blogger'){
    var feed = new google.feeds.Feed(url);
	var handler = function(result){
                    AxsCNRLoader.handleBlogger(result, callback);
                  }; 
    feed.load(handler);  
  }
};

AxsCNRLoader.handleBlogger = function(result, callback){
  var cnrs = new Array();
  var entries = result.feed.entries;
  for (var i=0, entry; entry = entries[i]; i++){
    var isCNR = false;
    for (var j=0, cat; cat = entry.categories[j]; j++){
	  if (cat == 'CNR'){
	    isCNR = true;
	  }	
	}
	if (isCNR){
	  var cnrObj = new Object();
	  cnrObj.url = entry.title;
	  var unescapedRule = entry.content.replace(/<br>/g, '');
	  unescapedRule = unescapedRule.replace(/&lt;/g, '<');
	  unescapedRule = unescapedRule.replace(/&gt;/g, '>');
	  unescapedRule = unescapedRule.replace(/&#39;/g, '"');
	  cnrObj.rule = unescapedRule;
	  cnrs.push(cnrObj);
	}
  }  
  callback(cnrs);
};

AxsCNRLoader.init();
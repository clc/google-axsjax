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
  var foundCompiledScript = pickFromCompiled(baseURL);
  if (!foundCompiledScript){
    pickFromUncompiled(baseURL);
  }
}


function pickFromCompiled(scriptsBaseURL){
  var scriptURL = '';
  var currentURL = document.baseURI;
  if (urlIsGoogle()){
    var path = document.location.pathname;
    var prefix = document.location.host;
    var search = document.location.search;
    prefix = prefix.substring(0, prefix.indexOf('.'));
    if ((prefix == 'www') && (path.indexOf('/ig') === 0)){
      scriptURL = scriptsBaseURL + 'igoogle/comp_igoogle.js';
    }
    else if (path.indexOf('/calendar') === 0){
      scriptURL = scriptsBaseURL + 'calendar/comp_calendar.js';
    }
    else if ((prefix == 'images') && (path.indexOf('/images') === 0)){
      scriptURL = scriptsBaseURL + 'imagesearch/comp_imagesearch.js';
    }
    else if ((prefix == 'finance') && (path.indexOf('/finance') === 0 )){
      if (path == '/finance/stockscreener') { 
        scriptURL = scriptsBaseURL + 'finance/comp_financeStockScreener.js';
      } else if (currentURL.indexOf('?') == - 1) {
        scriptURL = scriptsBaseURL + 'finance/comp_financeHome.js';
      } else if (currentURL.indexOf('catid=') > -1) {
        scriptURL = scriptsBaseURL + 'finance/comp_financeSector.js';
      } else if (currentURL.indexOf('fstype=') > -1) {
        scriptURL = scriptsBaseURL + 'finance/comp_financeStatement.js';
      } else if (currentURL.indexOf('q=') > -1 && currentURL.lastIndexOf(':') > 30) {
        scriptURL = scriptsBaseURL + 'finance/comp_financeQuotes.js';
      } else if (currentURL.indexOf('cid=') > -1){
        scriptURL = scriptsBaseURL + 'finance/comp_financeIndex.js';
      } else if (path.indexOf('/converter') === -1){
        scriptURL = scriptsBaseURL + 'finance/comp_financeCurrency.js';
      }
    }
    else if (prefix == 'mail'){
      if (document.baseURI.indexOf('&view=cw&fs=1&tf=1') != -1){
        scriptURL = scriptsBaseURL + 'gmail/comp_talk.js';
      } else {
        scriptURL = scriptsBaseURL + 'gmail/comp_gmail.js';
      }
    }
    else if (path.indexOf('/products') === 0){
      scriptURL = scriptsBaseURL + 'productsearch/comp_productsearch.js';
    }
    else if ((prefix == 'www') && (path.indexOf('/sky') === 0)){
      scriptURL = scriptsBaseURL + 'sky/comp_sky.js';
    }
    else if ((prefix == 'scholar') && (path.indexOf('/scholar') === 0)){
      scriptURL = scriptsBaseURL + 'scholar/comp_scholar.js';
    }
    else if (((prefix == 'www') && (path.length > 1)) &&
             ((path.indexOf('/search') === 0) ||
              (path.indexOf('/custom') === 0) ||
              (path.indexOf('/cse') === 0))){
      // Redirect users to the Accessible View experiment
      if ((currentURL.indexOf('esrch=Axs&') == -1) && (currentURL.indexOf('?') != -1)){
        currentURL = currentURL.replace('?', '?esrch=Axs&');
        document.location = currentURL;
      }
    }
  }
  else if (currentURL.indexOf('http://moderator.appspot.com/#') === 0){
    currentURL = currentURL.replace('http://moderator.appspot.com/#', 'http://moderator.appspot.com/?axs#');
    document.location = currentURL;
  }
  else if (document.baseURI == 'http://www.minijuegosgratis.com/juegos/jawbreaker/jawbreaker.htm'){
    scriptURL = scriptsBaseURL + 'jawbreaker/comp_jawbreaker.js';
  }
  if (scriptURL !== ''){
    var theScript = document.createElement('script');
    theScript.type = 'text/javascript';
    theScript.src = scriptURL;
    document.getElementsByTagName('head')[0].appendChild(theScript);
    return true;
  }
  return false;
}


function pickFromUncompiled(scriptsBaseURL){
  var baseURL = scriptsBaseURL;
  var theLib = document.createElement('script');
  theLib.type = 'text/javascript';
  theLib.src = baseURL + 'common/AxsJAX.js';
  var navLib = document.createElement('script');
  navLib.type = 'text/javascript';
  navLib.src = baseURL + 'common/AxsNav.js';
  var lensLib = document.createElement('script');
  lensLib.type = 'text/javascript';
  lensLib.src = baseURL + 'common/AxsLens.js';
  var sndLib = document.createElement('script');
  sndLib.type = 'text/javascript';
  sndLib.src = baseURL + 'common/AxsSound.js';
  var pkLib = document.createElement('script');
  pkLib.type = 'text/javascript';
  pkLib.src = baseURL + 'common/PowerKey.js';

  var scriptsArray = new Array();
  scriptsArray.push(theLib);

  //Do not insert anything if the scripts are already inserted.
  var scriptArray = document.getElementsByTagName('script');
  for (var i = 0, script; script = scriptArray[i]; i++){
    if (script.src == theLib.src){
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
  //Check for uncompiled scripts
  else if ((currentURL.indexOf('http://www.xkcd.com') === 0) ||
           (currentURL.indexOf('http://xkcd.com') === 0)){
    theScript.src = baseURL + 'xkcd/axsEnableXKCD.js';
    shouldInsertScripts = true;
  }
  else if ((currentURL.indexOf('http://www.ohnorobot.com/transcribe.pl?comicid=apKHvCCc66NMg') === 0) &&
           (currentURL.indexOf('#AxsJAX_Cmd') != -1)){
    theScript.src = baseURL + 'xkcd/axsEnableXKCD_TranscriptFetcher.js';
    shouldInsertScripts = true;
  }
  else if (currentURL.indexOf('http://www.amazon.com') === 0){
    theScript.src = baseURL + 'www.amazon.com/axsEnableAmazonSearch.js';
    scriptsArray.push(navLib);
    scriptsArray.push(lensLib);
    scriptsArray.push(sndLib);
    shouldInsertScripts = true;
  }
  else if (currentURL.indexOf('http://shop.ebay.com') === 0){
    theScript.src = baseURL + 'www.ebay.com/axsEnableEbay.js';
    scriptsArray.push(navLib);
    scriptsArray.push(lensLib);
    scriptsArray.push(sndLib);
    shouldInsertScripts = true;
  }
  else if (currentURL.indexOf('http://www.weather.com') === 0){
    theScript.src = baseURL + 'www.weather.com/axsEnableWeather.js';
    scriptsArray.push(navLib);
    scriptsArray.push(lensLib);
    scriptsArray.push(sndLib);
    shouldInsertScripts = true;
  }
  else if (currentURL.indexOf('http://www.orkut.com') === 0){
    theScript.src = baseURL + 'orkut/axsEnableOrkut.js';
    scriptsArray.push(navLib);
    scriptsArray.push(lensLib);
    scriptsArray.push(sndLib);
    shouldInsertScripts = true;
  }
  else if (currentURL.indexOf('craigslist.org/forums') != -1){
    theScript.src = baseURL + 'www.craigslist.org/axsEnableCraigslistForums.js';
    scriptsArray.push(navLib);
    scriptsArray.push(lensLib);
    scriptsArray.push(sndLib);
    scriptsArray.push(pkLib);
    shouldInsertScripts = true;
  }
  else if (currentURL.indexOf('craigslist.org/about/sites') != -1){
    theScript.src = baseURL + 'www.craigslist.org/axsEnableCraigslistHome.js';
    scriptsArray.push(navLib);
    scriptsArray.push(lensLib);
    scriptsArray.push(sndLib);
    scriptsArray.push(pkLib);
    shouldInsertScripts = true;
  }
  else if (currentURL.indexOf('http://geo.craigslist.org/iso') === 0){
    theScript.src = baseURL + 'www.craigslist.org/axsEnableCraigslistHomeGeo.js';
    scriptsArray.push(navLib);
    scriptsArray.push(lensLib);
    scriptsArray.push(sndLib);
    scriptsArray.push(pkLib);
    shouldInsertScripts = true;
  }
  else if (currentURL.indexOf('.craigslist.org/') != -1){
    theScript.src = baseURL + 'www.craigslist.org/axsEnableCraigslistCategoryPostings.js';
    scriptsArray.push(navLib);
    scriptsArray.push(lensLib);
    scriptsArray.push(sndLib);
    scriptsArray.push(pkLib);
    shouldInsertScripts = true;
  }  
  if (shouldInsertScripts){
    scriptsArray.push(theScript);
    for (var i = 0, script; script = scriptsArray[i]; i++){
      document.getElementsByTagName('head')[0].appendChild(script);
    }
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
  return false;
}


pickScript();

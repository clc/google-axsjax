// Copyright 2008 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview 
 * This script will load and run the appropriate CNR for the current page
 * you are viewing if there is such a CNR available. 
 *
 * For more information about CNR, please see the AxsJAX project page at:
 * http://google-axsjax.googlecode.com
 *
 * The CNRs are available as blog posts on blogspot with the tag "CNR".
 * By default, cnrSource points to Charles L. Chen's blog 
 * (http://clcworld.blogspot.com). If you would like to change this to
 * some other blog, change cnrSource so that it contains the URL of 
 * the blog you wish to use.
 *
 * @author clchen@google.com (Charles L. Chen)
 */
 
 
 
 
function pickCNR(){
  var baseURL = 'http://google-axsjax.googlecode.com/svn/trunk/';

  // Don't try to run a CNR if there is already 
  // an AxsJAX script for the page.
  var scriptArray = document.getElementsByTagName('script');
  for (var i = 0, script; script = scriptArray[i]; i++){
    if ((script.src.indexOf(baseURL) === 0) &&
        (script.src.indexOf('AxsCNRLoader.js') == -1) &&
		(script.src.indexOf('axsScriptChooser') == -1)){
      return;
    }
  }

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
  var cnrFetcher = document.createElement('script');
  cnrFetcher.type = 'text/javascript';
  cnrFetcher.src = baseURL + 'common/AxsCNRFetcher.js';
  var cnrRunner = document.createElement('script');
  cnrRunner.type = 'text/javascript';
  cnrRunner.src = baseURL + 'common/AxsCNRRunner.js';
  
  document.getElementsByTagName('head')[0].appendChild(theLib);
  document.getElementsByTagName('head')[0].appendChild(navLib);
  document.getElementsByTagName('head')[0].appendChild(lensLib);
  document.getElementsByTagName('head')[0].appendChild(sndLib);
  document.getElementsByTagName('head')[0].appendChild(cnrFetcher);  
  document.getElementsByTagName('head')[0].appendChild(cnrRunner); 
}
 
 window.setTimeout(pickCNR,500);
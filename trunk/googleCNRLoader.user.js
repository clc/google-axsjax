// Copyright 2008 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview 
 * The Google AxsJAX CNR (Content Navigation Rule) Loader Greasemonkey 
 * script will load and run the appropriate CNR for the current page 
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
  // Don't try to run a CNR if there is already 
  // an AxsJAX script for the page.
  if (typeof(AxsJAX) != 'undefined'){
    return;
  }
  
  var baseURL = 'http://www.corp.google.com/~clchen/AxsJAX/';
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
  var cnrLoader = document.createElement('script');
  cnrLoader.type = 'text/javascript';
  cnrLoader.src = baseURL + 'common/AxsCNRLoader.js';
  var cnrRunner = document.createElement('script');
  cnrRunner.type = 'text/javascript';
  cnrRunner.src = baseURL + 'common/AxsCNRRunner.js';
  
  document.getElementsByTagName('head')[0].appendChild(theLib);
  document.getElementsByTagName('head')[0].appendChild(navLib);
  document.getElementsByTagName('head')[0].appendChild(lensLib);
  document.getElementsByTagName('head')[0].appendChild(sndLib);
  document.getElementsByTagName('head')[0].appendChild(cnrLoader);  
  document.getElementsByTagName('head')[0].appendChild(cnrRunner); 
  
 
}
 
 window.setTimeout(pickCNR,500);
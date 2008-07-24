// Copyright 2008 Google Inc.
// All Rights Reserved.

/**
 * @fileoverview 
 * The Google AxsJAX CNR (Content Navigation Rule) Loader Greasemonkey 
 * script will load and run axsCNRLoader.js
 * This adds a level of indirection and allows users to get the latest
 * version without needing to download and install it each time.
 *
 * For more information about CNR, please see the AxsJAX project page at:
 * http://google-axsjax.googlecode.com
 *
 * The CNRs are available as blog posts on blogspot with the tag "CNR".
 * By default, window.wrappedJSObject.axsCNRSource points to  
 * Charles L. Chen's blog (http://clcworld.blogspot.com). If you would 
 * like to change this to some other blog, change cnrSource so that 
 * it contains the URL of the blog you wish to use.
 *
 * @author clchen@google.com (Charles L. Chen)
 */
 
 // Replace this with the Blogspot ATOM Feed URL that contains 
 // the CNRs that you want to use. 
 window.wrappedJSObject.axsCNRSource = 'http://clcworld.blogspot.com/atom.xml';
 
 function loadCNRSystem(){
  var theScript = document.createElement('script');
  theScript.src = 'http://google-axsjax.googlecode.com/svn/trunk/common/AxsCNRLoader.js';
  document.getElementsByTagName('head')[0].appendChild(theScript);
}

loadCNRSystem();
(function() { 
var a=function(b){this.la=0;this.o=null;this.B=false;this.e=null;this.u=false;var c=this,d=function(f){c.e=f.target;if(f.target.tagName=="INPUT"||f.target.tagName=="SELECT"||f.target.tagName=="TEXTAREA")c.u=true;return true};document.addEventListener("focus",d,true);var e=function(f){c.P(c.e,"aria-activedescendant");c.e=null;if(f.target.tagName=="INPUT"||f.target.tagName=="SELECT"||f.target.tagName=="TEXTAREA")c.u=false;return true};document.addEventListener("blur",e,true);if(b){this.B=true;document.addEventListener("keypress",
function(f){c.R(f,c)},true);document.body.D=true}this.s=document.body};a.prototype.Za=function(b){this.s=b;var c=this.f();if(this.B&&!c.body.D){var d=this;c.addEventListener("keypress",function(e){d.R(e,d)},true);c.body.D=true}};a.prototype.f=function(){var b=this.s;while(b.nodeType!=9)b=b.parentNode;return b};a.prototype.$a=function(b,c){if(!b.id)this.L(b);if(c){this.g(b,"live","rude");this.g(b,"atomic","true");var d=this.f(),e=d.createElement("div");e.textContent=" ";e.name="AxsJAX_dummyNode";if(b.lastChild&&
b.lastChild.name&&b.lastChild.name==e.name)b.removeChild(b.lastChild);b.appendChild(e)}else{var f=this.Qa(b,"role");this.g(b,"role","row");var g=this.e;if(!g||g.nodeType==9){this.s.tabIndex=-1;g=this.s}this.g(g,"activedescendant",null);g.focus();this.g(g,"activedescendant",b.id);var h=this;window.setTimeout(function(){if(f)h.g(b,"role",f);else h.P(b,"role")},0)}};a.prototype.Q=function(b){var c=window.content.document,d=c.createElement("span");d.id="AxsJAX_audioNode";d.style.visibility="hidden";this.g(d,
"live","rude");var e=c.getElementById(d.id);if(e)c.body.removeChild(e);d.textContent=b;c.body.appendChild(d)};a.prototype.d=function(b,c){var d="AxsJAX_pixelAudioNode",e="AxsJAX_pixelAudioNode",f="data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",g=this.f(),h=null;if(c){if(c.previousSibling&&c.previousSibling.name==e)h=c.previousSibling;else{h=g.createElement("img");h.name=e;h.setAttribute("tabindex",0);h.style.outline="none";h.src=f;c.parentNode.insertBefore(h,c);
this.Pa(h)}h.setAttribute("alt",b);h.setAttribute("title",b);window.setTimeout(function(){h.blur();h.focus()},0)}else{h=g.getElementById(d);if(!h){h=g.createElement("img");h.id=d;h.src=f;g.body.appendChild(h)}h.setAttribute("alt",b);h.setAttribute("title",b);this.$a(h)}};a.prototype.z=function(b,c){var d=this.f(),e=d.createEvent("MouseEvents");e.initMouseEvent("mousedown",true,true,d.defaultView,1,0,0,0,0,false,false,c,false,0,null);try{b.dispatchEvent(e)}catch(f){}e=d.createEvent("MouseEvents");
e.initMouseEvent("mouseup",true,true,d.defaultView,1,0,0,0,0,false,false,c,false,0,null);try{b.dispatchEvent(e)}catch(f){}e=d.createEvent("MouseEvents");e.initMouseEvent("click",true,true,d.defaultView,1,0,0,0,0,false,false,c,false,0,null);try{b.dispatchEvent(e)}catch(f){}if(b.tagName=="A"&&b.href&&(b.href.indexOf("http")===0||b.href.indexOf("javascript:")===0))if(c)window.open(b.href);else document.location=b.href};a.prototype.Ya=function(b,c,d,e,f){var g=0,h=0;if(c=="ENTER")g=13;else if(c.length==
1)h=c.charCodeAt(0);var k=this.f(),j=k.createEvent("KeyboardEvent");j.cb("keypress",true,true,null,d,e,f,false,g,h);b.dispatchEvent(j)};a.prototype.L=function(b,c){if(!b)return"";if(b.id)return b.id;var d=c||"AxsJAX_ID_";b.id=d+this.la++;return b.id};a.prototype.Wa=function(b){if(!b)return false;if(b.tagName=="A"||b.tagName=="INPUT"){this.o=b;return true}var c=b.getElementsByTagName("*");for(var d=0,e;e=c[d];d++)if(e.tagName=="A"||e.tagName=="INPUT"||e.hasAttribute("tabindex")&&e.tabIndex!=-1){this.o=
e;return true}return false};a.prototype.R=function(b,c){if(!c.B)return true;if(b.keyCode==9&&c.o){c.o.focus();c.o=null}return true};a.prototype.g=function(b,c,d){if(!b)return;c=c.toLowerCase();switch(c){case "live":c="aria-live";break;case "activedescendant":c="aria-activedescendant";break;case "atomic":c="aria-atomic";break;default:break}b.setAttribute(c,d)};a.prototype.Qa=function(b,c){return b.getAttribute(c)};a.prototype.P=function(b,c){if(b&&b.removeAttribute)b.removeAttribute(c)};a.prototype.Pa=
function(b){var c=this.L(b),d=this.f(),e=d.baseURI,f=e.indexOf("#");if(f!=-1)e=e.substring(0,f);d.location=e+"#"+c};a.prototype.n=function(b,c){try{var d=c.ownerDocument.evaluate(b,c,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null)}catch(e){return[]}var f=[];for(var g=d.iterateNext();g;g=d.iterateNext())f.push(g);return f};var i={};i.b={T:"ac-row",C:"ac-row active",ma:"XoqCub",ia:"EGSDee",S:"P0GJpc",ua:"m14Grb",qa:"yyT6sf",va:"QhHSYc",l:"n1QcP",q:"rfza3e",k:"kyZrld",Y:"AG5mQe",F:"zyVlgb",G:"XZlFIc",X:"rziBod",Z:"HprMsc",U:"ilX2xb",V:"OvtWcf"};i.ha="Expand all";i.na="Messages loaded.";i.Ia="Unread. ";i.ta="Red. ";i.w="Selected. ";i.i="Starred. ";i.v="Not ";i.Ha="To undo, press Z.";i.pa="New chat message from ";i.oa="Press escape to ignore the message. Press any other key to open a chat window.";i.sa=", online.";i.ra=
", offline.";i.ka=", idle.";i.W="Chat buddies";i.ja="The following shortcut keys are available. L, go to the quick nav select box for jumping to labels. J, go to the next conversation. K, go to the previous conversation. O, open the current conversation. N, go to the next message in the current conversation. P, go to the previous message in the current conversation. X, select conversation. S, star a message/conversation. Y, remove conversation from current view. M, mute conversation. Exclamation mark, report spam. Number sign, move to trash. Z, undo. C, compose. R, reply. A, reply all. F, forward message. Slash, jump to the search field. Escape, leave the search field. Period, more actions menu. ";
i.a=null;i.c=null;i.A=null;i.t=null;i.r=null;i.j=false;i.p=null;i.h=false;i.m=false;i.Ra=function(b){i.a=new a(true);i.c=b;i.r=null;i.j=false;i.p=null;i.h=false;i.m=false;var c=window.content.document;c.addEventListener("keypress",i.Oa,true);c.addEventListener("DOMNodeInserted",i.Va,true);var d=c.getElementById("canvas_frame").contentDocument;i.a.Za(d.body);d.addEventListener("DOMAttrModified",i.Ma,true);d.addEventListener("DOMNodeInserted",i.Na,true);d.addEventListener("keypress",i.Ja,true);i.c.registerViewChangeCallback(i.ab);
i.Sa();window.setTimeout(function(){i.M()},100);i.a.d(i.na,null)};i.Oa=function(b){if(b.ctrlKey)return true;if(b.keyCode==27){i.a.e.blur();return false}if(i.a.u)return true;return true};i.Va=function(b){var c=b.target,d=c.className;if(c.tagName=="DIV"&&d.indexOf(i.b.ma)!=-1&&d.indexOf(i.b.ia)!=-1)window.setTimeout(function(){i.Ka(c)},0)};i.Ja=function(b){if(b.ctrlKey)return true;if(b.keyCode==27){i.a.e.blur();return false}if(i.a.e&&i.a.e==i.t)if(!i.m)if(b.keyCode==38||b.keyCode==40){i.m=true;window.setTimeout(i.La,
10);return true}if(i.a.u)return true;if(b.charCode==63){i.a.d(i.ja);return false}if(b.charCode==108)i.A.getElementsByTagName("SELECT")[0].focus();var c=i.c.getActiveViewType();if(c=="tl")if(!i.j)if(b.charCode==106||b.charCode==107){i.j=true;window.setTimeout(i.Fa,10);return true}if(c=="cv")if(!i.h)if(b.charCode==110||b.charCode==112){i.h=true;window.setTimeout(i.fa,10);return true}};i.Ma=function(b){var c=b.attrName,d=b.newValue,e=b.prevValue,f=b.target;if(c=="class"&&d.indexOf(i.b.S)!=-1){f.setAttribute("tabindex",
0);var g=f.textContent;window.setTimeout(function(){f.focus();i.a.d(g,f)},0);return}if(c=="class"&&e==i.b.T&&d==i.b.C){if(!i.t)i.M();i.N(f);return}if(i.c.getActiveViewType()=="tl")i.wa(b);else if(i.c.getActiveViewType()=="cv")i.$(b)};i.Na=function(b){if(i.c.getActiveViewType()=="tl")i.xa(b)};i.ab=function(){var b=i.c.getActiveViewType();if(b=="tl")return;else if(b=="cv"){i.H();var c=i.c.getActiveViewElement();i.a.Ya(c,"n",false,false,false)}};i.wa=function(b){var c=b.attrName,d=b.newValue,e=b.prevValue,
f=b.target,g="";if(c=="style"&&d=="visibility: visible;"){var h=f.parentNode.parentNode;i.K(h)}if(c=="class"&&e.indexOf(i.b.q)==-1&&d.indexOf(i.b.q)!=-1)i.a.d(i.w);if(c=="class"&&e.indexOf(i.b.q)!=-1&&d.indexOf(i.b.q)==-1){g=i.v+i.w;i.a.d(g)}if(c=="class"&&e.indexOf(i.b.l)==-1&&d.indexOf(i.b.l)!=-1)i.a.d(i.i);if(c=="class"&&e.indexOf(i.b.l)!=-1&&d.indexOf(i.b.l)==-1){g=i.v+i.i;i.a.d(g)}};i.xa=function(b){var c=b.target;if(c.parentNode.className==i.b.ua){var d=c.parentNode.firstChild.textContent,e=
i.a.f(),f=e.getElementById("link_undo");if(f){i.a.Wa(f);d=d+i.Ha}i.a.d(d)}};i.Ca=function(b){return b.className.indexOf(i.b.va)!=-1};i.Da=function(b){var c=b.getElementsByTagName("INPUT")[0];return c.checked};i.Ea=function(b){var c=b.childNodes[1];return c.className.indexOf(i.b.l)!=-1};i.za=function(b){return b.childNodes[2]};i.Ba=function(b){return b.childNodes[4].firstChild};i.Aa=function(b){return b.childNodes[4].lastChild};i.ya=function(b){return b.lastChild};i.K=function(b){if(!i.j)return;i.j=
false;var c="";c=i.Ca(b)?c+i.Ia:c+i.ta;if(i.Da(b))c=c+i.w;if(i.Ea(b))c=c+i.i;c=c+i.za(b).textContent+". "+i.Ba(b).textContent+". "+i.Aa(b).textContent+". "+i.ya(b).textContent+". ";i.a.d(c);i.r=b};i.Ga=function(){if(i.r)i.K(i.r)};i.Fa=function(){if(i.c.getActiveViewType()=="tl"&&i.j)i.Ga()};i.$=function(b){var c=b.attrName,d=b.newValue,e=b.prevValue,f=b.target;if(c=="class"&&d==i.b.Y){var g=f.nextSibling;if(g.tagName=="IMG")g=g.nextSibling;i.J(g)}if(c=="class"&&e.indexOf(i.b.k)==-1&&d.indexOf(i.b.k)!=
-1)i.a.d(i.i);if(c=="class"&&e.indexOf(i.b.k)!=-1&&d.indexOf(i.b.k)==-1){var h=i.v+i.i;i.a.d(h)}};i.ea=function(b){var c=i.da(b);return c.className.indexOf(i.b.k)!=-1};i.da=function(b){return b.getElementsByTagName("IMG")[0]};i.I=function(b){var c=b.getElementsByTagName("TD");for(var d=0,e;e=c[d];d++){var f=e.className;if(f.indexOf(i.b.F)!=-1&&f.indexOf(i.b.G)!=-1)return e}return null};i.ca=function(b){var c=i.I(b);if(!c||!c.nextSibling)return null;var d=c.nextSibling.className;if(d.indexOf(i.b.F)!=
-1&&d.indexOf(i.b.G)!=-1)return c.nextSibling;return null};i.ba=function(b){var c=b.getElementsByTagName("SPAN");for(var d=0,e;e=c[d];d++)if(e.className==i.b.X)return e;return null};i.aa=function(b){if(b.childNodes.length>3)return b.childNodes[3];return null};i.H=function(){var b=window.content.document.getElementById("canvas_frame"),c=b.contentDocument.getElementsByTagName("U");for(var d=0,e;e=c[d];d++)if(e.textContent==i.ha){i.a.z(e.parentNode,false);return}};i.J=function(b){if(!i.h)return;if(b.parentNode.className==
i.b.Z)i.h=false;else i.H();var c="";if(i.ea(b))c=c+i.i;var d=i.I(b),e=i.ca(b),f=i.ba(b),g=i.aa(b);if(d)c=c+d.textContent+". ";if(e)c=c+e.textContent+". ";if(f)c=c+f.textContent+". ";if(g)c=c+g.textContent+". ";i.a.d(c,b);i.p=b};i.ga=function(){if(i.p)i.J(i.p)};i.fa=function(){if(i.c.getActiveViewType()=="cv"&&i.h)i.ga()};i.Sa=function(){var b=i.c.addNavModule("Quick Nav"),c=i.O(),d=window.content.document.createElement("select");for(var e=0,f;f=c[e];e++){var g=window.content.document.createElement("option");
g.textContent=f.textContent;d.appendChild(g)}d.addEventListener("keypress",i.Xa,true);b.appendChild(d);i.A=b.bb()};i.O=function(){var b=i.c.getNavPaneElement(),c=".//DIV[contains(concat(' ', @class, ' '), '"+i.b.qa+"')]";return i.a.n(c,b)};i.Xa=function(b){if(b.keyCode==13)i.Ta()};i.Ta=function(){var b=i.O(),c=i.A.getElementsByTagName("SELECT")[0],d=c.selectedIndex;i.a.z(b[d].firstChild,false)};i.M=function(){var b=window.content.document.getElementById("canvas_frame"),c=b.contentDocument.body,d=
"//input[@label]";i.t=i.a.n(d,c)[0];i.t.title=i.W};i.N=function(b){i.m=false;var c="div/div[1]/div[1]",d=i.a.n(c,b)[0],e="",f=d.firstChild.className;e=f.indexOf(i.b.U)!=-1?i.sa:f.indexOf(i.b.V)!=-1?i.ra:i.ka;var g=i.a.n("div/div[1]/div[2]",b)[0];i.a.Q(g.textContent+e)};i.La=function(){if(i.m){var b=window.content.document.getElementById("canvas_frame"),c=b.contentDocument.body,d="//div[@class='"+i.b.C+"']",e=i.a.n(d,c)[0];i.N(e)}};i.Ka=function(b){var c=b.getElementsByTagName("textarea")[0];c.addEventListener("keypress",
function(f){if(f.keyCode==27)return true;var g=b.getElementsByTagName("img")[3];i.a.z(g,false);return false},true);c.focus();var d=b.getElementsByTagName("td")[1].textContent,e=i.pa+d+i.oa;i.a.Q(e)};i.Ua=function(){if(typeof gmonkey=="object")gmonkey.load("1.0",i.Ra)};window.addEventListener("load",i.Ua,true);
 })();

(function() { var h=true,i=null,j=false,l,n=function(a){this.hc=0;this.ga=i;this.Rb=j;this.D=i;this.ta=j;var b=this;this.Fa=document.body;this.Gc();if(a){this.Rb=h;document.addEventListener("keypress",function(c){b.Cd(c,b)},h);document.body.Dd=h}this.J(document.body,"role","application")};l=n.prototype;
l.Gc=function(){var a=this.z(),b=this,c=function(d){b.D=d.target;if(d.target.tagName=="INPUT"||d.target.tagName=="SELECT"||d.target.tagName=="TEXTAREA")b.ta=h;return h};a.addEventListener("focus",c,h);c=function(d){b.Ya(b.D,"aria-activedescendant");b.D=i;if(d.target.tagName=="INPUT"||d.target.tagName=="SELECT"||d.target.tagName=="TEXTAREA")b.ta=j;return h};a.addEventListener("blur",c,h)};l.z=function(){for(var a=this.Fa;a.nodeType!=9;)a=a.parentNode;return a};
l.Aa=function(a,b){a.id||this.lb(a);if(b){this.J(a,"live","rude");this.J(a,"atomic","true");var c=this.z();c=c.createElement("div");c.textContent=" ";c.name="AxsJAX_dummyNode";a.lastChild&&a.lastChild.name&&a.lastChild.name==c.name&&a.removeChild(a.lastChild);a.appendChild(c)}else{var d=this.Xc(a,"role");this.J(a,"role","row");c=this.D;if(!c||c.nodeType==9){this.Fa.tabIndex=-1;c=this.Fa}this.J(c,"activedescendant",i);c.focus&&c.focus();this.J(c,"activedescendant",a.id);var e=this;window.setTimeout(function(){d?
e.J(a,"role",d):e.Ya(a,"role")},0)}};l.Bd=function(a){var b=window.content.document,c=b.createElement("span");c.id="AxsJAX_audioNode";this.J(c,"role","alert");c.style.position="absolute";c.style.left="-1000em";var d=b.getElementById(c.id);d&&b.body.removeChild(d);c.textContent=a;b.body.appendChild(c)};
l.s=function(a,b){var c="AxsJAX_pixelAudioNode",d="AxsJAX_pixelAudioNode",e="data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",f=this.z(),g=i;if(b){if(b.previousSibling&&b.previousSibling.name==d)g=b.previousSibling;else{g=f.createElement("img");g.name=d;g.setAttribute("tabindex",0);g.style.outline="none";g.src=e;b.parentNode.insertBefore(g,b);this.Uc(g)}g.setAttribute("alt",a);g.setAttribute("title",a);window.setTimeout(function(){g.blur();g.focus()},0)}else{if((g=
f.getElementById(c))&&g.alt==a)a+=" ";if(!g){g=f.createElement("img");g.id=c;g.src=e;f.body.appendChild(g)}g.setAttribute("alt",a);g.setAttribute("title",a);this.Aa(g)}};
l.Oc=function(a,b){var c=this.z(),d=c.createEvent("MouseEvents");d.initMouseEvent("mousedown",h,h,c.defaultView,1,0,0,0,0,j,j,b,j,0,i);try{a.dispatchEvent(d)}catch(e){}d=c.createEvent("MouseEvents");d.initMouseEvent("mouseup",h,h,c.defaultView,1,0,0,0,0,j,j,b,j,0,i);try{a.dispatchEvent(d)}catch(f){}d=c.createEvent("MouseEvents");d.initMouseEvent("click",h,h,c.defaultView,1,0,0,0,0,j,j,b,j,0,i);try{a.dispatchEvent(d)}catch(g){}c=a.getAttribute("href");if(a.tagName=="A"&&c&&c!="#")if(b)window.open(a.href);
else document.location=a.href};l.lb=function(a,b){if(!a)return"";if(a.id)return a.id;var c=b||"AxsJAX_ID_";a.id=c+this.hc++;return a.id};l.va=function(a){if(!a)return j;if(a.tagName=="A"||a.tagName=="INPUT"){this.ga=a;return h}a=a.getElementsByTagName("*");for(var b=0,c;c=a[b];b++)if(c.tagName=="A"||c.tagName=="INPUT"||c.hasAttribute("tabindex")&&c.tabIndex!=-1){this.ga=c;return h}return j};l.Cd=function(a,b){if(!b.Rb)return h;if(a.keyCode==9&&b.ga){b.ga.focus();b.ga=i}return h};
l.$c=function(a){this.Aa(a);a.scrollIntoView(h);this.va(a)};l.J=function(a,b,c){if(a){b=b.toLowerCase();switch(b){case "live":b="aria-live";break;case "activedescendant":b="aria-activedescendant";break;case "atomic":b="aria-atomic";break;default:break}a.setAttribute(b,c)}};l.Xc=function(a,b){return a.getAttribute(b)};l.Ya=function(a,b){a&&a.removeAttribute&&a.removeAttribute(b)};
l.Uc=function(a){a=this.lb(a);var b=this.z(),c=b.baseURI,d=c.indexOf("#");if(d!=-1)c=c.substring(0,d);b.location=c+"#"+a};l.H=function(a,b){try{var c=b.ownerDocument.evaluate(a,b,i,XPathResult.ORDERED_NODE_ITERATOR_TYPE,i)}catch(d){return[]}for(var e=[],f=c.iterateNext();f;f=c.iterateNext())e.push(f);return e};n.Sd=function(a){window.addEventListener("load",function(){a()},h)};var o=function(a){this.ya=this.wa="";this.c=[];this.b=0;this.h=[];this.q=i;this.ha=[];this.K={};this.L={};this.M=[];this.I=[];this.e=a;this.G=this.A=this.F=i;this.jc="list";this.eb="item";this.kb="wrap";this.Q=i};o.a={nc:"next list",sc:"previous list",fc:"go forward",ec:"go backwards",Zb:"cycle next",$b:"cycle previous",yc:"Select available action",oc:"No available actions",ib:"Page up",hb:"Page down",T:"Enter",Hd:"Escape",Gd:"Delete",la:"Up",ia:"Down",fb:"Left",jb:"Right"};l=o.prototype;
l.yd=function(a,b){if(b){this.A=a;this.A.j===i&&this.Rc();var c=this,d=new Array(b);this.u(d,this.K,this.L,function(){c.Pb()})}};l.Ba=function(a){var b=h;if(a.type=="dynamic"&&a.l.length===0){this.F!==i&&this.F.view(i);a.l=this.ua(a.ca);a.p=this.Gb(a.ca);if(this.c[this.b]===a)this.h[this.b]=-1;else for(var c=0,d;d=this.c[c];c++)if(d===a){this.h[c]=-1;break}}if(a.l.length===0&&a.Ka===i)b=j;return b};
l.tb=function(){var a=this.N();a=a.Ka;var b=i;if(a!==i){this.ma(a);b=this.Ma(a.action)}if(b===i){this.Ic();this.G!==i&&this.G.play(this.jc)}};l.jd=function(){if(this.c.length<1)return i;for(var a=0;this.c[a];a++){this.b++;if(this.b>=this.c.length)this.b=0;if(this.Ba(this.c[this.b]))break}return this.N()};l.nd=function(){if(this.c.length<1)return i;for(var a=0;this.c[a];a++){this.b--;if(this.b<0)this.b=this.c.length-1;if(this.Ba(this.c[this.b]))break}return this.N()};l.N=function(){return this.c[this.b]};
l.Ic=function(){this.e.s(this.N().title)};l.Ta=function(){if(this.c.length<1)return i;var a=this.c[this.b],b=a.l;if(b.length<1)return i;if(this.q){var c=this.Oa(a);c=this.q.f.S[c];if(typeof c!="undefined")this.h[this.b]=c}this.h[this.b]++;c=j;if(this.h[this.b]>=b.length){this.h[this.b]=0;c=h}var d=this.h[this.b];if(b[d].f.parentNode===i){this.F!==i&&this.F.view(i);a.l=this.ua(a.ca);this.h[this.b]=0;d=this.h[this.b]}this.q=b[d];if(this.G!==i)c?this.G.play(this.kb):this.G.play(this.eb);return this.q};
l.Wc=function(){var a=this.c[this.b],b=this.h[this.b];if(a.cb!==i&&b+1>=a.l.length){this.ma(a.cb);this.h[this.b]=0;return i}return a=this.Ta()};
l.Lb=function(){if(this.c.length<1)return i;var a=this.c[this.b],b=a.l;if(b.length<1)return i;if(this.q){var c=this.Oa(a);c=this.q.f.S[c];if(typeof c!="undefined")this.h[this.b]=c}this.h[this.b]--;c=j;if(this.h[this.b]<0){this.h[this.b]=b.length-1;c=h}var d=this.h[this.b];if(b[d].f.parentNode===i){this.F!==i&&this.F.view(i);a.l=this.ua(a.ca);this.h[this.b]=a.l.length;d=this.h[this.b]}this.q=b[d];if(this.G!==i)c?this.G.play(this.kb):this.G.play(this.eb);return this.q};
l.Lc=function(){var a=this.c[this.b],b=this.h[this.b];if(a.Qa!==i&&b<=0){this.ma(a.Qa);this.h[this.b]=a.l.length-1;return i}return a=this.Lb()};l.sb=function(){if(this.c.length<1)return i;var a=this.c[this.b];if(this.q){var b=this.Oa(a);b=this.q.f.S[b];if(typeof b!="undefined")this.h[this.b]=b}a=a.l;b=this.h[this.b];return this.q=a[b]};l.Ma=function(a){var b=i;if(a!==i&&a.indexOf&&a.indexOf("CALL:")===0&&a.indexOf("(")===-1)try{b=eval(a.substring(5))}catch(c){}return b};
l.U=function(a){if(a!==i){var b=this,c=function(){var f=b.Ma(a.action);if(f)f(a);else{b.F!==i&&b.F.view(a.f);b.e.$c(a.f)}};if(this.e.D&&this.e.D.blur){var d=this.e.D;this.e.D=i;d.removeAttribute&&this.e.Ya(d,"aria-activedescendant");var e=function(f){f.target.removeEventListener("blur",e,h);c()};d.addEventListener("blur",e,h);d.blur()}else c()}else{d=this.c[this.b];d.type=="dynamic"&&this.e.s(d.onEmpty)}};
l.u=function(a,b,c,d){for(var e=0,f;f=a[e];e++)if(f=="LEFT")c[37]=d;else if(f=="UP")c[38]=d;else if(f=="RIGHT")c[39]=d;else if(f=="DOWN")c[40]=d;else if(f=="PGUP")c[33]=d;else if(f=="PGDOWN")c[34]=d;else if(f=="ENTER")c[13]=d;else if(f=="ESC")c[27]=d;else if(f=="DEL")c[46]=d;else b[f.charCodeAt(0)]=d};
l.oa=function(a,b,c){var d=[];if(a!==""){d=a.split(" ");var e=this;if(c=="prev")this.u(d,this.M[b],this.I[b],function(){e.U(e.Lb())});else if(c=="next")this.u(d,this.M[b],this.I[b],function(){e.U(e.Ta())});else c=="back"?this.u(d,this.M[b],this.I[b],function(){var f=e.Lc();f!==i&&e.U(f)}):this.u(d,this.M[b],this.I[b],function(){var f=e.Wc();f!=i&&e.U(f)})}};l.Kc=function(a,b,c){var d=[];if(a!==""){d=a.split(" ");var e=this;this.u(d,this.K,this.L,function(){if(e.Ba(e.c[b])){e.b=b;e.U(e.Ta())}else e.e.s(c)})}};
l.Jc=function(a,b){var c=[];if(a!==""){c=a.split(" ");var d=this;this.u(c,this.K,this.L,function(){d.e.s(b)})}};l.mb=function(a,b,c){var d=[];if(a.hotkey!==""){d=a.hotkey.split(" ");var e=this;this.u(d,b,c,function(){e.ma(a)})}};l.ma=function(a){a.action=="click"?this.Pc(a):this.Mc(a)};l.Mc=function(a){var b=this.vb(a);if(b.length<1)this.e.s(a.onEmpty);else{var c=this.Ma(a.action);if(c){var d={};d.action=a.action;d.f=b[0];c(d);this.e.va(b[0])}else throw new Error("Invalid action: "+a.action);}};
l.Pc=function(a){var b=this.vb(a);if(b.length<1)this.e.s(a.onEmpty);else{this.e.Oc(b[0],j);b[0].scrollIntoView(h);this.e.va(b[0])}};l.vb=function(a){a=a.t;var b=this.e.z().documentElement;if(a.indexOf(".")===0)b=this.sb().f;return this.e.H(a,b)};l.wb=function(a,b){var c=i,d=this.b;if(d<this.I.length)c=this.I[d][a]||this.M[d][b]||i;if(c===i)c=this.L[a]||this.K[b];return c};
l.hd=function(a,b){var c={};c.Eb=[];var d=new DOMParser,e=d.parseFromString(a,"text/xml"),f=e.getElementsByTagName("list"),g;for(d=0;g=f[d];d++){var k={};k.title=g.getAttribute("title");k.hotkey=g.getAttribute("hotkey");k.next=g.getAttribute("next");k.Wa=g.getAttribute("prev");k.Vc=g.getAttribute("fwd");k.back=g.getAttribute("back");k.onEmpty=g.getAttribute("onEmpty");k.type=g.getAttribute("type");var p,m,r,q;k.l=[];var s=g.getElementsByTagName("item");for(p=0;m=s[p];p++){var u={};u.t=m.textContent;
if(m.attributes instanceof NamedNodeMap){r=m.attributes;q=r.length;for(m=0;m<q;m++){var t=r.item(m);u[t.nodeName]=t.value}}k.l.push(u)}k.p=[];s=g.getElementsByTagName("target");for(p=0;m=s[p];p++){g={};g.t=m.textContent;if(m.attributes instanceof NamedNodeMap){r=m.attributes;q=r.length;for(m=0;m<q;m++){t=r.item(m);g[t.nodeName]=t.value}}k.p.push(g)}c.Eb.push(k)}c.p=[];var v=e.firstChild;for(d=0;e=v.childNodes[d];d++)if(e.tagName=="target"){g={};g.t=e.textContent;if(e.attributes instanceof NamedNodeMap){r=
e.attributes;q=r.length;for(m=0;m<q;m++){t=r.item(m);g[t.nodeName]=t.value}}c.p.push(g)}c.next=v.getAttribute("next");c.Wa=v.getAttribute("prev");if(b===i||typeof b=="undefined")this.Hb(c,b);else{d=new (function(C,z,A,B){b(v,z,A,B)});this.Hb(c,d)}};
l.Zc=function(){for(var a=this.Na(),b="",c=0,d;d=a[c];c++)b=b+d.$+", "+d.title+". ";b=b+this.wa+", "+o.a.nc;b=b+this.ya+", "+o.a.sc;b=b.replace("PGUP",o.a.ib);b=b.replace("PGDOWN",o.a.hb);b=b.replace("ENTER",o.a.T);b=b.replace("DEL",o.a.ac);b=b.replace("UP",o.a.la);b=b.replace("DOWN",o.a.ia);b=b.replace("LEFT",o.a.fb);return b=b.replace("RIGHT",o.a.jb)};
l.ed=function(){for(var a=this.Pa(),b="",c=0,d;d=a[c];c++)b=b+d.$+", "+d.title+". ";a=this.N();if(a.Ua!=="")b=b+a.Ua+", "+o.a.Zb+". ";if(a.Xa!=="")b=b+a.Xa+", "+o.a.$b+". ";if(a.La!=="")b=b+a.La+", "+o.a.fc+". ";if(a.Ga!=="")b=b+a.Ga+", "+o.a.ec+". ";b=b.replace("PGUP",o.a.ib);b=b.replace("PGDOWN",o.a.hb);b=b.replace("ENTER",o.a.T);b=b.replace("DEL",o.a.ac);b=b.replace("UP",o.a.la);b=b.replace("DOWN",o.a.ia);b=b.replace("LEFT",o.a.fb);return b=b.replace("RIGHT",o.a.jb)};l.xd=function(a){this.F=a};
l.zd=function(a){this.G=a};l.pd=function(a){if(a===i)return j;var b=j;a=this.Tc(a);if(a>-1){b=this.c[a];b.l=[];b.p=[];b=this.Ba(b)}return b};l.Pb=function(){if(this.A!==i){var a=this.Na(),b=this.Pa();if(a.length+b.length===0)this.e.s(o.a.oc);else{var c=[],d=0,e="";for(d=0;e=b[d];d++)c.push(e.title);for(d=0;e=a[d];d++)c.push(e.title);this.A.vd(c);this.A.Sb("visible",h,40,20)}}};
l.Na=function(){for(var a=[],b,c=0,d;d=this.c[c];c++)if(d.Y!==""){b={};b.title=d.title;b.$=d.Y;a.push(b)}for(c=0;d=this.ha[c];c++)if(this.Cb(d)){b={};b.title=d.title;b.$=d.hotkey;a.push(b)}return a};l.Pa=function(){for(var a=[],b=this.N(),c=0,d;d=b.p[c];c++)if(this.Cb(d)){var e={};e.title=d.title;e.$=d.hotkey;a.push(e)}return a};
l.Rc=function(){var a=this.e.z().body,b=this,c=function(d,e){var f=b.Pa(),g=b.Na();f=f.concat(g);f=f[e].$;f=f.split(" ")[0];var k=g=-1;if(f=="LEFT")g=37;else if(f=="UP")g=38;else if(f=="RIGHT")g=39;else if(f=="DOWN")g=40;else if(f=="PGUP")g=33;else if(f=="PGDOWN")g=34;else if(f=="ENTER")g=13;else if(f=="DEL")g=46;else if(f=="ESC")g=27;else k=f.charCodeAt(0);b.A.j.blur();(f=b.wb(g,k))&&f()};this.A.Qc(a,50,c,i,this.Nd,j);this.A.wd(o.a.yc);this.A.td(h);this.A.Za()};
l.Cb=function(a){var b=j;if(a.hotkey!==""){a=a.t;var c=this.e.z().body;if(a.indexOf(".")===0){var d=this.sb();if(d)c=d.f}a=this.e.H(a,c);if(a.length>0)b=h}return b};
l.Hb=function(a,b){this.c=[];this.b=0;this.h=[];var c=[],d,e;for(d=0;e=a.Eb[d];d++){var f={};e.Sa=d;f.Pd=i;f.ca=e;f.title=e.title||"";f.Y=e.hotkey||"";f.Ua=e.next||"";f.Xa=e.Wa||"";f.La=e.Vc||"";f.Ga=e.back||"";f.onEmpty=e.onEmpty||"";f.type=e.type||"";f.cb=i;f.Qa=i;f.Ka=i;f.l=this.ua(e);f.p=this.Gb(e);e=0;for(var g;g=f.p[e];e++)if(g.trigger=="listTail")f.cb=g;else if(g.trigger=="listHead")f.Qa=g;else if(g.trigger=="listEntry")f.Ka=g;if(f.l.length>0||f.type=="dynamic"){this.c.push(f);this.h.push(-1)}else f.Y!==
""&&c.push(f)}this.ha=[];this.Wd=0;if(a.p)for(d=0;f=a.p[d];d++){e={};e.t=f.t;e.t=e.t.replace(/^\s\s*/,"").replace(/\s\s*$/,"");e.title=f.title||"";e.trigger=f.trigger||"key";e.hotkey=f.hotkey||"";e.action=f.action||"click";e.onEmpty=f.onEmpty||"";this.ha.push(e)}this.Q!==i&&document.removeEventListener("keypress",this.Q,h);b===i||typeof b=="undefined"?this.Ad(a,c):b(a,this.c,c,this.ha)};
l.ua=function(a){var b=[];if(!a.l)return b;for(var c=0,d;d=a.l[c];c++)try{var e=d.t.replace(/^\s\s*/,"").replace(/\s\s*$/,""),f=this.e.z().documentElement,g=this.e.H(e,f),k=d.index||"0",p=parseInt(k,10),m=g.length-p,r=d.Qd||"*";if(r!="*")m=parseInt(r,10);for(var q=m+p,s=d.action||i;p<q;){d={};d.action=s;d.f=g[p];if(typeof d.f!="undefined"){if(typeof d.f.S=="undefined")d.f.S={};if(typeof a.Sa=="undefined")throw new Error("list does not have an id");d.f.S[a.Sa]=b.length;b.push(d)}p++}}catch(u){}return b};
l.Gb=function(a){var b=[];if(!a.p)return b;for(var c=0,d;d=a.p[c];c++){var e={};e.t=d.t.replace(/^\s\s*/,"").replace(/\s\s*$/,"");e.title=d.title||"";e.trigger=d.trigger||"key";e.hotkey=d.hotkey||"";e.action=d.action||"click";e.onEmpty=d.onEmpty||"";b.push(e)}return b};
l.Ad=function(a,b){var c=this,d;this.K={};this.L={};this.M=[];this.I=[];var e;for(d=0;e=this.ha[d];d++)this.mb(e,this.K,this.L);d=[];this.wa=a.next||"";if(this.wa!=="")d=this.wa.split(" ");this.u(d,this.K,this.L,function(){c.jd();c.tb()});d=[];this.ya=a.Wa||"";if(this.ya!=="")d=this.ya.split(" ");this.u(d,this.K,this.L,function(){c.nd();c.tb()});var f;for(d=0;f=this.c[d];d++){var g={},k={};this.M.push(g);this.I.push(k);this.oa(f.Ua,d,"next");this.oa(f.Xa,d,"prev");this.oa(f.La,d,"fwd");this.oa(f.Ga,
d,"back");this.Kc(f.Y,d,f.onEmpty);var p;for(p=0;e=f.p[p];p++)this.mb(e,g,k)}for(d=0;e=b[d];d++)this.Jc(e.Y,e.onEmpty);this.Q=function(m){if(m.ctrlKey)return h;if(c.e.ta)return h;if(m=c.wb(m.keyCode,m.charCode))return m()};document.addEventListener("keypress",this.Q,h)};l.Oa=function(a){return a.ca.Sa};l.Tc=function(a){for(var b=0;b<this.c.length;b++){var c=this.c[b];if(c.title==a)break}return b<this.c.length?b:-1};var w=function(a){this.k=a;this.ba=1.5;this.padding=-1;this.rd=0;this.na=a.z();this.d=this.na.createElement("span");this.d.style.backgroundColor="#CCE6FF";this.d.style.borderColor="#0000CC";this.d.style.borderWidth="medium";this.d.style.borderStyle="groove";this.d.style.position="absolute";this.d.style.display="none";this.na.body.appendChild(this.d);this.ob=function(){}};w.zc={Kd:0,cc:1};l=w.prototype;
l.view=function(a){for(;this.d.firstChild;)this.d.removeChild(this.d.firstChild);if(a===i)this.d.style.display="none";else{var b=0,c=0,d=a;if(d.offsetParent){b=d.offsetLeft;c=d.offsetTop;for(d=d.offsetParent;d!==i;){b+=d.offsetLeft;c+=d.offsetTop;d=d.offsetParent}}this.d.appendChild(a.cloneNode(h));this.d.style.top=c+"px";this.d.style.left=b+"px";this.d.style.zIndex=999;this.d.style.display="block";this.Fb()}};l.$a=function(a){this.ba=a;this.Fb()};
l.Fb=function(){this.na.body.removeChild(this.d);this.fd();this.Sc();this.Hc();this.na.body.appendChild(this.d);this.ob&&this.ob(this.d);if(this.rd==w.zc.cc){var a=this;window.setTimeout(function(){a.d.scrollIntoView(h)},0)}};l.Hc=function(){if(!(this.padding<0)){var a="//*[not(.//*)]";a=this.k.H(a,this.d);for(var b=0,c;c=a[b];b++)c.style.padding=this.padding+"px"}};
l.Sc=function(){for(var a=this.d.getElementsByTagName("img"),b=0,c;c=a[b];b++){if(!c.hasAttribute("Axs_OrigHeight")){c.setAttribute("Axs_OrigHeight",c.height);c.setAttribute("Axs_OrigWidth",c.width)}c.height=c.getAttribute("Axs_OrigHeight")*this.ba;c.width=c.getAttribute("Axs_OrigWidth")*this.ba}};
l.fd=function(){var a="fontSizeAdjust"in this.d.style;if(a){var b=this.ba*0.52;this.d.style.fontSizeAdjust=b}else{b=this.ba*100+"%";this.d.style.setProperty("font-size",b,"important")}b=this.d.getElementsByTagName("*");for(var c=0,d;d=b[c];c++){d.style.setProperty("line-height","normal","important");a||d.style.setProperty("font-size","100%","important")}};var x=function(a){var b="http://google-axsjax.googlecode.com/svn/trunk/";this.Rd=b+"common/earcons/axsEarcons.swf?sound=";this.ra=i;this.Ja=a;this.Qb=b+"thirdparty/soundmanager2/";this.o=i;this.Z=j;this.Tb="minimal";this.pa=j;this.Ra=0};l=x.prototype;
l.Bb=function(){if(!this.Ja)if(!this.Z)if(!this.pa){this.pa=h;this.Ra=0;if(this.o!==i){this.o.parentNode.removeChild(this.o);this.o=i}this.o=document.createElement("iframe");var a=document.location.toString();if(a.indexOf("#")!=-1)a=a.substring(0,a.indexOf("#"));this.o.src=this.Qb+"AxsJAX_SM2_Linker.html#Verbosity="+this.Tb+",Parent="+a;this.o.width="0%";this.o.height="0%";this.o.style.top="-1000";this.o.style.left="-1000";this.o.style.position="absolute";document.getElementsByTagName("body")[0].appendChild(this.o);
this.pb()}};l.pb=function(){if(document.location.hash=="#InitSuccess"){this.Z=h;this.pa=j}else if(this.Tb=="none"&&this.Ra>0){this.Z=h;this.pa=j}else{var a=this;window.setTimeout(function(){a.pb()},100);this.Ra++}};l.play=function(){};l.stop=function(){if(this.ra){this.ra.parentNode.removeChild(this.ra);this.ra=i}if(!this.Ja)if(this.Z)this.o.src=this.Qb+"AxsJAX_SM2_Linker.html#AxsSoundCmd=Stop()"};
l.getTime=function(){if(this.Ja)return-1;if(!this.Z)return-1;var a="Time=",b=unescape(document.location.hash);if(b.indexOf(a)==-1)return-1;a=b.indexOf(a)+a.length;return b=parseInt(b.substring(a),10)};var y=function(a,b){this.X=a;this.qb=this.n=this.w=this.j=this.r=i;this.qa="Enter Completion";this.ld="No completions found";this.W=i;this.B=[];this.gd={};this.i=-1;this.ab=this.Ab=j;this.Ha="#000000";this.Ia=0;this.dd={};this.sa={};this.Od={};if(b&&y.O)this.W=b;var c=this;this.V(window,y.Ca.vc,function(d){c.md.call(c,d)},i)};y.Wb=/^\<[A-Z|a-z|0-9|\-|\_]+\>$/;y.ic=/^(\s|\r|\n)+/;y.wc=/(\s|\r|\n)+$/;l=y.prototype;
l.V=function(a,b,c,d){if(y.O&&c)a.addEventListener(b,c,h);else y.m&&c&&a.attachEvent(b,function(g){c(g)});if(d){var e=new y.db(d),f=this;this.V(a,b,function(g){e.cd(g,e,f)},i)}};
l.Qc=function(a,b,c,d,e,f){var g=this,k,p,m,r,q;this.r&&this.r.parentNode.removeChild(this.r);do{k="completionField_"+Math.floor(Math.random()*1001);p="txt_"+k;r="div_"+k;q="bgdiv_"+k;m=document.getElementById(k)}while(m);m=document.createElement("div");m.id=q;m.style.display="none";q=document.createElement("div");q.id=k;q.style.position="absolute";k=document.createElement("input");k.type="text";k.id=p;k.size=b;k.value="";k.setAttribute("aria-owns",r);if(y.O)k.onkeypress=function(s){s.stopPropagation();
if(s.keyCode==y.C.Da)return j};if(k.readOnly=f)k.style.fontSize=0;b=document.createElement("div");b.id=r;b.setAttribute("tabindex",0);b.setAttribute("role","row");q.appendChild(b);q.appendChild(k);a.appendChild(m);a.appendChild(q);this.r=q;this.j=k;this.w=m;this.qb=b;this.r.className="pkHiddenStatus";this.j.className="pkOpaqueCompletionText";this.w.className="pkBackgroundHide";if(e){this.B=e;this.gd[this.X]=[e,this.qa];this.g=this.B;for(a=0;e=this.B[a];a++)this.sa[e.toLowerCase()]=a;this.i=-1}this.V(this.j,
y.Ca.ka,function(s){g.bd.call(g,s,d,c)},i);this.V(this.j,y.Ca.ja,function(s){g.ad.call(g,s)},i);this.V(this.j,"blur",function(){g.Ab&&g.Sb("hidden")},i)};l.td=function(a){this.Ab=a};l.wd=function(a){this.qa=a};l.vd=function(a){this.g=this.B=a;this.sa={};a=0;for(var b;b=this.B[a];a++)this.sa[b.toLowerCase()]=a;this.i=-1};
l.Sb=function(a,b,c,d){if(a=="visible"){this.r.className=="pkHiddenStatus"&&this.R(this.qa);this.bb(this.ab,this.Ha,this.Ia);this.r.className="pkVisibleStatus";var e=this.j;window.setTimeout(function(){e.focus()},0)}else if(a=="hidden"){if(y.m&&this.n)this.n.innerText="";else if(this.n)if(y.m)this.n.innerText="";else this.n.textContent="";this.bb(j,this.Ha,this.Ia);this.r.className="pkHiddenStatus";this.j.value="";this.i=-1}if(b){a=y.yb();c||(c=a.height-this.r.offsetHeight);d||(d=0);this.r.style.top=
c;this.r.style.left=d}};l.md=function(){var a=this;window.setTimeout(function(){a.ab&&a.w.style.display=="block"&&a.bb(a.ab,a.Ha,a.Ia)},0)};
l.bd=function(a,b,c){if(this.j.value.length===0)this.g=this.B;if(a.keyCode!=y.C.ka&&a.keyCode!=y.C.ja&&a.keyCode!=y.C.T&&a.keyCode!=y.C.Da)if(this.j.value.length){this.g=this.zb(this.B,this.j.value,50);this.i=-1;if(this.g.length>0){this.R(this.g[0]);this.i=0}else this.R(this.ld)}else this.R(this.qa);if(a.keyCode==y.C.T)if(!this.j.readOnly){if(this.g&&this.g.length>0&&this.i>=0&&this.j.value!=this.g[this.i]&&(this.g[this.i].indexOf("<")<0||this.g[this.i].indexOf("<")>=0&&this.g[this.i].split(" ").length>
this.j.value.split(" ").length))this.Ob();var d=this.j.value;a=(y.m?this.n.innerText:this.n.textContent).toLowerCase();var e=a.indexOf("<"),f;if(e>=0){f=d.substr(0,e-1).toLowerCase();d=f+" "+d.substr(e)}else f=d=d.toLowerCase();e=j;if(b)e=this.Fc.call(this,d,a,b);if(c&&!e){b=this.ub(d,a);c(f,this.sa[a],this.dd[a],b)}this.j.value=""}};
l.ad=function(a){if(a.keyCode==y.C.ka&&this.g&&this.g.length>0)this.od();else if(a.keyCode==y.C.ja&&this.g&&this.g.length>0)this.kd();else a.keyCode==y.C.Da&&this.g&&this.g.length>0&&this.Ob()};l.bb=function(a,b,c){if(a){this.w.className="pkBackgroundShow";this.w.style.display="block";a=y.yb();this.w.style.width=a.width+"px";this.w.style.height=a.height+"px";if(b)this.w.style.backgroundColor=b;c&&this.w.style.setProperty("-moz-opacity",c/100,"")}else this.w.style.display="none"};
l.zb=function(a,b,c){for(var d=a,e=a,f=b.split(" "),g=0,k;k=f[g];g++){e=d;d=[];if(k!==""){k=y.qd(k);var p=new RegExp("(^|\\W+)"+k,"i");k=0;for(var m;m=e[k];k++)String(m).match(p)&&d.push(m)}}e=a;for(k=0;m=e[k];k++){a=m.split(" ");f=[];for(g=0;p=a[g];g++){if(p.charAt(0)=="<")break;f.push(p)}g=f.join(" ");b.indexOf(g)===0&&d.push(m)}d.length>c&&d.slice(0,c-1);return d};
l.ub=function(a,b){a=a.replace(/\s+/g," ");b=b.replace(/\s+/g," ");var c=b.indexOf("<");if(c<0)return[];b=b.substr(c);a=a.substr(c);c=a.split(",");var d=b.split(",");if(c.length!=d.length)return[];for(var e=[],f=0,g,k;(g=c[f])&&(k=d[f]);f++){g=y.Db(y.Mb(g));k=y.Db(y.Mb(k));k.match(y.Wb)&&e.push(g)}return e};l.Fc=function(a,b,c){this.ub(a,b);if((a=c[b])&&a[this.X]){a=a[this.X]+"(args);";window.setTimeout(a,0);return h}else return j};
l.od=function(){if(this.i<0)this.i=0;this.i=(this.i||this.g.length)-1;this.i>=0&&this.R(this.g[this.i])};l.kd=function(){this.i=(this.i+1)%this.g.length;this.i<this.g.length&&this.R(this.g[this.i])};l.Ob=function(){this.j.value=this.g[this.i>=0?this.i:0];this.g=this.zb(this.B,this.j.value,50);this.W&&y.O&&this.W.s(this.j.value);this.i=0};
l.R=function(a){if(!this.n){this.n=document.createElement("div");this.n.id="listElem_"+Math.floor(Math.random()*1001);this.qb.appendChild(this.n)}if(y.m)this.n.innerText=a;else this.n.textContent=a;this.W&&y.O&&this.W.Aa(this.n,j)};l.Za=function(){y.Za()};y.db=function(a){this.Ea=a};
y.db.prototype.cd=function(a,b,c){if(b.Ea)if(a.keyCode){var d=""+a.keyCode,e=String.fromCharCode(a.keyCode).toLowerCase();if(a.ctrlKey){d="Ctrl+"+d;e="Ctrl+"+e}if(a.altKey){d="Alt+"+d;e="Alt+"+e}if(a.shiftKey){d="Shift+"+d;e="Shift+"+e}a=i;(a=b.Ea[e])||(a=b.Ea[d]);if(a)(b=a[c.X]?a[c.X]:a["*"])&&b()}};y.Ec=function(a,b){this.width=a?a:undefined;this.height=b?b:undefined};y.Db=function(a){return a.replace(y.ic,"")};y.Mb=function(a){return a.replace(y.wc,"")};
y.qd=function(a){return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")};
y.yb=function(){var a=0,b=0;if(typeof window.innerWidth=="number"){a=window.innerWidth;b=window.innerHeight}else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){a=document.documentElement.clientWidth;b=document.documentElement.clientHeight}else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){a=document.body.clientWidth;b=document.body.clientHeight}return new y.Ec(a,b)};y.m=j;y.O=j;
y.ud=function(){var a=navigator.userAgent.toLowerCase();y.O=a.indexOf("gecko")!=-1;y.m=a.indexOf("msie")!=-1&&a.indexOf("opera")==-1};y.ud();y.Ca={ka:y.m?"onkeyup":"keyup",ja:y.m?"onkeydown":"keydown",Jd:y.m?"onkeypress":"keypress",Fd:y.m?"onclick":"click",vc:y.m?"onresize":"resize",Id:y.m?"onfocus":"focus",Ed:y.m?"onblur":"blur"};y.rb=".pkHiddenStatus {display: none; position: absolute;}.pkVisibleStatus {display: block; position: absolute; left: 2px; top: 2px; line-height: 1.2em; z-index: 10001; background-color: #000000; padding: 2px; color: #fff; font-family: Arial, Sans-serif; font-size: 20px; filter: alpha(opacity=80); -moz-opacity: .80;}.pkOpaqueCompletionText {border-style: none; background-color:transparent; font-family: Arial, Helvetica, sans-serif; font-size: 35px; font-weight: bold; color: #fff; width: 1000px; height: 50px;}.pkBackgroundShow {position: absolute; width: 0px;height: 0px; background-color: #000000; filter: alpha(opacity=70);  -moz-opacity: .70; left: 0px; top: 0px; z-index: 10000;}";
y.Za=function(){var a,b;if(a=document.getElementsByTagName("head")[0]){b=document.createElement("style");b.type="text/css";if(y.m)b.Td=y.rb;else if(y.O)b.innerHTML=y.rb;a.appendChild(b)}};y.Md=function(a){var b=document.getElementsByTagName("head")[0],c=document.createElement("link");c.type="text/css";c.rel="stylesheet";c.href=a;b.appendChild(c)};y.C={ka:38,ja:40,T:13,Da:9};var axsFinance={};
axsFinance.a={gc:"The following shortcut keys are available. ",la:"up by",ia:"down by",qc:"percent",kc:"million",Ub:"billion",Bc:"trillion",Yb:"Consumer",Dc:"+",mc:"-",rc:"%",lc:"M",Vb:"B",Cc:"T",xc:"{0} percent of this sector is down. {1} percent of all the companies are down by more than {2} percent. {3} percent of this sector is up. {4} percent  of all the companies are up by more than {5} percent.",Ld:"Company {0}, change {1}, market capitalization {2}.",gb:"Company {0} {1} market capitalization {2}.",tc:"{0}, {1}, {2}, or {3}.",
pc:"{0}, {1}, {2}, or {3} market capitalization {4}.",uc:"{0}, {1}, or {2}.",Ac:"{0}, {1}, change {2}, market capitalization {3}.",dc:"Google Finance home."};axsFinance.Jb={};axsFinance.Va={};axsFinance.Va[axsFinance.a.mc]=axsFinance.a.ia;axsFinance.Va[axsFinance.a.Dc]=axsFinance.a.la;axsFinance.fa={};axsFinance.fa[axsFinance.a.Vb]=axsFinance.a.Ub;axsFinance.fa[axsFinance.a.lc]=axsFinance.a.kc;axsFinance.fa[axsFinance.a.Cc]=axsFinance.a.Bc;axsFinance.fa[axsFinance.a.rc]=axsFinance.a.qc;
axsFinance.Xb='<cnr next="RIGHT l" prev="LEFT h"><target title="Go to link" hotkey="ENTER" onEmpty="No link available">./descendant-or-self::a</target><target title="News" hotkey="e">(//li[@class="nav-item"])[1]//a</target><target title="Portfolios" hotkey="o">(//li[@class="nav-item"])[2]//a</target><target title="Stock screener" hotkey="s">(//li[@class="nav-item"])[3]//a</target><target title="Google domestic trends" hotkey="g">(//li[@class="nav-item"])[4]//a</target><list title="Recent quotes" next="DOWN j" prev="UP k" fwd="n" back="p" type="dynamic"><item action="CALL:axsFinance.readRecentQuoteTemplate">id("rq")//tr</item><target title="Create portfolio from quotes"  hotkey="c" onEmpty="No recent quotes.">id("rq-create")</target></list><list title="Recent activity" next="DOWN j" prev="UP k" fwd="n" back="p" type="dynamic"><item>//li[@class="ra-entry"]//a</item></list><list title="Market summary" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readTopStory">//div[@class="news major"]</item><item>//div[@class="news major"]//div[@class="rel-article" and .//a and not(.//a[contains(@class,"rel")])]</item><target title="Related articles"  hotkey="r" onEmpty="No related articles available.">//div[@class="news major"]//a[@class="more-rel"]</target></list><list title="Market summary indices" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readIndexCurrencyBondTemplate">//tr[@class="indices"]</item></list><list title="Market top stories" next="DOWN j" prev="UP k" fwd="n" back="p" ><item>id("market-news")//li</item><target title = "Market top stories" trigger="listEntry">(id("news-tabs")/div)[2]</target><target title="Related articles"  hotkey="r" onEmpty="No related articles available.">.//a[@class="more-rel"]</target><target title="More market news"  hotkey="a">id("market-news")//div[@class="section-link"]/a</target></list><list title="Portfolio related top stories" next="DOWN j" prev="UP k" fwd="n" back="p"><item>id("portfolio-news")//li</item><target title = "Portfolio related top stories" trigger="listEntry">(id("news-tabs")/div)[3]</target><target title="Related articles"  hotkey="r" onEmpty="No related articles available.">.//a[@class="more-rel"]</target><target title="More market news"  hotkey="a">id("market-news")//div[@class="section-link"]/a</target></list><list title="Portfolios" next="DOWN j" prev="UP k" onEmpty="No portfolios" fwd="n" back="p"><item action="CALL:axsFinance.readPortfolioTemplate">id("portfolios")//table[contains(@id,"portfolio")]//tr</item></list><list title="World markets" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readIndexCurrencyBondTemplate">id("markets")//table[@class="quotes"]//tr[count(./*) > 0]</item></list><list title="Currencies" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readIndexCurrencyBondTemplate">id("currencies")//table[@class="quotes"]//tr</item></list><list title="Bonds" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readIndexCurrencyBondTemplate">id("bonds")//table[@class="quotes"]//tr[count(./*) > 0]</item></list><list title="Sector summary" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readTableRowSectorSummaryDesc">id("secperf")/table/tbody/tr[not(@class="colHeader")]</item></list><list title="Popular trends" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">id("tm_zeitgeist")//td[@class="symbol"]/..</item><target title = "Popular trends" trigger="listEntry">id("l_tm_zeitgeist")</target></list><list title="Price trends gainers" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">id("tm_price_0")//td[@class="change chg"]/..</item><target title = "Price trends gainers" trigger="listEntry">id("l_tm_price")</target></list><list title="Price trends losers" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">id("tm_price_0")//td[@class="change chr"]/..</item><target title = "Price trends losers" trigger="listEntry">id("l_tm_price")</target></list><list title="Market capitalization trends gainers" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">id("tm_mcap_0")//td[@class="change chg"]/..</item><target title = "Market capitalization trends gainers" trigger="listEntry">id("l_tm_mcap")</target></list><list title="Market capitalization trends losers" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">id("tm_mcap_0")//td[@class="change chr"]/..</item><target title = "Market capitalization trends losers" trigger="listEntry">id("l_tm_mcap")</target></list><list title="Volume trends" next="DOWN j" prev="UP k" fwd="n" back="p"><item action="CALL:axsFinance.readPopularPriceMktCapVolTemplate">id("tm_volume_0")//td[@class="name"]/..</item><target title = "Volume trends" trigger="listEntry">id("l_tm_volume")</target></list></cnr>';
axsFinance.k=i;axsFinance.v=i;axsFinance.P=i;axsFinance.Kb=i;axsFinance.aa=2.5;axsFinance.nb=i;axsFinance.Nb=j;
axsFinance.Bb=function(){axsFinance.k=new n(h);axsFinance.v=new o(axsFinance.k);axsFinance.v.hd(axsFinance.Xb,i);axsFinance.P=new w(axsFinance.k);axsFinance.P.$a(axsFinance.aa);axsFinance.v.xd(axsFinance.P);axsFinance.nb=new x(h);axsFinance.v.zd(axsFinance.nb);axsFinance.Kb=new y("list",axsFinance.k);axsFinance.v.yd(axsFinance.Kb,".");document.addEventListener("keypress",axsFinance.Q,h);document.addEventListener("DOMSubtreeModified",axsFinance.bc,h);var a=document.getElementById("searchbox");a.addEventListener("focus",
axsFinance.sd,j);document.getElementById("searchbox").blur();window.setTimeout(function(){var b=axsFinance.a.dc+" "+axsFinance.v.N().title;axsFinance.k.Bd(b)},0)};axsFinance.bc=function(a){a=a.target;if(a.id=="ac-list")for(var b=0,c;c=a.childNodes[b];b++){if(c.className=="selected"){axsFinance.k.Aa(c);return}}else a.id=="video-news"&&window.setTimeout(function(){axsFinance.v.pd("Video top stories")},0)};axsFinance.ea=function(a,b){axsFinance.P.view(a);axsFinance.k.s(b);a.scrollIntoView(h);axsFinance.k.va(a)};
axsFinance.readTopStory=function(a){a=a.f;var b=a.getElementsByClassName("name")[0].textContent,c=a.getElementsByClassName("byline")[0].textContent,d=a.getElementsByClassName("snippet")[0].textContent;b=b+" "+c+" "+d;axsFinance.ea(a,b)};axsFinance.readPopularPriceMktCapVolTemplate=function(a){axsFinance.za(a.f,axsFinance.a.Ac)};axsFinance.readRecentQuoteTemplate=function(a){axsFinance.za(a.f,axsFinance.a.uc)};axsFinance.readIndexCurrencyBondTemplate=function(a){axsFinance.za(a.f,axsFinance.a.tc)};
axsFinance.readPortfolioTemplate=function(a){axsFinance.za(a.f,axsFinance.a.pc)};axsFinance.za=function(a,b){var c="./td[not(.//b)]";c=axsFinance.k.H(c,a);for(var d=[],e=0,f="",g=0,k=c.length;g<k;g++){f=c[g];if(f.nodeType!==3){f=axsFinance.Yc(f);f=axsFinance.Ib(f);if(f.indexOf("(")>0&&f.indexOf("%")>-1){f=f.split("(");d[e++]=axsFinance.da(f[0]);f=f[1]}d[e++]=axsFinance.da(f)}}c=axsFinance.xa(b,d);axsFinance.ea(a,c)};axsFinance.sd=function(a){if(!axsFinance.Nb){axsFinance.k.s(" ");a.target.blur()}};
axsFinance.Yc=function(a){var b="",c='.//descendant-or-self::*[not(contains(@style,"display: none;"))]/text()';a=axsFinance.k.H(c,a);c=0;for(var d=a.length;c<d;c++)b=b+a[c].textContent+" ";return b};
axsFinance.readTableRowSectorSummaryDesc=function(a){var b=a.f.childNodes,c=b[1].textContent,d=c.indexOf("Cons.");if(d!=-1)c=axsFinance.a.Yb+c.substring(d+5);d=axsFinance.da(b[3].textContent);var e="./descendant::table/descendant::td[@class]",f=axsFinance.k.H(e,b[5]),g=f[0].title,k=Number(g.substring(0,g.indexOf(" ")-1)),p=Number(g.substring(g.lastIndexOf(" "),g.length-1));g=f[1].title;f=Number(g.substring(0,g.indexOf(" ")-1));e=axsFinance.k.H(e,b[7]);g=e[0].title;b=Number(g.substring(0,g.indexOf(" ")-
1));g=e[1].title;g=Number(g.substring(0,g.indexOf(" ")-1));k=[k+f,k,p,g+b,g,p];k=axsFinance.xa(axsFinance.a.xc,k);c=c+" "+d+". "+k;axsFinance.ea(a.f,c)};axsFinance.xa=function(a,b){for(var c=new String(a),d=0;d<b.length;d++)c=c.replace("{"+d+"}",b[d]);return c};axsFinance.Ud=function(a){var b=axsFinance.xb(a);b=axsFinance.xa(axsFinance.a.gb,b);axsFinance.ea(a.f,b)};axsFinance.Vd=function(a){var b=axsFinance.xb(a);b=axsFinance.xa(axsFinance.a.gb,b);axsFinance.ea(a.f,b)};
axsFinance.xb=function(a){var b=a.f.childNodes;a=b[1].textContent;var c=b[4].textContent;if(c.charAt(0)!="-"&&b[4].className=="change chg")c="+"+c;c=axsFinance.da(c);b=axsFinance.da(b[5].textContent);return a=new Array(a,c,b)};
axsFinance.da=function(a){var b="";if(a==="")return a;a=axsFinance.Ib(a);var c=axsFinance.Jb[a];if(c!=undefined)return c;a=a.split(" ");for(c=0;a[c];c++){var d=a[c],e=axsFinance.Jb[d];if(e!=undefined)d=e;else{if(d.length>0&&d.charAt(0)==="(")d=d.substring(1);if(d.length>1&&d.charAt(d.length-1)===")")d=d.substring(0,d.length-1);if(d.length<2)continue;e=axsFinance.Va[d.charAt(0)];if(e!=undefined)d=e+" "+d.substring(1);e=d.charAt(d.length-1);e=axsFinance.fa[e];if(e!=undefined)d=d.substring(0,d.length-
1)+" "+e}b=b+" "+d}return b};axsFinance.Ib=function(a){a=a.replace(/^\s\s*/,"").replace(/\s\s*$/,"");a=a.replace(/\s+/g," ");return a.replace(/\n+/g,"").replace(/\r+/g,"")};axsFinance.Q=function(a){if(a.ctrlKey)return h;if(a.keyCode==27){axsFinance.k.D.blur();return j}if(axsFinance.k.ta)return h;a.charCode==46&&axsFinance.v.Pb();if(a=axsFinance.Nc[a.charCode])return a();return h};
axsFinance.Nc={47:function(){axsFinance.Nb=h;document.getElementById("searchbox").focus();document.getElementById("searchbox").select();return j},63:function(){var a=axsFinance.a.gc+axsFinance.v.ed()+axsFinance.v.Zc();axsFinance.k.s(a);return j},45:function(){axsFinance.aa-=0.1;axsFinance.P.$a(axsFinance.aa);return j},61:function(){axsFinance.aa+=0.1;axsFinance.P.$a(axsFinance.aa);return j}};window.addEventListener("load",axsFinance.Bb,h); })();

(function() { 
var g=false,h=null,i=true,k,l=function(a){this.cb=0;this.P=h;this.Ua=g;this.r=h;this.X=g;var b=this;this.da=document.body;this.hb();if(a){this.Ua=i;document.addEventListener("keypress",function(d){b.Mb(d,b)},i);document.body.Nb=i}};k=l.prototype;
k.hb=function(){var a=this.p(),b=this,d=function(e){b.r=e.target;if(e.target.tagName=="INPUT"||e.target.tagName=="SELECT"||e.target.tagName=="TEXTAREA")b.X=i;return i};a.addEventListener("focus",d,i);var c=function(e){b.sa(b.r,"aria-activedescendant");b.r=h;if(e.target.tagName=="INPUT"||e.target.tagName=="SELECT"||e.target.tagName=="TEXTAREA")b.X=g;return i};a.addEventListener("blur",c,i)};k.p=function(){var a=this.da;while(a.nodeType!=9)a=a.parentNode;return a};
k.Ta=function(a,b){a.id||this.Fa(a);if(b){this.J(a,"live","rude");this.J(a,"atomic","true");var d=this.p(),c=d.createElement("div");c.textContent=" ";c.name="AxsJAX_dummyNode";a.lastChild&&a.lastChild.name&&a.lastChild.name==c.name&&a.removeChild(a.lastChild);a.appendChild(c)}else{var e=this.tb(a,"role");this.J(a,"role","row");var f=this.r;if(!f||f.nodeType==9){this.da.tabIndex=-1;f=this.da}this.J(f,"activedescendant",h);f.focus&&f.focus();this.J(f,"activedescendant",a.id);var j=this;window.setTimeout(function(){e?
j.J(a,"role",e):j.sa(a,"role")},0)}};
k.u=function(a,b){var d="AxsJAX_pixelAudioNode",c="AxsJAX_pixelAudioNode",e="data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",f=this.p(),j=h;if(b){if(b.previousSibling&&b.previousSibling.name==c)j=b.previousSibling;else{j=f.createElement("img");j.name=c;j.setAttribute("tabindex",0);j.style.outline="none";j.src=e;b.parentNode.insertBefore(j,b);this.rb(j)}j.setAttribute("alt",a);j.setAttribute("title",a);window.setTimeout(function(){j.blur();j.focus()},0)}else{if((j=
f.getElementById(d))&&j.alt==a)a=a+" ";if(!j){j=f.createElement("img");j.id=d;j.src=e;f.body.appendChild(j)}j.setAttribute("alt",a);j.setAttribute("title",a);this.Ta(j)}};
k.V=function(a,b){var d=this.p(),c=d.createEvent("MouseEvents");c.initMouseEvent("mousedown",i,i,d.defaultView,1,0,0,0,0,g,g,b,g,0,h);try{a.dispatchEvent(c)}catch(e){}c=d.createEvent("MouseEvents");c.initMouseEvent("mouseup",i,i,d.defaultView,1,0,0,0,0,g,g,b,g,0,h);try{a.dispatchEvent(c)}catch(e){}c=d.createEvent("MouseEvents");c.initMouseEvent("click",i,i,d.defaultView,1,0,0,0,0,g,g,b,g,0,h);try{a.dispatchEvent(c)}catch(e){}var f=a.getAttribute("href");if(a.tagName=="A"&&f&&f!="#")if(b)window.open(a.href);
else document.location=a.href};k.Fa=function(a,b){if(!a)return"";if(a.id)return a.id;var d=b||"AxsJAX_ID_";return a.id=d+this.cb++};k.Pa=function(a){if(!a)return g;if(a.tagName=="A"||a.tagName=="INPUT"){this.P=a;return i}var b=a.getElementsByTagName("*");for(var d=0,c;c=b[d];d++)if(c.tagName=="A"||c.tagName=="INPUT"||c.hasAttribute("tabindex")&&c.tabIndex!=-1){this.P=c;return i}return g};k.Mb=function(a,b){if(!b.Ua)return i;if(a.keyCode==9&&b.P){b.P.focus();b.P=h}return i};
k.yb=function(a){this.Ta(a);a.scrollIntoView(i);this.Pa(a)};k.J=function(a,b,d){if(!!a){b=b.toLowerCase();switch(b){case "live":b="aria-live";break;case "activedescendant":b="aria-activedescendant";break;case "atomic":b="aria-atomic";break;default:break}a.setAttribute(b,d)}};k.tb=function(a,b){return a.getAttribute(b)};k.sa=function(a,b){a&&a.removeAttribute&&a.removeAttribute(b)};
k.rb=function(a){var b=this.Fa(a),d=this.p(),c=d.baseURI,e=c.indexOf("#");if(e!=-1)c=c.substring(0,e);d.location=c+"#"+b};k.v=function(a,b){try{var d=b.ownerDocument.evaluate(a,b,h,XPathResult.ORDERED_NODE_ITERATOR_TYPE,h)}catch(c){return[]}var e=[];for(var f=d.iterateNext();f;f=d.iterateNext())e.push(f);return e};var n=function(a){this.ba=this.$="";this.b=[];this.a=0;this.d=[];this.m=h;this.Q=[];this.B={};this.C={};this.A=[];this.w=[];this.f=a;this.Vb=this.s=h;this.t=h;this.db="list";this.ya="item";this.Ea="wrap";this.H=h};n.e={eb:"next list",fb:"previous list",ab:"go forward",$a:"go backwards",Wa:"cycle next",Xa:"cycle previous",Sb:"Select available action",Rb:"No available actions",Ba:"Page up",Aa:"Page down",xa:"Enter",Pb:"Escape",Ob:"Delete",Da:"Up",wa:"Down",za:"Left",Ca:"Right"};k=n.prototype;
k.ca=function(a){var b=i;if(a.type=="dynamic"&&a.i.length===0){this.s!==h&&this.s.view(h);a.i=this.Z(a.aa);a.l=this.Oa(a.aa);if(this.b[this.a]===a)this.d[this.a]=-1;else for(var d=0,c;c=this.b[d];d++)if(c===a){this.d[d]=-1;break}}if(a.i.length===0&&a.fa===h)b=g;return b};k.Ka=function(){var a=this.F(),b=a.fa,d=h;if(b!==h){this.R(b);d=this.ja(b.action)}if(d===h){this.jb();this.t!==h&&this.t.I(this.db)}};
k.Eb=function(){if(this.b.length<1)return h;for(var a=0;this.b[a];a++){this.a++;if(this.a>=this.b.length)this.a=0;if(this.ca(this.b[this.a]))break}return this.F()};k.Gb=function(){if(this.b.length<1)return h;for(var a=0;this.b[a];a++){this.a--;if(this.a<0)this.a=this.b.length-1;if(this.ca(this.b[this.a]))break}return this.F()};k.F=function(){return this.b[this.a]};k.jb=function(){this.f.u(this.F().title)};
k.oa=function(){if(this.b.length<1)return h;var a=this.b[this.a],b=a.i;if(b.length<1)return h;if(this.m){var d=this.m.h.K[this.a];if(typeof d!="undefined")this.d[this.a]=d}this.d[this.a]++;var c=g;if(this.d[this.a]>=b.length){this.d[this.a]=0;c=i}var e=this.d[this.a];if(b[e].h.parentNode===h){this.s!==h&&this.s.view(h);a.i=this.Z(a.aa);this.d[this.a]=0;e=this.d[this.a]}this.m=b[e];if(this.t!==h)c?this.t.I(this.Ea):this.t.I(this.ya);return this.m};
k.ha=function(){var a=this.b[this.a],b=this.d[this.a];if(a.va!==h&&b+1>=a.i.length){this.R(a.va);this.d[this.a]=0;return h}var d=this.oa();return d};
k.Ra=function(){if(this.b.length<1)return h;var a=this.b[this.a],b=a.i;if(b.length<1)return h;if(this.m){var d=this.m.h.K[this.a];if(typeof d!="undefined")this.d[this.a]=d}this.d[this.a]--;var c=g;if(this.d[this.a]<0){this.d[this.a]=b.length-1;c=i}var e=this.d[this.a];if(b[e].h.parentNode===h){this.s!==h&&this.s.view(h);a.i=this.Z(a.aa);this.d[this.a]=a.i.length;e=this.d[this.a]}this.m=b[e];if(this.t!==h)c?this.t.I(this.Ea):this.t.I(this.ya);return this.m};
k.mb=function(){var a=this.b[this.a],b=this.d[this.a];if(a.ka!==h&&b<=0){this.R(a.ka);this.d[this.a]=a.i.length-1;return h}var d=this.Ra();return d};k.L=function(){if(this.b.length<1)return h;if(this.m){var a=this.m.h.K[this.a];if(typeof a!="undefined")this.d[this.a]=a}var b=this.b[this.a],d=b.i,c=this.d[this.a];return this.m=d[c]};k.ja=function(a){var b=h;if(a!==h&&a.indexOf&&a.indexOf("CALL:")===0&&a.indexOf("(")===-1)try{b=eval(a.substring(5))}catch(d){}return b};
k.D=function(a){if(a!==h){var b=this,d=function(){var j=b.ja(a.action);if(j)j(a);else{b.s!==h&&b.s.view(a.h);b.f.yb(a.h)}};if(this.f.r&&this.f.r.blur){var c=this.f.r;this.f.r=h;c.removeAttribute&&this.f.sa(c,"aria-activedescendant");var e=function(j){j.target.removeEventListener("blur",e,i);d()};c.addEventListener("blur",e,i);c.blur()}else d()}else{var f=this.b[this.a];f.type=="dynamic"&&this.f.u(f.onEmpty)}};
k.q=function(a,b,d,c){for(var e=0,f;f=a[e];e++)if(f=="LEFT")d[37]=c;else if(f=="UP")d[38]=c;else if(f=="RIGHT")d[39]=c;else if(f=="DOWN")d[40]=c;else if(f=="PGUP")d[33]=c;else if(f=="PGDOWN")d[34]=c;else if(f=="ENTER")d[13]=c;else if(f=="ESC")d[27]=c;else if(f=="DEL")d[46]=c;else b[f.charCodeAt(0)]=c};
k.T=function(a,b,d){var c=[];if(!(a==="")){c=a.split(" ");var e=this;if(d=="prev")this.q(c,this.A[b],this.w[b],function(){e.D(e.Ra())});else if(d=="next")this.q(c,this.A[b],this.w[b],function(){e.D(e.oa())});else d=="back"?this.q(c,this.A[b],this.w[b],function(){e.D(e.mb())}):this.q(c,this.A[b],this.w[b],function(){e.D(e.ha())})}};k.lb=function(a,b,d){var c=[];if(!(a==="")){c=a.split(" ");var e=this;this.q(c,this.B,this.C,function(){if(e.ca(e.b[b])){e.a=b;e.D(e.oa())}else e.f.u(d)})}};
k.kb=function(a,b){var d=[];if(!(a==="")){d=a.split(" ");var c=this;this.q(d,this.B,this.C,function(){c.f.u(b)})}};k.Ga=function(a,b,d){var c=[];if(!(a.hotkey==="")){c=a.hotkey.split(" ");var e=this;this.q(c,b,d,function(){e.R(a)})}};k.R=function(a){var b=a.n,d=this.f.p().documentElement;if(b.indexOf(".")===0)d=this.L().h;var c=this.f.v(b,d);if(c.length<1)this.f.u(a.onEmpty);else{var e=this.ja(a.action);if(e){var f={};f.action=a.action;f.h=c[0];e(f)}else{this.f.V(c[0],g);c[0].scrollIntoView(i)}this.f.Pa(c[0])}};
k.ub=function(a,b){var d=h,c=this.a;if(c<this.w.length)d=this.w[c][a]||this.A[c][b]||h;if(d===h)d=this.C[a]||this.B[b];return d};
k.Db=function(a,b){var d={};d.Ma=[];var c=new DOMParser,e=c.parseFromString(a,"text/xml"),f=e.getElementsByTagName("list"),j,o;for(j=0,o;o=f[j];j++){var m={};m.title=o.getAttribute("title");m.hotkey=o.getAttribute("hotkey");m.na=o.getAttribute("next");m.qa=o.getAttribute("prev");m.sb=o.getAttribute("fwd");m.back=o.getAttribute("back");m.onEmpty=o.getAttribute("onEmpty");m.type=o.getAttribute("type");var p,r,q,s,t;m.i=[];var B=o.getElementsByTagName("item");for(p=0;r=B[p];p++){var z={};z.n=r.textContent;
if(r.attributes instanceof NamedNodeMap){s=r.attributes;t=s.length;for(q=0;q<t;q++){var u=s.item(q);z[u.nodeName]=u.value}}m.i.push(z)}m.l=[];var D=o.getElementsByTagName("target");for(p=0;r=D[p];p++){var v={};v.n=r.textContent;if(r.attributes instanceof NamedNodeMap){s=r.attributes;t=s.length;for(q=0;q<t;q++){var u=s.item(q);v[u.nodeName]=u.value}}m.l.push(v)}d.Ma.push(m)}d.l=[];var w,x=e.firstChild;for(j=0,w;w=x.childNodes[j];j++)if(w.tagName=="target"){var v={};v.n=w.textContent;if(w.attributes instanceof
NamedNodeMap){s=w.attributes;t=s.length;for(q=0;q<t;q++){var u=s.item(q);v[u.nodeName]=u.value}}d.l.push(v)}d.na=x.getAttribute("next");d.qa=x.getAttribute("prev");if(b===h||typeof b=="undefined")this.Qa(d,b);else{var H=new (function(I,E,F,G){b(x,E,F,G)});this.Qa(d,H)}};
k.xb=function(){var a=this.vb(),b="";for(var d=0,c;c=a[d];d++)b=b+c.Y+", "+c.title+". ";b=b+this.$+", "+n.e.eb;b=b+this.ba+", "+n.e.fb;b=b.replace("PGUP",n.e.Ba);b=b.replace("PGDOWN",n.e.Aa);b=b.replace("ENTER",n.e.xa);b=b.replace("DEL",n.e.Ya);b=b.replace("UP",n.e.Da);b=b.replace("DOWN",n.e.wa);b=b.replace("LEFT",n.e.za);return b=b.replace("RIGHT",n.e.Ca)};
k.Bb=function(){var a=this.wb(),b="";for(var d=0,c;c=a[d];d++)b=b+c.Y+", "+c.title+". ";var e=this.F();if(e.pa!=="")b=b+e.pa+", "+n.e.Wa+". ";if(e.ra!=="")b=b+e.ra+", "+n.e.Xa+". ";if(e.ia!=="")b=b+e.ia+", "+n.e.ab+". ";if(e.ea!=="")b=b+e.ea+", "+n.e.$a+". ";b=b.replace("PGUP",n.e.Ba);b=b.replace("PGDOWN",n.e.Aa);b=b.replace("ENTER",n.e.xa);b=b.replace("DEL",n.e.Ya);b=b.replace("UP",n.e.Da);b=b.replace("DOWN",n.e.wa);b=b.replace("LEFT",n.e.za);return b=b.replace("RIGHT",n.e.Ca)};
k.Jb=function(a){this.s=a};k.Kb=function(a){this.t=a};k.Sa=function(a){if(a===h)return g;var b=g;for(var d=0,c;c=this.b[d];d++)if(c.title==a){c.i=[];c.l=[];b=this.ca(c);break}return b};k.vb=function(){var a=[],b;for(var d=0,c;c=this.b[d];d++)if(c.M!==""){b={};b.title=c.title;b.Y=c.M;a.push(b)}for(var e=0,f;f=this.Q[e];e++)if(this.La(f)){b={};b.title=f.title;b.Y=f.hotkey;a.push(b)}return a};
k.wb=function(){var a=[],b=this.F();for(var d=0,c;c=b.l[d];d++)if(this.La(c)){var e={};e.title=c.title;e.Y=c.hotkey;a.push(e)}return a};k.La=function(a){var b=g;if(a.hotkey!==""){var d=a.n,c=this.f.p().body;if(d.indexOf(".")===0){var e=this.L();if(e)c=e.h}var f=this.f.v(d,c);if(f.length>0)b=i}return b};
k.Qa=function(a,b){this.b=[];this.a=0;this.d=[];var d=[],c,e;for(c=0,e;e=a.Ma[c];c++){var f={};f.Tb=h;f.aa=e;f.title=e.title||"";f.M=e.hotkey||"";f.pa=e.na||"";f.ra=e.qa||"";f.ia=e.sb||"";f.ea=e.back||"";f.onEmpty=e.onEmpty||"";f.type=e.type||"";f.va=h;f.ka=h;f.fa=h;f.i=this.Z(e);f.l=this.Oa(e);for(var j=0,o;o=f.l[j];j++)if(o.trigger=="listTail")f.va=o;else if(o.trigger=="listHead")f.ka=o;else if(o.trigger=="listEntry")f.fa=o;if(f.i.length>0||f.type=="dynamic"){this.b.push(f);this.d.push(-1)}else f.M!==
""&&d.push(f)}this.Q=[];this.Xb=0;var m;if(a.l)for(c=0,m;m=a.l[c];c++){var p={};p.n=m.n;p.n=p.n.replace(/^\s\s*/,"").replace(/\s\s*$/,"");p.title=m.title||"";p.trigger=m.trigger||"key";p.hotkey=m.hotkey||"";p.action=m.action||"click";p.onEmpty=m.onEmpty||"";this.Q.push(p)}this.H!==h&&document.removeEventListener("keypress",this.H,i);b===h||typeof b=="undefined"?this.Lb(a,d):b(a,this.b,d,this.Q)};
k.Z=function(a){var b=[];if(!a.i)return b;for(var d=0,c;c=a.i[d];d++)try{var e=c.n.replace(/^\s\s*/,"").replace(/\s\s*$/,""),f=this.f.p().documentElement,j=this.f.v(e,f),o=c.index||"0",m=parseInt(o,10),p=j.length-m,r=c.Ub||"*";if(r!="*")p=parseInt(r,10);var q=p+m,s=c.action||h;while(m<q){var t={};t.action=s;t.h=j[m];if(typeof t.h!="undefined"){if(typeof t.h.K=="undefined")t.h.K={};t.h.K[this.b.length]=b.length;b.push(t)}m++}}catch(B){}return b};
k.Oa=function(a){var b=[];if(!a.l)return b;for(var d=0,c;c=a.l[d];d++){var e={};e.n=c.n.replace(/^\s\s*/,"").replace(/\s\s*$/,"");e.title=c.title||"";e.trigger=c.trigger||"key";e.hotkey=c.hotkey||"";e.action=c.action||"click";e.onEmpty=c.onEmpty||"";b.push(e)}return b};
k.Lb=function(a,b){var d=this,c;this.B={};this.C={};this.A=[];this.w=[];var e;for(c=0,e;e=this.Q[c];c++)this.Ga(e,this.B,this.C);var f=[];this.$=a.na||"";if(this.$!=="")f=this.$.split(" ");this.q(f,this.B,this.C,function(){d.Eb();d.Ka()});f=[];this.ba=a.qa||"";if(this.ba!=="")f=this.ba.split(" ");this.q(f,this.B,this.C,function(){d.Gb();d.Ka()});var j;for(c=0,j;j=this.b[c];c++){var o={},m={};this.A.push(o);this.w.push(m);this.T(j.pa,c,"next");this.T(j.ra,c,"prev");this.T(j.ia,c,"fwd");this.T(j.ea,
c,"back");this.lb(j.M,c,j.onEmpty);var p;for(p=0,e;e=j.l[p];p++)this.Ga(e,o,m)}var r;for(c=0,r;r=b[c];c++)this.kb(r.M,r.onEmpty);this.H=function(q){if(q.ctrlKey)return i;if(d.f.X)return i;var s=d.ub(q.keyCode,q.charCode);if(s)return s()};document.addEventListener("keypress",this.H,i)};var y=function(a){this.g=a;this.O=1.5;this.padding=-1;this.Ib=0;this.S=a.p();this.c=this.S.createElement("span");this.c.style.backgroundColor="#CCE6FF";this.c.style.borderColor="#0000CC";this.c.style.borderWidth="medium";this.c.style.borderStyle="groove";this.c.style.position="absolute";this.c.style.display="none";this.S.body.appendChild(this.c);this.Ia=function(){}};y.gb={Qb:0,Za:1};k=y.prototype;
k.view=function(a){while(this.c.firstChild)this.c.removeChild(this.c.firstChild);if(a===h)this.c.style.display="none";else{var b=0,d=0,c=a;if(c.offsetParent){b=c.offsetLeft;d=c.offsetTop;c=c.offsetParent;while(c!==h){b+=c.offsetLeft;d+=c.offsetTop;c=c.offsetParent}}this.c.appendChild(a.cloneNode(i));this.c.style.top=d+"px";this.c.style.left=b+"px";this.c.style.zIndex=999;this.c.style.display="block";this.Na()}};k.ta=function(a){this.O=a;this.Na()};
k.Na=function(){this.S.body.removeChild(this.c);this.Cb();this.qb();this.ib();this.S.body.appendChild(this.c);this.Ia&&this.Ia(this.c);if(this.Ib==y.gb.Za){var a=this;window.setTimeout(function(){a.c.scrollIntoView(i)},0)}};k.ib=function(){if(!(this.padding<0)){var a="//*[not(.//*)]",b=this.g.v(a,this.c);for(var d=0,c;c=b[d];d++)c.style.padding=this.padding+"px"}};
k.qb=function(){var a=this.c.getElementsByTagName("img");for(var b=0,d;d=a[b];b++){if(!d.hasAttribute("Axs_OrigHeight")){d.setAttribute("Axs_OrigHeight",d.height);d.setAttribute("Axs_OrigWidth",d.width)}d.height=d.getAttribute("Axs_OrigHeight")*this.O;d.width=d.getAttribute("Axs_OrigWidth")*this.O}};
k.Cb=function(){var a="fontSizeAdjust"in this.c.style;if(a){var b=this.O*0.52;this.c.style.fontSizeAdjust=b}else{var d=this.O*100+"%";this.c.style.setProperty("font-size",d,"important")}var c=this.c.getElementsByTagName("*");for(var e=0,f;f=c[e];e++){f.style.setProperty("line-height","normal","important");a||f.style.setProperty("font-size","100%","important")}};var A=function(a){var b="http://google-axsjax.googlecode.com/svn/trunk/";this.pb=b+"common/earcons/axsEarcons.swf?sound=";this.o=h;this.W=a;this.ua=b+"thirdparty/soundmanager2/";this.k=h;this.G=g;this.Va="minimal";this.U=g;this.ma=0};k=A.prototype;
k.la=function(){if(!this.W)if(!this.G)if(!this.U){this.U=i;this.ma=0;if(this.k!==h){this.k.parentNode.removeChild(this.k);this.k=h}this.k=document.createElement("iframe");var a=document.location.toString();if(a.indexOf("#")!=-1)a=a.substring(0,a.indexOf("#"));this.k.src=this.ua+"AxsJAX_SM2_Linker.html#Verbosity="+this.Va+",Parent="+a;this.k.width="0%";this.k.height="0%";this.k.style.top="-1000";this.k.style.left="-1000";this.k.style.position="absolute";document.getElementsByTagName("body")[0].appendChild(this.k);
this.Ja()}};k.Ja=function(){if(document.location.hash=="#InitSuccess"){this.G=i;this.U=g}else if(this.Va=="none"&&this.ma>0){this.G=i;this.U=g}else{var a=this;window.setTimeout(function(){a.Ja()},100);this.ma++}};k.I=function(a){var b=this.Fb(a);if(!(this.W||b))if(this.G)this.k.src=this.ua+"AxsJAX_SM2_Linker.html#AxsSoundCmd=Play("+a+")";else{this.la();var d=this;window.setTimeout(function(){d.I(a)},500)}};
k.stop=function(){if(this.o){this.o.parentNode.removeChild(this.o);this.o=h}if(!this.W)if(!!this.G)this.k.src=this.ua+"AxsJAX_SM2_Linker.html#AxsSoundCmd=Stop()"};k.getTime=function(){if(this.W)return-1;if(!this.G)return-1;var a="Time=",b=unescape(document.location.hash);if(b.indexOf(a)==-1)return-1;var d=b.indexOf(a)+a.length,c=parseInt(b.substring(d),10);return c};
k.Fb=function(a){var b="";switch(a){case "alert":b="alert";break;case "deselect":b="deselect";break;case "item":b="item";break;case "list":b="list";break;case "select":b="select";break;case "success":b="success";break;case "wrap":b="wrap";break;default:}if(!(b==="")){if(this.o===h){this.o=document.createElement("embed");this.o.height=0;this.o.width=0;document.body.appendChild(this.o)}this.o.src=this.pb+b}};var C={};C.bb="The following shortcut keys are available. ";C.g=h;C.j=h;C.z=h;C.Ha=h;C.N=1.5;
C.la=function(){C.g=new l(i);C.j=new n(C.g);document.addEventListener("keypress",C.H,i);var a='<cnr next="RIGHT l" prev="LEFT h">     <list title="Featured question" next="DOWN j" prev="UP k" type="dynamic">    <item count="1">      //div[contains(@class, "moderator-featured")]    </item>\t<target title="Yes" hotkey="y" action="CALL:axsModerator.voteYes">\t .\t</target>\t<target title="No" hotkey="n" action="CALL:axsModerator.voteNo">\t .\t</target>\t<target title="Skip" hotkey="s" action="CALL:axsModerator.voteSkip">\t .\t</target>\t<target title="Repeat" hotkey="r" action="CALL:axsModerator.repeatFeaturedQuestion">\t .\t</target>  </list>  <list title="Questions" next="DOWN j" prev="UP k" type="dynamic">    <item>      //div[contains(@class, "QuestionListPanel")]/table/tbody/tr    </item>\t<target title="Yes" hotkey="y" action="CALL:axsModerator.voteYes">\t .\t</target>\t<target title="No" hotkey="n" action="CALL:axsModerator.voteNo">\t .\t</target>  </list>   <list title="Topics" fwd="DOWN j" back="UP k" type="dynamic">    <item index="5">      //div[contains(@class, "link link-regular ")]    </item>\t<target title="Go to topic" hotkey="ENTER" action="CALL:axsModerator.goToTopic">\t .//a\t</target>  </list>\t<target title="Ask a question" hotkey="a">\t //table[@class="AskMinimizedPanel"]//div[@class="goog-button-base-content"]\t</target></cnr>';C.j.Db(a,
h);C.z=new y(C.g);C.j.Jb(C.z);C.z.ta(C.N);C.Ha=new A(i);C.j.Kb(C.Ha);document.addEventListener("DOMAttrModified",C.ob,i);C.j.a=2;C.j.ha();C.zb(C.j.L())};C.Hb=function(){if(C.j.Sa("Featured question")){C.j.a=0;C.j.ha();var a=C.j.L().h;a.addEventListener("DOMNodeInserted",C.ga,i);C.ga(h)}C.j.Sa("Questions")};C.zb=function(a){var b=a.h,d=C.g.p(),c=d.createEvent("MouseEvents");c.initMouseEvent("click",i,i,d.defaultView,1,0,0,0,0,g,g,g,g,0,h);try{b.dispatchEvent(c)}catch(e){}};
C.$b=function(a){var b=a.h,d='.//div[contains(@class,"gwt-ToggleButton")]',c=C.g.v(d,b)[0];C.g.V(c,g);C.g.u("Press enter to confirm your yes vote.")};C.Yb=function(a){var b=a.h,d='.//div[contains(@class,"gwt-ToggleButton")]',c=C.g.v(d,b)[1];C.g.V(c,g);C.g.u("Press enter to confirm your no vote.")};C.Zb=function(a){var b=a.h,d='//div[(@class = "goog-button-base-content") and (text()="Skip")]',c=C.g.v(d,b)[0];C.g.V(c,g)};
C.ob=function(a){var b=a.target;if(b.className=="qdb-StatusBox"){C.z.view(h);C.g.u(b.textContent);b.textContent.indexOf("Loading")===0&&window.setTimeout(C.Hb,500)}};C.ga=function(){C.j.D(C.j.L());C.z.view(h)};C.Wb=function(){C.ga(h)};C.H=function(a){if(a.ctrlKey)return i;if(a.keyCode==27){C.g.r.blur();return g}if(C.g.X)return i;var b=C.Ab[a.keyCode]||C.nb[a.charCode];if(b)return b();return i};C.Ab={};
C.nb={45:function(){C.N-=0.1;C.z.ta(C.N);return g},61:function(){C.N+=0.1;C.z.ta(C.N);return g},63:function(){var a=C.bb+C.j.Bb()+C.j.xb();C.g.u(a);return g},47:function(){var a="//input",b=C.g.v(a,document.body)[0];b.focus();b.select();return g}};window.setTimeout(C.la,1000);
 })();
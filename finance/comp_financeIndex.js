(function() { 
var h=false,i=null,j=true,l=function(a){this.pc=0;this.ea=i;this.Pb=h;this.C=i;this.ta=h;var b=this,d=function(e){b.C=e.target;if(e.target.tagName=="INPUT"||e.target.tagName=="SELECT"||e.target.tagName=="TEXTAREA")b.ta=j;return j};document.addEventListener("focus",d,j);var c=function(e){b.Ya(b.C,"aria-activedescendant");b.C=i;if(e.target.tagName=="INPUT"||e.target.tagName=="SELECT"||e.target.tagName=="TEXTAREA")b.ta=h;return j};document.addEventListener("blur",c,j);if(a){this.Pb=j;document.addEventListener("keypress",
function(e){b.Wd(e,b)},j);document.body.Xd=j}this.Fa=document.body};l.prototype.G=function(){var a=this.Fa;while(a.nodeType!=9)a=a.parentNode;return a};
l.prototype.za=function(a,b){a.id||this.ob(a);if(b){this.T(a,"live","rude");this.T(a,"atomic","true");var d=this.G(),c=d.createElement("div");c.textContent=" ";c.name="AxsJAX_dummyNode";a.lastChild&&a.lastChild.name&&a.lastChild.name==c.name&&a.removeChild(a.lastChild);a.appendChild(c)}else{var e=this.md(a,"role");this.T(a,"role","row");var f=this.C;if(!f||f.nodeType==9){this.Fa.tabIndex=-1;f=this.Fa}this.T(f,"activedescendant",i);f.focus();this.T(f,"activedescendant",a.id);var g=this;window.setTimeout(function(){e?
g.T(a,"role",e):g.Ya(a,"role")},0)}};
l.prototype.u=function(a,b){var d="AxsJAX_pixelAudioNode",c="AxsJAX_pixelAudioNode",e="data:image/gif;base64,R0lGODlhAQABAIAAANvf7wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",f=this.G(),g=i;if(b){if(b.previousSibling&&b.previousSibling.name==c)g=b.previousSibling;else{g=f.createElement("img");g.name=c;g.setAttribute("tabindex",0);g.style.outline="none";g.src=e;b.parentNode.insertBefore(g,b);this.jd(g)}g.setAttribute("alt",a);g.setAttribute("title",a);window.setTimeout(function(){g.blur();g.focus()},0)}else{g=
f.getElementById(d);if(g&&g.alt==a)a=a+" ";if(!g){g=f.createElement("img");g.id=d;g.src=e;f.body.appendChild(g)}g.setAttribute("alt",a);g.setAttribute("title",a);this.za(g)}};
l.prototype.bd=function(a,b){var d=this.G(),c=d.createEvent("MouseEvents");c.initMouseEvent("mousedown",j,j,d.defaultView,1,0,0,0,0,h,h,b,h,0,i);try{a.dispatchEvent(c)}catch(e){}c=d.createEvent("MouseEvents");c.initMouseEvent("mouseup",j,j,d.defaultView,1,0,0,0,0,h,h,b,h,0,i);try{a.dispatchEvent(c)}catch(e){}c=d.createEvent("MouseEvents");c.initMouseEvent("click",j,j,d.defaultView,1,0,0,0,0,h,h,b,h,0,i);try{a.dispatchEvent(c)}catch(e){}if(a.tagName=="A"&&a.href&&(a.href.indexOf("http")===0||a.href.indexOf("javascript:")===
0))if(b)window.open(a.href);else document.location=a.href};l.prototype.ob=function(a,b){if(!a)return"";if(a.id)return a.id;var d=b||"AxsJAX_ID_";a.id=d+this.pc++;return a.id};l.prototype.Sa=function(a){if(!a)return h;if(a.tagName=="A"||a.tagName=="INPUT"){this.ea=a;return j}var b=a.getElementsByTagName("*");for(var d=0,c;c=b[d];d++)if(c.tagName=="A"||c.tagName=="INPUT"||c.hasAttribute("tabindex")&&c.tabIndex!=-1){this.ea=c;return j}return h};
l.prototype.Wd=function(a,b){if(!b.Pb)return j;if(a.keyCode==9&&b.ea){b.ea.focus();b.ea=i}return j};l.prototype.od=function(a){this.za(a);a.scrollIntoView(j);this.Sa(a)};l.prototype.T=function(a,b,d){if(!a)return;b=b.toLowerCase();switch(b){case "live":b="aria-live";break;case "activedescendant":b="aria-activedescendant";break;case "atomic":b="aria-atomic";break;default:break}a.setAttribute(b,d)};l.prototype.md=function(a,b){return a.getAttribute(b)};
l.prototype.Ya=function(a,b){a&&a.removeAttribute&&a.removeAttribute(b)};l.prototype.jd=function(a){var b=this.ob(a),d=this.G(),c=d.baseURI,e=c.indexOf("#");if(e!=-1)c=c.substring(0,e);d.location=c+"#"+b};l.prototype.m=function(a,b){try{var d=b.ownerDocument.evaluate(a,b,i,XPathResult.ORDERED_NODE_ITERATOR_TYPE,i)}catch(c){return[]}var e=[];for(var f=d.iterateNext();f;f=d.iterateNext())e.push(f);return e};var o=function(a){this.wa="";this.ya="";this.c=[];this.b=0;this.g=[];this.q=i;this.fa=[];this.N={};this.O={};this.P=[];this.K=[];this.h=a;this.I=i;this.D=i;this.J=i;this.tc="list";this.fb="item";this.nb="wrap";this.S=i};o.a={zc:"next list",Dc:"previous list",nc:"go forward",mc:"go backwards",Zb:"cycle next",$b:"cycle previous",Jc:"Select available action",Ac:"No available actions",kb:"Page up",jb:"Page down",W:"Enter",ae:"Escape",$d:"Delete",ja:"Up",ga:"Down",gb:"Left",mb:"Right"};
o.prototype.Sd=function(a,b){if(b){this.D=a;this.D.k===i&&this.ed();var d=this,c=new Array(b);this.w(c,this.N,this.O,function(){d.Ob()})}};o.prototype.Aa=function(a){var b=j;if(a.type=="dynamic"&&a.l.length===0){this.I!==i&&this.I.view(i);a.l=this.ua(a.xa);a.p=this.Fb(a.xa);if(this.c[this.b]===a)this.g[this.b]=-1;else for(var d=0,c;c=this.c[d];d++)if(c===a){this.g[d]=-1;break}}if(a.l.length===0&&a.Ka===i)b=h;return b};
o.prototype.vb=function(){var a=this.Q(),b=a.Ka,d=i;if(b!==i){this.ka(b);d=this.Ma(b.action)}if(d===i){this.Vc();this.J!==i&&this.J.play(this.tc)}};o.prototype.zd=function(){if(this.c.length<1)return i;for(var a=0;this.c[a];a++){this.b++;if(this.b>=this.c.length)this.b=0;if(this.Aa(this.c[this.b]))break}return this.Q()};o.prototype.Fd=function(){if(this.c.length<1)return i;for(var a=0;this.c[a];a++){this.b--;if(this.b<0)this.b=this.c.length-1;if(this.Aa(this.c[this.b]))break}return this.Q()};
o.prototype.Q=function(){return this.c[this.b]};o.prototype.Vc=function(){this.h.u(this.Q().title)};
o.prototype.Ua=function(){if(this.c.length<1)return i;var a=this.c[this.b],b=a.l;if(b.length<1)return i;if(this.q){var d=this.q.i.V[this.b];if(typeof d!="undefined")this.g[this.b]=d}this.g[this.b]++;var c=h;if(this.g[this.b]>=b.length){this.g[this.b]=0;c=j}var e=this.g[this.b];if(b[e].i.parentNode===i){this.I!==i&&this.I.view(i);a.l=this.ua(a.xa);this.g[this.b]=0;e=this.g[this.b]}this.q=b[e];if(this.J!==i)c?this.J.play(this.nb):this.J.play(this.fb);return this.q};
o.prototype.ld=function(){var a=this.c[this.b],b=this.g[this.b];if(a.cb!==i&&b+1>=a.l.length){this.ka(a.cb);this.g[this.b]=0;return i}var d=this.Ua();return d};
o.prototype.Jb=function(){if(this.c.length<1)return i;var a=this.c[this.b],b=a.l;if(b.length<1)return i;if(this.q){var d=this.q.i.V[this.b];if(typeof d!="undefined")this.g[this.b]=d}this.g[this.b]--;var c=h;if(this.g[this.b]<0){this.g[this.b]=b.length-1;c=j}var e=this.g[this.b];if(b[e].i.parentNode===i){this.I!==i&&this.I.view(i);a.l=this.ua(a.xa);this.g[this.b]=a.l.length;e=this.g[this.b]}this.q=b[e];if(this.J!==i)c?this.J.play(this.nb):this.J.play(this.fb);return this.q};
o.prototype.Zc=function(){var a=this.c[this.b],b=this.g[this.b];if(a.Pa!==i&&b-1<=-1){this.ka(a.Pa);this.g[this.b]=a.l.length;return i}var d=this.Jb();return d};o.prototype.ub=function(){if(this.c.length<1)return i;if(this.q){var a=this.q.i.V[this.b];if(typeof a!="undefined")this.g[this.b]=a}var b=this.c[this.b],d=b.l,c=this.g[this.b];this.q=d[c];return this.q};o.prototype.Ma=function(a){var b=i;if(a!==i&&a.indexOf&&a.indexOf("CALL:")===0&&a.indexOf("(")===-1)try{b=eval(a.substring(5))}catch(d){}return b};
o.prototype.X=function(a){if(a!==i){var b=this,d=function(){var g=b.Ma(a.action);if(g)g(a);else{b.I!==i&&b.I.view(a.i);b.h.od(a.i)}};if(this.h.C&&this.h.C.blur){var c=this.h.C;this.h.C=i;c.removeAttribute&&this.h.Ya(c,"aria-activedescendant");var e=function(g){g.target.removeEventListener("blur",e,j);d()};c.addEventListener("blur",e,j);c.blur()}else d()}else{var f=this.c[this.b];f.type=="dynamic"&&this.h.u(f.onEmpty)}};
o.prototype.w=function(a,b,d,c){for(var e=0,f;f=a[e];e++)if(f=="LEFT")d[37]=c;else if(f=="UP")d[38]=c;else if(f=="RIGHT")d[39]=c;else if(f=="DOWN")d[40]=c;else if(f=="PGUP")d[33]=c;else if(f=="PGDOWN")d[34]=c;else if(f=="ENTER")d[13]=c;else if(f=="ESC")d[27]=c;else if(f=="DEL")d[46]=c;else b[f.charCodeAt(0)]=c};
o.prototype.ma=function(a,b,d){var c=[];if(a==="")return;c=a.split(" ");var e=this;if(d=="prev")this.w(c,this.P[b],this.K[b],function(){e.X(e.Jb())});else if(d=="next")this.w(c,this.P[b],this.K[b],function(){e.X(e.Ua())});else d=="back"?this.w(c,this.P[b],this.K[b],function(){e.X(e.Zc())}):this.w(c,this.P[b],this.K[b],function(){e.X(e.ld())})};
o.prototype.Yc=function(a,b,d){var c=[];if(a==="")return;c=a.split(" ");var e=this;this.w(c,this.N,this.O,function(){if(!e.Aa(e.c[b])){e.h.u(d);return}e.b=b;e.X(e.Ua())})};o.prototype.Xc=function(a,b){var d=[];if(a==="")return;d=a.split(" ");var c=this;this.w(d,this.N,this.O,function(){c.h.u(b)})};o.prototype.pb=function(a,b,d){var c=[];if(a.hotkey==="")return;c=a.hotkey.split(" ");var e=this;this.w(c,b,d,function(){e.ka(a)})};
o.prototype.ka=function(a){var b=a.v,d=this.h.G().documentElement;if(b.indexOf(".")===0)d=this.ub().i;var c=this.h.m(b,d);if(c.length<1)this.h.u(a.onEmpty);else{var e=this.Ma(a.action);if(e){var f={};f.action=a.action;f.i=c[0];e(f)}else{this.h.bd(c[0],h);c[0].scrollIntoView(j)}this.h.Sa(c[0])}};o.prototype.xb=function(a,b){var d=i,c=this.b;if(c<this.K.length)d=this.K[c][a]||this.P[c][b]||i;if(d===i)d=this.O[a]||this.N[b];return d};
o.prototype.yd=function(a,b){var d={};d.Db=[];var c=new DOMParser,e=c.parseFromString(a,"text/xml"),f=e.getElementsByTagName("list"),g,k;for(g=0,k;k=f[g];g++){var m={};m.title=k.getAttribute("title");m.hotkey=k.getAttribute("hotkey");m.Ta=k.getAttribute("next");m.Wa=k.getAttribute("prev");m.kd=k.getAttribute("fwd");m.back=k.getAttribute("back");m.onEmpty=k.getAttribute("onEmpty");m.type=k.getAttribute("type");var n,p,q,r,s;m.l=[];var t=k.getElementsByTagName("item");for(n=0;p=t[n];n++){var x={};x.v=
p.textContent;if(p.attributes instanceof NamedNodeMap){r=p.attributes;s=r.length;for(q=0;q<s;q++){var w=r.item(q);x[w.nodeName]=w.value}}m.l.push(x)}m.p=[];var B=k.getElementsByTagName("target");for(n=0;p=B[n];n++){var v={};v.v=p.textContent;if(p.attributes instanceof NamedNodeMap){r=p.attributes;s=r.length;for(q=0;q<s;q++){var w=r.item(q);v[w.nodeName]=w.value}}m.p.push(v)}d.Db.push(m)}d.p=[];var A,C=e.firstChild;for(g=0,A;A=C.childNodes[g];g++)if(A.tagName=="target"){var v={};v.v=A.textContent;
if(A.attributes instanceof NamedNodeMap){r=A.attributes;s=r.length;for(q=0;q<s;q++){var w=r.item(q);v[w.nodeName]=w.value}}d.p.push(v)}d.Ta=C.getAttribute("next");d.Wa=C.getAttribute("prev");if(b===i||typeof b=="undefined")this.Gb(d,b);else{var G=new (function(H,D,E,F){b(C,D,E,F)});this.Gb(d,G)}};
o.prototype.nd=function(){var a=this.Na(),b="";for(var d=0,c;c=a[d];d++)b=b+c.da+", "+c.title+". ";b=b+this.wa+", "+o.a.zc;b=b+this.ya+", "+o.a.Dc;b=b.replace("PGUP",o.a.kb);b=b.replace("PGDOWN",o.a.jb);b=b.replace("ENTER",o.a.W);b=b.replace("DEL",o.a.cc);b=b.replace("UP",o.a.ja);b=b.replace("DOWN",o.a.ga);b=b.replace("LEFT",o.a.gb);b=b.replace("RIGHT",o.a.mb);return b};
o.prototype.td=function(){var a=this.Oa(),b="";for(var d=0,c;c=a[d];d++)b=b+c.da+", "+c.title+". ";var e=this.Q();if(e.Va!=="")b=b+e.Va+", "+o.a.Zb+". ";if(e.Xa!=="")b=b+e.Xa+", "+o.a.$b+". ";if(e.La!=="")b=b+e.La+", "+o.a.nc+". ";if(e.Ga!=="")b=b+e.Ga+", "+o.a.mc+". ";b=b.replace("PGUP",o.a.kb);b=b.replace("PGDOWN",o.a.jb);b=b.replace("ENTER",o.a.W);b=b.replace("DEL",o.a.cc);b=b.replace("UP",o.a.ja);b=b.replace("DOWN",o.a.ga);b=b.replace("LEFT",o.a.gb);b=b.replace("RIGHT",o.a.mb);return b};
o.prototype.Qd=function(a){this.I=a};o.prototype.Td=function(a){this.J=a};o.prototype.Id=function(a){if(a===i)return h;var b=h;for(var d=0,c;c=this.c[d];d++)if(c.title==a){c.l=[];c.p=[];b=this.Aa(c);break}return b};o.prototype.Ob=function(){if(this.D===i)return;var a=this.Na(),b=this.Oa();if(a.length+b.length===0){this.h.u(o.a.Ac);return}var d=[],c=0,e="";for(c=0;e=b[c];c++)d.push(e.title);for(c=0;e=a[c];c++)d.push(e.title);this.D.Od(d);this.D.Qb("visible",j,40,20)};
o.prototype.Na=function(){var a=[],b;for(var d=0,c;c=this.c[d];d++)if(c.ba!==""){b={};b.title=c.title;b.da=c.ba;a.push(b)}for(var e=0,f;f=this.fa[e];e++)if(this.Bb(f)){b={};b.title=f.title;b.da=f.hotkey;a.push(b)}return a};o.prototype.Oa=function(){var a=[],b=this.Q();for(var d=0,c;c=b.p[d];d++)if(this.Bb(c)){var e={};e.title=c.title;e.da=c.hotkey;a.push(e)}return a};
o.prototype.ed=function(){var a=this.h.G().body,b=this,d=function(c,e){var f=b.Oa(),g=b.Na(),k=f.concat(g),m=k[e].da,n=m.split(" ")[0],p=-1,q=-1;if(n=="LEFT")p=37;else if(n=="UP")p=38;else if(n=="RIGHT")p=39;else if(n=="DOWN")p=40;else if(n=="PGUP")p=33;else if(n=="PGDOWN")p=34;else if(n=="ENTER")p=13;else if(n=="DEL")p=46;else if(n=="ESC")p=27;else q=n.charCodeAt(0);b.D.k.blur();var r=b.xb(p,q);r&&r()};this.D.cd(a,50,d,i,this.ee,h);this.D.Pd(o.a.Jc);this.D.Md(j);this.D.Za()};
o.prototype.Bb=function(a){var b=h;if(a.hotkey!==""){var d=a.v,c=this.h.G().body;if(d.indexOf(".")===0){var e=this.ub();if(e)c=e.i}var f=this.h.m(d,c);if(f.length>0)b=j}return b};
o.prototype.Gb=function(a,b){this.c=[];this.b=0;this.g=[];var d=[],c,e;for(c=0,e;e=a.Db[c];c++){var f={};f.ge=i;f.xa=e;f.title=e.title||"";f.ba=e.hotkey||"";f.Va=e.Ta||"";f.Xa=e.Wa||"";f.La=e.kd||"";f.Ga=e.back||"";f.onEmpty=e.onEmpty||"";f.type=e.type||"";f.cb=i;f.Pa=i;f.Ka=i;f.l=this.ua(e);f.p=this.Fb(e);for(var g=0,k;k=f.p[g];g++)if(k.trigger=="listTail")f.cb=k;else if(k.trigger=="listHead")f.Pa=k;else if(k.trigger=="listEntry")f.Ka=k;if(f.l.length>0||f.type=="dynamic"){this.c.push(f);this.g.push(-1)}else f.ba!==
""&&d.push(f)}this.fa=[];this.ie=0;var m;if(a.p)for(c=0,m;m=a.p[c];c++){var n={};n.v=m.v;n.v=n.v.replace(/^\s\s*/,"").replace(/\s\s*$/,"");n.title=m.title||"";n.trigger=m.trigger||"key";n.hotkey=m.hotkey||"";n.action=m.action||"click";n.onEmpty=m.onEmpty||"";this.fa.push(n)}this.S!==i&&document.removeEventListener("keypress",this.S,j);b===i||typeof b=="undefined"?this.Ud(a,d):b(a,this.c,d,this.fa)};
o.prototype.ua=function(a){var b=[];if(!a.l)return b;for(var d=0,c;c=a.l[d];d++)try{var e=c.v.replace(/^\s\s*/,"").replace(/\s\s*$/,""),f=this.h.G().documentElement,g=this.h.m(e,f),k=c.index||"0",m=parseInt(k,10),n=g.length-m,p=c.he||"*";if(p!="*")n=parseInt(p,10);var q=n+m,r=c.action||i;while(m<q){var s={};s.action=r;s.i=g[m];if(typeof s.i!="undefined"){if(typeof s.i.V=="undefined")s.i.V={};s.i.V[this.c.length]=b.length;b.push(s)}m++}}catch(t){}return b};
o.prototype.Fb=function(a){var b=[];if(!a.p)return b;for(var d=0,c;c=a.p[d];d++){var e={};e.v=c.v.replace(/^\s\s*/,"").replace(/\s\s*$/,"");e.title=c.title||"";e.trigger=c.trigger||"key";e.hotkey=c.hotkey||"";e.action=c.action||"click";e.onEmpty=c.onEmpty||"";b.push(e)}return b};
o.prototype.Ud=function(a,b){var d=this,c;this.N={};this.O={};this.P=[];this.K=[];var e;for(c=0,e;e=this.fa[c];c++)this.pb(e,this.N,this.O);var f=[];this.wa=a.Ta||"";if(this.wa!=="")f=this.wa.split(" ");this.w(f,this.N,this.O,function(){d.zd();d.vb()});f=[];this.ya=a.Wa||"";if(this.ya!=="")f=this.ya.split(" ");this.w(f,this.N,this.O,function(){d.Fd();d.vb()});var g;for(c=0,g;g=this.c[c];c++){var k={},m={};this.P.push(k);this.K.push(m);this.ma(g.Va,c,"next");this.ma(g.Xa,c,"prev");this.ma(g.La,c,"fwd");
this.ma(g.Ga,c,"back");this.Yc(g.ba,c,g.onEmpty);var n;for(n=0,e;e=g.p[n];n++)this.pb(e,k,m)}var p;for(c=0,p;p=b[c];c++)this.Xc(p.ba,p.onEmpty);this.S=function(q){if(q.ctrlKey)return j;if(d.h.ta)return j;var r=d.xb(q.keyCode,q.charCode);if(r)return r()};document.addEventListener("keypress",this.S,j)};var u=function(a){this.d=a;this.va=1.5;this.padding=-1;this.Kd=0;this.la=a.G();this.f=this.la.createElement("span");this.f.style.backgroundColor="#CCE6FF";this.f.style.borderColor="#0000CC";this.f.style.borderWidth="medium";this.f.style.borderStyle="groove";this.f.style.position="absolute";this.f.style.display="none";this.la.body.appendChild(this.f);this.rb=function(){}};u.Lc={de:0,jc:1};
u.prototype.view=function(a){while(this.f.firstChild)this.f.removeChild(this.f.firstChild);if(a===i){this.f.style.display="none";return}var b=0,d=0,c=a;if(c.offsetParent){b=c.offsetLeft;d=c.offsetTop;c=c.offsetParent;while(c!==i){b+=c.offsetLeft;d+=c.offsetTop;c=c.offsetParent}}this.f.appendChild(a.cloneNode(j));this.f.style.top=d+"px";this.f.style.left=b+"px";this.f.style.zIndex=999;this.f.style.display="block";this.Eb()};u.prototype.Rd=function(a){this.va=a;this.Eb()};
u.prototype.Eb=function(){this.la.body.removeChild(this.f);this.vd();this.gd();this.Tc();this.la.body.appendChild(this.f);this.rb&&this.rb(this.f);if(this.Kd==u.Lc.jc){var a=this;window.setTimeout(function(){a.f.scrollIntoView(j)},0)}};u.prototype.Tc=function(){if(this.padding<0)return;var a="//*[not(.//*)]",b=this.d.m(a,this.f);for(var d=0,c;c=b[d];d++)c.style.padding=this.padding+"px"};
u.prototype.gd=function(){var a=this.f.getElementsByTagName("img");for(var b=0,d;d=a[b];b++){if(!d.hasAttribute("Axs_OrigHeight")){d.setAttribute("Axs_OrigHeight",d.height);d.setAttribute("Axs_OrigWidth",d.width)}d.height=d.getAttribute("Axs_OrigHeight")*this.va;d.width=d.getAttribute("Axs_OrigWidth")*this.va}};u.prototype.vd=function(){var a=this.va*0.52;this.f.style.fontSizeAdjust=a;var b=this.f.getElementsByTagName("*");for(var d=0,c;c=b[d];d++)c.style.setProperty("line-height","normal","important")};var y=function(a){var b="http://google-axsjax.googlecode.com/svn/trunk/";this.fd=b+"common/earcons/axsEarcons.swf?sound=";this.B=i;this.ra=a;this.bb=b+"thirdparty/soundmanager2/";this.n=i;this.R=h;this.Rb="minimal";this.oa=h;this.Ra=0};
y.prototype.Qa=function(){if(this.ra)return;if(this.R)return;if(this.oa)return;this.oa=j;this.Ra=0;if(this.n!==i){this.n.parentNode.removeChild(this.n);this.n=i}this.n=document.createElement("iframe");var a=document.location.toString();if(a.indexOf("#")!=-1)a=a.substring(0,a.indexOf("#"));this.n.src=this.bb+"AxsJAX_SM2_Linker.html#Verbosity="+this.Rb+",Parent="+a;this.n.width="0%";this.n.height="0%";this.n.style.top="-1000";this.n.style.left="-1000";this.n.style.position="absolute";document.getElementsByTagName("body")[0].appendChild(this.n);
this.sb()};y.prototype.sb=function(){if(document.location.hash=="#InitSuccess"){this.R=j;this.oa=h;return}if(this.Rb=="none"&&this.Ra>0){this.R=j;this.oa=h;return}var a=this;window.setTimeout(function(){a.sb()},100);this.Ra++};y.prototype.play=function(a){var b=this.Ed(a);if(this.ra||b)return;if(!this.R){this.Qa();var d=this;window.setTimeout(function(){d.play(a)},500);return}this.n.src=this.bb+"AxsJAX_SM2_Linker.html#AxsSoundCmd=Play("+a+")"};
y.prototype.stop=function(){if(this.B){this.B.parentNode.removeChild(this.B);this.B=i}if(this.ra)return;if(!this.R)return;this.n.src=this.bb+"AxsJAX_SM2_Linker.html#AxsSoundCmd=Stop()"};y.prototype.getTime=function(){if(this.ra)return-1;if(!this.R)return-1;var a="Time=",b=unescape(document.location.hash);if(b.indexOf(a)==-1)return-1;var d=b.indexOf(a)+a.length,c=parseInt(b.substring(d),10);return c};
y.prototype.Ed=function(a){var b="";switch(a){case "alert":b="alert";break;case "deselect":b="deselect";break;case "item":b="item";break;case "list":b="list";break;case "select":b="select";break;case "success":b="success";break;case "wrap":b="wrap";break;default:}if(b==="")return;if(this.B===i){this.B=document.createElement("embed");this.B.height=0;this.B.width=0;document.body.appendChild(this.B)}this.B.src=this.fd+b};var z=function(a,b){this.$=a;this.r=i;this.k=i;this.A=i;this.o=i;this.tb=i;this.qa="Enter Completion";this.Bd="No completions found";this.Z=i;this.F=[];this.xd={};this.j=-1;this.Ab=h;this.$a=h;this.Ha="#000000";this.Ia=0;this.sd={};this.sa={};this.fe={};if(b&&z.ca)this.Z=b;var d=this;this.Y(window,z.Ca.Hc,function(c){d.Dd.call(d,c)},i)};z.Xb=/^\<[A-Z|a-z|0-9|\-|\_]+\>$/;z.sc=/^(\s|\r|\n)+/;z.Ic=/(\s|\r|\n)+$/;
z.prototype.Y=function(a,b,d,c){if(z.ca&&d)a.addEventListener(b,d,j);else z.s&&d&&a.attachEvent(b,function(g){d(g)});if(c){var e=new z.eb(c),f=this;this.Y(a,b,function(g){e.rd(g,e,f)},i)}};
z.prototype.cd=function(a,b,d,c,e,f){var g=this,k,m,n,p,q;this.r&&this.r.parentNode.removeChild(this.r);do{k="completionField_"+Math.floor(Math.random()*1001);m="txt_"+k;p="div_"+k;q="bgdiv_"+k;n=document.getElementById(k)}while(n);var r=document.createElement("div");r.id=q;r.style.display="none";var s=document.createElement("div");s.id=k;s.style.position="absolute";var t=document.createElement("input");t.type="text";t.id=m;t.size=b;t.value="";t.onkeypress=function(v){v.stopPropagation();if(v.keyCode==
z.H.Da)return h};t.readOnly=f;if(f)t.style.fontSize=0;var x=document.createElement("div");x.id=p;x.setAttribute("tabindex",0);x.setAttribute("role","row");s.appendChild(x);s.appendChild(t);a.appendChild(r);a.appendChild(s);this.r=s;this.k=t;this.A=r;this.tb=x;this.r.className="pkHiddenStatus";this.k.className="pkOpaqueCompletionText";this.A.className="pkBackgroundHide";if(e){this.F=e;this.xd[this.$]=[e,this.qa];this.e=this.F;for(var w=0,B;B=this.F[w];w++)this.sa[B.toLowerCase()]=w;this.j=-1}this.Y(this.k,
z.Ca.ia,function(v){g.qd.call(g,v,c,d)},i);this.Y(this.k,z.Ca.ha,function(v){g.pd.call(g,v)},i);this.Y(this.k,"blur",function(){g.Ab&&g.Qb("hidden")},i)};z.prototype.Md=function(a){this.Ab=a};z.prototype.Pd=function(a){this.qa=a};z.prototype.Od=function(a){this.F=a;this.e=this.F;this.sa={};for(var b=0,d;d=this.F[b];b++)this.sa[d.toLowerCase()]=b;this.j=-1};
z.prototype.Qb=function(a,b,d,c){if(a=="visible"){this.r.className=="pkHiddenStatus"&&this.U(this.qa);this.ab(this.$a,this.Ha,this.Ia);this.r.className="pkVisibleStatus";var e=this.k;window.setTimeout(function(){e.focus()},0)}else if(a=="hidden"){if(z.s&&this.o)this.o.innerText="";else if(this.o)this.o.textContent="";this.ab(h,this.Ha,this.Ia);this.r.className="pkHiddenStatus";this.k.value="";this.j=-1}if(b){var f=z.yb();d||(d=f.height-this.r.offsetHeight);c||(c=0);this.r.style.top=d;this.r.style.left=
c}};z.prototype.Dd=function(){var a=this;window.setTimeout(function(){a.$a&&a.A.style.display=="block"&&a.ab(a.$a,a.Ha,a.Ia)},0)};
z.prototype.qd=function(a,b,d){if(this.k.value.length===0)this.e=this.F;if(a.keyCode!=z.H.ia&&a.keyCode!=z.H.ha&&a.keyCode!=z.H.W&&a.keyCode!=z.H.Da)if(this.k.value.length){this.e=this.zb(this.F,this.k.value,50);this.j=-1;if(this.e.length>0){this.U(this.e[0]);this.j=0}else this.U(this.Bd)}else this.U(this.qa);if(a.keyCode==z.H.W){if(this.k.readOnly)return;if(this.e&&this.e.length>0&&this.k.value!=this.e[this.j]&&(this.e[this.j].indexOf("<")<0||this.e[this.j].indexOf("<")>=0&&this.e[this.j].split(" ").length>
this.k.value.split(" ").length))this.Nb();var c=this.k.value,e=(z.s?this.o.innerText:this.o.textContent).toLowerCase(),f=e.indexOf("<"),g;if(f>=0){g=c.substr(0,f-1).toLowerCase();c=g+" "+c.substr(f)}else{c=c.toLowerCase();g=c}var k=h;if(b)k=this.Sc.call(this,c,e,b);if(d&&!k){var m=this.wb(c,e);d(g,this.sa[e],this.sd[e],m)}this.k.value=""}};
z.prototype.pd=function(a){if(a.keyCode==z.H.ia&&this.e&&this.e.length>0)this.Gd();else if(a.keyCode==z.H.ha&&this.e&&this.e.length>0)this.Ad();else a.keyCode==z.H.Da&&this.e&&this.e.length>0&&this.Nb()};z.prototype.ab=function(a,b,d){if(a){this.A.className="pkBackgroundShow";this.A.style.display="block";var c=z.yb();this.A.style.width=c.width+"px";this.A.style.height=c.height+"px";if(b)this.A.style.backgroundColor=b;d&&this.A.style.setProperty("-moz-opacity",d/100,"")}else this.A.style.display="none"};
z.prototype.zb=function(a,b,d){var c=a,e=a,f=b.split(" ");for(var g=0,k;k=f[g];g++){e=c;c=[];if(k!==""){var m=z.Jd(k),n=new RegExp("(^|\\W+)"+m,"i");for(var p=0,q;q=e[p];p++)String(q).match(n)&&c.push(q)}}e=a;for(p=0;q=e[p];p++){var r=q.split(" "),s=[],t;for(g=0;t=r[g];g++){if(t.charAt(0)=="<")break;s.push(t)}var x=s.join(" ");b.indexOf(x)===0&&c.push(q)}c.length>d&&c.slice(0,d-1);return c};
z.prototype.wb=function(a,b){a=a.replace(/\s+/g," ");b=b.replace(/\s+/g," ");var d=b.indexOf("<");if(d<0)return[];b=b.substr(d);a=a.substr(d);var c=a.split(","),e=b.split(",");if(c.length!=e.length)return[];var f=[];for(var g=0,k,m;(k=c[g])&&(m=e[g]);g++){k=z.Cb(z.Lb(k));m=z.Cb(z.Lb(m));m.match(z.Xb)&&f.push(k)}return f};z.prototype.Sc=function(a,b,d){this.wb(a,b);var c=d[b];if(c&&c[this.$]){var e=c[this.$]+"(args);";window.setTimeout(e,0);return j}else return h};
z.prototype.Gd=function(){if(this.j<0)this.j=0;this.j=(this.j||this.e.length)-1;this.j>=0&&this.U(this.e[this.j])};z.prototype.Ad=function(){this.j=(this.j+1)%this.e.length;this.j<this.e.length&&this.U(this.e[this.j])};z.prototype.Nb=function(){this.k.value=this.e[this.j>=0?this.j:0];this.e=this.zb(this.F,this.k.value,50);this.Z&&z.ca&&this.Z.u(this.k.value);this.j=0};
z.prototype.U=function(a){if(!this.o){this.o=document.createElement("div");this.o.id="listElem_"+Math.floor(Math.random()*1001);this.tb.appendChild(this.o)}if(z.s)this.o.innerText=a;else this.o.textContent=a;this.Z&&z.ca&&this.Z.za(this.o,h)};z.prototype.Za=function(){z.Za()};z.eb=function(a){this.Ea=a};
z.eb.prototype.rd=function(a,b,d){if(!b.Ea)return;if(a.keyCode){var c=""+a.keyCode,e=String.fromCharCode(a.keyCode).toLowerCase();if(a.ctrlKey){c="Ctrl+"+c;e="Ctrl+"+e}if(a.altKey){c="Alt+"+c;e="Alt+"+e}if(a.shiftKey){c="Shift+"+c;e="Shift+"+e}var f=i;f=b.Ea[e];f||(f=b.Ea[c]);if(f){var g=f[d.$]?f[d.$]:f["*"];g&&g()}}};z.Pc=function(a,b){this.width=a?a:undefined;this.height=b?b:undefined};z.Cb=function(a){return a.replace(z.sc,"")};z.Lb=function(a){return a.replace(z.Ic,"")};
z.Jd=function(a){return String(a).replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g,"\\$1").replace(/\x08/g,"\\x08")};
z.yb=function(){var a=0,b=0;if(typeof window.innerWidth=="number"){a=window.innerWidth;b=window.innerHeight}else if(document.documentElement&&(document.documentElement.clientWidth||document.documentElement.clientHeight)){a=document.documentElement.clientWidth;b=document.documentElement.clientHeight}else if(document.body&&(document.body.clientWidth||document.body.clientHeight)){a=document.body.clientWidth;b=document.body.clientHeight}return new z.Pc(a,b)};z.s=h;z.ca=h;
z.Nd=function(){var a=navigator.userAgent.toLowerCase();z.ca=a.indexOf("gecko")!=-1;z.s=a.indexOf("msie")!=-1&&a.indexOf("opera")==-1};z.Nd();z.Ca={ia:z.s?"onkeyup":"keyup",ha:z.s?"onkeydown":"keydown",ce:z.s?"onkeypress":"keypress",Zd:z.s?"onclick":"click",Hc:z.s?"onresize":"resize",be:z.s?"onfocus":"focus",Yd:"blur"};z.dd=".pkHiddenStatus {display: none; position: absolute;}.pkVisibleStatus {display: block; position: absolute; left: 2px; top: 2px; line-height: 1.2em; z-index: 10001; background-color: #000000; padding: 2px; color: #fff; font-family: Arial, Sans-serif; font-size: 20px; filter: alpha(opacity=80); -moz-opacity: .80;}.pkOpaqueCompletionText {border-style: none; background-color:transparent; font-family: Arial, Helvetica, sans-serif; font-size: 35px; font-weight: bold; color: #fff; width: 1000px; height: 50px;}.pkBackgroundShow {position: absolute; width: 0px;height: 0px; background-color: #000000; filter: alpha(opacity=70);  -moz-opacity: .70; left: 0px; top: 0px; z-index: 10000;}";
z.Za=function(){var a,b;a=document.getElementsByTagName("head")[0];if(!a)return;b=document.createElement("style");b.type="text/css";b.innerHTML=z.dd;a.appendChild(b)};z.H={ia:38,ha:40,W:13,Da:9};var axsFinance={};axsFinance.oc="The following shortcut keys are available. ";
axsFinance.a={ib:"or",Kc:". Status",Gc:"Rate",ac:"Date",ja:" up by ",Mc:"+",ga:" down by ",fc:"-",Bc:" percent",Cc:"%",vc:" million",wc:"M",Ub:" billion",Vb:"B",Wb:"Change",hb:"Market cap",ic:"Example",bc:"Definition",hb:"Market cap",uc:"Mkt Cap:",Ec:"Price earnings ratio",Fc:"P/E:",kc:"Forward price to earnings ratio",lc:"F P/E:",Nc:"Volume",Oc:"Vol:",Qc:"Fifty two week",Rc:"52Wk",Sb:"Average volume",Tb:"Avg Vol:",yc:"-",xc:"Not available",qc:"Institutional Ownership",rc:"Inst. Own:",gc:"E P S",
hc:"EPS:"};axsFinance.lb="id('md')//span[@class='pr']/..";axsFinance.wd=new Array(axsFinance.a.Gc,axsFinance.a.Wb,axsFinance.a.ib,axsFinance.a.ac);axsFinance.t={};axsFinance.t[axsFinance.a.uc]=axsFinance.a.hb;axsFinance.t[axsFinance.a.Rc]=axsFinance.a.Qc;axsFinance.t[axsFinance.a.yc]=axsFinance.a.xc;axsFinance.t[axsFinance.a.Fc]=axsFinance.a.Ec;axsFinance.t[axsFinance.a.lc]=axsFinance.a.kc;axsFinance.t[axsFinance.a.Oc]=axsFinance.a.Nc;axsFinance.t[axsFinance.a.Tb]=axsFinance.a.Sb;
axsFinance.t[axsFinance.a.rc]=axsFinance.a.qc;axsFinance.t[axsFinance.a.hc]=axsFinance.a.gc;axsFinance.Ja={};axsFinance.Ja[axsFinance.a.fc]=axsFinance.a.ga;axsFinance.Ja[axsFinance.a.Mc]=axsFinance.a.ja;axsFinance.pa={};axsFinance.pa[axsFinance.a.Vb]=axsFinance.a.Ub;axsFinance.pa[axsFinance.a.wc]=axsFinance.a.vc;axsFinance.pa[axsFinance.a.Cc]=axsFinance.a.Bc;axsFinance.Yb='<cnr next="RIGHT l" prev="LEFT h">  <target title="Stock screener" hotkey="s">    //a[@href="/finance/stockscreener"]  </target>  <target title="Read current quote" hotkey="q"      action="CALL:axsFinance.readCurrentQuote">    /html"]  </target>  <list title="Market data" next="DOWN j" prev="UP k" fwd="n" back="p">    <item action="CALL:axsFinance.readCurrentQuote">      id("md")//span[@class="pr"]/..    </item>    <item action="CALL:axsFinance.readMarketDataItem">      id("md")//tr/td[@class="key"]    </item>    <item action="CALL:axsFinance.readAfterHours">      id("md")//tr//nobr    </item>    <target title="Go to section" trigger="listEntry">      id("companyheader")    </target>  </list>  <list title="News" next="DOWN j" prev="UP k" fwd="n" back="p" type="dynamic">    <item action="CALL:axsFinance.readNewsDesc">      id("newsmovingdiv")//div[@class="inner"]//tbody    </item>    <item>      id("older_news_link")//following-sibling::a[not(./img)]    </item>    <target title="Go to link" hotkey="ENTER">      .//ancestor-or-self::a    </target>    <target title="Related articles" hotkey="r" onEmpty="No related        articles available">      .//a[@class="g bld" or @class="rl" or @class="rg"]    </target>    <target title="Go to section" trigger="listEntry">      id("news_tab_title")    </target>  </list>  <list title="Blogs" next="DOWN j" prev="UP k" fwd="n" back="p" type="dynamic">    <item action="CALL:axsFinance.readBlogsDesc">      //div[@class="rss-item"]    </item>    <target title="Go to blog" hotkey="ENTER">      .//a[./img[@class="rssSprite"]]    </target>    <target title="Go to section" trigger="listEntry">       id("blogs_tab_title")    </target>  </list>  <list title="Feeds" next="DOWN j" prev="UP k" fwd="n" back="p" type="dynamic">    <item action="CALL:axsFinance.readFeedExampleDesc">      //div[./div[contains(@id, "rss-feed-item-snippet")]          and not(.//b)]    </item>    <item action="CALL:axsFinance.readFeedSearchResDesc">      //div[./div[contains(@id, "rss-feed-item-snippet")]         and .//b]    </item>    <item action="CALL:axsFinance.readBlogsDesc">      //div[@id="plot_feed_div_cont"]//          div[@class="rss-item"]    </item>    <target title="Go to feed source" hotkey="g">      .//a[@class="g"]    </target>    <target title="Try this example" hotkey="t">      .//a[not(@class)]    </target>    <target title="Go to feed" hotkey="ENTER"        onEmpty="The current item is not a feed">      .//a[./img[@class="rssSprite"]]    </target>    <target title="Feed search" hotkey="s"        action="CALL:axsFinance.focusOnSearchBox">      id("rss_query_box")    </target>    <target title="Go to section" trigger="listEntry">      id("plot_feeds_title")    </target>  </list>  <list title="Discussions" next="DOWN j" prev="UP k" fwd="n" back="p">    <item>      id("groups")//div[@class="item"]    </item>    <target title="Go to link" hotkey="ENTER">      .//a    </target>    <target title="Go to section" trigger="listEntry">      id("groups")/div[@class="hdg"]    </target>  </list>  </cnr>';
axsFinance.d=i;axsFinance.z=i;axsFinance.na=i;axsFinance.qb=i;axsFinance.Ib=i;axsFinance.ud=2.5;axsFinance.Mb=h;axsFinance.Ba=300;axsFinance.aa={};
axsFinance.Qa=function(){axsFinance.d=new l(j);axsFinance.z=new o(axsFinance.d);axsFinance.z.yd(axsFinance.Yb,i);axsFinance.na=new u(axsFinance.d);axsFinance.z.Qd(axsFinance.na);axsFinance.na.Rd(axsFinance.ud);axsFinance.qb=new y(j);axsFinance.z.Td(axsFinance.qb);axsFinance.Ib=new z("list",axsFinance.d);axsFinance.z.Sd(axsFinance.Ib,".");document.addEventListener("keypress",axsFinance.S,j);var a=axsFinance.ec;document.addEventListener("DOMSubtreeModified",a,j);var a=axsFinance.dc;document.addEventListener("DOMNodeInserted",
a,j);var b=document.getElementById("searchbox");b.addEventListener("focus",axsFinance.Ld,h);window.setTimeout(axsFinance.Vd,200)};axsFinance.ec=function(a){var b=a.target;if(b.id=="ac-list")axsFinance.Uc(a);else b.className=="goog-tab-selected"&&axsFinance.Kb(a)};axsFinance.Uc=function(a){var b=a.target;for(var d=0,c;c=b.childNodes[d];d++)if(c.className=="selected"){axsFinance.d.za(c);return}};
axsFinance.Wc=function(){var a='//div[@id="feed_list_title" and .//ancestor::div[contains(@id, "_div_cont") and not(contains(@style, "display: none"))]]',b=axsFinance.d.m(a,document.body);if(b.length>0){var d=b[0].textContent;axsFinance.d.u(d);axsFinance.d.C.blur()}};axsFinance.dc=function(a){var b=a.target;b.parentNode.parentNode.parentNode.id=="scrollingListTd"&&axsFinance.Kb(a)};axsFinance.Kb=function(a){var b=function(){axsFinance.Hd();axsFinance.Wc()};axsFinance.hd(b,a)};
axsFinance.Ld=function(a){if(!axsFinance.Mb){axsFinance.d.u(" ");a.target.blur()}};axsFinance.Vd=function(){var a="",b='id("companyheader")//h1',d=axsFinance.d.m(b,document.body),c=axsFinance.d.m(axsFinance.lb,document.body);a=d[0].textContent+" ";a=a+axsFinance.Hb(c[0]);axsFinance.M(c[0],a)};axsFinance.readMarketDataItem=function(a){var b=a.i,d=".//following-sibling::td[1]",c=axsFinance.d.m(d,b)[0],e=axsFinance.L(b.textContent),f=axsFinance.L(c.textContent),g=e+" "+f+".";axsFinance.M(b,g)};
axsFinance.readAfterHours=function(a){var b="",d=a.i,c=d.childNodes[0].textContent;c=axsFinance.L(c);c=c+" "+axsFinance.a.ib+" ";var e=d.childNodes[2].textContent;e=axsFinance.L(e);e=e+", ";var f=d.childNodes[4].textContent;b=c+e+f;axsFinance.M(d,b)};axsFinance.readCurrentQuote=function(){var a=axsFinance.d.m(axsFinance.lb,document.body),b=axsFinance.Hb(a[0]);axsFinance.M(a[0],b)};
axsFinance.Hb=function(a){var b="",d=a.childNodes[1].textContent;d=axsFinance.L(d)+", ";var c=a.childNodes[4].textContent;c=axsFinance.L(c)+" ";var e=a.childNodes[6].textContent;e=axsFinance.L(e)+", ";var f=a.childNodes[8].textContent;f=f.replace(" -",axsFinance.a.Kc);f=axsFinance.L(f)+", ";var g="";if(a.childNodes.length>9)g=a.childNodes[9].textContent;var k=new Array(d,c,e,f,g);b=axsFinance.$c(k,axsFinance.wd);return b};
axsFinance.readNewsDesc=function(a){var b=a.i,d="",c='.//td[@class="title" or @class="source"]',e=axsFinance.d.m(c,b);d=e[0].textContent+". ";d=d+e[1].childNodes[0].textContent;d=d+e[1].childNodes[1].textContent;axsFinance.M(a.i,d)};axsFinance.readBlogsDesc=function(a){var b=a.i,d='.//div[@class="content"]',c=axsFinance.d.m(d,b)[0];d='.//div[@class="date"]';var e=axsFinance.d.m(d,b)[0],f=c.textContent+" "+e.textContent;axsFinance.M(b,f)};
axsFinance.readFeedExampleDesc=function(a){var b=a.i,d=b.firstChild,c='./div[contains(@id, "rss-feed-item-snippet")]',e=axsFinance.d.m(c,b)[0].firstChild,f=axsFinance.a.ic+". "+d.textContent+" ";f=f+axsFinance.a.bc+". "+e.textContent;axsFinance.M(b,f)};axsFinance.readFeedSearchResDesc=function(a){var b=a.i,d=b.textContent,c=".//a",e=axsFinance.d.m(c,b);for(var f=0,g;g=e[f];f++)d=d.replace(g.textContent,"");axsFinance.M(b,d)};
axsFinance.focusOnSearchBox=function(a){var b=a.i;b.title="Search box";b.focus();b.select()};axsFinance.hd=function(a,b){if(axsFinance.aa[a.toString()]){b.db=(new Date).getTime()+axsFinance.Ba;axsFinance.aa[a.toString()]=b;return}b.db=(new Date).getTime()+axsFinance.Ba;axsFinance.aa[a.toString()]=b;var d=function(){var c=(new Date).getTime(),e=a.toString(),f=axsFinance.aa[e];if(f.db>c){var g=f.db-c;window.setTimeout(d,g)}else{a(f);axsFinance.aa[a.toString()]=i}};window.setTimeout(d,axsFinance.Ba)};
axsFinance.M=function(a,b){axsFinance.na.view(a);axsFinance.d.u(b);a.scrollIntoView(j);axsFinance.d.Sa(a)};axsFinance.$c=function(a,b){if(a===i)return"";var d="";for(var c=0;a[c];c++){if(b!==i&&c<b.length)d=d+" "+b[c];d=d+" "+a[c]}if(b!==i&&c<b.length)d=d+" "+b[c];return d};axsFinance.Hd=function(){var a=axsFinance.z.Q();axsFinance.z.Id(a.title)};
axsFinance.L=function(a){var b="";if(a==="")return a;a=axsFinance.Cd(a);var d=axsFinance.t[a];if(d!=undefined)return d;var c=a.split(" ");for(var e=0,f;f=c[e];e++){var g=axsFinance.t[f];if(g!=undefined)f=g;else{if(f.length>0&&f.charAt(0)==="(")f=f.substring(1);if(f.length>1&&f.charAt(f.length-1)===")")f=f.substring(0,f.length-1);var k=axsFinance.Ja[f.charAt(0)];if(k!=undefined)f=k+" "+f.substring(1);var m=f.charAt(f.length-1),n=axsFinance.pa[m];if(n!=undefined)f=f.substring(0,f.length-1)+" "+n}b=
b+" "+f}return b};axsFinance.Cd=function(a){a=a.replace(/^\s\s*/,"").replace(/\s\s*$/,"");a=a.replace(/\s+/g," ");return a.replace(/\n+/g,"").replace(/\r+/g,"")};axsFinance.S=function(a){if(a.ctrlKey)return j;if(a.keyCode==27){axsFinance.d.C.blur();return h}if(axsFinance.d.ta)return j;a.charCode==46&&axsFinance.z.Ob();var b=axsFinance.ad[a.charCode];if(b)return b();return j};
axsFinance.ad={47:function(){axsFinance.Mb=j;document.getElementById("searchbox").focus();document.getElementById("searchbox").select();return h},63:function(){var a=axsFinance.oc+axsFinance.z.td()+axsFinance.z.nd();axsFinance.d.u(a);return h}};window.addEventListener("load",axsFinance.Qa,j);
 })();

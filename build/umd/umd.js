!function(t,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define("react-ufo",[],r):"object"==typeof exports?exports["react-ufo"]=r():t["react-ufo"]=r()}("undefined"!=typeof self?self:this,function(){return function(t){function r(e){if(n[e])return n[e].exports;var o=n[e]={i:e,l:!1,exports:{}};return t[e].call(o.exports,o,o.exports,r),o.l=!0,o.exports}var n={};return r.m=t,r.c=n,r.d=function(t,n,e){r.o(t,n)||Object.defineProperty(t,n,{configurable:!1,enumerable:!0,get:e})},r.n=function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return r.d(n,"a",n),n},r.o=function(t,r){return Object.prototype.hasOwnProperty.call(t,r)},r.p="/",r(r.s=2)}([function(t,r){t.exports=require("react")},function(t,r,n){"use strict";function e(t,r,n,e,o,u,i){try{var c=t[u](i),a=c.value}catch(t){return void n(t)}c.done?r(a):Promise.resolve(a).then(e,o)}function o(t){return function(){var r=this,n=arguments;return new Promise(function(o,u){function i(t){e(a,o,u,i,c,"next",t)}function c(t){e(a,o,u,i,c,"throw",t)}var a=t.apply(r,n);i(void 0)})}}function u(t,r){return a(t)||c(t,r)||i()}function i(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function c(t,r){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)){var n=[],e=!0,o=!1,u=void 0;try{for(var i,c=t[Symbol.iterator]();!(e=(i=c.next()).done)&&(n.push(i.value),!r||n.length!==r);e=!0);}catch(t){o=!0,u=t}finally{try{e||null==c.return||c.return()}finally{if(o)throw u}}return n}}function a(t){if(Array.isArray(t))return t}var f=n(0),l=(n.n(f),n(5)),s=function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=r.defaultLoading,e=void 0!==n&&n,i=Object(f.useState)(e),c=u(i,2),a=c[0],s=c[1],v=Object(f.useState)(null),b=u(v,2),p=b[0],y=b[1],h=Object(f.useState)(null),w=u(h,2),j=w[0],m=w[1],g=Object(f.useCallback)(o(regeneratorRuntime.mark(function r(){var n,e,o,u,i,c,a,f=arguments;return regeneratorRuntime.wrap(function(r){for(;;)switch(r.prev=r.next){case 0:for(n=d(),g.abort=function(){n.abort()},s(!0),m(null),y(null),e=null,o=!1,r.prev=7,u=f.length,i=new Array(u),c=0;c<u;c++)i[c]=f[c];return r.next=11,t.apply(void 0,i.concat([n.signal]));case 11:e=r.sent,r.next=19;break;case 14:r.prev=14,r.t0=r.catch(7),a=null===r.t0||void 0===r.t0?void 0:r.t0.name,"AbortError"!==a&&"Suspend"!==a&&(y(r.t0),s(!1)),o=!0;case 19:o||(m(e),s(!1));case 20:case"end":return r.stop()}},r,null,[[7,14]])})),[t]);return Object(l.a)(function(){return[a,p,j,g]},[a,p,j,g])},d=function(){return window.AbortController?new window.AbortController:{abort:function(){return console.warn("react-ufo: you invocation of `.abort()` will do nothing because no `window.AbortController` was detected in your environment")}}};r.a=s},function(t,r,n){t.exports=n(3)},function(t,r,n){"use strict";Object.defineProperty(r,"__esModule",{value:!0});var e=n(4),o=n(1),u=n(6);n.d(r,"useFetchEffect",function(){return e.a}),n.d(r,"useFetchCallback",function(){return o.a}),n.d(r,"awaitResource",function(){return u.a})},function(t,r,n){"use strict";function e(t,r){return i(t)||u(t,r)||o()}function o(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function u(t,r){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)){var n=[],e=!0,o=!1,u=void 0;try{for(var i,c=t[Symbol.iterator]();!(e=(i=c.next()).done)&&(n.push(i.value),!r||n.length!==r);e=!0);}catch(t){o=!0,u=t}finally{try{e||null==c.return||c.return()}finally{if(o)throw u}}return n}}function i(t){if(Array.isArray(t))return t}var c=n(0),a=(n.n(c),n(1)),f=function(t){var r=Object(a.a)(t,{defaultLoading:!0}),n=e(r,4),o=n[3];return Object(c.useEffect)(function(){return o(),function(){o.abort()}},[o]),r};r.a=f},function(t,r,n){"use strict";var e=n(0),o=(n.n(e),function(t){var r=Object(e.useRef)(null);if(null===r.current)return r.current=t,!0;for(var n=0;n<t.length;n++){var o=r.current[n],u=t[n];if(!Object.is(o,u))return r.current=t,!0}return r.current=t,!1}),u=function(t){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=Object(e.useRef)();return o(r)&&(n.current=t()),n.current};r.a=u},function(t,r,n){"use strict";function e(t,r){return i(t)||u(t,r)||o()}function o(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}function u(t,r){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)){var n=[],e=!0,o=!1,u=void 0;try{for(var i,c=t[Symbol.iterator]();!(e=(i=c.next()).done)&&(n.push(i.value),!r||n.length!==r);e=!0);}catch(t){o=!0,u=t}finally{try{e||null==c.return||c.return()}finally{if(o)throw u}}return n}}function i(t){if(Array.isArray(t))return t}var c=n(7),a=function(t){var r=e(t,3),n=r[0],o=r[1],u=r[2];if(n||o)throw c.a;return u};r.a=a},function(t,r,n){"use strict";var e={name:"Suspend"};r.a=e}])});
//# sourceMappingURL=umd.js.map
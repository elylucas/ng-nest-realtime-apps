"use strict";(self.webpackChunkguide_generator=self.webpackChunkguide_generator||[]).push([[162],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>g});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function l(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?l(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):l(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},l=Object.keys(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)n=l[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),s=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=s(e.components);return r.createElement(p.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,l=e.originalType,p=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=s(n),g=a,m=d["".concat(p,".").concat(g)]||d[g]||c[g]||l;return n?r.createElement(m,o(o({ref:t},u),{},{components:n})):r.createElement(m,o({ref:t},u))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var l=n.length,o=new Array(l);o[0]=d;var i={};for(var p in t)hasOwnProperty.call(t,p)&&(i[p]=t[p]);i.originalType=e,i.mdxType="string"==typeof e?e:a,o[1]=i;for(var s=2;s<l;s++)o[s]=n[s];return r.createElement.apply(null,o)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"},9390:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>o,default:()=>c,frontMatter:()=>l,metadata:()=>i,toc:()=>s});var r=n(7462),a=(n(7294),n(3905));const l={slug:"/"},o="Realtime apps with Angular & NestJS",i={unversionedId:"getting-started",id:"getting-started",title:"Realtime apps with Angular & NestJS",description:"Getting started!!! boo",source:"@site/docs/getting-started.md",sourceDirName:".",slug:"/",permalink:"/",draft:!1,tags:[],version:"current",frontMatter:{slug:"/"},sidebar:"tutorialSidebar",next:{title:"Lab1 - Echo Client",permalink:"/lab1"}},p={},s=[{value:"Getting started!!! boo",id:"getting-started-boo",level:2},{value:"Clone Git repo",id:"clone-git-repo",level:3},{value:"Install dependencies",id:"install-dependencies",level:3},{value:"Start app",id:"start-app",level:3}],u={toc:s};function c(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"realtime-apps-with-angular--nestjs"},"Realtime apps with Angular & NestJS"),(0,a.kt)("h2",{id:"getting-started-boo"},"Getting started!!! boo"),(0,a.kt)("h3",{id:"clone-git-repo"},"Clone Git repo"),(0,a.kt)("p",null,"To begin, clone the starter app from Github:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"git clone https://github.com/elylucas/realtime-ng-nest.git\n")),(0,a.kt)("p",null,"The repo folder contains three folders:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"client"),": The Angular app"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"server"),": The Nest app"),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"guide"),": This guide in md and html formats")),(0,a.kt)("h3",{id:"install-dependencies"},"Install dependencies"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"npm run installdeps\n")),(0,a.kt)("p",null,"This will install the dependencies for both apps."),(0,a.kt)("h3",{id:"start-app"},"Start app"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"npm run start\n")),(0,a.kt)("p",null,"aaabb"),(0,a.kt)("p",null,"This will start both the Angular and Nest apps at the same time. The Angular app\nwill run on port 4200 and the Nest app will be running on port 3000."),(0,a.kt)("p",null,"Next, open the folder in your code editor. You can also open the client and\nserver folder is separate instances of your editor if you choose."))}c.isMDXComponent=!0}}]);
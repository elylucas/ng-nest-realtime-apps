"use strict";(self.webpackChunkguide_generator=self.webpackChunkguide_generator||[]).push([[376],{3905:(e,t,n)=>{n.d(t,{Zo:()=>i,kt:()=>g});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),c=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},i=function(e){var t=c(e.components);return r.createElement(p.Provider,{value:t},e.children)},m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},u=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,i=l(e,["components","mdxType","originalType","parentName"]),u=c(n),g=a,d=u["".concat(p,".").concat(g)]||u[g]||m[g]||o;return n?r.createElement(d,s(s({ref:t},i),{},{components:n})):r.createElement(d,s({ref:t},i))}));function g(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,s=new Array(o);s[0]=u;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l.mdxType="string"==typeof e?e:a,s[1]=l;for(var c=2;c<o;c++)s[c]=n[c];return r.createElement.apply(null,s)}return r.createElement.apply(null,n)}u.displayName="MDXCreateElement"},6191:(e,t,n)=>{n.r(t),n.d(t,{contentTitle:()=>s,default:()=>i,frontMatter:()=>o,metadata:()=>l,toc:()=>p});var r=n(7462),a=(n(7294),n(3905));const o={},s=void 0,l={type:"mdx",permalink:"/ng-nest-realtime-apps/demo1",source:"@site/src/pages/demo1.md",description:"Echo Client Demo",frontMatter:{}},p=[{value:"Echo Client Demo",id:"echo-client-demo",level:2},{value:"Nest Gateway",id:"nest-gateway",level:2},{value:"Angular",id:"angular",level:2},{value:"AppComponent",id:"appcomponent",level:3}],c={toc:p};function i(e){let{components:t,...n}=e;return(0,a.kt)("wrapper",(0,r.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h2",{id:"echo-client-demo"},"Echo Client Demo"),(0,a.kt)("h2",{id:"nest-gateway"},"Nest Gateway"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-shell",metastring:"title='./server'",title:"'./server'"},"nest generate gateway echo\n")),(0,a.kt)("p",null,"update ",(0,a.kt)("inlineCode",{parentName:"p"},"@WebsockeGateway")," to use cors:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=./server/src/echo.gateway.ts",title:"./server/src/echo.gateway.ts"},"@WebSocketGateway({ cors: true })\n")),(0,a.kt)("p",null,"update ",(0,a.kt)("inlineCode",{parentName:"p"},"handleMessage")," to add types to params and return payload"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=./server/src/echo.gateway.ts",title:"./server/src/echo.gateway.ts"},"import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';\nimport { Socket } from 'socket.io';\n\n@WebSocketGateway()\nexport class EchoGateway {\n  @SubscribeMessage('message')\n  handleMessage(client: Socket, payload: string): string {\n    return payload;\n  }\n}\n")),(0,a.kt)("h2",{id:"angular"},"Angular"),(0,a.kt)("h3",{id:"appcomponent"},"AppComponent"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"import socket.io-client")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=./client/src/app/app.component.ts",title:"./client/src/app/app.component.ts"},"import { io } from 'socket.io-client';\n")),(0,a.kt)("p",null,"create class members"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=./client/src/app/app.component.ts",title:"./client/src/app/app.component.ts"},"export class AppComponent {\n  message = '';\n  returnedResponses: string[] = [];\n  socket = io('http://localhost:3000');\n}\n")),(0,a.kt)("p",null,"add sendmessage:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-ts",metastring:"title=./client/src/app/app.component.ts",title:"./client/src/app/app.component.ts"},"sendMessage() {\n  this.socket.emit('message', this.message, (msg: string) => {\n    this.returnedResponses.push(msg)\n  });\n}\n")),(0,a.kt)("p",null,"update template:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-html",metastring:"title=./client/src/app/app.component.html",title:"./client/src/app/app.component.html"},'<div>\n  <label\n    >Message\n    <input type="text" name="messasge" [(ngModel)]="message" />\n  </label>\n  <button type="button" (click)="sendMessage()">Send</button>\n  <ul>\n    <li *ngFor="let message of returnedResponses">{{ message }}</li>\n  </ul>\n</div>\n')))}i.isMDXComponent=!0}}]);
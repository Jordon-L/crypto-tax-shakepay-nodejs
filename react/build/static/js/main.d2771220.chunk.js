(this["webpackJsonpreact-flask-app"]=this["webpackJsonpreact-flask-app"]||[]).push([[0],{122:function(e,t,a){},123:function(e,t,a){},156:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),l=a(11),i=a.n(l),s=(a(122),a(93)),r=a(94),o=a(101),j=a(100),d=a(13),b=a(63),u=(a(123),a(95)),O=a.n(u),h=a(202),x=a(211),p=a(212),m=a(215),C=a(214),f=a(210),T=a(230),g=a(213),S=a(216),y=a(104),v=a(227),N=a(209),k=a(224),w=a(220),F=a(221),B=a(223),E=a(222),G=a(232),D=a(207),H=a(208),P=a(206),A=a(96),I=a(233),W=a(225),L=a(226),M=a(98),J=a.n(M),Y=a(99),z=a(16),R=a(228),U=a(5),V=Object(h.a)((function(e){var t;return{root:{width:"100%"},button:{color:"#F7F7F7",background:"black",textTransform:"capitalize","&:hover":{backgroundColor:"black"}},instructions:{marginTop:e.spacing(1),marginBottom:e.spacing(1)},grid:Object(b.a)({},e.breakpoints.down("sm"),{width:"100%"}),inputCard:(t={display:"flex",flexDirection:"column",alignItems:"center"},Object(b.a)(t,e.breakpoints.up("md"),{width:"960px"}),Object(b.a)(t,e.breakpoints.down("sm"),{width:"100%"}),t),inputCardAction:{flexGrow:1,display:"flex",flexDirection:"column"},table:{width:"1500px"},disabledAccordion:{backgroundColor:"#fff !important"},disabledAccordionSummary:{opacity:"1 !important"},moreDetail:{marginLeft:"0.5em"}}}));function q(e){var t=e.openTable,a=e.onCloseTable,c=e.data,l=e.columns,i=V(),s=Object(n.useState)(0),r=Object(d.a)(s,2),o=r[0],j=r[1],b=Object(n.useState)(10),u=Object(d.a)(b,2),O=u[0],h=u[1],y=O-Math.min(O,c.length-o*O);return Object(U.jsxs)(G.a,{onClose:a,maxWidth:"1500px",open:t,children:[Object(U.jsx)(P.a,{id:"simple-dialog-title",children:"Transaction Table"}),Object(U.jsxs)(D.a,{children:[Object(U.jsx)(H.a,{children:"Shakingsats is not displayed, but is calculated as Income"}),Object(U.jsx)(A.CSVLink,{data:c,filename:"transactionTable.csv",children:Object(U.jsx)(N.a,{className:i.button,variant:"contained",component:"label",children:"Download"})}),Object(U.jsx)(f.a,{className:i.table,children:Object(U.jsxs)(x.a,{stickyHeader:!0,"aria-label":"transaction table",children:[Object(U.jsx)(p.a,{children:Object(U.jsx)(g.a,{children:l.map((function(e){return Object(U.jsx)(C.a,{children:e.field},e.title)}))})}),Object(U.jsxs)(m.a,{children:[(O>0?c.slice(o*O,o*O+O):c).map((function(e){return Object(U.jsx)(g.a,{children:l.map((function(t){var a=e[t.field];return Object(U.jsx)(C.a,{children:a},t.title)}))})})),y>0&&Object(U.jsx)(g.a,{style:{height:53*y},children:Object(U.jsx)(C.a,{colSpan:6})})]}),Object(U.jsx)(S.a,{children:Object(U.jsx)(g.a,{children:Object(U.jsx)(T.a,{rowsPerPageOptions:[10,25,{label:"All",value:-1}],count:c.length,rowsPerPage:O,page:o,onChangePage:function(e,t){j(t)},onChangeRowsPerPage:function(e){h(+e.target.value),j(0)}})})})]})})]})]})}function K(e){var t=e.openDetail,a=e.onCloseDetail,n=e.taxInfo;return Object(U.jsxs)(G.a,{onClose:a,maxWidth:"1500px",open:t,children:[Object(U.jsx)(P.a,{children:"Breakdown of Capital Gain"}),Object(U.jsx)(D.a,{children:Object(U.jsx)(H.a,{children:n.capitalGain})})]})}function Q(){var e,t=Object(n.useState)(null),l=Object(d.a)(t,2),i=l[0],s=l[1],r=Object(n.useState)(null),o=Object(d.a)(r,2),j=o[0],b=o[1],u=Object(n.useState)(null),h=Object(d.a)(u,2),x=h[0],p=h[1],m=Object(n.useState)([]),C=Object(d.a)(m,2),f=C[0],T=C[1],g=Object(n.useState)([]),S=Object(d.a)(g,2),G=S[0],D=S[1],H=Object(n.useState)([]),P=Object(d.a)(H,2),A=(P[0],P[1],Object(n.useState)([])),M=Object(d.a)(A,2),Q=(M[0],M[1],Object(n.useState)({})),X=Object(d.a)(Q,2),Z=X[0],$=X[1],_=Object(n.useState)(!1),ee=Object(d.a)(_,2),te=(ee[0],ee[1],Object(n.useState)(!1)),ae=Object(d.a)(te,2),ne=(ae[0],ae[1],Object(n.useState)(!1)),ce=Object(d.a)(ne,2),le=(ce[0],ce[1],Object(n.useState)(!1)),ie=Object(d.a)(le,2),se=ie[0],re=ie[1],oe=Object(n.useState)(!1),je=Object(d.a)(oe,2),de=je[0],be=je[1],ue=Object(n.useState)(!1),Oe=Object(d.a)(ue,2),he=Oe[0],xe=Oe[1],pe=c.a.useState(!1),me=Object(d.a)(pe,2),Ce=me[0],fe=me[1],Te=c.a.useState(!1),ge=Object(d.a)(Te,2),Se=ge[0],ye=ge[1],ve=c.a.useState(!1),Ne=Object(d.a)(ve,2),ke=Ne[0],we=Ne[1],Fe=Object(n.useState)(new Date),Be=Object(d.a)(Fe,2),Ee=Be[0],Ge=Be[1],De=new Date,He=De.getFullYear(),Pe=De.getMonth(),Ae=De.getDate(),Ie=new Date(He-5,Pe,Ae),We=De,Le=V();return e=0===f.length&&0===G.length?Object(U.jsx)("div",{class:"content",children:Object(U.jsx)(w.a,{container:!0,justify:"center",direction:"column",alignItems:"center",children:Object(U.jsx)(w.a,{item:!0,xs:12,className:Le.grid,children:Object(U.jsx)(F.a,{children:Object(U.jsxs)(E.a,{className:Le.inputCard,children:[Object(U.jsxs)(B.a,{className:Le.inputCardAction,children:["Year:",Object(U.jsx)(z.a,{utils:Y.a,children:Object(U.jsx)(R.a,{value:Ee,onChange:Ge,views:["year"],minDate:Ie,maxDate:We})})]}),Object(U.jsx)(y.a,{children:"Shakepay csv file:"}),Object(U.jsx)(B.a,{className:Le.inputCardAction,children:Object(U.jsxs)(N.a,{className:Le.button,variant:"contained",component:"label",children:["Choose File",Object(U.jsx)("input",{id:"fileInput",type:"file",onChange:function(e){var t;s(e.target.files[0]),t=e.target.files[0].name,document.getElementById("selectedFile").innerHTML="Selected File: "+t},hidden:!0})]})}),Object(U.jsx)(y.a,{children:Object(U.jsx)("div",{id:"selectedFile",children:"Selected File: "})}),Object(U.jsx)(B.a,{className:Le.inputCardAction,children:Object(U.jsx)(N.a,{className:Le.button,variant:"contained",color:"primary",onClick:function(){return function(e,t,n,c,l,i,s,r,o,j,d,b){if(null==e||null==j)o(!0),s(!1);else if(null!=t&&null==n||null!=t&&""==n)d(!0),s(!1);else{o(!1),d(!1),b(!1),s(!0);var u=new FormData;u.append("file",new Blob([e],{type:"text/csv"})),t?u.append("wallet",t):u.append("wallet","0"),n?u.append("shakepayWallet",n):u.append("shakepayWallet","0"),u.append("year",j.getFullYear());a(153);O.a.post("/api/tax",u,{headers:{"Content-Type":"multipart/form-data"}}).then((function(e){if(console.log(e.data.error),"true"==e.data.error)b(!0),s(!1);else{!function(e,t,a,n){a(t),n(e)}(e.data.table,e.data.columns,c,l);var t=JSON.parse(e.data.info);i({incomeGain:t.incomeGain,capitalGain:t.capitalGain,totalNumberETH:t.totalNumberETH,totalSalePriceETH:t.totalSalePriceETH,totalCostETH:t.totalCostETH,totalFeesETH:t.totalFeesETH,totalGainsETH:t.totalGainsETH,totalNumberBTC:t.totalNumberBTC,totalSalePriceBTC:t.totalSalePriceBTC,totalCostBTC:t.totalCostBTC,totalFeesBTC:t.totalFeesBTC,totalGainsBTC:t.totalGainsBTC})}}))}}(i,x,j,T,D,$,re,0,be,Ee,we,xe)},children:"Upload "})}),Object(U.jsx)(y.a,{children:Object(U.jsx)("h4",{children:" Optional "})}),"Non-shakepay ethereum data will not be 100% accurate due to limited historical price data available on Coingecko.",Object(U.jsxs)(B.a,{className:Le.inputCardAction,children:["Shakepay Ethereum Wallet: ",Object(U.jsx)("input",{type:"text",name:"shakepayWallet",onChange:function(e){return b(e.target.value)}})]}),Object(U.jsxs)(B.a,{className:Le.inputCardAction,children:["non-Shakepay Ethereum Wallets (comma separated): ",Object(U.jsx)("input",{type:"text",name:"wallet",onChange:function(e){e.target.value;p(e.target.value)}})]}),Object(U.jsxs)(y.a,{children:[se?Object(U.jsx)(k.a,{}):"",de?"No csv selected or year is empty":"",he?"Format incorrect in csv":"",ke?"Fill in Shakepay Wallet address":""]})]})})})})}):Object(U.jsxs)("div",{class:"content",children:[Object(U.jsx)(w.a,{container:!0,justify:"center",direction:"column",alignItems:"center",children:Object(U.jsx)(w.a,{item:!0,xs:12,className:Le.grid,children:Object(U.jsx)(F.a,{className:Le.inputCard,children:Object(U.jsxs)(E.a,{children:[Object(U.jsxs)("div",{children:[Object(U.jsx)(I.a,{disabled:!0,className:Le.disabledAccordion,children:Object(U.jsx)(W.a,{"aria-controls":"panel1a-content",id:"panel1a-header",className:Le.disabledAccordionSummary,children:Object(U.jsxs)(y.a,{children:["Income: ",Z.incomeGain]})})}),Object(U.jsxs)(I.a,{children:[Object(U.jsx)(W.a,{expandIcon:Object(U.jsx)(J.a,{}),"aria-controls":"panel2a-content",id:"panel2a-header",children:Object(U.jsxs)(y.a,{children:["Capital gain: ",Z.capitalGain]})}),Object(U.jsxs)(L.a,{children:[Object(U.jsxs)(y.a,{className:Le.moreDetail,children:["BTC",Object(U.jsxs)(y.a,{children:["Total BTC: ",Z.totalNumberBTC]}),Object(U.jsxs)(y.a,{children:["Total Sale: ",Z.totalSalePriceBTC]}),Object(U.jsxs)(y.a,{children:["Total Cost: ",Z.totalCostBTC]}),Object(U.jsxs)(y.a,{children:["Total Fees: ",Z.totalFeesBTC]}),Object(U.jsxs)(y.a,{children:["Total Gain: ",Z.totalGainsBTC]})]}),Object(U.jsxs)(y.a,{className:Le.moreDetail,children:["ETH",Object(U.jsxs)(y.a,{children:["Total ETH: ",Z.totalNumberETH]}),Object(U.jsxs)(y.a,{children:["Total Sale: ",Z.totalSalePriceETH]}),Object(U.jsxs)(y.a,{children:["Total Cost: ",Z.totalCostETH]}),Object(U.jsxs)(y.a,{children:["Total Fees: ",Z.totalFeesETH]}),Object(U.jsxs)(y.a,{children:["Total Gain: ",Z.totalGainsETH]})]})]})]}),Object(U.jsx)(I.a,{disabled:!0,className:Le.disabledAccordion,children:Object(U.jsx)(W.a,{"aria-controls":"panel3a-content",id:"panel3a-header",className:Le.disabledAccordionSummary,children:Object(U.jsxs)(y.a,{children:["Taxable Income: ",+Z.incomeGain+.5*+Z.capitalGain]})})})]}),Object(U.jsx)(B.a,{className:Le.inputCardAction,children:Object(U.jsx)(N.a,{className:Le.button,variant:"contained",color:"primary",onClick:function(){fe(!0)},children:"Display transaction table "})})]})})})}),Object(U.jsx)(q,{openTable:Ce,onCloseTable:function(){fe(!1)},data:G,columns:f}),Object(U.jsx)(K,{openDetail:Se,onCloseDetail:function(){ye(!1)},taxInfo:Z})]}),Object(U.jsx)(v.a,{disableGutters:!0,maxWidth:"false",children:e})}var X=function(e){Object(o.a)(a,e);var t=Object(j.a)(a);function a(){return Object(s.a)(this,a),t.apply(this,arguments)}return Object(r.a)(a,[{key:"render",value:function(){return Object(U.jsxs)(w.a,{Container:!0,disableGutters:!0,maxWidth:"false",direction:"column",alignItems:"center",id:"website",children:[Object(U.jsxs)(w.a,{item:!0,xs:12,id:"title",children:[Object(U.jsx)("h1",{children:" Crypto gains "}),Object(U.jsx)("h4",{children:" for Shakepay and Ethereum mining"})]}),Object(U.jsx)(w.a,{item:!0,xs:12,id:"results",children:Object(U.jsx)(Q,{})})]})}}]),a}(n.Component),Z=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,237)).then((function(t){var a=t.getCLS,n=t.getFID,c=t.getFCP,l=t.getLCP,i=t.getTTFB;a(e),n(e),c(e),l(e),i(e)}))};i.a.render(Object(U.jsx)(c.a.StrictMode,{children:Object(U.jsx)(X,{})}),document.getElementById("root")),Z()}},[[156,1,2]]]);
//# sourceMappingURL=main.d2771220.chunk.js.map
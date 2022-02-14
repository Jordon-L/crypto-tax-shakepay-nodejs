(this["webpackJsonpreact-flask-app"]=this["webpackJsonpreact-flask-app"]||[]).push([[0],{144:function(e,t,a){},145:function(e,t,a){},185:function(e,t,a){"use strict";a.r(t);var n=a(0),c=a.n(n),i=a(28),l=a.n(i),r=(a(144),a(39)),o=a(40),s=a(50),d=a(49),j=a(91),b=a(8),u=a(3),h=(a(145),a(265)),p=a(275),m=a(266),x=a(276),O=a(277),f=a(260),g=a(261),T=a(119),C=a(268),v=a(116),k=a.n(v),y=a(258),S=a(259),w=a(251),B=a(273),F=a(272),N=a(269),E=a(1),I=Object(T.a)({palette:{primary:{main:"#000000"}}});var H=function(e){Object(s.a)(a,e);var t=Object(d.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(o.a)(a,[{key:"render",value:function(){return Object(E.jsx)(C.a,{theme:I,children:Object(E.jsx)(B.a,{position:"static",color:"primary",children:(e="Crypto Gains",Object(E.jsx)(F.a,{children:Object(E.jsx)(N.a,{variant:"h6",noWrap:!0,component:"div",sx:{flexGrow:1},children:e})}))})});var e}}]),a}(n.Component),G=H,A=a(115),D=a.n(A),L=a(263),P=a(270),W=a(271),R=a(118),z=a.n(R),U=Object(T.a)(),V=Object(g.a)((function(e){var t;return{root:{width:"100%"},buttonCSV:(t={color:"#F7F7F7",background:"#0080FF",textTransform:"capitalize",border:"1px solid transparent",width:"100%",margin:"auto"},Object(u.a)(t,e.breakpoints.up("xl"),{width:"1536px"}),Object(u.a)(t,e.breakpoints.down("xl"),{width:"100%"}),Object(u.a)(t,"&:hover",{border:"1px solid black",background:"#0080FF",filter:"brightness(95%)"}),t),buttonText:{color:"#F7F7F7",background:"black",textTransform:"capitalize","&:hover":{backgroundColor:"black"}},instructions:{marginTop:e.spacing(1),marginBottom:e.spacing(1)},grid:Object(u.a)({margin:"auto",height:"100%"},e.breakpoints.up("xl"),{width:"1536px"}),gridItem:{justifyContent:"center",alignItems:"center",display:"flex",marginBottom:"30px"},gridItemLeft:{marginBottom:"30px",paddingRight:"15px"},gridItemRight:{marginBottom:"30px",paddingLeft:"15px"},inputCard:{display:"flex",flexDirection:"column",alignItems:"center"},inputCardAction:{flexGrow:1,display:"flex",flexDirection:"column"},cardHeight:{height:"100%"},uploadImage:{fontSize:"100px"},helpfulLinks:{color:"White"},table:{width:"1500px"},taxInformation:{marginTop:"30px",marginBottom:"30px"},disabledAccordion:{backgroundColor:"#fff !important"},disabledAccordionSummary:{opacity:"1 !important"},moreDetail:{marginLeft:"0.5em"},downloadButton:{color:"#F7F7F7",background:"black",textTransform:"capitalize","&:hover":{backgroundColor:"black"},marginLeft:"30px"}}}));function Y(e){a(170);a(171).json2csv(e,(function(e,t){if(e)throw e;!function(e){var t=new Blob([e],{type:"text/plain"}),a=URL.createObjectURL(t),n=document.createElement("a");n.download="transactions.csv",n.href=a,n.click()}(t)}))}function J(){var e,t=Object(n.useState)(null),a=Object(b.a)(t,2),i=a[0],l=a[1],r=Object(n.useState)(null),o=Object(b.a)(r,2),s=o[0],d=o[1],u=Object(n.useState)(new Date),g=Object(b.a)(u,2),T=g[0],C=g[1],v=Object(n.useState)(!1),B=Object(b.a)(v,2),F=(B[0],B[1],Object(n.useState)(null)),I=Object(b.a)(F,2),H=I[0],G=I[1],A=Object(n.useState)(null),D=Object(b.a)(A,2),R=D[0],U=D[1],J=Object(n.useState)(!1),_=Object(b.a)(J,2),q=(_[0],_[1]),K=Object(n.useState)(!1),Q=Object(b.a)(K,2),X=(Q[0],Q[1]),Z=Object(n.useState)(!1),$=Object(b.a)(Z,2),ee=($[0],$[1]),te=c.a.useState(!1),ae=Object(b.a)(te,2),ne=(ae[0],ae[1]),ce=Object(n.useState)([]),ie=Object(b.a)(ce,2),le=(ie[0],ie[1]),re=Object(n.useState)([]),oe=Object(b.a)(re,2),se=oe[0],de=oe[1],je=Object(n.useState)({}),be=Object(b.a)(je,2),ue=be[0],he=be[1],pe=Object(n.useState)({}),me=Object(b.a)(pe,2),xe=(me[0],me[1]),Oe=new Date,fe=Oe.getFullYear(),ge=Oe.getMonth(),Te=Oe.getDate(),Ce=new Date(fe-5,ge,Te),ve=Oe,ke=V();return 0===Object.keys(ue).length?e=Object(E.jsxs)(h.a,{container:!0,className:ke.grid,alignItems:"stretch",children:[Object(E.jsx)(h.a,{item:!0,xs:12,className:ke.gridItem,children:Object(E.jsx)(p.a,{children:Object(E.jsxs)(m.a,{className:ke.buttonCSV,variant:"contained",component:"label",children:[Object(E.jsxs)(x.a,{className:ke.inputCard,children:[Object(E.jsx)(k.a,{className:ke.uploadImage}),Object(E.jsx)(O.a,{className:ke.inputCardAction,children:Object(E.jsxs)(m.a,{className:ke.buttonText,variant:"contained",component:"label",children:["Upload your Shakepay CSV file",Object(E.jsx)("input",{type:"file",onChange:function(e){l(e.target.files[0]),d(e.target.files[0].name)},hidden:!0})]})}),Object(E.jsx)("a",{href:"https://help.shakepay.com/en/articles/3336094-where-can-i-see-my-full-transaction-history-on-shakepay",target:"_blank",className:ke.helpfulLinks,children:"How to get Shakepay CSV"})]}),Object(E.jsx)("input",{type:"file",onChange:function(e){l(e.target.files[0]),d(e.target.files[0].name)},hidden:!0})]})})}),Object(E.jsx)(h.a,{item:!0,xs:12,children:s?"Selected File: "+s:"Selected File:"}),Object(E.jsx)(h.a,{item:!0,xs:12,children:Object(E.jsx)(m.a,{className:ke.buttonText,variant:"contained",color:"primary",onClick:function(){return M(i,R,H,le,de,he,q,G,xe,X,T,ne,ee)},children:"Submit "})}),Object(E.jsx)(h.a,{item:!0,xs:6,className:ke.gridItemLeft,children:Object(E.jsx)(p.a,{className:ke.cardHeight,children:Object(E.jsxs)(x.a,{children:["Advance Options",Object(E.jsx)(O.a,{children:Object(E.jsx)(w.b,{dateAdapter:S.a,children:Object(E.jsx)(y.a,{label:"Year",value:T,onChange:function(e){C(e)},views:["year"],minDate:Ce,maxDate:ve,renderInput:function(e){return Object(E.jsx)(f.a,Object(j.a)(Object(j.a)({},e),{},{helperText:null}))}})})}),Object(E.jsx)(O.a,{children:Object(E.jsx)(f.a,{fullWidth:!0,label:"Ethereum Wallet Addresses",variant:"outlined",value:R,onChange:function(e){return U(e.target.value)}})}),Object(E.jsx)(O.a,{children:Object(E.jsx)(f.a,{fullWidth:!0,label:"Shakepay Ethereum Wallet Address",variant:"outlined",value:H,onChange:function(e){return G(e.target.value)}})})]})})}),Object(E.jsx)(h.a,{item:!0,xs:6,className:ke.gridItemRight,children:Object(E.jsx)(p.a,{className:ke.cardHeight,children:Object(E.jsx)(x.a,{children:"This is a tax calculator for the crypto trading platform, Shakepay. Upload your csv file from Shakepay. Integration with Ethereum blockchain is available under Advance Options."})})}),Object(E.jsx)(h.a,{item:!0,xs:12,children:Object(E.jsx)(m.a,{className:ke.buttonText,variant:"contained",color:"primary",onClick:function(){return M(i,R,H,le,de,he,q,G,xe,X,T,ne,ee)},children:"Submit "})})]}):Object.keys(ue).length>0&&(e=Object(E.jsx)(h.a,{container:!0,className:ke.grid,children:Object(E.jsxs)(h.a,{item:!0,xs:12,className:ke.taxInformation,children:[Object(E.jsx)(m.a,{className:ke.buttonText,variant:"contained",color:"primary",onClick:function(){return function(e,t,a,n,c,i,l,r,o,s){i({}),s({})}(0,0,0,0,0,he)},children:"Go Back"}),Object(E.jsx)(m.a,{className:ke.downloadButton,variant:"contained",color:"primary",onClick:function(){return Y(se)},children:"Download Transactions"}),Object(E.jsx)(p.a,{className:ke.taxInformation,children:Object(E.jsxs)(x.a,{children:[Object(E.jsx)(L.a,{disabled:!0,className:ke.disabledAccordion,children:Object(E.jsx)(P.a,{"aria-controls":"panel1a-content",id:"panel1a-header",className:ke.disabledAccordionSummary,children:Object(E.jsxs)(N.a,{children:["Income: ",ue.incomeGain]})})}),Object(E.jsxs)(L.a,{children:[Object(E.jsx)(P.a,{expandIcon:Object(E.jsx)(z.a,{}),"aria-controls":"panel2a-content",id:"panel2a-header",children:Object(E.jsxs)(N.a,{children:["Capital gain: ",ue.capitalGain]})}),Object(E.jsxs)(W.a,{children:[Object(E.jsxs)(N.a,{className:ke.moreDetail,children:["BTC",Object(E.jsxs)(N.a,{children:["Total BTC: ",ue.totalNumberBTC]}),Object(E.jsxs)(N.a,{children:["Total Sale: ",ue.totalSalePriceBTC]}),Object(E.jsxs)(N.a,{children:["Total Cost: ",ue.totalCostBTC]}),Object(E.jsxs)(N.a,{children:["Total Fees: ",ue.totalFeesBTC]}),Object(E.jsxs)(N.a,{children:["Total Gain: ",ue.totalGainsBTC]})]}),Object(E.jsxs)(N.a,{className:ke.moreDetail,children:["ETH",Object(E.jsxs)(N.a,{children:["Total ETH: ",ue.totalNumberETH]}),Object(E.jsxs)(N.a,{children:["Total Sale: ",ue.totalSalePriceETH]}),Object(E.jsxs)(N.a,{children:["Total Cost: ",ue.totalCostETH]}),Object(E.jsxs)(N.a,{children:["Total Fees: ",ue.totalFeesETH]}),Object(E.jsxs)(N.a,{children:["Total Gain: ",ue.totalGainsETH]})]})]})]})]})})]})})),Object(E.jsx)("div",{className:ke.grid,children:e})}function M(e,t,n,c,i,l,r,o,s,d,j,b,u){if(null==e||null==j)d(!0),r(!1);else if(null!=t&&null==n||null!=t&&""==n)b(!0),r(!1);else{d(!1),b(!1),u(!1),r(!0);var h=new FormData;h.append("file",new Blob([e],{type:"text/csv"})),t?h.append("wallet",t):h.append("wallet","0"),n?h.append("shakepayWallet",n):h.append("shakepayWallet","0"),h.append("year",j.getFullYear());a(182);D.a.post("/api/tax",h,{headers:{"Content-Type":"multipart/form-data"}}).then((function(e){if(console.log(e),"true"==e.data.error)u(!0),r(!1);else{!function(e,t,a,n){a(t),n(e)}(e.data.table,e.data.columns,c,i);var t=e.data.info;l({incomeGain:t.incomeGain,capitalGain:t.capitalGain,totalNumberETH:t.totalNumberETH,totalSalePriceETH:t.totalSalePriceETH,totalCostETH:t.totalCostETH,totalFeesETH:t.totalFeesETH,totalGainsETH:t.totalGainsETH,totalNumberBTC:t.totalNumberBTC,totalSalePriceBTC:t.totalSalePriceBTC,totalCostBTC:t.totalCostBTC,totalFeesBTC:t.totalFeesBTC,totalGainsBTC:t.totalGainsBTC}),s(e.data.totals)}})).catch((function(e){console.log(e),alert("An error has occured, Could not read data sent back"),d(!1),b(!1),u(!1),r(!1)}))}}var _=function(e){Object(s.a)(a,e);var t=Object(d.a)(a);function a(){return Object(r.a)(this,a),t.apply(this,arguments)}return Object(o.a)(a,[{key:"render",value:function(){return Object(E.jsxs)("div",{id:"website",children:[Object(E.jsx)("div",{id:"navbar",children:Object(E.jsx)(G,{})}),Object(E.jsx)("div",{id:"content",children:Object(E.jsx)(C.a,{theme:U,children:Object(E.jsx)(J,{})})}),Object(E.jsx)("div",{id:"footer",children:Object(E.jsx)("p",{children:"Powered By Coingecko API and Etherscan API"})})]})}}]),a}(n.Component),q=_,K=function(e){e&&e instanceof Function&&a.e(3).then(a.bind(null,278)).then((function(t){var a=t.getCLS,n=t.getFID,c=t.getFCP,i=t.getLCP,l=t.getTTFB;a(e),n(e),c(e),i(e),l(e)}))};l.a.render(Object(E.jsx)(c.a.StrictMode,{children:Object(E.jsx)(q,{})}),document.getElementById("root")),K()}},[[185,1,2]]]);
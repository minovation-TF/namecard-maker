import {getImageAsset,type ImageAsset} from "./image-assets";
import {cardFonts,getCardFont,cardFontStack} from "./card-fonts";
export type Side="front"|"back";
export type CardElement={id:string;label:string;kind:"text"|"image";text?:string;textAlign?:"left"|"center"|"right";fontFamily?:string;x:number;y:number;width:number;size:number;color:string;bold:boolean;rotation:number;visible:boolean;assetId?:string;src?:string;imageWidth?:number;imageHeight?:number;crop?:[number,number,number,number];flipX?:boolean;layer?:"back"|"front"};
export type CardState={version:3;orientation:"horizontal"|"vertical";cards:Record<"horizontal"|"vertical",Record<Side,{background:string;elements:CardElement[]}>>};
export const dimensions=(o:CardState["orientation"]):[number,number]=>o==="horizontal"?[900,500]:[500,900];
export const defaultDetails:Record<string,string>={name:"김메리",role:"메리츠화재 파트너스",title:"멘토",mobile:"010-1234-5678",fax:"FAX 0505-123-4567",email:"example@example.com",web:"www.meritzfire.com",company:"메리츠화재해상보험(주)",address:"서울특별시 강남구 강남대로 382, meritz TOWER"};
const previousDemoDetails:Record<string,string>={name:"박서연",role:"파트너스 강남센터",title:"지점장",mobile:"Mobile 010-8954-4743",fax:"Fax 0505-048-8572",email:"people38000@gmail.com",address:"서울특별시 강남구 테헤란로98길 8 (대치동)\n2층 메리츠화재 (대치동, KOSMO DAECHI), 06181"};
const text=(id:string,label:string,value:string,x:number,y:number,width:number,size:number,bold=false,color="#171717"):CardElement=>({id,label,kind:"text",text:value,x,y,width,size,bold,color,rotation:0,visible:true});
export const imageElement=(id:string,asset:ImageAsset,x:number,y:number,width:number):CardElement=>({...asset,assetId:asset.id,id,kind:"image",x,y,width,size:0,color:"#171717",bold:false,rotation:0,visible:true});
export function makeInitial():CardState {
  const card=(v:boolean,back:boolean)=>({background:back?"#171717":"#ffffff",elements:back?[
    imageElement("logo-en",getImageAsset("meritz-en"),48,45,210),imageElement("logo-ko",getImageAsset("meritz-ko"),48,122,160),text("message","뒷면 메시지","걱정은 제가\n담아둘게요.",48,v?215:190,v?400:510,48,true,"#ffffff"),text("description","뒷면 소개","상담이 필요한 순간, 편하게 연락 주세요.\n당신의 내일을 함께 준비하겠습니다.",48,v?400:355,v?390:540,20,false,"#ffffff"),text("back-company","회사명","메리츠화재해상보험(주)",48,v?810:450,400,16,false,"#ffffff")
  ]:[
    imageElement("logo-en",getImageAsset("meritz-en"),v?40:55,v?45:170,v?290:340),text("name","이름",defaultDetails.name,v?40:530,v?210:50,v?270:320,38,true),text("role","소속",defaultDetails.role,v?40:530,v?267:106,v?270:325,21),text("title","직함",defaultDetails.title,v?40:530,v?302:138,v?270:325,20),text("mobile","휴대폰",defaultDetails.mobile,v?40:530,v?450:225,v?410:325,20,true),text("fax","팩스",defaultDetails.fax,v?40:530,v?488:258,v?410:325,19),text("email","이메일",defaultDetails.email,v?40:530,v?526:291,v?410:325,19),text("web","웹사이트","www.meritzfire.com",v?40:530,v?565:324,v?410:325,19,false,"#ef3219"),text("company","회사명","메리츠화재해상보험(주)",v?40:530,v?717:389,v?420:325,21,true),text("address","주소",defaultDetails.address,v?40:530,v?760:428,v?420:325,13)
  ]});
  return {version:3,orientation:"horizontal",cards:{horizontal:{front:card(false,false),back:card(false,true)},vertical:{front:card(true,false),back:card(true,true)}}};
}
let measure:CanvasRenderingContext2D|null=null;
export function wrapText(value:string,width:number,size:number,bold:boolean,fontFamily?:string):string[]{
  if(typeof document!=="undefined"){measure??=document.createElement("canvas").getContext("2d");if(measure)measure.font=`${bold?700:400} ${size}px ${cardFontStack(fontFamily)}`;}
  const result:string[]=[];for(const p of value.split("\n")){let line="";for(const char of Array.from(p)){const test=line+char;const length=measure?measure.measureText(test).width:Array.from(test).reduce((n,c)=>n+(c.charCodeAt(0)>255?size:size*.56),0);if(length>width&&line){result.push(line);line=char;}else line=test;}result.push(line);}return result;
}
export const imageSource=(e:CardElement)=>e.src||"";
export const imageCrop=(e:CardElement):[number,number,number,number]=>e.crop||[0,0,1,1];
export const imageRatio=(e:CardElement)=>((e.imageWidth||1280)*imageCrop(e)[2])/((e.imageHeight||1280)*imageCrop(e)[3]);
export function elementHeight(e:CardElement){return e.kind==="image"?e.width/imageRatio(e):wrapText(e.text||"",e.width,e.size,e.bold,e.fontFamily).length*e.size*1.35;}
export function renderElements(elements:CardElement[]):CardElement[]{
  const rank=(e:CardElement)=>e.layer==="front"?1:e.layer==="back"?-1:0;
  return [...elements].sort((a,b)=>rank(a)-rank(b));
}
export function updateElement(state:CardState,side:Side,id:string,patch:Partial<CardElement>):CardState {
  const next=structuredClone(state),[w,h]=dimensions(next.orientation),e=next.cards[next.orientation][side].elements.find(e=>e.id===id);if(!e)throw new Error("Unknown element");Object.assign(e,patch);
  e.size=Math.max(0,Math.min(80,Number.isFinite(e.size)?e.size:20));e.width=Math.max(30,Math.min(w-20,Number.isFinite(e.width)?e.width:100));e.rotation=Math.max(-45,Math.min(45,Number.isFinite(e.rotation)?e.rotation:0));
  if(e.crop){const [cx,cy,cw,ch]=e.crop,x=Math.max(0,Math.min(.99,Number.isFinite(cx)?cx:0)),y=Math.max(0,Math.min(.99,Number.isFinite(cy)?cy:0));e.crop=[x,y,Math.max(.01,Math.min(1-x,Number.isFinite(cw)?cw:1)),Math.max(.01,Math.min(1-y,Number.isFinite(ch)?ch:1))];}
  if(e.kind==="image"){const r=imageRatio(e),angle=Math.abs(e.rotation)*Math.PI/180;e.width=Math.min(e.width,(w-20)/(Math.cos(angle)+Math.sin(angle)/r),(h-20)/(Math.sin(angle)+Math.cos(angle)/r));}
  const eh=elementHeight(e),rad=Math.abs(e.rotation)*Math.PI/180,dx=Math.max(0,(e.width*Math.cos(rad)+eh*Math.sin(rad)-e.width)/2),dy=Math.max(0,(e.width*Math.sin(rad)+eh*Math.cos(rad)-eh)/2);
  e.x=Math.round(Math.max(dx,Math.min(w-e.width-dx,Number.isFinite(e.x)?e.x:0)));e.y=Math.round(Math.max(dy,Math.min(h-eh-dy,Number.isFinite(e.y)?e.y:0)));return next;
}
const esc=(v:string)=>v.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]!));
export function svgMarkup(state:CardState,side:Side,selection:string|null=null,guides=false,assets:{images?:Record<string,string>;font?:string;fonts?:Record<string,string>}={}):string {
  const [w,h]=dimensions(state.orientation),card=state.cards[state.orientation][side];
  const families=new Set(card.elements.filter(e=>e.visible&&e.kind==="text").map(e=>getCardFont(e.fontFamily).family));
  const fontStyles=cardFonts.filter(f=>families.has(f.family)).flatMap(f=>f.faces.map(face=>{const data=assets.fonts?.[face.src]||(f.family==="LabSans"?assets.font:undefined);return data?`@font-face{font-family:"${f.family}";src:url('${data}') format('${face.format}');font-weight:${face.weight};}`:"";})).join("");
  const items=renderElements(card.elements).filter(e=>e.visible).map(e=>{const lines=wrapText(e.text||"",e.width,e.size,e.bold,e.fontFamily),eh=elementHeight(e);return `<g data-element="${esc(e.id)}" transform="translate(${e.x} ${e.y}) rotate(${e.rotation} ${e.width/2} ${eh/2})" style="cursor:move"><rect width="${e.width}" height="${eh}" fill="transparent"/>${e.kind==="image"?imageSvg(e,assets.images?.[imageSource(e)]):`<text fill="${e.color}" font-family="${esc(cardFontStack(e.fontFamily))}" font-size="${e.size}" font-weight="${e.bold?700:400}" text-anchor="${e.textAlign==="center"?"middle":e.textAlign==="right"?"end":"start"}" dominant-baseline="text-before-edge">${lines.map((l,i)=>`<tspan x="${e.textAlign==="center"?e.width/2:e.textAlign==="right"?e.width:0}" y="${i*e.size*1.35}">${esc(l)}</tspan>`).join("")}</text>`}${e.id===selection?`<rect class="editing-guide" x="-5" y="-5" width="${e.width+10}" height="${eh+10}" fill="none" stroke="#ef3219" stroke-width="2" stroke-dasharray="5 3" pointer-events="none"/>`:""}</g>`;}).join("");return `<svg xmlns="http://www.w3.org/2000/svg" width="${w/10}mm" height="${h/10}mm" viewBox="0 0 ${w} ${h}" role="img" aria-label="${side==="front"?"앞면":"뒷면"} 명함"><defs>${fontStyles?`<style>${fontStyles}</style>`:""}</defs><rect width="${w}" height="${h}" fill="${card.background}"/>${guides?`<rect class="editing-guide" x="30" y="30" width="${w-60}" height="${h-60}" fill="none" stroke="${card.background==="#171717"?"#a0a0a0":"#d8d8d8"}" stroke-width="1" stroke-dasharray="5 5" pointer-events="none"/>`:""}${items}</svg>`;
}

export function imageSvg(e:CardElement,embedded?:string):string {
  const [x,y,cw,ch]=imageCrop(e),iw=e.imageWidth||1280,ih=e.imageHeight||1280;
  return `<g${e.flipX?` transform="translate(${e.width} 0) scale(-1 1)"`:""}><svg width="${e.width}" height="${elementHeight(e)}" viewBox="${x*iw} ${y*ih} ${cw*iw} ${ch*ih}" overflow="hidden"><image href="${esc(embedded||imageSource(e))}" width="${iw}" height="${ih}"/></svg></g>`;
}
export function restoreState(value:unknown):CardState {
  const s=value as CardState;if(!s||![2,3].includes(s.version)||!s.cards?.horizontal?.front?.elements||!s.cards?.vertical?.back?.elements)throw new Error("Invalid draft");
  const next=structuredClone(s);next.version=3;
  for(const o of ["horizontal","vertical"] as const)for(const side of ["front","back"] as const){const card=next.cards[o][side];
    if(card.background==="#202622")card.background="#171717";for(const e of card.elements){if(e.fontFamily)e.fontFamily=getCardFont(e.fontFamily).family;if(e.color==="#202622")e.color="#171717";if(e.color==="#e93324")e.color="#ef3219";}
    const previousDemo=side==="front"&&card.elements.find(e=>e.id==="name")?.text===previousDemoDetails.name&&card.elements.find(e=>e.id==="role")?.text===previousDemoDetails.role;
    if(previousDemo)for(const e of card.elements)if(e.kind==="text"&&previousDemoDetails[e.id]!==undefined&&e.text===previousDemoDetails[e.id])e.text=defaultDetails[e.id];
    card.elements=card.elements.filter(e=>!(e.kind==="image"&&(e.assetId?.startsWith("meritz:reference-originals/")||e.src?.includes("/reference-originals/")||(side==="front"&&e.id==="logo-ko"&&e.assetId==="meritz-ko")||e.assetId==="worry-doll"||e.src==="/assets/worry-doll.png"||e.id==="doll"&&!e.src)));
    const logo=card.elements.find(e=>e.id==="logo");
    if(logo?.kind==="text"&&logo.text==="meritz"){const replacement=imageElement("logo-en",getImageAsset("meritz-en"),logo.x,logo.y,Math.min(logo.width,side==="back"?210:o==="vertical"?290:340));Object.assign(logo,replacement,{visible:logo.visible,rotation:logo.rotation});if(side==="back")card.elements.push(imageElement("logo-ko",getImageAsset("meritz-ko"),logo.x,Math.round(logo.y+elementHeight(logo)+20),side==="back"?160:240));}
    for(const e of card.elements)if(e.kind==="image"){const asset=e.assetId?getImageAsset(e.assetId):undefined;if(asset)Object.assign(e,{thumbnail:asset.thumbnail,...(!e.src?{src:asset.src,imageWidth:asset.imageWidth,imageHeight:asset.imageHeight,crop:asset.crop}:{})});}

  }
  return next;
}

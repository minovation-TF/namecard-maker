import {dimensions,elementHeight,updateElement,type CardElement,type CardState,type Side} from "./card-model";
import type {AlignmentGuide} from "./card-alignment";
export type Bounds={x:number;y:number;width:number;height:number};
export type ResizeHandle="nw"|"ne"|"sw"|"se"|"w"|"e";
const clamp=(n:number,min:number,max:number)=>Math.max(min,Math.min(max,n));
export function elementBounds(e:CardElement):Bounds{
  const h=elementHeight(e),r=e.rotation*Math.PI/180,w=e.width*Math.abs(Math.cos(r))+h*Math.abs(Math.sin(r)),height=h*Math.abs(Math.cos(r))+e.width*Math.abs(Math.sin(r));
  return {x:e.x+(e.width-w)/2,y:e.y+(h-height)/2,width:w,height};
}
export function selectionBounds(elements:CardElement[],ids:string[]):Bounds|null{
  const boxes=elements.filter(e=>ids.includes(e.id)).map(elementBounds);if(!boxes.length)return null;
  const x=Math.min(...boxes.map(b=>b.x)),y=Math.min(...boxes.map(b=>b.y));return {x,y,width:Math.max(...boxes.map(b=>b.x+b.width))-x,height:Math.max(...boxes.map(b=>b.y+b.height))-y};
}
export function marqueeIds(elements:CardElement[],box:Bounds){return elements.filter(e=>e.visible).filter(e=>{const b=elementBounds(e);return b.x<=box.x+box.width&&b.x+b.width>=box.x&&b.y<=box.y+box.height&&b.y+b.height>=box.y;}).map(e=>e.id);}
export function moveSelection(state:CardState,side:Side,ids:string[],dx:number,dy:number):CardState{
  const card=state.cards[state.orientation][side],bounds=selectionBounds(card.elements,ids);if(!bounds)return state;
  const [w,h]=dimensions(state.orientation),x=clamp(dx,-bounds.x,w-bounds.x-bounds.width),y=clamp(dy,-bounds.y,h-bounds.y-bounds.height),next=structuredClone(state);
  for(const e of next.cards[next.orientation][side].elements)if(ids.includes(e.id)){e.x+=x;e.y+=y;}
  return next;
}
const anchors=(box:Bounds,axis:"x"|"y")=>{const n=box[axis],size=axis==="x"?box.width:box.height;return [n,n+size/2,n+size];};
export function snapSelection(state:CardState,side:Side,ids:string[],dx:number,dy:number,tolerance:number):{state:CardState;guides:AlignmentGuide[]}{
  const moving=moveSelection(state,side,ids,dx,dy),box=selectionBounds(moving.cards[moving.orientation][side].elements,ids);if(!box)return {state:moving,guides:[]};
  const [w,h]=dimensions(state.orientation),others=state.cards[state.orientation][side].elements.filter(e=>!ids.includes(e.id)&&e.visible).map(elementBounds),adjust={x:0,y:0},guides:AlignmentGuide[]=[];
  for(const axis of ["x","y"] as const){const limit=axis==="x"?w:h,targets=[30,limit/2,limit-30,...others.flatMap(b=>anchors(b,axis))];let best:{delta:number;target:number}|null=null;
    for(const n of anchors(box,axis))for(const target of targets){const delta=target-n;if(Math.abs(delta)<=tolerance&&(!best||Math.abs(delta)<Math.abs(best.delta)))best={delta,target};}
    if(best){adjust[axis]=best.delta;guides.push({axis,position:best.target});}
  }
  const next=moveSelection(moving,side,ids,adjust.x,adjust.y),final=selectionBounds(next.cards[next.orientation][side].elements,ids)!;
  return {state:next,guides:guides.filter(g=>anchors(final,g.axis).some(n=>Math.abs(n-g.position)<1))};
}
export function resizeElement(state:CardState,side:Side,id:string,handle:ResizeHandle,dx:number,dy:number):CardState{
  const e=state.cards[state.orientation][side].elements.find(e=>e.id===id);if(!e)return state;
  const height=elementHeight(e),rad=e.rotation*Math.PI/180,c=Math.cos(rad),s=Math.sin(rad),localX=dx*c+dy*s,localY=-dx*s+dy*c;
  const horizontalOnly=handle==="w"||handle==="e",left=handle.endsWith("w"),top=handle.startsWith("n"),ratio=e.width/height;
  let width=e.width+(horizontalOnly?(left?-localX:localX):((left?-localX:localX)+(top?-localY:localY)/ratio)/(1+1/(ratio*ratio)));
  const [cw,ch]=dimensions(state.orientation);let size=e.size;
  if(e.kind==="text"&&!horizontalOnly){size=clamp(e.size*width/e.width,10,80);width=e.width*size/e.size;}
  width=clamp(width,30,cw-20);
  if(e.kind==="image")width=Math.min(width,(cw-20)/(Math.abs(c)+Math.abs(s)/ratio),(ch-20)/(Math.abs(s)+Math.abs(c)/ratio));
  if(e.kind==="text"&&!horizontalOnly)size=e.size*width/e.width;
  const nextHeight=elementHeight({...e,width,size}),ox=left?e.width:0,oy=horizontalOnly?0:top?height:0,anchorX=e.x+e.width/2+(ox-e.width/2)*c-(oy-height/2)*s,anchorY=e.y+height/2+(ox-e.width/2)*s+(oy-height/2)*c;
  const nx=left?width:0,ny=horizontalOnly?0:top?nextHeight:0,centerX=anchorX-(nx-width/2)*c+(ny-nextHeight/2)*s,centerY=anchorY-(nx-width/2)*s-(ny-nextHeight/2)*c;
  return updateElement(state,side,id,{width,size,x:centerX-width/2,y:centerY-nextHeight/2});
}

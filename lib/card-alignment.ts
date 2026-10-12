import {dimensions,elementHeight,updateElement,type CardElement,type CardState,type Side} from "./card-model";
export type AlignmentGuide={axis:"x"|"y";position:number};
function anchors(e:CardElement,axis:"x"|"y"):number[]{
  const start=e[axis],size=axis==="x"?e.width:elementHeight(e),other=axis==="x"?elementHeight(e):e.width,rad=Math.abs(e.rotation)*Math.PI/180;
  const extent=size*Math.cos(rad)+other*Math.sin(rad),center=start+size/2;
  return [center-extent/2,center,center+extent/2];
}
export function snapElement(state:CardState,side:Side,id:string,x:number,y:number,tolerance:number):{state:CardState;guides:AlignmentGuide[]}{
  let next=updateElement(state,side,id,{x,y});const [w,h]=dimensions(next.orientation),elements=next.cards[next.orientation][side].elements,moving=elements.find(e=>e.id===id)!;
  const guides:AlignmentGuide[]=[],patch:Partial<CardElement>={};
  for(const axis of ["x","y"] as const){const limit=axis==="x"?w:h,targets=[30,limit/2,limit-30,...elements.filter(e=>e.id!==id&&e.visible).flatMap(e=>anchors(e,axis))];
    let best:{distance:number;delta:number;target:number}|null=null;
    for(const anchor of anchors(moving,axis))for(const target of targets){const delta=target-anchor,distance=Math.abs(delta);if(distance<=tolerance&&(!best||distance<best.distance))best={distance,delta,target};}
    if(best){patch[axis]=moving[axis]+best.delta;guides.push({axis,position:best.target});}
  }
  next=updateElement(next,side,id,patch);const final=next.cards[next.orientation][side].elements.find(e=>e.id===id)!;
  return {state:next,guides:guides.filter(g=>anchors(final,g.axis).some(a=>Math.abs(a-g.position)<1))};
}
export function alignInformation(state:CardState,ids:string[]):CardState {
  const card=state.cards[state.orientation].front,reference=card.elements.find(e=>e.id==="name"&&e.visible)||card.elements.find(e=>ids.includes(e.id)&&e.visible);if(!reference)return state;
  const [w]=dimensions(state.orientation),items=card.elements.filter(e=>ids.includes(e.id)&&e.visible),x=Math.max(30,Math.min(reference.x,...items.map(e=>w-30-e.width)));
  return items.reduce((next,e)=>updateElement(next,"front",e.id,{x,textAlign:"left"}),state);
}

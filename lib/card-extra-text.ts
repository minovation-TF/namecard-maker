import {dimensions,updateElement,type CardState,type CardElement,type Side} from "./card-model";

export type TextDraft={text:string;size:number;bold:boolean;color:string};
export const isExtraText=(e:CardElement)=>e.kind==="text"&&(e.id==="extra-text"||e.label==="추가 텍스트");
export function extraText(state:CardState,side:Side,id?:string){const elements=state.cards[state.orientation][side].elements;return elements.find(e=>e.id===id&&isExtraText(e))||elements.find(e=>e.id==="extra-text")||elements.find(isExtraText);}
export function saveExtraText(state:CardState,side:Side,draft:TextDraft,targetId?:string):{state:CardState;id:string}{
  const value=draft.text.trim();if(!value)throw new Error("Text is required");
  const next=structuredClone(state),existing=extraText(next,side,targetId),[w]=dimensions(next.orientation),id=existing?.id||"extra-text";
  if(!existing)next.cards[next.orientation][side].elements.push({id,label:"추가 텍스트",kind:"text",text:value,x:next.orientation==="horizontal"?(side==="front"?45:450):40,y:next.orientation==="horizontal"?55:side==="front"?360:600,width:next.orientation==="horizontal"?Math.round(w*.46):w-80,size:draft.size,color:draft.color,bold:draft.bold,rotation:0,visible:true});
  return {state:updateElement(next,side,id,{...draft,text:value,visible:true}),id};
}

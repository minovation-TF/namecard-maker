"use client";
import {useEffect,useRef,useState} from "react";
import {Dialog,DialogContent,DialogDescription,DialogTitle} from "@/components/ui/dialog";
import {Slider} from "@/components/ui/slider";
import {cardColors} from "@/components/card-object-controls";
import type {CardElement} from "@/lib/card-model";
import type {TextDraft} from "@/lib/card-extra-text";

type Props={open:boolean;target?:CardElement;defaultColor:string;onClose:()=>void;onSave:(value:TextDraft,targetId?:string)=>void};
export function CardTextDialog({open,target,defaultColor,onClose,onSave}:Props){
  const [draft,setDraft]=useState<TextDraft>({text:"",size:24,bold:false,color:defaultColor}),submitted=useRef(false),form=useRef<HTMLFormElement>(null);
  useEffect(()=>{if(open){submitted.current=false;setDraft({text:target?.text||"",size:target?.size||24,bold:target?.bold||false,color:target?.color||defaultColor});}},[open,target?.id]);
  return <Dialog open={open} onOpenChange={v=>{if(!v)onClose();}}><DialogContent className="text-dialog" onKeyDown={e=>{e.stopPropagation();if((e.ctrlKey||e.metaKey)&&e.key==="Enter"){e.preventDefault();form.current?.requestSubmit();}}}><DialogTitle>{target?"텍스트 수정":"텍스트 추가"}</DialogTitle><DialogDescription>문구를 입력하고 확인하세요. 추가 버튼은 같은 텍스트를 다시 편집합니다.</DialogDescription>
    <form ref={form} onSubmit={e=>{e.preventDefault();if(submitted.current||!draft.text.trim())return;submitted.current=true;onSave(draft,target?.id);}}>
      <textarea aria-label="추가할 문구" placeholder="명함에 넣을 문구를 입력하세요" rows={3} maxLength={200} value={draft.text} onChange={e=>setDraft(d=>({...d,text:e.target.value}))}/>
      <div className="text-dialog-styles"><button type="button" className={"icon-button "+(draft.bold?"active":"")} aria-label="굵게" aria-pressed={draft.bold} onClick={()=>setDraft(d=>({...d,bold:!d.bold}))}><b>B</b></button><div className="text-swatches">{cardColors.map(c=><button type="button" key={c.value} title={c.label} aria-label={c.label+" 글자색"} style={{background:c.value}} className={draft.color===c.value?"active":""} onClick={()=>setDraft(d=>({...d,color:c.value}))}/>)}</div><label className="object-custom-color"><input type="color" aria-label="직접 글자색 선택" value={draft.color} onChange={e=>setDraft(d=>({...d,color:e.target.value}))}/></label></div>
      <div className="text-dialog-size"><span>글자 크기</span><Slider aria-label="글자 크기" min={10} max={80} step={1} value={[draft.size]} onValueChange={v=>setDraft(d=>({...d,size:v[0]}))}/><output>{draft.size}</output></div>
      {draft.text&&<div className="text-dialog-preview" style={{background:draft.color.toLowerCase()==="#ffffff"?"#171717":"#fafafa",color:draft.color,fontSize:Math.min(draft.size,40),fontWeight:draft.bold?700:400}}>{draft.text}</div>}
      <div className="text-dialog-actions"><button type="button" className="small-button" onClick={onClose}>취소</button><button type="submit" className="primary" disabled={!draft.text.trim()}>{target?"수정":"추가"}</button></div>
    </form>
  </DialogContent></Dialog>;
}

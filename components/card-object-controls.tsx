"use client";

import {AlignLeft,AlignCenter,AlignRight,ArrowDownToLine,ArrowUpToLine,ImagePlus,Pencil,Trash2,Check,X} from "lucide-react";
import {cardFonts,getCardFont} from "@/lib/card-fonts";
import type {CardElement} from "@/lib/card-model";

export const cardColors=[{value:"#171717",label:"검정"},{value:"#ffffff",label:"흰색"},{value:"#ee3722",label:"메리츠 CI 레드"},{value:"#006dd9",label:"블루"}];
type Props={element?:CardElement;count:number;editing:boolean;fontBusy:boolean;onPatch:(p:Partial<CardElement>)=>void;onFont:(family:string)=>void;onEdit:()=>void;onFinish:(cancel?:boolean)=>void;onReplace:()=>void;onAlign:(position:"left"|"center"|"right")=>void;onDelete:()=>void;onClear:()=>void};

export function CardObjectControls({element:e,count,editing,fontBusy,onPatch,onFont,onEdit,onFinish,onReplace,onAlign,onDelete,onClear}:Props){
  if(!count)return null;
  if(count>1)return <div className="object-controls" aria-label="선택한 요소 편집"><strong>{count}개 선택</strong><button className="small-button" onClick={onClear}>선택 해제</button><button className="icon-button danger" aria-label="선택한 요소 모두 삭제" onClick={onDelete}><Trash2 size={16}/></button></div>;
  if(!e)return null;
  return <div className="object-controls" aria-label={`${e.label} 편집`}>
    <strong>{e.label}</strong>
    {editing?<><button className="small-button" onPointerDown={v=>v.preventDefault()} onClick={()=>onFinish()}><Check size={16}/>완료</button><button className="icon-button" aria-label="문구 편집 취소" onPointerDown={v=>v.preventDefault()} onClick={()=>onFinish(true)}><X size={16}/></button></>:e.kind==="text"?<>
      <button className="icon-button" aria-label="문구 수정" title="문구 수정 · 더블클릭" onClick={onEdit}><Pencil size={16}/></button>
      {cardFonts.length>1&&<select className="font-select" aria-label="글꼴" value={getCardFont(e.fontFamily).family} disabled={fontBusy} onChange={v=>onFont(v.target.value)}>{["고딕","명조","손글씨"].map(group=><optgroup key={group} label={group}>{cardFonts.filter(f=>f.group===group).map(f=><option key={f.family} value={f.family}>{f.label}</option>)}</optgroup>)}</select>}
      <button className={"icon-button "+(e.bold?"active":"")} aria-label="굵게" title="굵게" aria-pressed={e.bold} onClick={()=>onPatch({bold:!e.bold})}><b>B</b></button>
      <div className="text-swatches" aria-label="기본 글자색">{cardColors.map(c=><button key={c.value} title={c.label} aria-label={c.label+" 글자색"} aria-pressed={e.color===c.value} className={e.color===c.value?"active":""} style={{background:c.value}} onClick={()=>onPatch({color:c.value})}/>)}</div>
      <label className="object-custom-color" title="직접 글자색 선택"><input type="color" aria-label="직접 글자색 선택" value={e.color} onChange={v=>onPatch({color:v.target.value})}/></label>
    </>:<><button className="small-button" onClick={onReplace}><ImagePlus size={16}/>교체</button><button className="icon-button" aria-label="맨 뒤로" title="맨 뒤로" onClick={()=>onPatch({layer:"back"})}><ArrowDownToLine size={16}/></button><button className="icon-button" aria-label="맨 앞으로" title="맨 앞으로" onClick={()=>onPatch({layer:"front"})}><ArrowUpToLine size={16}/></button></>}
    {!editing&&<><div className="object-alignment">{(["left","center","right"] as const).map((position,i)=>{const Icon=[AlignLeft,AlignCenter,AlignRight][i],label=["왼쪽 정렬","가운데 정렬","오른쪽 정렬"][i];return <button key={position} className="icon-button" aria-label={label} title={label} onClick={()=>onAlign(position)}><Icon size={16}/></button>;})}</div><button className="icon-button danger" aria-label="선택 요소 삭제" title="삭제 · Delete" onClick={onDelete}><Trash2 size={16}/></button></>}
  </div>;
}

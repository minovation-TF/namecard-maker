import {elementHeight,type CardElement} from "@/lib/card-model";
import {selectionBounds,type Bounds,type ResizeHandle} from "@/lib/card-selection";
export function CardSelectionOverlay({elements,ids,width,height,handleSize,marquee}:{elements:CardElement[];ids:string[];width:number;height:number;handleSize:number;marquee:Bounds|null}){
  const selected=elements.filter(e=>ids.includes(e.id)&&e.visible),box=selectionBounds(selected,ids),single=selected.length===1?selected[0]:null;
  return <svg className="selection-overlay editing-guide" viewBox={`0 0 ${width} ${height}`} aria-label="선택 요소와 크기 조절점">
    {single?<g transform={`translate(${single.x} ${single.y}) rotate(${single.rotation} ${single.width/2} ${elementHeight(single)/2})`}>
      <rect width={single.width} height={elementHeight(single)} fill="none" stroke="#ef3219" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>
      {(["nw","ne","sw","se",...(single.kind==="text"?["w","e"]:[])] as ResizeHandle[]).map(handle=>{
        const x=handle.endsWith("w")?0:single.width,y=handle.length===1?elementHeight(single)/2:handle.startsWith("n")?0:elementHeight(single),label=handle.length===1?"텍스트 상자 너비 조절":"요소 크기 조절";
        return <g key={handle} data-resize-handle={handle} className={"resize-handle handle-"+handle} style={{pointerEvents:"all"}}><title>{label}</title><rect x={x-handleSize} y={y-handleSize} width={handleSize*2} height={handleSize*2} fill="transparent"/><rect x={x-handleSize/2} y={y-handleSize/2} width={handleSize} height={handleSize} rx={handleSize/5} fill="white" stroke="#ef3219" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/></g>;
      })}
    </g>:box&&<><rect x={box.x} y={box.y} width={box.width} height={box.height} fill="none" stroke="#ef3219" strokeDasharray="6 3" strokeWidth="1.5" vectorEffect="non-scaling-stroke"/>{selected.map(e=><rect key={e.id} {...elementOutline(e)} fill="none" stroke="#ef321980" strokeWidth="1" vectorEffect="non-scaling-stroke"/>)}</>}
    {marquee&&<rect x={marquee.x} y={marquee.y} width={marquee.width} height={marquee.height} fill="#ef321917" stroke="#ef3219" strokeWidth="1" vectorEffect="non-scaling-stroke"/>}
  </svg>;
}
function elementOutline(e:CardElement){const h=elementHeight(e);return {x:e.x,y:e.y,width:e.width,height:h,transform:`rotate(${e.rotation} ${e.x+e.width/2} ${e.y+h/2})`};}

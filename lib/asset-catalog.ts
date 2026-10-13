import {catalogAssets,type ImageAsset} from "./image-assets";

export const categoryGroups=[
  {label:"캐릭터",items:[{id:"guide-basic",label:"기본 캐릭터"},{id:"basic-variants",label:"기본 응용"},{id:"guide-views",label:"옆·뒷모습"},{id:"guide-faces",label:"표정"},{id:"guide-3d",label:"3D 캐릭터"},{id:"individual-png",label:"개별 이미지"},{id:"emoticons",label:"이모티콘"}]},
  {label:"계절과 상황",items:[{id:"collection",label:"활동 모음"},{id:"holiday",label:"명절"},{id:"summer-disease",label:"여름·질병"},{id:"winter",label:"겨울"},{id:"winter-variants",label:"겨울 응용"},{id:"hospital",label:"병원"},{id:"detective",label:"탐정"}]},
  {label:"아이콘과 CI",items:[{id:"icons",label:"아이콘"},{id:"logos",label:"회사 CI"},{id:"credentials",label:"자격·인증 마크"},{id:"reference-originals",label:"배경 있는 원본"}]}
];
export const characters=[{id:"merry",label:"메리"},{id:"eco",label:"에코"},{id:"rara",label:"라라"},{id:"indi",label:"인디"},{id:"tata",label:"타타"},{id:"ziziry",label:"지지리"}];
export const categoryLabel=(id:string)=>id==="all"?"전체 분류":id==="favorites"?"즐겨찾기":id==="recent"?"최근 사용":categoryGroups.flatMap(g=>g.items).find(c=>c.id===id)?.label||id;
export const categoryCount=(id:string)=>catalogAssets.filter(a=>a.category===id).length;
export const catalogPageSize=24;
export function filterCatalog({category,query="",character="all",transparentOnly=false,favorites=[],recent=[]}:{category:string;query?:string;character?:string;transparentOnly?:boolean;favorites?:string[];recent?:string[]}):ImageAsset[]{
  const terms=query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const candidates=category==="recent"?recent.map(id=>catalogAssets.find(a=>a.id===id)).filter((a):a is ImageAsset=>!!a):catalogAssets;
  return candidates.filter(a=>(category==="all"||category==="recent"||category==="favorites"&&favorites.includes(a.id)||a.category===category)&&(character==="all"||a.character===character)&&(!transparentOnly||a.transparent)&&terms.every(t=>{const namedCharacter=characters.find(c=>c.label===t);return namedCharacter?a.character===namedCharacter.id:(a.searchText||a.label).toLocaleLowerCase().includes(t);}));
}
export function rememberAsset(ids:string[],id:string){return [id,...ids.filter(x=>x!==id)].slice(0,12);}
export function sanitizeAssetIds(value:unknown){return Array.isArray(value)?[...new Set(value.filter((id):id is string=>typeof id==="string"&&catalogAssets.some(a=>a.id===id)))]:[];}
export const isCharacterAsset=(a:ImageAsset)=>a.id==="worry-doll"||!!a.category&&!['icons','logos','credentials','reference-originals'].includes(a.category);

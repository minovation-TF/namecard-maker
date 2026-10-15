import {assetPath} from "./asset-path";
export type CardFont={family:string;label:string;group:string;faces:{src:string;weight:string|number;format:string}[]};
export const cardFonts:CardFont[]=[{family:"LabSans",label:"기본 고딕",group:"고딕",faces:[{src:assetPath("/assets/lab-sans.woff2"),weight:"100 900",format:"woff2"}]}];
export const getCardFont=(family?:string)=>cardFonts.find(f=>f.family===family)||cardFonts[0];
export const cardFontStack=(family?:string)=>`"${getCardFont(family).family}", LabSans, sans-serif`;
export const cardFontCSS=(e:{bold:boolean;size:number;fontFamily?:string})=>`${e.bold?700:400} ${e.size}px ${cardFontStack(e.fontFamily)}`;

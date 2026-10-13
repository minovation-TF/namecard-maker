import companyVariants from "./generated/company-variants.json";
import credentials from "./generated/credential-catalog.json";
import catalog from "./generated/meritz-catalog.json";
export type ImageAsset={id:string;label:string;src:string;imageWidth:number;imageHeight:number;crop:[number,number,number,number];category?:string;thumbnail?:string;character?:string;transparent?:boolean;searchText?:string;sourceUrl?:string;usageNote?:string};
const ci=(id:string,label:string,box:[number,number,number,number]):ImageAsset=>({id,label,src:"/assets/meritz-ci.png",imageWidth:2048,imageHeight:1445,crop:[box[0]/2048,box[1]/1445,box[2]/2048,box[3]/1445]});
export const commonImageAssets:ImageAsset[]=[
  ci("meritz-en","영문 meritz",[324,254,945,275]),
  ci("meritz-ko","한글 메리츠화재",[454,589,670,147]),
  {id:"partners-ko",label:"한글 메리츠 파트너스",src:"/assets/meritz-partners.jpg",imageWidth:810,imageHeight:163,crop:[379/810,71/163,410/810,61/163]},
  ci("meritz-combined","영문 + 한글 CI",[324,1046,976,146])
];
export const meritzAssets:ImageAsset[]=catalog.map(a=>({...a,crop:a.crop as [number,number,number,number]}));
export const companyAssets:ImageAsset[]=[...commonImageAssets.slice(0,4).map(a=>({...a,category:"logos",thumbnail:`/assets/catalog-common/${a.id}.png`,transparent:a.src.endsWith(".png"),searchText:a.label})),...companyVariants.map(a=>({...a,crop:a.crop as [number,number,number,number]}))];
export const credentialAssets:ImageAsset[]=credentials.map(a=>({...a,crop:a.crop as [number,number,number,number]}));
export const catalogAssets=[...companyAssets,...credentialAssets,...meritzAssets];
export const imageAssets=[...companyAssets,...credentialAssets,...meritzAssets];
export const getImageAsset=(id:string)=>imageAssets.find(a=>a.id===id)!;

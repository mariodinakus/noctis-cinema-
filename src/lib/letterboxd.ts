import JSZip from 'jszip';
import Papa from 'papaparse';
import {FilmEntry,keyOf} from './catalog';
const MAX_ZIP=26*1024*1024, MAX_CSV=12*1024*1024;
const clean=(x:unknown)=>String(x??'').trim();
export async function importLetterboxd(file:File):Promise<{entries:FilmEntry[];files:string[]}>{
 if(file.size>MAX_ZIP) throw new Error('ZIP exceeds the 26 MB local import limit.');
 if(!/\.zip$/i.test(file.name)) throw new Error('Choose a Letterboxd .zip export.');
 let zip:JSZip;try{zip=await JSZip.loadAsync(file)}catch{throw new Error('The ZIP file could not be opened.');}
 const files=Object.values(zip.files).filter(f=>!f.dir&&/(^|\/)(watched|ratings|diary|watchlist)\.csv$/i.test(f.name));
 if(!files.length)throw new Error('No watched.csv, ratings.csv, diary.csv or watchlist.csv found.');
 const record=new Map<string,FilmEntry>();
 // Import watched before ratings/diary, so ratings can update the existing film record.
 const order=['watched.csv','ratings.csv','diary.csv','watchlist.csv'];
 files.sort((a,b)=>order.findIndex(s=>a.name.toLowerCase().endsWith(s))-order.findIndex(s=>b.name.toLowerCase().endsWith(s)));
 for(const f of files){
  const declared=(f as unknown as {_data?:{uncompressedSize?:number}})._data?.uncompressedSize;
  if(declared&&declared>MAX_CSV)throw new Error(`${f.name} is too large to import locally.`);
  const content=await f.async('string');if(content.length>MAX_CSV)throw new Error(`${f.name} exceeds import limit.`);
  const parsed=Papa.parse<Record<string,string>>(content.replace(/^\uFEFF/,''),{header:true,skipEmptyLines:true,transformHeader:h=>h.trim()});
  const kind=f.name.toLowerCase().split('/').pop();
  for(const r of parsed.data){
   const title=clean(r.Name||r.Title||r.name||r.title);const year=Number(r.Year||r.year||'0');
   if(!title||!Number.isFinite(year)||year<1880||year>2100)continue;
   const key=keyOf(title,year);const e=record.get(key)||{title,year};
   if(kind==='watchlist.csv')e.watchlist=true;else e.watched=true;
   const rating=Number(r.Rating||r.rating||0);if(rating>=.5&&rating<=5)e.rating=rating;
   record.set(key,e);
  }
 }
 return {entries:[...record.values()],files:files.map(f=>f.name)};
}

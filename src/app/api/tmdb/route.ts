import {NextRequest,NextResponse} from 'next/server';
import {GENRE_IDS,Movie} from '@/lib/catalog';
export const runtime='nodejs';
const ROOT='https://api.themoviedb.org/3';
const token=()=>process.env.TMDB_READ_ACCESS_TOKEN;
async function tmdb(path:string,params:Record<string,string>={}){
 const url=new URL(ROOT+path);for(const [k,v] of Object.entries(params))if(v)url.searchParams.set(k,v);
 const res=await fetch(url,{headers:{Authorization:`Bearer ${token()}`,'Content-Type':'application/json'},next:{revalidate:21600},signal:AbortSignal.timeout(8500)});
 if(!res.ok)throw new Error(`TMDB request failed (${res.status})`);
 return res.json();
}
const map=(r:Record<string,unknown>,genres?:Array<{id:number;name:string}>):Movie=>{
 const date=String(r.release_date||'');const year=Number(date.slice(0,4))||0;
 const ids=(r.genre_ids as number[])||((r.genres as Array<{id:number}>)||[]).map(x=>x.id);
 return {id:`tmdb-${r.id}`,tmdbId:Number(r.id),title:String(r.title||''),year,decade:Math.floor(year/10)*10,genre:ids.map(id=>genres?.find(g=>g.id===id)?.name||Object.keys(GENRE_IDS).find(k=>GENRE_IDS[k]===id)||'Other'),minutes:Number(r.runtime)||0,overview:String(r.overview||''),director:'—',poster:r.poster_path?`https://image.tmdb.org/t/p/w500${r.poster_path}`:null,backdrop:r.backdrop_path?`https://image.tmdb.org/t/p/w1280${r.backdrop_path}`:null,vote:Number(r.vote_average)||0,color:'#713d4a'};
};
const err=(message:string,status=500)=>NextResponse.json({error:message},{status});
export async function GET(req:NextRequest){
 if(!token())return NextResponse.json({configured:false,movies:[],providers:[]});
 const s=req.nextUrl.searchParams;const action=s.get('action')||'discover';
 try{
  if(action==='discover'){
   const mood=s.get('genres')||'';const platformNames=(s.get('platforms')||'').split(',').filter(x=>x&&x!=='Stremio');
   let providerIds:string[]=[];
   if(platformNames.length){
    const raw=await tmdb('/watch/providers/movie',{watch_region:'GR',language:'en-US'});
    providerIds=(raw.results||[]).filter((p:{provider_name:string})=>platformNames.some(n=>p.provider_name.toLowerCase().includes(n.toLowerCase()))).map((p:{provider_id:number})=>String(p.provider_id));
   }
   if(platformNames.length&&!providerIds.length)return NextResponse.json({configured:true,movies:[],message:'Selected streaming providers not found in Greek provider directory.'});
   const params:Record<string,string>={language:'en-US',page:String(Math.min(5,Math.max(1,Number(s.get('page'))||1))),sort_by:'vote_average.desc','vote_count.gte':'200',include_adult:'false','primary_release_date.lte':new Date().toISOString().slice(0,10)};
   if(mood) params.with_genres=mood.split(',').map(x=>GENRE_IDS[x]||'').filter(Boolean).join('|');
   if(providerIds.length){params.watch_region='GR';params.with_watch_providers=providerIds.join('|');params.with_watch_monetization_types='flatrate|rent|buy';}
   const data=await tmdb('/discover/movie',params);
   return NextResponse.json({configured:true,movies:(data.results||[]).filter((x:{release_date?:string})=>x.release_date).map((x:Record<string,unknown>)=>map(x)),providerFilterApplied:providerIds.length>0});
  }
  if(action==='details'){
   let id=Number(s.get('id'))||0;
   if(!id){const q=(s.get('title')||'').slice(0,140),y=s.get('year')||'';if(!q)return err('Missing title',400);
    const results=await tmdb('/search/movie',{query:q,year:y,include_adult:'false'});
    const exact=(results.results||[]).find((m:{title:string})=>m.title.toLowerCase()===q.toLowerCase());id=(exact||results.results?.[0])?.id||0;
   }
   if(!id)return NextResponse.json({configured:true,found:false,providers:[]});
   const [detail,watch]=await Promise.all([tmdb(`/movie/${id}`,{language:'en-US',append_to_response:'credits'}),tmdb(`/movie/${id}/watch/providers`)]);
   const m=map(detail);m.director=(detail.credits?.crew||[]).find((p:{job:string})=>p.job==='Director')?.name||'—';
   const gr=watch.results?.GR||{};
   const providers=[...(gr.flatrate||[]).map((p:{provider_name:string})=>({name:p.provider_name,type:'Subscription'})),...(gr.rent||[]).map((p:{provider_name:string})=>({name:p.provider_name,type:'Rent'})),...(gr.buy||[]).map((p:{provider_name:string})=>({name:p.provider_name,type:'Buy'}))];
   return NextResponse.json({configured:true,found:true,movie:m,providers,watchLink:gr.link||null,country:'GR'});
  }
  return err('Unknown action',400);
 }catch(e){return err(e instanceof Error?e.message:'External movie service unavailable',502)}
}
export async function POST(req:NextRequest){
 if(!token())return NextResponse.json({configured:false,movies:[]});
 try{
  const body=await req.json();const entries:Array<{title:string;year:number}>=(Array.isArray(body?.entries)?body.entries:[]).slice(0,30);
  const matches=await Promise.all(entries.map(async e=>{
    if(typeof e.title!=='string'||e.title.length>140||!Number.isFinite(e.year))return null;
    try{const res=await tmdb('/search/movie',{query:e.title,year:String(e.year),include_adult:'false'});const result=(res.results||[])[0];return result?map(result):null}catch{return null}
  }));
  return NextResponse.json({configured:true,movies:matches.filter(Boolean)});
 }catch{return err('Invalid enrichment request',400)}
}

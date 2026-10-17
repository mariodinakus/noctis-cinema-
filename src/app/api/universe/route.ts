import {NextResponse} from 'next/server';
import {CATALOG} from '@/lib/catalog';
import {fetchUniverse} from '../../../../scripts/generate-universe.mjs';
export const runtime='nodejs';
export const revalidate=86400;
export async function GET(){
 if(CATALOG.length>=1500)return NextResponse.json({movies:[],catalogue:CATALOG.length,source:'bundled'},{headers:{'Cache-Control':'public, s-maxage=86400'}});
 try{
  const films=await fetchUniverse();
  return NextResponse.json({movies:films,catalogue:films.length,source:'IMDb / Quantavil'},{headers:{'Cache-Control':'public, s-maxage=86400, stale-while-revalidate=604800'}});
 }catch{
  return NextResponse.json({movies:[],catalogue:CATALOG.length,source:'curated-fallback',message:'Expanded film feed temporarily unavailable.'},{status:503});
 }
}
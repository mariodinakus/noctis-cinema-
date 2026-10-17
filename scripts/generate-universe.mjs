/**
 * Build a local film snapshot from Quantavil's IMDb clean dataset.
 * Data provider: https://github.com/quantavil/imdb-dataset (GPL-3.0).
 * Download is part of the GitHub refresh workflow, NOT required to browse NOCTIS.
 * Metadata/poster URLs are attributed; this file never stores film images.
 */
import {gunzipSync} from 'node:zlib';
import {mkdir,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
const SOURCE='https://quantavil.github.io/imdb-dataset/titles.json.gz';
const CAPS=[['2020+',2020,2030,325],['2010s',2010,2020,425],['2000s',2000,2010,380],['1990s',1990,2000,300],['1980s',1980,1990,190],['1970s',1970,1980,140],['classics',1900,1970,190]];
const MAX=1950;
const genreAliases={"Sci-Fi":"Science Fiction","Film-Noir":"Film Noir"};
export function selectFilms(doc){
 const fields=doc.fields||[],rows=doc.data||[];if(!Array.isArray(fields)||!Array.isArray(rows)||rows.length<10000)throw Error('Catalog feed missing or malformed');
 const idx=(field)=>fields.indexOf(field);
 const at=(r,field)=>r[idx(field)];
 const seen=new Set();const universe=[];
 for(const row of rows){
  if(at(row,'type')!=='movie'||at(row,'is_adult')===1||at(row,'is_adult')===true)continue;
  const id=String(at(row,'id')||'');const title=String(at(row,'title')||'').trim();const year=Number(at(row,'year'));
  const votes=Number(at(row,'votes')||0),rating=Number(at(row,'rating')||0),runtime=Number(at(row,'runtime')||0);
  if(!/^tt\d+$/.test(id)||!title||title.length>160||!Number.isInteger(year)||year<1900||year>2026||votes<7500||rating<5.4||runtime<65||runtime>350)continue;
  const matchKey=title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'')+'-'+year;
  if(seen.has(matchKey))continue;seen.add(matchKey);
  const genres=String(at(row,'genres')||'').split(',').map(x=>x.trim()).filter(Boolean).slice(0,5).map(x=>genreAliases[x]||x);
  const poster=String(at(row,'poster')||'');
  const safePoster=/^https:\/\/(?:m\.media-amazon\.com|images-na\.ssl-images-amazon\.com|image\.tmdb\.org)\//.test(poster)?poster:null;
  const popularity=Number(at(row,'popularity')||0);
  universe.push({id:'imdb-'+id,imdbId:id,title,year,decade:Math.floor(year/10)*10,genre:genres.length?genres:['Drama'],minutes:runtime,director:'—',overview:'',poster:safePoster,backdrop:null,vote:rating,imdbVotes:votes,rank:Number(at(row,'rank')||0),popularity});
 }
 // Rank films by a Bayesian-inspired score so a rating based on 50,000 votes is not
 // automatically outweighed by a film with only 7,500 votes.
 const quality=(m)=>m.vote+Math.min(0.7,Math.log10(Math.max(1,m.imdbVotes))*0.10)+Math.min(.35,m.imdbVotes/800000*.35);
 universe.sort((a,b)=>quality(b)-quality(a)||b.imdbVotes-a.imdbVotes||a.id.localeCompare(b.id));
 const selected=[],chosen=new Set();
 for(const [,lo,hi,cap] of CAPS){let count=0;for(const m of universe){if(m.year>=lo&&m.year<hi&&!chosen.has(m.id)){chosen.add(m.id);selected.push(m);if(++count>=cap)break}}}
 if(selected.length<MAX)for(const m of universe){if(!chosen.has(m.id)){chosen.add(m.id);selected.push(m);if(selected.length>=MAX)break}}
 if(selected.length<1500)throw Error('Too few valid films in provider dataset: '+selected.length);
 selected.sort((a,b)=>b.year-a.year||b.imdbVotes-a.imdbVotes);
 // Keep output slim: the UI only consumes the regular Movie fields.
 return selected.map(({rank,popularity,imdbVotes,...m})=>m);
}
export async function fetchUniverse(){
 const response=await fetch(SOURCE,{headers:{'User-Agent':'NOCTIS film discovery (https://github.com/mariodinakus/noctis-cinema-)'},signal:AbortSignal.timeout(30000)});
 if(!response.ok)throw Error('Dataset request failed: HTTP '+response.status);
 const buf=Buffer.from(await response.arrayBuffer());
 if(buf.length>15000000)throw Error('Dataset unexpectedly large');
 const raw=buf[0]===0x1f&&buf[1]===0x8b?gunzipSync(buf):buf;
 return selectFilms(JSON.parse(raw.toString('utf8')));
}
async function main(){
 const films=await fetchUniverse();await mkdir('src/data',{recursive:true});
 await writeFile('src/data/universe.json',JSON.stringify(films));
 console.log(`NOCTIS universe: ${films.length} verified distinct movies from IMDb dataset`);
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href)main().catch(e=>{console.error('Universe generation failed:',e);process.exitCode=1});
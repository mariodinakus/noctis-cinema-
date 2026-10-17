import {Movie,Profile,entryMatch,watched,getEntry,MOODS} from './catalog';
export type Scored={movie:Movie;score:number;confidence:'low'|'medium'|'high';reason:string};
export function profileSignals(profile:Profile|null,catalog:Movie[]){
 const refs=(profile?.entries||[]).filter(x=>x.rating&&x.watched);
 const matched=refs.map(entry=>({entry,movie:catalog.find(m=>entryMatch(entry,m))})).filter(x=>x.movie) as {entry:{rating?:number};movie:Movie}[];
 const genres=new Map<string,{sum:number;n:number}>();const directors=new Map<string,{sum:number;n:number}>();const decades=new Map<number,{sum:number;n:number}>();
 for(const {entry,movie} of matched){const weight=((entry.rating||2.5)-2.5)/2.5;
 for(const g of movie.genre){const v=genres.get(g)||{sum:0,n:0};genres.set(g,{sum:v.sum+weight,n:v.n+1})}
 const d=directors.get(movie.director)||{sum:0,n:0};directors.set(movie.director,{sum:d.sum+weight,n:d.n+1});
 const v=decades.get(movie.decade)||{sum:0,n:0};decades.set(movie.decade,{sum:v.sum+weight,n:v.n+1});
 }
 return {genres,directors,decades,matched:matched.length,rated:refs.length,seen:profile?.entries.filter(x=>x.watched).length||0};
}
export function recommend(movies:Movie[],a:Profile|null,b:Profile|null,mood:string,duration:number,excludeWatched=true,couple=false,liked:string[]=[],listOnly=false){
 const signalA=profileSignals(a,movies),signalB=profileSignals(b,movies);const moodGenres=MOODS.find(m=>m.id===mood)?.genres||[];
 const scoreOne=(m:Movie,signal:ReturnType<typeof profileSignals>)=>{
  const genre=m.genre.reduce((s,g)=>{const v=signal.genres.get(g);return s+(v ? v.sum/Math.max(1,Math.sqrt(v.n)):0)},0)/Math.max(1,m.genre.length);
  const director=signal.directors.get(m.director),decade=signal.decades.get(m.decade);
  return 3.35+Math.max(-.7,Math.min(.7,genre*.55))+Math.max(-.35,Math.min(.35,(director?.sum||0)*.18)) + Math.max(-.15,Math.min(.15,(decade?.sum||0)*.03));
 };
 return movies.filter(m=>(!excludeWatched||(!watched(a,m)&&(!couple||!watched(b,m))))&&(!duration||!m.minutes||m.minutes<=duration)&&(!listOnly||liked.includes(m.id)||getEntry(a,m)?.watchlist||getEntry(b,m)?.watchlist)).map(movie=>{
  const ma=scoreOne(movie,signalA),mb=scoreOne(movie,signalB);const moodMatch=movie.genre.some(g=>moodGenres.includes(g))?.29:-.16;
  const base=(couple&&b?Math.min(ma,mb)*.72+(ma+mb)/2*.28:ma)+moodMatch+(movie.vote?Math.max(-.15,Math.min(.15,(movie.vote-7)/12)):0);
  const v=Math.max(1,Math.min(5,base));const weight=(couple?Math.min(signalA.matched,signalB.matched):signalA.matched);
  const confidence=weight>=20?'high':weight>=7?'medium':'low';
  const genre=movie.genre.find(g=>moodGenres.includes(g))||movie.genre[0]||'cinema';
  const reason=weight ? `Your rated films suggest an interest in ${genre.toLowerCase()}${signalA.directors.has(movie.director)?` and ${movie.director}`:''}.`:`Curated for your ${mood.replace('-',' ')} mood, with ${genre.toLowerCase()} themes.`;
  return {movie,score:v,confidence,reason} as Scored;
 }).sort((x,y)=>y.score-x.score||x.movie.title.localeCompare(y.movie.title));
}
export const posterPaths:Record<string,string>={
'The Lighthouse':'/3nk9UoepYmv1G9oP18q6JJCeYwN.jpg','The Prestige':'/tRNlZbgNCNOpLpbPEz5L8G8A0JN.jpg','Prisoners':'/uhviyknTT5cEQX11w0jFJ2tPcF.jpg','The Witch':'/zap5hpFCWSvdWSuPGAQyjUv2wAC.jpg','The Substance':'/lqoMzCcZYEFK729d6qzt349fB4o.jpg','Her':'/eCOtqtfvn7mxGl6nfmq4b1exJRc.jpg','Memories of Murder':'/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg','Parasite':'/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg','Whiplash':'/7fn624j5lj3xTme2SgiLCeuedmO.jpg','The Grand Budapest Hotel':'/eWdyYQreja6JGCzqHWXpWHDrrPo.jpg','The Truman Show':'/vuza0WqY239yBXOadKlGwJsZJFE.jpg','The Shining':'/nRj5511mZdTl4saWEPoj9QroTIu.jpg','The Thing':'/tzGY49kseSE9QAKk47uuDGwnSCu.jpg','No Country for Old Men':'/bj1v6YKF8yHqA489VFfnQvOJpnc.jpg','Arrival':'/x2FJsf1ElAgr63Y3PNPtJrcmpoe.jpg','Eternal Sunshine of the Spotless Mind':'/5MwkWH9tYHv3mV9OdYTMR5qreIz.jpg','Poor Things':'/kQs6keheMwCxJxrzV83VUwFtHkB.jpg','Coherence':'/ezUtb9m5DeLwL2gxi4gktzNCcwn.jpg','The Menu':'/v31MsWhF9WFh7Qooq6xSBbmJxoG.jpg','The Lobster':'/7Y9mHi0T8ZtS9NVo5W4shPGeB77.jpg','The Banshees of Inisherin':'/4yFG6cSPaCaPhyJ1vtGOtMD1lgh.jpg',
};
export function poster(m:Movie){return m.poster||(posterPaths[m.title]?`https://image.tmdb.org/t/p/w500${posterPaths[m.title]}`:'');}

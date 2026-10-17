import universe from '@/data/universe.json';
export type Movie = { imdbId?:string; id:string; title:string; year:number; genre:string[]; minutes:number; overview:string; director:string; decade:number; poster?:string|null; backdrop?:string|null; tmdbId?:number; vote?:number; color?:string; tagline?:string };
export type FilmEntry = {title:string;year:number;rating?:number;watched?:boolean;watchlist?:boolean};
export type Profile = {id:'a'|'b';name:string;entries:FilmEntry[];importedAt:number};
export type Screen = 'tonight'|'discover'|'taste'|'couple'|'watchlist'|'streaming'|'settings';
export const GENRE_IDS:Record<string,number> = {Action:28,Adventure:12,Animation:16,Comedy:35,Crime:80,Documentary:99,Drama:18,Family:10751,Fantasy:14,History:36,Horror:27,Music:10402,Mystery:9648,Romance:10749,'Science Fiction':878,Thriller:53,War:10752,Western:37};
export const MOODS = [
  {id:'haunting',label:'Haunting',el:'Ατμοσφαιρικό',genres:['Drama','Mystery','Thriller']},
  {id:'mind',label:'Mind-bending',el:'Ανατροπές',genres:['Science Fiction','Mystery','Thriller']},
  {id:'intense',label:'Unsettling',el:'Σκοτεινό',genres:['Horror','Thriller','Crime']},
  {id:'tender',label:'Dreamy',el:'Ρομαντικό',genres:['Romance','Drama','Fantasy']},
  {id:'bright',label:'Comfort',el:'Χαλαρό',genres:['Comedy','Adventure','Animation']},
  {id:'classic',label:'Masterpiece',el:'Αριστούργημα',genres:['Drama','History','Crime']},
] as const;
const raw: Array<[string,number,number,string,string,string,string,string?]> = [
 ['The Lighthouse',2019,109,'Horror|Drama|Mystery','Robert Eggers','Two lighthouse keepers descend into a fever dream of isolation and obsession.','#4b3942','Madness in monochrome'],
 ['The Handmaiden',2016,145,'Thriller|Drama|Romance','Park Chan-wook','An intricate tale of deception, desire and shifting allegiances.','#56634d'],
 ['The Prestige',2006,130,'Drama|Mystery|Thriller','Christopher Nolan','Two rival magicians will sacrifice almost anything for the perfect illusion.','#75503d'],
 ['The Others',2001,104,'Horror|Mystery|Thriller','Alejandro Amenábar','A mother and her children live in a dark mansion filled with unsettling secrets.','#66605f'],
 ['Coherence',2013,89,'Science Fiction|Thriller|Mystery','James Ward Byrkit','A dinner party becomes an unsettling puzzle after a comet passes overhead.','#4f294d'],
 ['The Wailing',2016,156,'Horror|Mystery|Thriller','Na Hong-jin','A remote village confronts a series of inexplicable violent events.','#4b3d36'],
 ['Prisoners',2013,153,'Drama|Thriller|Crime','Denis Villeneuve','A desperate father crosses moral lines after two girls go missing.','#4a514e'],
 ['Incendies',2010,131,'Drama|Mystery|War','Denis Villeneuve','Twins uncover a harrowing truth about their mother’s past.','#765b49'],
 ['The Witch',2015,92,'Horror|Drama|Mystery','Robert Eggers','A family is haunted by fear and suspicion in seventeenth-century New England.','#604a46'],
 ['The Banshees of Inisherin',2022,114,'Drama|Comedy','Martin McDonagh','A friendship ruptures on a remote island, with painful consequences.','#4d5d63'],
 ['Aftersun',2022,102,'Drama','Charlotte Wells','A woman reflects on a holiday with her father, finding meaning in remembered fragments.','#916b62'],
 ['Past Lives',2023,106,'Drama|Romance','Celine Song','Two childhood friends reckon with connection, time and paths not taken.','#62505b'],
 ['Perfect Days',2023,124,'Drama','Wim Wenders','A Tokyo cleaner finds grace in a ritual of ordinary moments.','#57614c'],
 ['The Substance',2024,141,'Horror|Science Fiction|Thriller','Coralie Fargeat','A provocative body-horror satire about youth and beauty.','#ad3544'],
 ['Her',2013,126,'Drama|Romance|Science Fiction','Spike Jonze','An intimate exploration of love and loneliness in a near-future world.','#a74442'],
 ['Memories of Murder',2003,131,'Crime|Drama|Thriller','Bong Joon-ho','Detectives confront an elusive killer and their own limitations.','#5e5a4d'],
 ['Mulholland Drive',2001,147,'Mystery|Thriller|Drama','David Lynch','An aspiring actress enters a labyrinthine Hollywood mystery.','#545076'],
 ['The Lobster',2015,119,'Comedy|Drama|Romance','Yorgos Lanthimos','In a bizarre society, single people face an impossible deadline.','#606a6a'],
 ['The Killing of a Sacred Deer',2017,121,'Drama|Thriller|Horror','Yorgos Lanthimos','A surgeon’s life unravels under an increasingly sinister bargain.','#68555d'],
 ['Drive My Car',2021,179,'Drama','Ryusuke Hamaguchi','An actor and his driver find unexpected connection through grief and art.','#7c3f42'],
 ['Portrait of a Lady on Fire',2019,122,'Drama|Romance','Céline Sciamma','A painter and her subject experience a quietly devastating love.','#9b6256'],
 ['Anatomy of a Fall',2023,151,'Drama|Mystery|Thriller','Justine Triet','An investigation into a man’s death tests the stories a marriage can tell.','#5c6066'],
 ['The Zone of Interest',2023,105,'Drama|History|War','Jonathan Glazer','The ordinary domestic world beside a place of unimaginable horror.','#808078'],
 ['Children of Men',2006,109,'Drama|Science Fiction|Thriller','Alfonso Cuarón','In a world facing extinction, one man protects a fragile hope.','#556064'],
 ['Arrival',2016,116,'Drama|Science Fiction|Mystery','Denis Villeneuve','A linguist searches for understanding after alien vessels arrive on Earth.','#5f6467'],
 ['The Grand Budapest Hotel',2014,100,'Comedy|Drama|Adventure','Wes Anderson','A stylish comic adventure across a changing European landscape.','#ae7267'],
 ['Little Miss Sunshine',2006,102,'Comedy|Drama','Jonathan Dayton & Valerie Faris','An endearingly dysfunctional family takes a chaotic road trip.','#b38448'],
 ['Before Sunrise',1995,101,'Drama|Romance','Richard Linklater','Two strangers connect during one magical night in Vienna.','#856d5e'],
 ['Before Sunset',2004,80,'Drama|Romance','Richard Linklater','An unexpected reunion in Paris rekindles a conversation begun years earlier.','#866d54'],
 ['The Holdovers',2023,133,'Comedy|Drama','Alexander Payne','An irritable teacher forms an unlikely bond during winter break.','#6b6151'],
 ['The Truman Show',1998,103,'Comedy|Drama','Peter Weir','A man begins to question the reality of his seemingly perfect world.','#5b7785'],
 ['Eternal Sunshine of the Spotless Mind',2004,108,'Science Fiction|Romance|Drama','Michel Gondry','Two people discover the complicated cost of forgetting love.','#5b607e'],
 ['Parasite',2019,132,'Thriller|Comedy|Drama','Bong Joon-ho','A poor family enters the lives of a wealthy household with startling consequences.','#617263'],
 ['Whiplash',2014,107,'Drama|Music','Damien Chazelle','A gifted drummer pushes himself toward brilliance and the breaking point.','#876046'],
 ['No Country for Old Men',2007,122,'Crime|Drama|Thriller','Joel & Ethan Coen','A chance discovery sets off a merciless pursuit across Texas.','#766049'],
 ['The Tree of Life',2011,139,'Drama|Fantasy','Terrence Malick','A lyrical meditation on family, memory and existence.','#87755d'],
 ['The Favourite',2018,120,'Drama|Comedy|History','Yorgos Lanthimos','Rivalries and ambitions collide in Queen Anne’s court.','#83725d'],
 ['The Fall',2006,117,'Drama|Fantasy|Adventure','Tarsem Singh','A storyteller conjures a dazzling world for an injured young girl.','#955e56'],
 ['A Ghost Story',2017,92,'Drama|Fantasy|Romance','David Lowery','A quiet, uncanny reflection on grief and the passage of time.','#6c716f'],
 ['The Night of the Hunter',1955,93,'Thriller|Crime|Drama','Charles Laughton','A sinister preacher casts a long shadow over two children.','#535761'],
 ['The Seventh Seal',1957,96,'Drama|Fantasy','Ingmar Bergman','A medieval knight plays chess with Death while confronting his beliefs.','#625f63'],
 ['12 Angry Men',1957,97,'Drama','Sidney Lumet','One juror challenges the certainty of eleven others.','#716d60'],
 ['Persona',1966,83,'Drama|Mystery','Ingmar Bergman','Two women’s identities begin to blur on an isolated island.','#6a6260'],
 ['The Thing',1982,109,'Horror|Science Fiction|Mystery','John Carpenter','An Antarctic research team confronts an entity that can imitate anyone.','#59717d'],
 ['The Shining',1980,144,'Horror|Thriller','Stanley Kubrick','Isolation at a grand hotel descends into madness.','#886447'],
 ['Stalker',1979,162,'Science Fiction|Drama','Andrei Tarkovsky','A guide leads two travelers into a forbidden zone of uncertain promise.','#67715d'],
 ['The Secret in Their Eyes',2009,129,'Thriller|Crime|Drama','Juan José Campanella','An investigator remains haunted by an unsolved crime and an unspoken love.','#6e6460'],
 ['The Menu',2022,107,'Horror|Thriller|Comedy','Mark Mylod','An exclusive dinner turns into a terrifying theatrical experience.','#7a4b46'],
 ['Poor Things',2023,141,'Science Fiction|Romance|Comedy','Yorgos Lanthimos','A young woman embarks on an extraordinary journey of self-discovery.','#8d6685'],
];
const CURATED:Movie[] = raw.map(([title,year,minutes,genre,director,overview,color,tagline],i)=>({id:`curated-${i}`,title,year,minutes,genre:genre.split('|'),director,overview,color,tagline,decade:Math.floor(year/10)*10}));
// The curated films keep their descriptions and directors; the larger universe supplies genres,
// runtimes, IMDb scores and posters. Deduplicate by normalized title and release year.
const catalogByKey=new Map<string,Movie>();
const movieKey=(m:Movie)=>`${m.title.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]/g,'')}-${m.year}`;
for(const m of universe as Movie[]) catalogByKey.set(movieKey(m),m);
for(const m of CURATED){const key=movieKey(m);const candidate=catalogByKey.get(key);catalogByKey.set(key,{...candidate,...m,poster:candidate?.poster||m.poster||null,imdbId:candidate?.imdbId,vote:candidate?.vote||m.vote})}
export const CATALOG:Movie[]=[...catalogByKey.values()];
export function keyOf(title:string,year?:number){return `${title.normalize('NFKD').replace(/[\u0300-\u036f]/g,'').toLowerCase().replace(/^the /,'').replace(/[^a-z0-9]+/g,'').trim()}-${year||''}`;}
export function entryMatch(a:{title:string;year:number},b:{title:string;year:number}) {return keyOf(a.title,a.year)===keyOf(b.title,b.year)|| (Math.abs(a.year-b.year)<=1&&keyOf(a.title).split('-')[0]===keyOf(b.title).split('-')[0]);}
export function watched(profile:Profile|null,m:Movie){return !!profile?.entries.some(e=>e.watched&&entryMatch(e,m));}
export function getEntry(profile:Profile|null,m:Movie){return profile?.entries.find(e=>entryMatch(e,m));}
export function decadeLabel(year:number){return `${Math.floor(year/10)*10}s`;}
export function titleSlug(title:string){return title.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')}
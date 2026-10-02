import { createFileRoute } from '@tanstack/react-router';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Heart, ArrowRight, Volume2, VolumeX, Sparkles, X, Settings2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { storyConfig } from '@/lib/story-config';
import coupleArt from '@/assets/couple-illustration.png';

export const Route = createFileRoute('/')({
  head: () => ({ meta: [
    { title: 'For Pallavi ❤️ — A little world from Hakim' },
    { name: 'description', content: 'Nine little rooms, a thousand little reasons. A love story made for Pallavi by Hakim.' },
    { property: 'og:title', content: 'For Pallavi ❤️ — A little world from Hakim' },
    { property: 'og:description', content: 'Nine little rooms, a thousand little reasons. A love story made for Pallavi by Hakim.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: Story,
});

type Config = typeof storyConfig;
const flowers = [
  [85,93],[110,65],[140,105],[161,68],[196,82],[219,50],[249,89],[270,58],[302,99],[330,72],
  [63,128],[113,132],[151,139],[187,119],[221,137],[265,128],[309,140],[349,118],
  [95,169],[143,178],[184,158],[234,173],[287,168],[335,161],
  [44,95],[78,53],[124,91],[175,45],[216,112],[281,29],[320,48],[367,87],
  [55,178],[101,200],[155,116],[203,187],[252,152],[298,193],[342,190],[360,148],
] as const;
const flowerColors = ['var(--primary)', 'var(--accent)', 'var(--gold)', 'var(--paper)', 'var(--petal)'];
const floatData = Array.from({ length: 18 }, (_, i) => ({ left: `${(i * 47 + 7) % 95}%`, top: `${(i * 31 + 9) % 91}%`, duration: `${6 + i % 6}s`, size: `${13 + i % 4 * 6}px`, glyph: i % 3 === 0 ? '✿' : i % 3 === 1 ? '♡' : '✦' }));
const memoryRotation = ['-8deg','6deg','-4deg','8deg','-6deg','4deg'];
const initialTiles = [0,1,2,3,4,5,6,7,8];
function scrambledTiles() {
  const tiles = [...initialTiles]; let last = -1;
  for (let step = 0; step < 36; step++) {
    const blank = tiles.indexOf(8);
    const options = [blank - 3, blank + 3, blank % 3 ? blank - 1 : -1, blank % 3 < 2 ? blank + 1 : -1].filter(n => n >= 0 && n < 9 && n !== last);
    const next = options[(step * 7 + 3) % options.length];
    if (next === undefined) continue;
    const piece = tiles[next]; const empty = tiles[blank];
    if (piece === undefined || empty === undefined) continue;
    tiles[blank] = piece; tiles[next] = empty; last = blank;
  }
  return tiles.every((v, i) => v === i) ? [1,0,2,3,4,5,6,8,7] : tiles;
}
function Floaties({ many = false }: { many?: boolean }) {
  return <div className="floaties" aria-hidden="true">{floatData.slice(0, many ? 18 : 10).map((item, i) => <span className="floaty" key={i} style={{ left: item.left, top: item.top, animationDuration: item.duration, fontSize: item.size }}>{item.glyph}</span>)}</div>;
}
function NextButton({ children, onClick }: { children: React.ReactNode; onClick: () => void }) {
  return <Button variant="story" className="story-button mt-8" onClick={onClick}>{children}<ArrowRight size={16}/></Button>;
}
function Tree({ blooms, onTap }: { blooms: number; onTap: () => void }) {
  return <div className="tree-stage"><svg viewBox="0 0 400 390" role="img" aria-label={`${blooms} flowers growing on the love tree`}>
    <path d="M195 371 Q207 304 193 244 Q179 195 180 144 M197 273 Q238 241 271 183 Q291 146 312 126 M188 246 Q148 206 114 169 Q94 139 73 123 M181 190 Q218 164 223 105 Q230 73 251 49 M181 186 Q148 153 139 106 Q130 75 111 66 M207 239 Q254 217 326 211 M170 227 Q127 210 78 218" fill="none" stroke="var(--ink-soft)" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M195 370 Q213 289 192 240 M181 187 Q211 177 224 114 M199 274 Q247 238 275 188" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" opacity=".5"/>
    <path d="M206 286 Q246 282 260 263 Q227 249 206 286 M164 247 Q136 246 123 225 Q149 220 164 247 M264 199 Q284 204 301 185 Q275 179 264 199 M127 180 Q107 182 95 166 Q119 160 127 180 M187 160 Q204 148 205 128 Q184 136 187 160" fill="var(--ink-soft)" opacity=".65"/>
    {flowers.slice(0, blooms).map(([x,y], i) => <g key={i} className="tree-flower" style={{ transformOrigin: `${x}px ${y}px` }}><circle cx={x} cy={y-8} r="8" fill={flowerColors[i%5]}/><circle cx={x+8} cy={y-2} r="8" fill={flowerColors[i%5]}/><circle cx={x+5} cy={y+8} r="8" fill={flowerColors[i%5]}/><circle cx={x-6} cy={y+6} r="8" fill={flowerColors[i%5]}/><circle cx={x-8} cy={y-3} r="8" fill={flowerColors[i%5]}/><circle cx={x} cy={y} r="4" fill="var(--gold)"/></g>)}
    <path d="M110 376 Q193 367 280 376" stroke="var(--gold)" strokeWidth="2" fill="none"/>
  </svg>{blooms >= flowers.length && <Button variant="ghost" className="absolute inset-0 h-full w-full opacity-0" aria-label="Tap the flowers to enter the memories" onClick={onTap}/>}</div>;
}
function Story() {
  const [scene, setScene] = useState(0);
  const [config, setConfig] = useState<Config>(storyConfig);
  const [ready, setReady] = useState(false);
  const [blooms, setBlooms] = useState(0);
  const [activePhoto, setActivePhoto] = useState<number | null>(null);
  const [viewed, setViewed] = useState<number[]>([]);
  const [tiles, setTiles] = useState<number[]>(() => scrambledTiles());
  const [moves, setMoves] = useState(0);
  const [solved, setSolved] = useState(false);
  const [knocks, setKnocks] = useState(0);
  const [doorOpen, setDoorOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [envelopeOpening, setEnvelopeOpening] = useState(false);
  const [finalEntered, setFinalEntered] = useState(false);
  const [secretTaps, setSecretTaps] = useState(0);
  const [secret, setSecret] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [burst, setBurst] = useState(false);
  const [musicEnded, setMusicEnded] = useState(false);
  const [musicError, setMusicError] = useState(false);
  const audio = useRef<HTMLAudioElement>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const reduceMotion = useReducedMotion();
  useEffect(() => { const timer = window.setTimeout(() => setReady(true), 1400); return () => clearTimeout(timer); }, []);
  useEffect(() => { if (!secret) return; const timer = window.setTimeout(() => setSecret(''), 4500); return () => clearTimeout(timer); }, [secret]);
  useEffect(() => { if (!burst) return; const timer = window.setTimeout(() => setBurst(false), 1700); return () => clearTimeout(timer); }, [burst]);
  const next = () => { setBurst(true); setScene(n => Math.min(n+1, 8)); };
  const openSurprise = () => {
    if (audio.current && config.music && !musicEnded) {
      audio.current.currentTime = 0;
      audio.current.play().then(() => setSoundOn(true)).catch(() => setMusicError(true));
    }
    next();
  };
  const chime = (freq = 540) => {
    if (!soundOn) return;
    try { const ctx = audioContext.current ?? new AudioContext(); audioContext.current = ctx; const oscillator = ctx.createOscillator(); const gain = ctx.createGain(); oscillator.type = 'sine'; oscillator.frequency.setValueAtTime(freq, ctx.currentTime); oscillator.frequency.exponentialRampToValueAtTime(freq * .75, ctx.currentTime + .22); gain.gain.setValueAtTime(.055, ctx.currentTime); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + .28); oscillator.connect(gain).connect(ctx.destination); oscillator.start(); oscillator.stop(ctx.currentTime + .3); } catch { /* audio is optional */ }
  };
  const moveTile = (index: number) => {
    if (solved) return;
    const blank = tiles.indexOf(8);
    if (!(Math.floor(index / 3) === Math.floor(blank / 3) && Math.abs(index - blank) === 1) && Math.abs(index - blank) !== 3) return;
    const updated = [...tiles]; const piece = updated[index]; const empty = updated[blank];
    if (piece === undefined || empty === undefined) return;
    updated[blank] = piece; updated[index] = empty;
    setTiles(updated); setMoves(n => n + 1); chime(440);
    if (updated.every((v,i) => v === i)) { setSolved(true); setBurst(true); chime(820); }
  };
  const knock = () => {
    if (doorOpen) return;
    chime(160);
    setKnocks(n => { if (n >= 2) { setDoorOpen(true); window.setTimeout(next, 1800); return 3; } return n+1; });
  };
  const upload = (file: File | undefined, kind: 'memory' | 'puzzle' | 'music' | 'video', index = 0) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    if (kind === 'memory') setConfig(c => ({ ...c, memories: c.memories.map((m,i) => i === index ? { ...m, image: url } : m) }));
    if (kind === 'puzzle') setConfig(c => ({ ...c, puzzleImage: url }));
    if (kind === 'music') setConfig(c => ({ ...c, music: url }));
    if (kind === 'video') setConfig(c => ({ ...c, videos: [...c.videos, url] }));
  };
  const toggleSound = () => {
    if (musicEnded || musicError || !config.music) return;
    if (soundOn) { audio.current?.pause(); setSoundOn(false); }
    else { audio.current?.play().then(() => setSoundOn(true)).catch(() => setMusicError(true)); }
  };
  const sceneClass = `story ${scene === 5 ? 'story--night' : scene === 1 || scene === 3 ? 'story--pink' : scene === 8 ? 'story--final' : ''}`;
  return <main className={sceneClass}>
    {config.music && <audio ref={audio} src={config.music} preload="auto" onEnded={() => {setMusicEnded(true);setSoundOn(false);}} onError={() => setMusicError(true)}/>}
    <div className="story-progress" aria-label={`Room ${scene+1} of 9`}>{Array.from({length:9},(_,i) => <i key={i} className={i <= scene ? 'current' : ''}/>)}</div>
    <div className="customize">
      <button className="customize-toggle" onClick={() => setSettingsOpen(v => !v)} aria-label="Customize story" title="Customize story"><Settings2 size={17}/></button>
      {settingsOpen && <div className="customize-panel"><div className="flex items-center justify-between"><strong className="font-display text-2xl">Make it yours</strong><Button size="icon" variant="ghost" onClick={() => setSettingsOpen(false)} aria-label="Close customization"><X/></Button></div>
        <p className="story-small">Your changes preview on this device. For a permanent shared version, update the story content before sending the link.</p>
        <label>Her name<input value={config.names.to} onChange={e => setConfig(c => ({...c, names:{...c.names,to:e.target.value}}))}/></label>
        <label>Your name<input value={config.names.from} onChange={e => setConfig(c => ({...c, names:{...c.names,from:e.target.value}}))}/></label>
        <label>Special date<input value={config.date} onChange={e => setConfig(c => ({...c,date:e.target.value}))}/></label>
        <label>What the date means<input value={config.dateMeaning} onChange={e => setConfig(c => ({...c,dateMeaning:e.target.value}))}/></label>
        <label>Love letter<textarea value={config.letter} onChange={e => setConfig(c => ({...c,letter:e.target.value}))}/></label>
        {config.memories.map((m,i) => <div key={i}><label>Memory {i+1} caption<input value={m.caption} onChange={e => setConfig(c => ({...c, memories:c.memories.map((item,j) => j === i ? {...item,caption:e.target.value} : item)}))}/></label><label>Memory {i+1} photo<input type="file" accept="image/*" onChange={e => upload(e.target.files?.[0],'memory',i)}/></label></div>)}
        <label>Puzzle photo<input type="file" accept="image/*" onChange={e => { upload(e.target.files?.[0],'puzzle'); setTiles(scrambledTiles()); setSolved(false); setMoves(0); }}/></label>
        <label>Background music<input type="file" accept="audio/*" onChange={e => upload(e.target.files?.[0],'music')}/></label>
        <label>Video memory<input type="file" accept="video/*" onChange={e => upload(e.target.files?.[0],'video')}/></label>
      </div>}
    </div>
    {scene > 0 && !musicEnded && !musicError && config.music && <Button variant="ghost" size="icon" className="absolute bottom-5 left-5 z-10 opacity-60" onClick={toggleSound} aria-label={soundOn ? 'Pause music' : 'Resume music'} title={soundOn ? 'Pause music' : 'Resume music'}>{soundOn ? <Volume2/> : <VolumeX/>}</Button>}
    <Floaties many={scene === 8}/>
    <AnimatePresence mode="wait"><motion.div key={scene} className="story-shell" initial={{ opacity:0, scale: reduceMotion ? 1 : .985, y: reduceMotion ? 0 : 16 }} animate={{ opacity:1, scale:1, y:0 }} exit={{ opacity:0, scale: reduceMotion ? 1 : 1.015, y: reduceMotion ? 0 : -14 }} transition={{ duration: reduceMotion ? 0 : .62, ease:[.22,1,.36,1] }}>
      {scene === 0 && <>
        <div className="opening-bouquet" aria-hidden="true">{Array.from({length:24},(_,i) => <span key={i} className="opening-flower" style={{'--flower-angle':`${i*15}deg`,'--flower-distance':`${110+i%4*20}px`,'--flower-delay':`${i*.08}s`}}>{i%4===0 ? '✿' : i%3===0 ? '❀' : '✾'}</span>)}</div>
        <motion.div className="story-hero-heart" animate={reduceMotion ? {} : { y:[0,-5,0], rotate:[-2,2,-2] }} transition={{duration:5,repeat:Infinity,ease:'easeInOut'}}><Heart fill="currentColor"/></motion.div>
        <div className="story-kicker">A little world, made just for you</div>
        <h1 className="story-title">Hey <em>{config.names.to}.</em> <span className="inline-block text-[.5em] align-middle">♡</span></h1>
        <AnimatePresence>{ready && <motion.div initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} transition={{duration:.8}}><p className="story-hand mt-4">I made something for you...</p><p className="story-small mt-7">Are you ready?</p><NextButton onClick={openSurprise}>Open your surprise</NextButton></motion.div>}</AnimatePresence>
        <span className="story-ornament mt-16">✦ &nbsp; ♡ &nbsp; ✦</span>
      </>}
      {scene === 1 && <>
        <span className="story-ornament">✦ &nbsp; ♡ &nbsp; ✦</span><div className="story-kicker mt-10">a small confession</div>
        <h2 className="story-title mt-5">Still you.<br/><em>Always you.</em> ♡</h2>
        <motion.p className="story-copy mt-8" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1,duration:1.4}}>Because somehow...<br/>out of all the people in this world,<br/><em className="text-primary">I found you.</em></motion.p>
        <motion.div initial={{pathLength:0}} className="mt-8 text-primary"><Heart size={44} strokeWidth={1.2}/></motion.div>
        <NextButton onClick={next}>There's more...</NextButton>
      </>}
      {scene === 2 && <>
        <div className="story-kicker">room three · a little thing called love</div>
        <h2 className="story-title text-[48px] sm:text-[70px]">The love <em>tree.</em></h2>
        <p className="story-copy text-[23px] sm:text-[30px]">{blooms >= flowers.length ? 'Look what you helped me grow. ❤️' : 'Something beautiful needs a little love...'}</p>
        <Tree blooms={blooms} onTap={next}/>
        {blooms < flowers.length ? <><Button variant="story" className="tree-tap" onClick={() => { setBlooms(n => Math.min(n+5,flowers.length)); chime(500+blooms*13); }} aria-label="Tap the heart to grow flowers">♥</Button><p className="story-small mt-3">Tap the heart ♡ &nbsp; {Math.ceil((flowers.length-blooms)/5)} more to bloom</p></> : <><p className="story-hand">Our little world.</p><p className="story-small mt-2">Tap the flowers...</p></>}
      </>}
      {scene === 3 && <>
        <div className="story-kicker">room four · moments worth keeping</div><h2 className="story-title text-[46px] sm:text-[76px]">Our <em>memories.</em></h2>
        <p className="story-copy text-[21px] sm:text-[30px]">Some moments just stay with you...</p>
        <div className="memory-grid">{config.memories.map((m,i) => <motion.button key={i} className={`polaroid ${activePhoto === i ? 'active' : ''}`} style={{'--rotation':memoryRotation[i] ?? '0deg'}} initial={{opacity:0,y:35,rotate: i%2 ? 12 : -12}} animate={{opacity:1,y:0,rotate:0}} transition={{delay:i*.1}} onClick={() => {setActivePhoto(i);setViewed(v => v.includes(i) ? v : [...v,i]); chime(500+i*35);}} aria-label={`View memory: ${m.caption}`}><img src={m.image} alt={m.caption} loading="lazy"/><span>{m.caption}</span></motion.button>)}</div>
        <p className="story-small">These are some of my favorite memories with you. ❤️</p>
        {viewed.length >= 3 ? <NextButton onClick={next}>Ready for a little challenge?</NextButton> : <p className="story-small mt-5">Open {3-viewed.length} more {3-viewed.length === 1 ? 'memory' : 'memories'}...</p>}
        {config.videos.length > 0 && <div className="flex gap-2 mt-5 overflow-x-auto max-w-full">{config.videos.map((video,i) => <video key={i} controls playsInline src={video} className="w-36 aspect-video object-cover"/>)}</div>}
      </>}
      {scene === 4 && <>
        <div className="story-kicker">room five · the little challenge</div><h2 className="story-title text-[50px] sm:text-[80px]">Piece by <em>piece.</em></h2>
        <p className="story-copy text-[22px] sm:text-[30px]">One memory. Nine pieces.<br/>Can you put us back together? ♡</p>
        <div className="puzzle" role="grid" aria-label="Sliding photo puzzle">{tiles.map((tile,i) => tile === 8 ? <div key="blank" className="puzzle-empty" role="gridcell">♡</div> : <button key={tile} role="gridcell" className="puzzle-piece" aria-label={`Move puzzle piece ${tile+1}`} onClick={() => moveTile(i)} style={{backgroundImage:`url(${config.puzzleImage})`,backgroundPosition:`${tile%3*50}% ${Math.floor(tile/3)*50}%`}}/>)}</div>
        <p className="story-small">Moves: {moves}</p>
        {solved ? <motion.div initial={{opacity:0,scale:.8}} animate={{opacity:1,scale:1}}><p className="story-hand mt-5">You put us back together. ✨</p><p className="story-copy text-[22px] mt-2">And honestly...<br/>that's what love feels like.</p><NextButton onClick={next}>Continue ❤️</NextButton></motion.div> : <><p className="story-small mt-3">Tap a piece beside the empty space.</p><Button variant="ghost" className="mt-2 text-muted-foreground" onClick={() => {setTiles(scrambledTiles());setMoves(0);}}><RotateCcw size={14}/> Shuffle again</Button></>}
      </>}
      {scene === 5 && <>
        <div className="story-kicker">room six · beyond this door</div><h2 className="story-title text-[50px] sm:text-[75px]">There's one <em>more place...</em></h2>
        <p className="story-copy text-[22px] sm:text-[29px]">{config.names.from} built something just for you.</p>
        <div className="door-scene"><div className="door-light"/><div role="button" tabIndex={0} aria-label={`Knock on the door, ${3-knocks} knocks remaining`} className={`door ${doorOpen ? 'open' : ''}`} onClick={knock} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') knock(); }}><div className="door-panel"/><span className="door-knob"/></div></div>
        <p className="story-hand text-[28px] sm:text-[36px]">{doorOpen ? 'Come inside...' : knocks ? `${3-knocks} more ${3-knocks===1 ? 'knock' : 'knocks'}...` : "Knock three times. That's the rule. ❤️"}</p>
      </>}
      {scene === 6 && <>
        <div className="story-kicker">room seven · a quiet moment</div><h2 className="story-title text-[55px] sm:text-[90px]">From me <em>to you.</em></h2>
        <p className="story-hand mt-2">This is how much I love you.</p>
        <img src={coupleArt} className="couple-art" alt="A painted couple sitting together on a rose-covered bench" loading="lazy" width={1024} height={1024}/>
        <motion.p className="story-copy text-[25px] sm:text-[36px]" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:.7,duration:1}}>If I could go back to the beginning...<br/><em className="text-primary">I would still choose you.</em><br/>Every single time.</motion.p>
        <NextButton onClick={next}>Read what I couldn't say...</NextButton>
      </>}
      {scene === 7 && <>
        <div className="story-kicker">room eight · the words I kept for you</div><h2 className="story-title text-[55px] sm:text-[85px]">A love <em>letter.</em></h2>
        {!letterOpen ? <><div role="button" tabIndex={0} aria-label="Open the envelope to Pallavi" className={`envelope ${envelopeOpening ? 'open' : ''}`} onClick={() => {if (envelopeOpening) return; setEnvelopeOpening(true); chime(650); window.setTimeout(() => setLetterOpen(true), 1000);}} onKeyDown={e => {if((e.key === 'Enter' || e.key === ' ') && !envelopeOpening) { setEnvelopeOpening(true); window.setTimeout(() => setLetterOpen(true), 1000); }}}><div className="envelope-label">To {config.names.to} ♡</div></div><p className="story-hand">Tap to open...</p></> : <motion.div className="w-full" initial={{opacity:0,y:80}} animate={{opacity:1,y:0}} transition={{duration:.9}}><div className="letter-paper"><p>{config.letter}</p></div><p className="story-small">Just one more thing...</p><NextButton onClick={next}>One last room</NextButton></motion.div>}
      </>}
      {scene === 8 && <>
        {!finalEntered ? <><div className="story-kicker">the final room · just for you</div><h2 className="story-title">One last <em>room...</em></h2><div className="story-hero-heart my-10"><Sparkles size={65} strokeWidth={1.1}/></div><NextButton onClick={() => {setFinalEntered(true);setBurst(true);}}>Enter ❤️</NextButton></> : <>
          <div className="final-photo a"><img src={config.memories[0]?.image ?? config.puzzleImage} alt="Memory"/></div><div className="final-photo b"><img src={config.memories[1]?.image ?? config.puzzleImage} alt="Memory"/></div><div className="final-photo c"><img src={config.memories[2]?.image ?? config.puzzleImage} alt="Memory"/></div>
          <motion.div initial={{opacity:0,scale:.7}} animate={{opacity:1,scale:1}} transition={{duration:1.3}}><div className="story-kicker">and after all of it, there is you</div><h2 className="story-title mt-6"><em>{config.names.to}.</em> ♡</h2></motion.div>
          <motion.p className="story-copy mt-8 text-[27px] sm:text-[37px]" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2}}>From two strangers...</motion.p>
          <motion.p className="story-copy text-[27px] sm:text-[37px]" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:2.4}}>...to two people...</motion.p>
          <motion.p className="story-copy text-[27px] sm:text-[37px]" initial={{opacity:0}} animate={{opacity:1}} transition={{delay:3.6}}>...building a lifetime together.</motion.p>
          <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:4.8}} className="mt-7"><div className="story-ornament">✦ &nbsp; ♡ &nbsp; ✦</div><p className="story-hand mt-4 text-[48px] sm:text-[65px]">{config.date} ❤️</p><p className="story-small mt-1">{config.dateMeaning}</p></motion.div>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:6}} className="mt-10"><p className="story-copy text-[30px] sm:text-[42px]">Still you.<br/>Always you.<br/>My favorite person.<br/>My safest place.<br/>My forever.</p><p className="story-hand mt-6 text-[45px] sm:text-[60px]">I love you. ❤️</p><div className="story-kicker mt-8">Forever yours, {config.names.from}</div></motion.div>
        </>}
      </>}
    </motion.div></AnimatePresence>
    {burst && <div className="floaties z-20" aria-hidden="true">{Array.from({length:32},(_,i) => <motion.span key={i} className="absolute left-1/2 top-1/2 text-primary text-2xl" initial={{x:0,y:0,opacity:1,scale:.3}} animate={{x:Math.cos(i*2.4)*(90+i%6*45),y:Math.sin(i*2.4)*(100+i%5*55),opacity:0,scale:1.2,rotate:i*35}} transition={{duration:1.4,ease:'easeOut'}}>{i%3 ? '♥' : '✿'}</motion.span>)}</div>}
    <Button variant="ghost" size="icon" className="absolute bottom-5 right-5 z-10 text-primary/45" aria-label="A tiny hidden heart" title="A tiny hidden heart" onClick={() => {setSecretTaps(n => { if (n === 4) {setSecret('Okay okay... I know you love discovering things. 😂❤️'); return 0;} if (n === 2 && scene > 3) setSecret('PS: I still remember the little things you think I forgot.'); return n+1;});}}><Heart size={15}/></Button>
    <AnimatePresence>{secret && <motion.div className="secret-note" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}>{secret}</motion.div>}</AnimatePresence>
  </main>;
}

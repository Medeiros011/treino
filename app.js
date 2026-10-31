/* =========================================================================
   MEUS TREINOS — app (força + corrida + dieta)
   ========================================================================= */
(function(){
"use strict";
const $ = id => document.getElementById(id);
const app = $('app');
const store = {
  get(k, d){ try{ const v = localStorage.getItem('treino_'+k); return v===null ? d : JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem('treino_'+k, JSON.stringify(v)); }catch(e){} }
};
const esc = s => String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const num = s => { const n = parseFloat(String(s).replace(',','.')); return isNaN(n) ? null : n; };
const pad = n => String(n).padStart(2,'0');
const iso = d => d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate());
const today = () => iso(new Date());
const parseISO = s => { const [y,m,d] = s.split('-').map(Number); return new Date(y, m-1, d, 12); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate()+n); return x; };
const mondayOf = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 12); const k = (x.getDay()+6)%7; x.setDate(x.getDate()-k); return x; };
const DIAS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
const MESES = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];
const fmtBR = n => n.toLocaleString('pt-BR',{maximumFractionDigits:1});
const money = n => 'R$ '+n.toLocaleString('pt-BR',{minimumFractionDigits:2,maximumFractionDigits:2});
function toast(m){ const t=$('toast'); t.textContent=m; t.classList.add('show'); clearTimeout(t._t); t._t=setTimeout(()=>t.classList.remove('show'),2300); }
function vibrar(p){ try{ navigator.vibrate && navigator.vibrate(p); }catch(e){} }
function isDark(){ return document.documentElement.getAttribute('data-mode')!=='light'; }
function cor(v){ return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }

/* =============================== TEMA =============================== */
const THEMES = {
  vermelho:{red:'#e10600',red2:'#ff2a1f',glow:'rgba(225,6,0,.45)',tint:'rgba(225,6,0,.12)',line:'rgba(225,6,0,.30)'},
  azul:    {red:'#1f6fff',red2:'#4d90ff',glow:'rgba(31,111,255,.45)',tint:'rgba(31,111,255,.12)',line:'rgba(31,111,255,.30)'},
  verde:   {red:'#10b768',red2:'#22d67e',glow:'rgba(16,183,104,.45)',tint:'rgba(16,183,104,.12)',line:'rgba(16,183,104,.30)'},
  roxo:    {red:'#7a3cff',red2:'#9a5cff',glow:'rgba(122,60,255,.45)',tint:'rgba(122,60,255,.12)',line:'rgba(122,60,255,.30)'},
  dourado: {red:'#d99a00',red2:'#ffc21f',glow:'rgba(217,154,0,.5)',tint:'rgba(217,154,0,.14)',line:'rgba(217,154,0,.32)'}
};
const getTheme = () => store.get('theme', {accent:'vermelho', mode:'dark'});
function applyTheme(){
  const t=getTheme(), c=THEMES[t.accent]||THEMES.vermelho, r=document.documentElement.style;
  r.setProperty('--red',c.red); r.setProperty('--red2',c.red2); r.setProperty('--redglow',c.glow); r.setProperty('--redtint',c.tint); r.setProperty('--redline',c.line);
  document.documentElement.setAttribute('data-mode', t.mode==='light'?'light':'dark');
  document.querySelector('meta[name=theme-color]').setAttribute('content', t.mode==='light'?'#eceef3':'#0a0a0b');
}

/* =============================== PERFIL e METAS =============================== */
const PERFIL_PADRAO = { peso:80, altura:175, idade:35, objetivo:'perder', t5k:'30:00' };
const perfil = () => Object.assign({}, PERFIL_PADRAO, store.get('perfil', {}));
function metas(){
  const p = perfil();
  const tmb = 10*p.peso + 6.25*p.altura - 5*p.idade + 5;      // Mifflin-St Jeor (homem)
  const gasto = tmb * 1.6;                                      // treina força 5× + corrida 3×
  const ajuste = {perder:-450, manter:0, ganhar:250}[p.objetivo] || 0;
  const kcal = Math.round((gasto+ajuste)/10)*10;
  const prot = Math.round(p.peso * ({perder:2.2, manter:1.8, ganhar:2.0}[p.objetivo]||2));
  const gord = Math.round(p.peso * 0.8);
  const carb = Math.max(100, Math.round((kcal - prot*4 - gord*9)/4));
  return { tmb:Math.round(tmb), gasto:Math.round(gasto), kcal, prot, gord, carb, agua:(p.peso*0.035).toFixed(1) };
}
function segs(t){ const p=String(t||'').trim().split(':').map(Number); if(p.some(isNaN)||!p.length) return null; return p.length===3 ? p[0]*3600+p[1]*60+p[2] : p.length===2 ? p[0]*60+p[1] : p[0]*60; }
function fmtPace(s){ s=Math.round(s); return Math.floor(s/60)+':'+pad(s%60); }
function fmtTempo(s){ s=Math.round(s); const h=Math.floor(s/3600), m=Math.floor(s%3600/60), x=s%60; return h ? h+':'+pad(m)+':'+pad(x) : m+':'+pad(x); }
function ritmos(){
  const t5 = segs(perfil().t5k) || 1800, p5 = t5/5;
  return { p5, leve:[p5*1.2, p5*1.3], limiar:p5*1.05, k10:p5*1.045, int:p5, tiro:p5-8, previsao10k:t5*Math.pow(2,1.06) };
}
function trocaRitmo(txt){
  const r = ritmos();
  const map = { leve:fmtPace(r.leve[0])+'–'+fmtPace(r.leve[1])+'/km', limiar:fmtPace(r.limiar)+'/km', '10k':fmtPace(r.k10)+'/km', int:fmtPace(r.int)+'/km', tiro:fmtPace(r.tiro)+'/km' };
  return esc(txt).replace(/\{(leve|limiar|10k|int|tiro)\}/g, (_,k)=>'<b>'+map[k]+'</b>');
}

/* =============================== FORÇA: sessões, séries, cargas =============================== */
const sessions = () => store.get('sessions', []);
const doneToday = id => sessions().some(s=>s.id===id && s.d===today());
function addSession(id){ const s=sessions(); if(s.some(x=>x.id===id && x.d===today())) return false; s.push({id, d:today(), ts:Date.now()}); store.set('sessions', s); return true; }
function lastDone(id){ const ds=sessions().filter(s=>s.id===id).map(s=>s.d).sort(); if(!ds.length) return null; return Math.round((parseISO(today())-parseISO(ds[ds.length-1]))/864e5); }
function seriesDe(k){ const v=store.get('v2s_'+k, null); return v && v.d===today() ? v.f : []; }
function setSeries(k, f){ store.set('v2s_'+k, {d:today(), f}); }
const hist = k => store.get('v2h_'+k, []);
function recordLoad(k, val){ const kg=num(val); if(kg===null) return; let h=hist(k); const d=today(); if(h.length && h[h.length-1].d===d) h[h.length-1].kg=kg; else h.push({d,kg}); store.set('v2h_'+k, h.slice(-120)); }
function prevLoad(k){ const h=hist(k); for(let i=h.length-1;i>=0;i--) if(h[i].d!==today()) return h[i]; return null; }
const ORDEM = TREINOS.map(t=>t.id);
function proximoForca(){
  const s = sessions().filter(x=>ORDEM.includes(x.id)).sort((a,b)=>a.ts-b.ts);
  let idx = s.length ? (ORDEM.indexOf(s[s.length-1].id)+1) % ORDEM.length : 0;
  let id = ORDEM[idx], aviso = '';
  const dow = new Date().getDay();
  const perna = x => x==='B' || x==='D';
  if(perna(id) && (dow===6)){ aviso = 'Amanhã é dia de longão: hoje faça um treino de superior (E) e deixe '+id+' para segunda ou terça.'; id='E'; }
  else if(perna(id) && dow===0 && !corridaFeitaHoje()){ aviso = 'Hoje é dia de longão: se for treinar força, prefira superior e faça '+id+' amanhã.'; }
  else if(perna(id)){ aviso = 'Treino de pernas: evite fazê-lo na véspera do intervalado ou do longão.'; }
  return { t:TREINOS.find(t=>t.id===id), aviso };
}

/* =============================== CORRIDA =============================== */
const runs = () => store.get('runs', []);
function inicioPlano(){ let s=store.get('corridaInicio', null); if(!s){ s=iso(mondayOf(new Date())); store.set('corridaInicio', s); } return s; }
function semanaAtual(){ const w = Math.floor((mondayOf(new Date()) - parseISO(inicioPlano()))/(7*864e5)) + 1; return Math.max(1, Math.min(CORRIDA.length, w)); }
function sessaoFeita(sem, i){ return runs().find(r=>r.ses===sem+'-'+i); }
function corridaFeitaHoje(){ return runs().some(r=>r.d===today()); }
function proximaCorrida(){
  const sem = semanaAtual(), w = CORRIDA[sem-1];
  for(let i=0;i<w.s.length;i++) if(!sessaoFeita(sem,i)) return { sem, i, s:w.s[i], fase:w.fase };
  return null;
}
let semVista = null;

/* =============================== DIETA =============================== */
const GRUPO = { frango:'p', carne:'p', ovo:'p', sardinha:'p', figado:'p', arroz:'c', feijao:'c', pao:'c', leite:'c', banana:'c', aveia:'c', macarrao:'c', batata:'c', cuscuz:'c', laranja:'f', legumes:'f', oleo:'f', amendoim:'f', iogurte:'c' };
function macroItem(id, q){ const a=ALIMENTOS[id], f = a.por==='un' ? q : q/100; return { kcal:a.kcal*f, p:a.p*f, c:a.c*f, g:a.g*f }; }
function soma(itens){ return itens.reduce((t,[id,q])=>{ const m=macroItem(id,q); t.kcal+=m.kcal; t.p+=m.p; t.c+=m.c; t.g+=m.g; return t; }, {kcal:0,p:0,c:0,g:0}); }
function arred(id, q){
  const a = ALIMENTOS[id];
  if(a.por==='un') return (id==='ovo'||id==='banana'||id==='laranja'||id==='sardinha') ? Math.max(1, Math.round(q)) : Math.max(.5, Math.round(q*2)/2);
  if(a.por==='ml') return Math.max(100, Math.round(q/50)*50);
  if(id==='aveia' || id==='amendoim') return Math.max(10, Math.round(q/5)*5);
  return Math.max(30, Math.round(q/10)*10);
}
function dietaEscalada(){
  const m = metas(), base = DIETA.flatMap(r=>r.itens);
  const tot = {p:{kcal:0,p:0}, c:{kcal:0}, f:{kcal:0}};
  base.forEach(([id,q])=>{ const x=macroItem(id,q), gr=GRUPO[id]||'c'; tot[gr].kcal+=x.kcal; if(gr==='p') tot.p.p+=x.p; });
  const protOutros = base.filter(([id])=>GRUPO[id]!=='p').reduce((s,[id,q])=>s+macroItem(id,q).p,0);
  const fp = Math.min(1.7, Math.max(.7, (m.prot - protOutros)/tot.p.p));
  const fc = Math.min(1.9, Math.max(.5, (m.kcal - tot.f.kcal - tot.p.kcal*fp)/tot.c.kcal));
  return DIETA.map(r=>{
    const itens = r.itens.map(([id,q])=>{ const gr=GRUPO[id]||'c'; const f = gr==='p'?fp : gr==='c'?fc : 1; return [id, arred(id, q*f)]; });
    return Object.assign({}, r, { itens, tot:soma(itens) });
  });
}
function qtdTxt(id, q){ const a=ALIMENTOS[id]; if(a.por==='un'){ const nome={ovo:['ovo','ovos'],pao:['pão','pães'],banana:['banana','bananas'],laranja:['laranja','laranjas'],sardinha:['lata','latas'],legumes:['porção','porções'],oleo:['colher de chá','colheres de chá'],iogurte:['pote','potes']}[id]||['un','un']; return fmtBR(q)+' '+(q>1?nome[1]:nome[0]); } if(a.por==='ml') return q+' ml'; return q+' g'; }
const precos = () => Object.assign({}, ...Object.entries(COMPRAS).map(([k,v])=>({[k]:v.preco})), store.get('precos', {}));
function listaCompras(){
  const sem = {}; dietaEscalada().forEach(r=>r.itens.forEach(([id,q])=>{ sem[id]=(sem[id]||0)+q*7; }));
  const pr = precos(); let total = 0;
  const linhas = Object.entries(sem).map(([id,q])=>{
    const c = COMPRAS[id]; if(!c) return null;
    let qtd, custo;
    if(c.fixo){ qtd='1 '+c.un; custo=pr[id]; }
    else if(c.g){ const cru = q*(c.cru||1); custo = cru/c.g*pr[id]; qtd = cru>=1000 ? fmtBR(cru/1000)+' kg' : Math.round(cru)+' g'; qtd += (c.cru&&c.cru<1)?' (cru)':(c.cru>1?' (cru)':''); }
    else if(c.ml){ custo = q/c.ml*pr[id]; qtd = fmtBR(q/1000)+' L'; }
    else { custo = q/c.q*pr[id]; qtd = id==='ovo' ? Math.ceil(q)+' ovos ('+fmtBR(q/12)+' dz)' : id==='oleo' ? Math.round(q*5)+' ml' : fmtBR(q)+' un'; }
    total += custo;
    return { id, nome:ALIMENTOS[id].n.split(' (')[0], qtd, un:c.un, preco:pr[id], custo };
  }).filter(Boolean).sort((a,b)=>b.custo-a.custo);
  return { linhas, total };
}

/* =============================== GRÁFICOS (SVG leve, sem biblioteca) =============================== */
let ttEl = null;
function tooltip(chartEl, x, y, html){
  if(!ttEl){ ttEl=document.createElement('div'); ttEl.className='tt'; }
  if(ttEl.parentNode!==chartEl) chartEl.appendChild(ttEl);
  ttEl.innerHTML=html; ttEl.style.left='0px'; ttEl.style.top='0px'; const w=ttEl.offsetWidth||140, W=chartEl.clientWidth; x=Math.max(w/2+2, Math.min(W-w/2-2, x)); ttEl.style.left=x+'px'; ttEl.style.top=Math.max(ttEl.offsetHeight+4,y)+'px'; ttEl.classList.add('on');
  clearTimeout(ttEl._t); ttEl._t=setTimeout(()=>ttEl.classList.remove('on'),2600);
}
function divs(max){ for(const k of [4,5,3,2]){ const st=max/k; if(Math.abs(st-Math.round(st))<1e-9 || st<1&&Math.abs(st*10-Math.round(st*10))<1e-9) return k; } return 4; }
function niceMax(v){ if(v<=0) return 1; const p=Math.pow(10,Math.floor(Math.log10(v))), n=v/p; return (n<=1?1:n<=2?2:n<=2.5?2.5:n<=5?5:10)*p; }
function topoArred(x, y, w, h, r){ if(h<=0) return ''; r=Math.min(r, w/2, h); return 'M'+x+','+(y+h)+'V'+(y+r)+'Q'+x+','+y+' '+(x+r)+','+y+'H'+(x+w-r)+'Q'+(x+w)+','+y+' '+(x+w)+','+(y+r)+'V'+(y+h)+'Z'; }
// barras (simples ou empilhadas). series: [{nome, cor, valores:[]}]
function barras(el, labels, series, opt){
  opt = opt||{}; const W=340, H=opt.h||170, L=30, R=6, T=10, B=22, iw=W-L-R, ih=H-T-B;
  const totais = labels.map((_,i)=>series.reduce((s,se)=>s+(se.valores[i]||0),0));
  const max = niceMax(Math.max(opt.min||0, ...totais)); const bw = iw/labels.length;
  let s = '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(opt.aria||'')+'">';
  const nd=divs(max); for(let k=0;k<=nd;k++){ const v=max*k/nd, y=T+ih-ih*k/nd; s+='<line class="grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'"/><text class="ax" x="'+(L-6)+'" y="'+(y+3)+'" text-anchor="end">'+(opt.fmtY?opt.fmtY(v):fmtBR(v))+'</text>'; }
  labels.forEach((lb,i)=>{
    const x = L + i*bw + bw*.2, w = bw*.6; let base = T+ih;
    series.forEach((se,si)=>{ const v=se.valores[i]||0; if(!v) return; let h=ih*v/max; const top = si===series.length-1 || !series.slice(si+1).some(o=>o.valores[i]); const y=base-h;
      s += top ? '<path d="'+topoArred(x,y,w,h-(si>0?2:0),4)+'" fill="'+se.cor+'"/>' : '<rect x="'+x+'" y="'+y+'" width="'+w+'" height="'+Math.max(0,h-(si>0?2:0))+'" fill="'+se.cor+'"/>';
      base = y; });
    const pl=opt.passoLabel||1; if((labels.length-1-i)%pl===0) s+='<text class="ax" x="'+(x+w/2)+'" y="'+(H-6)+'" text-anchor="middle">'+esc(lb)+'</text>';
    s += '<rect class="hit" data-i="'+i+'" x="'+(L+i*bw)+'" y="'+T+'" width="'+bw+'" height="'+ih+'"/>';
  });
  s += '</svg>'; el.innerHTML = s;
  el.querySelectorAll('.hit').forEach(r=>r.addEventListener('click',e=>{ const i=+r.dataset.i, b=el.getBoundingClientRect(), rb=r.getBoundingClientRect();
    const linhas = series.map(se=>'<i style="background:'+se.cor+'"></i>'+esc(se.nome)+': <b>'+(opt.fmtV?opt.fmtV(se.valores[i]||0):fmtBR(se.valores[i]||0))+'</b>').join('<br>');
    tooltip(el, rb.left-b.left+rb.width/2, rb.top-b.top+rb.height*(1-totais[i]/max), '<div class="muted">'+esc(opt.tip?opt.tip(i):labels[i])+'</div>'+linhas); }));
}
// linha (uma série). pts: [{x:label, y:valor, tip}]
function linha(el, pts, opt){
  opt = opt||{}; const W=340, H=opt.h||170, L=38, R=10, T=12, B=22, iw=W-L-R, ih=H-T-B;
  if(!pts.length){ el.innerHTML='<div class="empty">'+(opt.vazio||'Sem dados ainda.')+'</div>'; return; }
  const ys = pts.map(p=>p.y); let lo=Math.min(...ys), hi=Math.max(...ys); const pad_=(hi-lo)*.15 || Math.max(1,hi*.05); lo-=pad_; hi+=pad_;
  const X = i => L + (pts.length===1 ? iw/2 : iw*i/(pts.length-1));
  const Y = v => opt.inverter ? T + ih*(v-lo)/(hi-lo) : T + ih - ih*(v-lo)/(hi-lo);
  const c = opt.cor || cor('--red2');
  let s = '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="'+esc(opt.aria||'')+'">';
  for(let k=0;k<=3;k++){ const v = lo+(hi-lo)*k/3, y=Y(v); s+='<line class="grid" x1="'+L+'" x2="'+(W-R)+'" y1="'+y+'" y2="'+y+'"/><text class="ax" x="'+(L-6)+'" y="'+(y+3)+'" text-anchor="end">'+(opt.fmtY?opt.fmtY(v):fmtBR(v))+'</text>'; }
  const d = pts.map((p,i)=>(i?'L':'M')+X(i).toFixed(1)+','+Y(p.y).toFixed(1)).join(' ');
  s += '<path d="'+d+' L'+X(pts.length-1)+','+(T+ih)+' L'+X(0)+','+(T+ih)+'Z" fill="'+c+'" opacity=".10"/>';
  s += '<path d="'+d+'" fill="none" stroke="'+c+'" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>';
  const passo = Math.max(1, Math.ceil(pts.length/6));
  pts.forEach((p,i)=>{ s+='<circle cx="'+X(i)+'" cy="'+Y(p.y)+'" r="4" fill="'+c+'" stroke="'+cor('--card')+'" stroke-width="2"/>';
    if((pts.length-1-i)%passo===0) s+='<text class="ax" x="'+X(i)+'" y="'+(H-6)+'" text-anchor="middle">'+esc(p.x)+'</text>';
    s+='<rect class="hit" data-i="'+i+'" x="'+(X(i)-14)+'" y="'+T+'" width="28" height="'+ih+'"/>'; });
  if(opt.meta!=null && opt.meta>lo && opt.meta<hi) s+='<line x1="'+L+'" x2="'+(W-R)+'" y1="'+Y(opt.meta)+'" y2="'+Y(opt.meta)+'" stroke="'+cor('--muted')+'" stroke-dasharray="4 4"/><text class="ax" x="'+(W-R)+'" y="'+(Y(opt.meta)-4)+'" text-anchor="end">meta</text>';
  s += '</svg>'; el.innerHTML = s;
  el.querySelectorAll('.hit').forEach(r=>r.addEventListener('click',()=>{ const i=+r.dataset.i, b=el.getBoundingClientRect(), sv=el.querySelector('svg').getBoundingClientRect(), k=sv.width/W;
    tooltip(el, X(i)*k + (sv.left-b.left), Y(pts[i].y)*k + (sv.top-b.top) - 6, pts[i].tip || ('<b>'+fmtBR(pts[i].y)+'</b>')); }));
}
function anel(pct, cor_, txt){ const r=30, C=2*Math.PI*r, p=Math.min(1,pct); return '<svg viewBox="0 0 74 74"><circle cx="37" cy="37" r="'+r+'" fill="none" stroke="var(--card2)" stroke-width="7"/><circle cx="37" cy="37" r="'+r+'" fill="none" stroke="'+cor_+'" stroke-width="7" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+(C*(1-p))+'" transform="rotate(-90 37 37)" style="transition:stroke-dashoffset 1s"/><text x="37" y="42" text-anchor="middle" font-family="Oswald,sans-serif" font-size="17" font-weight="700" fill="var(--txt)">'+txt+'</text></svg>'; }

/* =============================== VIEWS =============================== */
function cab(t, sub, back){ $('title').childNodes[0].nodeValue=t; $('subtitle').textContent=sub; $('backBtn').style.display=back?'flex':'none'; }
function navOn(r){ document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on', b.dataset.r===r)); }
function semanaStats(){
  const ini = iso(mondayOf(new Date())), fim = iso(addDays(mondayOf(new Date()),6));
  const f = new Set(sessions().filter(s=>s.d>=ini && s.d<=fim).map(s=>s.d+s.id)).size;
  const rs = runs().filter(r=>r.d>=ini && r.d<=fim);
  return { forca:f, corridas:rs.length, km:rs.reduce((s,r)=>s+r.km,0) };
}
function streak(){
  const dias = new Set(sessions().map(s=>s.d).concat(runs().map(r=>r.d))); if(!dias.size) return 0;
  let n=0, d=new Date(); if(!dias.has(iso(d))){ d=addDays(d,-1); if(!dias.has(iso(d))) return 0; }
  while(dias.has(iso(d))){ n++; d=addDays(d,-1); } return n;
}

/* ---------- HOJE ---------- */
function renderHoje(){
  cab('Meus Treinos','Sem modo fácil',false); navOn('hoje');
  const h=new Date().getHours(), saud = h<12?'Bom dia':h<18?'Boa tarde':'Boa noite';
  const ws = semanaStats(), m = metas(), pf = proximoForca(), pc = proximaCorrida(), st = streak();
  const d0 = new Date();
  let html = '<div class="hello"><small>'+DIAS[d0.getDay()].toUpperCase()+' · '+d0.getDate()+' '+MESES[d0.getMonth()].toUpperCase()+'</small><h2>'+saud+', guerreiro.</h2></div>';
  html += '<div class="rings">'+
    '<div class="ring">'+anel(ws.forca/5, cor('--forca'), ws.forca+'/5')+'<b>Força</b><span>na semana</span></div>'+
    '<div class="ring">'+anel(ws.corridas/3, cor('--corrida'), ws.corridas+'/3')+'<b>Corrida</b><span>'+fmtBR(ws.km)+' km</span></div>'+
    '<div class="ring">'+anel(Math.min(1,st/7), '#ffc24a', st+'🔥')+'<b>Sequência</b><span>dias ativos</span></div></div>';
  html += '<div class="label">Força · manhã</div>';
  if(pf.t){ const feito = doneToday(pf.t.id);
    html += '<div class="card"><div class="next" data-go="#/forca/'+pf.t.id+'"><div class="badge">'+pf.t.id+'</div><div class="info"><h3>'+(feito?'✓ ':'')+esc(pf.t.foco)+'</h3><p>'+esc(pf.t.sub)+' · '+pf.t.exercicios.length+' exercícios'+(feito?' · feito hoje':'')+'</p></div><div class="go">›</div></div>'+(pf.aviso?'<div class="aviso">⚠️ '+esc(pf.aviso)+'</div>':'')+'</div>'; }
  html += '<div class="label">Corrida · almoço e domingo</div>';
  if(pc){ html += '<div class="card"><div class="next" data-go="#/corrida"><div class="badge run">'+({Q:'TIRO',L:'LEVE',T:'LIM',LONG:'LONG',TESTE:'10K'}[pc.s.t])+'</div><div class="info"><h3>'+esc(pc.s.nome)+'</h3><p>'+trocaRitmo(pc.s.principal)+'</p><p class="small">Semana '+pc.sem+' de '+CORRIDA.length+' · '+esc(pc.fase)+' · '+esc(DIA_SESSAO[pc.s.t])+' · ~'+pc.s.min+' min</p></div><div class="go">›</div></div></div>'; }
  else html += '<div class="card"><div class="empty" style="padding:10px">✅ As 3 corridas desta semana estão feitas. Descanse as pernas.</div></div>';
  // semana
  html += '<div class="label">Sua semana</div><div class="card"><div class="semana">';
  const seg = mondayOf(new Date());
  for(let i=0;i<7;i++){ const d=addDays(seg,i), k=iso(d); const f=sessions().some(s=>s.d===k), c=runs().some(r=>r.d===k);
    html += '<div class="dia'+(k===today()?' hoje':'')+'">'+DIAS[d.getDay()]+'<span class="n">'+d.getDate()+'</span><span class="ic">'+(f?'<i style="background:var(--forca)"></i>':'')+(c?'<i style="background:var(--corrida)"></i>':'')+'</span></div>'; }
  html += '</div><div class="leg" style="margin-top:10px"><span><i style="background:var(--forca)"></i>Força</span><span><i style="background:var(--corrida)"></i>Corrida</span></div></div>';
  // combustível
  html += '<div class="label">Combustível de hoje</div><div class="card" data-go="#/dieta" style="cursor:pointer"><div class="macros"><div><b>'+m.kcal+'</b><span>kcal</span></div><div><b>'+m.prot+'g</b><span>Proteína</span></div><div><b>'+m.carb+'g</b><span>Carbo</span></div><div><b>'+m.agua+'L</b><span>Água</span></div></div></div>';
  html += '<div class="row" style="margin-top:4px"><button class="btn sec" data-go="#/forca">Ver ficha de força</button><button class="btn blue" id="hjReg">Registrar corrida</button></div>';
  app.innerHTML = html;
  ligarGo(); $('hjReg').onclick = ()=>sheetCorrida();
}
function ligarGo(){ app.querySelectorAll('[data-go]').forEach(e=>e.onclick=()=>{ location.hash=e.dataset.go; }); }

/* ---------- FORÇA (lista) ---------- */
const ARTE_FORCA = '<svg class="arte" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice"><defs><radialGradient id="hf0" cx=".7" cy=".3" r=".8"><stop offset="0" stop-color="var(--red)" stop-opacity=".55"/><stop offset=".6" stop-color="#140404" stop-opacity=".6"/><stop offset="1" stop-color="#050506"/></radialGradient><linearGradient id="hf1" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3a42"/><stop offset="1" stop-color="#111114"/></linearGradient></defs><rect width="400" height="220" fill="url(#hf0)"/><g opacity=".9"><rect x="150" y="66" width="240" height="7" rx="3" fill="#9a9aa4"/><rect x="300" y="30" width="20" height="80" rx="4" fill="url(#hf1)" stroke="#55555f"/><rect x="322" y="40" width="14" height="60" rx="3" fill="url(#hf1)" stroke="#55555f"/><rect x="338" y="50" width="10" height="40" rx="3" fill="url(#hf1)" stroke="#55555f"/><rect x="200" y="30" width="20" height="80" rx="4" fill="url(#hf1)" stroke="#55555f"/><rect x="184" y="40" width="14" height="60" rx="3" fill="url(#hf1)" stroke="#55555f"/></g><g stroke="var(--red2)" stroke-width="2" opacity=".35"><path d="M0 200 L400 120"/><path d="M0 214 L400 140"/></g><rect y="140" width="400" height="80" fill="url(#hfv)"/><defs><linearGradient id="hfv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050506" stop-opacity="0"/><stop offset="1" stop-color="#050506"/></linearGradient></defs></svg>';
function renderForca(){
  cab('Força','Plano híbrido A–E',false); navOn('forca');
  const pf = proximoForca();
  let html = '<section class="hero">'+ARTE_FORCA+'<div class="ct"><span class="kick">Rotação livre A → E</span><h2>FORÇA PRIMEIRO,<br><b>CORRIDA EM VOLTA</b></h2><p>Musculação de manhã · 5 treinos que respeitam suas corridas</p></div></section>';
  TREINOS.forEach(t=>{
    const feito = doneToday(t.id), ld = lastDone(t.id), sug = pf.t && pf.t.id===t.id && !feito;
    const st = feito ? '<div class="st ok">✓ Feito hoje</div>' : sug ? '<div class="st">➜ Sugerido para hoje</div>' : ld!=null ? '<div class="st m">Último: '+(ld===0?'hoje':ld===1?'ontem':'há '+ld+' dias')+'</div>' : '<div class="st m">'+t.exercicios.length+' exercícios</div>';
    html += '<div class="card tcard'+(sug?' sug':'')+'" data-go="#/forca/'+t.id+'"><div class="badge">'+t.id+'</div><div class="info"><h3>'+esc(t.foco)+'</h3><p>'+esc(t.sub)+'</p>'+st+'</div><div class="go" style="color:var(--red2);font-size:24px">›</div></div>';
  });
  html += '<div class="label">Regras do híbrido</div><div class="card"><ul class="regras" style="margin:0;padding-left:18px">'+REGRAS_HIBRIDO.map(r=>'<li>'+esc(r)+'</li>').join('')+'</ul></div>';
  app.innerHTML = html; ligarGo();
}

/* ---------- FORÇA (treino) ---------- */
function renderTreino(id){
  const t = TREINOS.find(x=>x.id===id); if(!t){ location.hash='#/forca'; return; }
  cab(t.nome, t.foco, true); navOn('forca');
  let html = '<div class="progress-wrap"><div class="progress-top"><span>Progresso</span><span id="progTxt"></span></div><div class="bar"><div id="progFill"></div></div></div>';
  if(t.nota) html += '<div class="obs" style="margin-bottom:14px">'+esc(t.nota)+'</div>';
  t.exercicios.forEach((ex,i)=>{
    const done = seriesDe(ex.k), carga = store.get('v2c_'+ex.k, '');
    let sb=''; for(let s=0;s<ex.series;s++){ const on=done.includes(s); sb+='<button class="serie-btn'+(on?' done':'')+'" data-k="'+ex.k+'" data-s="'+s+'"><span class="n">'+(s+1)+'ª</span>'+(on?'ok':'série')+'</button>'; }
    const imgs = ex.imgs||[];
    const media = imgs.length ? '<div class="ex-media"><img class="ex-img" src="'+imgs[0]+'" alt="'+esc(ex.nome)+'" loading="lazy" onerror="this.parentNode.innerHTML=\'<div class=ph>Imagem indisponível offline</div>\'">'+(imgs[1]?'<img class="ex-img f1 anim" src="'+imgs[1]+'" alt="" loading="lazy" onerror="this.remove()"><span class="dot">● execução</span>':'')+'</div>' : '';
    html += '<div class="ex'+(done.length===ex.series?' done':'')+'" id="ex_'+ex.k+'">'+media+'<div class="ex-body"><div class="ex-head"><h3>'+(i+1)+'. '+esc(ex.nome)+'</h3><span class="pill red">'+esc(ex.musculo)+'</span></div>'+
      '<div class="ex-meta"><div><span>Séries</span><strong>'+ex.series+'</strong></div><div><span>Reps</span><strong>'+esc(ex.reps)+'</strong></div><div><span>Descanso</span><strong>'+ex.descanso+'s</strong></div></div>'+
      (ex.obs?'<p class="obs">💡 '+esc(ex.obs)+'</p>':'')+
      '<div class="carga"><label>Carga</label><input type="text" inputmode="decimal" placeholder="ex: 20" value="'+esc(carga)+'" data-carga="'+ex.k+'"><span class="muted small">kg</span></div>'+
      '<div class="lastload" id="last_'+ex.k+'">'+lastHtml(ex.k, carga)+'</div>'+
      '<div class="series">'+sb+'</div><button class="rest-btn" data-rest="'+ex.descanso+'" data-nome="'+esc(ex.nome)+'">⏱️ Descanso '+ex.descanso+'s</button></div></div>';
  });
  const feito = doneToday(id);
  html += '<button class="btn" id="concluir" style="margin-bottom:10px'+(feito?';background:transparent;border:1px solid var(--ok);color:var(--ok);box-shadow:none':'')+'">'+(feito?'✓ Treino concluído hoje':'✅ Concluir treino de hoje')+'</button>';
  html += '<button class="btn ghost" id="zerar">↺ Zerar séries de hoje</button>';
  app.innerHTML = html; progresso(t);
  app.querySelectorAll('.serie-btn').forEach(b=>b.onclick=()=>{ const k=b.dataset.k, s=+b.dataset.s; let f=seriesDe(k); f = f.includes(s) ? f.filter(x=>x!==s) : f.concat(s); setSeries(k,f);
    const on=f.includes(s); b.classList.toggle('done',on); b.lastChild.textContent=on?'ok':'série'; b.classList.remove('pop'); void b.offsetWidth; b.classList.add('pop'); vibrar(on?15:5);
    const ex=t.exercicios.find(e=>e.k===k); $('ex_'+k).classList.toggle('done', f.length===ex.series); progresso(t);
    if(on){ const exx=t.exercicios.find(e=>e.k===k); if(f.length<exx.series) startTimer(exx.descanso, exx.nome); } });
  app.querySelectorAll('[data-carga]').forEach(inp=>inp.onchange=()=>{ const k=inp.dataset.carga; store.set('v2c_'+k, inp.value); recordLoad(k, inp.value); $('last_'+k).innerHTML=lastHtml(k, inp.value); });
  app.querySelectorAll('[data-rest]').forEach(b=>b.onclick=()=>startTimer(+b.dataset.rest, b.dataset.nome));
  $('concluir').onclick=()=>{ t.exercicios.forEach(ex=>{ const v=store.get('v2c_'+ex.k,''); if(num(v)!==null) recordLoad(ex.k, v); }); const novo=addSession(id); vibrar([40,30,90]); toast(novo?'💪 Treino '+id+' concluído! Sequência: '+streak()+' dia(s)':'Já estava concluído hoje'); renderTreino(id); };
  $('zerar').onclick=()=>{ t.exercicios.forEach(ex=>setSeries(ex.k,[])); renderTreino(id); toast('Séries zeradas'); };
}
function lastHtml(k, cur){
  const p=prevLoad(k); if(!p) return '<span>Registre a carga para acompanhar a evolução 📈</span>';
  const c=num(cur); let tr='';
  if(c!==null){ tr = c>p.kg ? '<span class="up">↗ +'+fmtBR(c-p.kg)+' kg</span>' : c<p.kg ? '<span class="down">↘ '+fmtBR(c-p.kg)+' kg</span>' : '<span>→ igual</span>'; }
  const pr = Math.max(...hist(k).map(h=>h.kg));
  return '<span>Última vez: <b>'+fmtBR(p.kg)+' kg</b></span>'+tr+'<span class="pill gold" style="margin-left:auto">Recorde '+fmtBR(pr)+' kg</span>';
}
function progresso(t){ let tot=0, d=0; t.exercicios.forEach(ex=>{ tot+=ex.series; d+=seriesDe(ex.k).length; }); $('progFill').style.width=(tot?d/tot*100:0)+'%'; $('progTxt').innerHTML='<b>'+d+'</b> / '+tot+' séries'; }

/* ---------- CORRIDA ---------- */
function renderCorrida(){
  cab('Corrida','Rumo a um 10K mais forte',false); navOn('corrida');
  const atual = semanaAtual(); if(semVista==null) semVista = atual;
  const w = CORRIDA[semVista-1], r = ritmos();
  const feitas = CORRIDA.reduce((s,wk,wi)=>s+wk.s.filter((_,i)=>sessaoFeita(wi+1,i)).length,0), totalS = CORRIDA.length*3;
  let html = '<div class="card"><div class="fase"><div><span class="pill blue">'+esc(w.fase)+'</span><h2 class="h2" style="margin-top:8px">Semana '+semVista+'<span class="muted" style="font-size:16px"> / '+CORRIDA.length+'</span></h2>'+(semVista===atual?'<div class="small muted" style="margin-top:3px">semana atual</div>':'')+'</div>'+
    '<div class="weeknav"><button id="wPrev" aria-label="Semana anterior">‹</button><button id="wNext" aria-label="Próxima semana">›</button></div></div>'+
    '<div class="bar blue" style="margin-top:14px"><div style="width:'+(feitas/totalS*100)+'%"></div></div><div class="small muted" style="margin-top:6px">'+feitas+' de '+totalS+' corridas do plano · previsão de 10K hoje: <b style="color:var(--txt)">'+fmtTempo(r.previsao10k)+'</b></div></div>';
  html += '<div class="card" style="padding-top:4px">';
  w.s.forEach((s,i)=>{ const f = sessaoFeita(semVista,i);
    html += '<div class="sess'+(f?' done':'')+'"><div class="tag '+s.t.toLowerCase()+'">'+(f?'✓':({Q:'TIRO',L:'LEVE',T:'LIM',LONG:'LONG',TESTE:'10K'}[s.t]))+'</div><div class="bd"><h4>'+esc(s.nome)+(f?' <span class="pill ok">'+fmtBR(f.km)+' km · '+fmtPace(f.seg/f.km)+'/km</span>':'')+'</h4><div class="quando">'+esc(DIA_SESSAO[s.t])+' · ~'+s.min+' min · ~'+fmtBR(s.km)+' km</div>'+
      '<div class="pr">'+trocaRitmo(s.principal)+'</div>'+(s.t!=='L'?'<div class="ext">'+esc(AQ)+'<br>'+esc(DQ)+'</div>':'')+
      '<div class="acts">'+(f?'<button data-undo="'+f.id+'">Desfazer</button>':'<button class="reg" data-reg="'+i+'">Registrar</button>')+'</div></div></div>'; });
  html += '</div>';
  html += '<div class="label">Seus ritmos</div><div class="card"><div class="zonas">'+
    '<div><b>'+fmtPace(r.leve[0])+'</b><span>Leve</span></div><div><b>'+fmtPace(r.limiar)+'</b><span>Limiar</span></div><div><b>'+fmtPace(r.k10)+'</b><span>10K</span></div><div><b>'+fmtPace(r.int)+'</b><span>Interv.</span></div><div><b>'+fmtPace(r.tiro)+'</b><span>Tiro</span></div></div>'+
    '<div class="small muted" style="margin-top:10px">Calculados a partir do seu 5 km em <b style="color:var(--txt)">'+esc(perfil().t5k)+'</b>. Leve = dá para conversar. Atualize depois do teste de 10K. <a href="#" id="editT5" style="color:var(--red2)">Alterar</a></div></div>';
  const rs = runs().slice().sort((a,b)=>b.d.localeCompare(a.d)||b.id-a.id).slice(0,8);
  html += '<div class="label">Últimas corridas</div><div class="card">'+(rs.length? rs.map(x=>{ const [,mm,dd]=x.d.split('-'); return '<div class="runrow"><div class="d">'+dd+'/'+mm+'</div><div class="k"><b>'+fmtBR(x.km)+' km</b><div class="small muted">'+esc(x.tipo||'Corrida')+'</div></div><div class="p"><b>'+fmtPace(x.seg/x.km)+'/km</b>'+fmtTempo(x.seg)+'</div><button data-del="'+x.id+'" aria-label="Apagar">🗑</button></div>'; }).join('') : '<div class="empty">Nenhuma corrida registrada. Corra e registre aqui (dá para copiar do Nike Run Club).</div>')+'</div>';
  html += '<button class="btn blue" id="regLivre">+ Registrar corrida avulsa</button>';
  html += '<button class="btn ghost" id="reiniciar" style="margin-top:10px">Recomeçar o plano nesta semana</button>';
  app.innerHTML = html;
  $('wPrev').onclick=()=>{ semVista=Math.max(1,semVista-1); renderCorrida(); };
  $('wNext').onclick=()=>{ semVista=Math.min(CORRIDA.length,semVista+1); renderCorrida(); };
  app.querySelectorAll('[data-reg]').forEach(b=>b.onclick=()=>sheetCorrida(semVista, +b.dataset.reg));
  app.querySelectorAll('[data-undo],[data-del]').forEach(b=>b.onclick=()=>{ const id=+(b.dataset.undo||b.dataset.del); store.set('runs', runs().filter(x=>x.id!==id)); toast('Corrida removida'); renderCorrida(); });
  $('regLivre').onclick=()=>sheetCorrida();
  $('editT5').onclick=e=>{ e.preventDefault(); sheetPerfil(); };
  $('reiniciar').onclick=()=>{ if(confirm('Recomeçar o plano de 12 semanas a partir desta semana? As corridas registradas continuam no histórico.')){ store.set('corridaInicio', iso(mondayOf(new Date()))); store.set('runs', runs().map(x=>Object.assign({},x,{ses:null}))); semVista=1; renderCorrida(); } };
}
function sheetCorrida(sem, i){
  const s = sem ? CORRIDA[sem-1].s[i] : null;
  openSheet('<h3>Registrar corrida</h3><p class="sub">'+(s?esc(s.nome)+' · semana '+sem:'Corrida avulsa (fora do plano)')+'</p>'+
    '<div class="grid2"><div class="field"><label>Distância (km)</label><input class="inp" id="rKm" inputmode="decimal" placeholder="5,0" value="'+(s?String(s.km).replace('.',','):'')+'"></div>'+
    '<div class="field"><label>Tempo (h:mm:ss ou mm:ss)</label><input class="inp" id="rT" inputmode="numeric" placeholder="32:30"></div></div>'+
    '<div class="field"><label>Data</label><input class="inp" type="date" id="rD" value="'+today()+'"></div>'+
    '<div class="small muted" id="rPace" style="margin:-2px 0 14px">Ritmo: —</div>'+
    '<button class="btn blue" id="rSalvar">Salvar corrida</button><button class="btn ghost" id="rCancel" style="margin-top:10px">Cancelar</button>');
  const upd=()=>{ const km=num($('rKm').value), sg=segs($('rT').value); $('rPace').textContent = km&&sg ? 'Ritmo: '+fmtPace(sg/km)+'/km' : 'Ritmo: —'; };
  $('rKm').oninput=upd; $('rT').oninput=upd;
  $('rCancel').onclick=closeSheet;
  $('rSalvar').onclick=()=>{ const km=num($('rKm').value), sg=segs($('rT').value); if(!km||!sg){ toast('Informe distância e tempo'); return; }
    const l=runs(); l.push({ id:Date.now(), d:$('rD').value||today(), km, seg:sg, tipo:s?s.nome:'Corrida avulsa', ses: s ? sem+'-'+i : null }); store.set('runs', l);
    closeSheet(); vibrar([30,30,60]); toast('🏃 '+fmtBR(km)+' km a '+fmtPace(sg/km)+'/km registrados'); route(); };
}

/* ---------- DIETA ---------- */
const ICONES = { cafe:'☕', pos:'🥤', almoco:'🍛', lanche:'🥪', jantar:'🍲', ceia:'🥛' };
function renderDieta(){
  cab('Dieta','Barata, simples e de atleta',false); navOn('dieta');
  const m = metas(), p = perfil(), refeicoes = dietaEscalada();
  const tot = refeicoes.reduce((t,r)=>{ t.kcal+=r.tot.kcal; t.p+=r.tot.p; t.c+=r.tot.c; t.g+=r.tot.g; return t; },{kcal:0,p:0,c:0,g:0});
  const kp=tot.p*4, kc=tot.c*4, kg=tot.g*9, kt=kp+kc+kg;
  const obj = {perder:'Perder gordura',manter:'Manter o peso',ganhar:'Ganhar massa'}[p.objetivo];
  let html = '<div class="card"><div class="small muted" style="font-weight:800;letter-spacing:1.5px;text-transform:uppercase">Sua meta · '+esc(obj)+'</div><div class="meta-k" style="margin-top:6px"><b>'+Math.round(tot.kcal)+'</b><span class="muted">kcal / dia (meta '+m.kcal+')</span></div>'+
    '<div class="macrobar"><i style="width:'+(kp/kt*100)+'%;background:var(--forca)"></i><i style="width:'+(kc/kt*100)+'%;background:var(--corrida)"></i><i style="width:'+(kg/kt*100)+'%;background:#ffc24a"></i></div>'+
    '<div class="leg"><span><i style="background:var(--forca)"></i>Proteína <b>'+Math.round(tot.p)+' g</b></span><span><i style="background:var(--corrida)"></i>Carbo <b>'+Math.round(tot.c)+' g</b></span><span><i style="background:#ffc24a"></i>Gordura <b>'+Math.round(tot.g)+' g</b></span></div>'+
    '<div class="small muted" style="margin-top:10px">Peso '+fmtBR(p.peso)+' kg · gasto estimado '+m.gasto+' kcal · água '+m.agua+' L/dia (+0,5 L nos dias de corrida). <a href="#" id="edPerfil" style="color:var(--red2)">Ajustar perfil</a></div></div>';
  html += '<div class="label">Refeições do dia</div>';
  refeicoes.forEach(r=>{
    html += '<div class="card meal" data-meal="'+r.id+'"><div class="meal-h"><div class="ico">'+ICONES[r.id]+'</div><div class="t"><h3>'+esc(r.nome)+'</h3><p>'+esc(r.hora)+'</p></div><div class="kc">'+Math.round(r.tot.kcal)+'<span>'+Math.round(r.tot.p)+' g prot.</span></div></div>'+
      '<ul>'+r.itens.map(([id,q])=>'<li><span>'+esc(ALIMENTOS[id].n)+'</span><b>'+qtdTxt(id,q)+'</b></li>').join('')+(r.id==='cafe'?'<li><span>'+esc(CAFE_PRETO)+'</span><b></b></li>':'')+'</ul>'+
      '<div class="mx"><div class="tr"><b>Trocas baratas:</b><br>'+r.trocas.map(esc).join('<br>')+'</div><div class="tr">💡 '+esc(r.dica)+'</div></div></div>';
  });
  const lc = listaCompras();
  html += '<div class="label">Lista de compras da semana</div><div class="card"><div class="small muted" style="margin-bottom:6px">Quantidades para 7 dias deste plano. Preços estimados de São Paulo — toque no valor para ajustar ao seu mercado.</div>'+
    lc.linhas.map(l=>'<div class="compra"><div class="n">'+esc(l.nome)+'<small>'+esc(l.qtd)+' · '+money(l.custo)+'/semana</small></div><span class="small muted">R$/'+esc(l.un)+'</span><input inputmode="decimal" data-preco="'+l.id+'" value="'+String(l.preco).replace('.',',')+'"></div>').join('')+
    '<div class="total"><span class="muted">Estimativa semanal</span><b>'+money(lc.total)+'</b></div><div class="small muted" style="text-align:right">≈ '+money(lc.total*4.3)+' por mês</div></div>';
  html += '<div class="label">Regras de ouro</div><div class="card"><ul class="regras" style="margin:0;padding-left:18px">'+
    '<li><b>Ovo, frango, sardinha e carne moída</b> são as proteínas mais baratas por grama — gire entre elas.</li>'+
    '<li><b>Arroz com feijão</b> é combustível de corredor: mais carbo nos dias de longão e intervalado.</li>'+
    '<li><b>Marmita de domingo</b>: cozinhe as proteínas da semana de uma vez e congele em potes.</li>'+
    '<li><b>Compre fruta da época</b> na feira no fim do dia — banana e laranja quase sempre são as mais baratas.</li>'+
    '<li>Este plano é uma referência geral. Se você tem alguma condição de saúde, confirme com um nutricionista.</li></ul></div>';
  app.innerHTML = html;
  app.querySelectorAll('.meal').forEach(c=>c.onclick=()=>c.classList.toggle('open'));
  app.querySelectorAll('[data-preco]').forEach(inp=>{ inp.onclick=e=>e.stopPropagation(); inp.onchange=()=>{ const v=num(inp.value); if(v==null) return; const pr=store.get('precos',{}); pr[inp.dataset.preco]=v; store.set('precos',pr); renderDieta(); }; });
  $('edPerfil').onclick=e=>{ e.preventDefault(); sheetPerfil(); };
}

/* ---------- EVOLUÇÃO ---------- */
function renderEvolucao(){
  cab('Evolução','Seus números',false); navOn('evolucao');
  const semanas=[], seg0 = mondayOf(new Date());
  for(let k=11;k>=0;k--){ const ini=addDays(seg0,-7*k), fim=addDays(ini,6); semanas.push({ini:iso(ini), fim:iso(fim), lb:ini.getDate()+'/'+(ini.getMonth()+1)}); }
  const fW = semanas.map(w=>new Set(sessions().filter(s=>s.d>=w.ini&&s.d<=w.fim).map(s=>s.d+s.id)).size);
  const cW = semanas.map(w=>runs().filter(r=>r.d>=w.ini&&r.d<=w.fim).length);
  const kmW = semanas.map(w=>runs().filter(r=>r.d>=w.ini&&r.d<=w.fim).reduce((s,r)=>s+r.km,0));
  const totF = sessions().length, totKm = runs().reduce((s,r)=>s+r.km,0);
  let html = '<div class="kpi"><div><small>Treinos de força</small><b>'+totF+'</b></div><div><small>Km corridos</small><b>'+fmtBR(totKm)+'</b></div><div><small>Sequência</small><b>'+streak()+'🔥</b></div></div>';
  html += '<div class="card"><div class="ctitle"><h3>Treinos por semana</h3><span>12 semanas</span></div><div class="leg" style="margin-bottom:8px"><span><i style="background:var(--forca)"></i>Força</span><span><i style="background:var(--corrida)"></i>Corrida</span></div><div class="chart" id="chFreq"></div>'+
    '<details><summary>Ver como tabela</summary><table class="tabela"><tr><th>Semana</th><th>Força</th><th>Corrida</th></tr>'+semanas.map((w,i)=>'<tr><td>'+w.lb+'</td><td>'+fW[i]+'</td><td>'+cW[i]+'</td></tr>').join('')+'</table></details></div>';
  html += '<div class="card"><div class="ctitle"><h3>Km por semana</h3><span>meta do plano em pontilhado</span></div><div class="chart" id="chKm"></div></div>';
  html += '<div class="card"><div class="ctitle"><h3>Ritmo das corridas</h3><span>↑ mais rápido</span></div><div class="chart" id="chPace"></div></div>';
  const comHist = TREINOS.flatMap(t=>t.exercicios.map(e=>({k:e.k, n:t.id+' · '+e.nome}))).filter(e=>hist(e.k).length);
  const sel = store.get('evoEx', comHist[0] && comHist[0].k);
  html += '<div class="card"><div class="ctitle"><h3>Carga por exercício</h3></div>'+(comHist.length?'<select class="inp" id="selEx" style="margin-bottom:10px">'+comHist.map(e=>'<option value="'+e.k+'"'+(e.k===sel?' selected':'')+'>'+esc(e.n)+'</option>').join('')+'</select>':'')+'<div class="chart" id="chCarga"></div></div>';
  const pesos = store.get('peso', []);
  html += '<div class="card"><div class="ctitle"><h3>Peso corporal</h3><span>'+(pesos.length?fmtBR(pesos[pesos.length-1].kg)+' kg':'')+'</span></div><div class="row" style="margin-bottom:10px"><input class="inp" id="novoPeso" inputmode="decimal" placeholder="Peso de hoje (kg)"><button class="btn" id="addPeso" style="width:auto;padding:0 18px">+</button></div><div class="chart" id="chPeso"></div></div>';
  // calendário
  const hoje=new Date(), fimCal=addDays(mondayOf(hoje),6), iniCal=addDays(fimCal,-83);
  let cols=''; let cur=new Date(iniCal);
  for(let c=0;c<12;c++){ cols+='<div class="col">'; for(let r=0;r<7;r++){ const k=iso(cur), f=sessions().some(s=>s.d===k), cr=runs().some(x=>x.d===k); let cl = cur>hoje?'x': f&&cr?'fc': f?'f': cr?'c':''; if(k===today()) cl+=' h'; cols+='<i class="'+cl+'" title="'+k+'"></i>'; cur=addDays(cur,1);} cols+='</div>'; }
  html += '<div class="card"><div class="ctitle"><h3>Calendário</h3><span>12 semanas</span></div><div class="heat">'+cols+'</div><div class="leg" style="margin-top:10px"><span><i style="background:var(--forca)"></i>Força</span><span><i style="background:var(--corrida)"></i>Corrida</span><span><i style="background:linear-gradient(135deg,var(--forca) 50%,var(--corrida) 50%)"></i>Os dois</span></div></div>';
  app.innerHTML = html;
  const cF=cor('--forca'), cC=cor('--corrida');
  barras($('chFreq'), semanas.map(w=>w.lb), [{nome:'Força',cor:cF,valores:fW},{nome:'Corrida',cor:cC,valores:cW}], {min:4, passoLabel:2, fmtY:v=>Math.round(v), fmtV:v=>v+' treino'+(v!==1?'s':''), tip:i=>'Semana de '+semanas[i].lb, aria:'Treinos de força e corrida por semana'});
  barras($('chKm'), semanas.map(w=>w.lb), [{nome:'Km',cor:cC,valores:kmW}], {min:10, passoLabel:2, fmtY:v=>Math.round(v), fmtV:v=>fmtBR(v)+' km', tip:i=>'Semana de '+semanas[i].lb, aria:'Quilômetros por semana'});
  // linha de meta do plano (semana atual) desenhada sobre o gráfico de km
  const metaKm = CORRIDA[semanaAtual()-1].s.reduce((s,x)=>s+x.km,0); const svgKm=$('chKm').querySelector('svg');
  if(svgKm){ const maxK = niceMax(Math.max(10,...kmW)); if(metaKm<maxK){ const y = 10 + (170-32)*(1-metaKm/maxK); svgKm.insertAdjacentHTML('beforeend','<line x1="30" x2="334" y1="'+y+'" y2="'+y+'" stroke="'+cor('--muted')+'" stroke-dasharray="4 4"/><text class="ax" x="334" y="'+(y-4)+'" text-anchor="end">plano: '+fmtBR(metaKm)+' km</text>'); } }
  const rs = runs().slice().sort((a,b)=>a.d.localeCompare(b.d)).slice(-20);
  linha($('chPace'), rs.map(x=>({x:x.d.slice(8)+'/'+x.d.slice(5,7), y:x.seg/x.km, tip:'<div class="muted">'+x.d.split('-').reverse().join('/')+'</div><b>'+fmtPace(x.seg/x.km)+'/km</b> · '+fmtBR(x.km)+' km'})), {cor:cC, inverter:true, fmtY:v=>fmtPace(v), vazio:'Registre corridas para ver seu ritmo evoluir.', aria:'Ritmo por corrida'});
  const desenhaCarga = k => { const h = hist(k||''); linha($('chCarga'), h.map(x=>({x:x.d.slice(8)+'/'+x.d.slice(5,7), y:x.kg, tip:'<div class="muted">'+x.d.split('-').reverse().join('/')+'</div><b>'+fmtBR(x.kg)+' kg</b>'})), {fmtY:v=>fmtBR(Math.round(v)), vazio:'Anote as cargas nos treinos de força para ver a progressão.', aria:'Carga por exercício'}); };
  desenhaCarga(sel);
  const se=$('selEx'); if(se) se.onchange=()=>{ store.set('evoEx', se.value); desenhaCarga(se.value); };
  linha($('chPeso'), pesos.map(x=>({x:x.d.slice(8)+'/'+x.d.slice(5,7), y:x.kg, tip:'<b>'+fmtBR(x.kg)+' kg</b>'})), {fmtY:v=>fmtBR(Math.round(v*10)/10), vazio:'Registre o peso 1× por semana, sempre em jejum.', aria:'Peso corporal'});
  $('addPeso').onclick=()=>{ const v=num($('novoPeso').value); if(!v){ toast('Informe o peso'); return; } let p=store.get('peso',[]); if(p.length && p[p.length-1].d===today()) p[p.length-1].kg=v; else p.push({d:today(),kg:v}); store.set('peso',p); const pf=store.get('perfil',{}); pf.peso=v; store.set('perfil',pf); toast('Peso registrado · dieta recalculada'); renderEvolucao(); };
}

/* =============================== SHEETS =============================== */
function openSheet(html){ $('sheet').innerHTML=html; $('sheetWrap').classList.add('show'); }
function closeSheet(){ $('sheetWrap').classList.remove('show'); }
$('sheetWrap').onclick=e=>{ if(e.target.id==='sheetWrap') closeSheet(); };
function camposPerfil(p){
  return '<div class="grid2"><div class="field"><label>Peso (kg)</label><input class="inp" id="pPeso" inputmode="decimal" value="'+p.peso+'"></div><div class="field"><label>Altura (cm)</label><input class="inp" id="pAlt" inputmode="numeric" value="'+p.altura+'"></div>'+
    '<div class="field"><label>Idade</label><input class="inp" id="pIdade" inputmode="numeric" value="'+p.idade+'"></div><div class="field"><label>Seu 5 km (mm:ss)</label><input class="inp" id="pT5" inputmode="numeric" value="'+esc(p.t5k)+'"></div></div>'+
    '<div class="field"><label>Objetivo</label><div class="seg" id="pObj">'+[['perder','Perder gordura'],['manter','Manter'],['ganhar','Ganhar massa']].map(([k,n])=>'<button type="button" data-o="'+k+'" class="'+(p.objetivo===k?'sel':'')+'">'+n+'</button>').join('')+'</div></div>';
}
function lerPerfil(){
  const p = perfil(); const o = document.querySelector('#pObj .sel');
  const np = { peso:num($('pPeso').value)||p.peso, altura:num($('pAlt').value)||p.altura, idade:num($('pIdade').value)||p.idade, objetivo:o?o.dataset.o:p.objetivo, t5k: segs($('pT5').value) ? $('pT5').value.trim() : p.t5k };
  store.set('perfil', np); return np;
}
function ligarObj(){ document.querySelectorAll('#pObj button').forEach(b=>b.onclick=()=>{ document.querySelectorAll('#pObj button').forEach(x=>x.classList.remove('sel')); b.classList.add('sel'); }); }
function sheetPerfil(){
  openSheet('<h3>Seu perfil</h3><p class="sub">Usado para calcular a dieta e os ritmos de corrida.</p>'+camposPerfil(perfil())+'<button class="btn" id="pSalvar">Salvar</button>');
  ligarObj(); $('pSalvar').onclick=()=>{ lerPerfil(); closeSheet(); toast('Perfil atualizado'); route(); };
}
function sheetConfig(){
  const t=getTheme();
  openSheet('<h3>Configurações</h3><p class="sub">Deixe o app com a sua cara.</p>'+
    '<div class="field"><label>Cor de destaque</label><div class="swatches">'+Object.keys(THEMES).map(n=>'<div class="swatch'+(t.accent===n?' sel':'')+'" data-a="'+n+'" style="background:'+THEMES[n].red+'"></div>').join('')+'</div></div>'+
    '<div class="field"><label>Tema</label><div class="seg"><button data-m="dark" class="'+(t.mode!=='light'?'sel':'')+'">🌙 Escuro</button><button data-m="light" class="'+(t.mode==='light'?'sel':'')+'">☀️ Claro</button></div></div>'+
    '<div class="field"><label>Perfil</label><button class="btn sec" id="cPerfil">Peso, altura, objetivo e ritmo</button></div>'+
    '<div class="field"><label>Backup</label><div class="row"><button class="btn sec" id="cExp">Exportar</button><button class="btn sec" id="cImp">Importar</button></div><input type="file" id="cArq" accept=".json" style="display:none"></div>'+
    '<button class="btn ghost" id="cApres">Ver a apresentação de novo</button><button class="btn" id="cOk" style="margin-top:12px">Pronto</button>');
  document.querySelectorAll('.swatch').forEach(s=>s.onclick=()=>{ const c=getTheme(); c.accent=s.dataset.a; store.set('theme',c); applyTheme(); sheetConfig(); route(); });
  document.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{ const c=getTheme(); c.mode=b.dataset.m; store.set('theme',c); applyTheme(); sheetConfig(); route(); });
  $('cPerfil').onclick=sheetPerfil; $('cOk').onclick=closeSheet;
  $('cApres').onclick=()=>{ closeSheet(); apresentacao(); };
  $('cExp').onclick=()=>{ const d={}; for(let i=0;i<localStorage.length;i++){ const k=localStorage.key(i); if(k.startsWith('treino_')) d[k]=localStorage.getItem(k); } const a=document.createElement('a'); a.href=URL.createObjectURL(new Blob([JSON.stringify(d)],{type:'application/json'})); a.download='treinos-backup-'+today()+'.json'; a.click(); toast('Backup exportado'); };
  $('cImp').onclick=()=>$('cArq').click();
  $('cArq').onchange=e=>{ const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=()=>{ try{ const d=JSON.parse(r.result); if(!confirm('Substituir os dados atuais pelo backup?')) return; Object.entries(d).forEach(([k,v])=>{ if(k.startsWith('treino_')) localStorage.setItem(k,v); }); toast('Backup restaurado'); closeSheet(); applyTheme(); route(); }catch(err){ toast('Arquivo inválido'); } }; r.readAsText(f); };
}
$('gearBtn').onclick=sheetConfig;

/* =============================== CRONÔMETRO =============================== */
const overlay=$('timerOverlay'), tNum=$('timerNum'), tLabel=$('timerLabel'), tCircle=$('timerCircle'), tToggle=$('timerToggle');
const CIRC=2*Math.PI*108; let tInt=null, tRem=0, tTot=0, tPause=false;
function drawT(){ tNum.textContent=Math.floor(tRem/60)+':'+pad(tRem%60); tCircle.style.strokeDashoffset=CIRC*(1-tRem/tTot); tCircle.setAttribute('stroke', tRem<=5?'#ff2a1f':tRem<=10?'#ffb648':cor('--red')); }
function startTimer(sec, nome){ tTot=tRem=sec; tPause=false; tLabel.textContent='Descanso · '+(nome||''); tToggle.textContent='Pausar'; tCircle.style.strokeDasharray=CIRC; overlay.classList.add('show'); drawT(); clearInterval(tInt); tInt=setInterval(()=>{ if(tPause) return; tRem--; if(tRem<=0){ tRem=0; drawT(); clearInterval(tInt); tLabel.textContent='Acabou o descanso! 🔥'; beep(); vibrar([200,100,200,100,300]); setTimeout(()=>overlay.classList.remove('show'),1200); return; } drawT(); },1000); }
tToggle.onclick=function(){ tPause=!tPause; this.textContent=tPause?'Retomar':'Pausar'; };
$('timerAdd').onclick=()=>{ tRem+=15; tTot=Math.max(tTot,tRem); drawT(); };
$('timerStop').onclick=()=>{ clearInterval(tInt); overlay.classList.remove('show'); };
function beep(){ try{ const c=new (window.AudioContext||window.webkitAudioContext)(); [0,.25,.5].forEach(d=>{ const o=c.createOscillator(), g=c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value=880; g.gain.setValueAtTime(.0001,c.currentTime+d); g.gain.exponentialRampToValueAtTime(.3,c.currentTime+d+.02); g.gain.exponentialRampToValueAtTime(.0001,c.currentTime+d+.2); o.start(c.currentTime+d); o.stop(c.currentTime+d+.22); }); }catch(e){} }

/* =============================== ABERTURA (toda vez que abre) =============================== */
function abertura(){
  const st = streak(), km = runs().reduce((s,r)=>s+r.km,0), tr = sessions().length;
  const el = document.createElement('div'); el.className='splash';
  const plates = (lado)=>{ const s=lado<0?-1:1, xs=[[s*86,56,26],[s*112,48,20],[s*132,40,16]]; return xs.map(([x,h,w],i)=>'<rect class="pl" style="--dx:'+(s*70)+'px;animation-delay:'+(0.6+i*0.12)+'s" x="'+(180+x-(s<0?w:0))+'" y="'+(70-h)+'" width="'+w+'" height="'+(h*2)+'" rx="5" fill="'+(i===0?'var(--red2)':'#2a2a30')+'" stroke="'+(i===0?'#fff3':'#55555f')+'"/>').join(''); };
  el.innerHTML = '<div class="sp-bar"><svg viewBox="0 0 360 140"><g class="lift"><line class="haste" x1="30" y1="70" x2="330" y2="70" stroke="#c9c9d1" stroke-width="8" stroke-linecap="round"/>'+plates(-1)+plates(1)+'</g></svg></div>'+
    '<svg class="sp-pista" viewBox="0 0 360 24"><path d="M4 12 L356 12" stroke="#3b8fe0" stroke-width="3" stroke-dasharray="420" fill="none"/><circle r="6" fill="#5aa8ff"/></svg>'+
    '<div class="sp-tit">'+'MEUS'.split('').map((c,i)=>'<span style="--i:'+i+'">'+c+'</span>').join('')+'<span style="--i:4">&nbsp;</span>'+'TREINOS'.split('').map((c,i)=>'<span class="r" style="--i:'+(i+5)+'">'+c+'</span>').join('')+'</div>'+
    '<div class="sp-tags"><span>FORÇA</span><span>CORRIDA</span><span>COMBUSTÍVEL</span></div>'+
    '<div class="sp-stats"><div><b data-n="'+st+'">0</b><small>SEQUÊNCIA</small></div><div><b data-n="'+tr+'">0</b><small>TREINOS</small></div><div><b data-n="'+Math.round(km)+'">0</b><small>KM</small></div></div>'+
    '<div class="sp-skip">TOQUE PARA ENTRAR</div>';
  document.body.appendChild(el);
  setTimeout(()=>el.querySelectorAll('[data-n]').forEach(b=>{ const alvo=+b.dataset.n; let n=0; const pass=Math.max(1,Math.ceil(alvo/25)); const iv=setInterval(()=>{ n=Math.min(alvo,n+pass); b.textContent=n; if(n>=alvo) clearInterval(iv); },30); }), 2700);
  let saiu=false; const sair=()=>{ if(saiu) return; saiu=true; el.classList.add('out'); setTimeout(()=>{ el.remove(); if(!store.get('apresentado', false)) apresentacao(); },560); };
  el.onclick=sair; setTimeout(sair, matchMedia('(prefers-reduced-motion: reduce)').matches ? 800 : 4200);
}

/* =============================== APRESENTAÇÃO (primeiro uso) =============================== */
function apresentacao(){
  const p = perfil(), el = document.createElement('div'); el.className='onb';
  const slides = [
    '<div class="big">⚡</div><h2>Seu treino<br><b>mudou.</b></h2><p>O app agora junta <b>força, corrida e alimentação</b> num plano só, pensado para a sua rotina: musculação de manhã, corrida no almoço e longão no domingo.</p>',
    '<div class="big">🏋️</div><h2>Força <b>híbrida</b></h2><div class="feat"><span>A</span>Superior força — peito e costas pesado</div><div class="feat"><span>B</span>Inferior força — agachamento e posterior</div><div class="feat"><span>C</span>Superior volume — costas e bíceps</div><div class="feat"><span>D</span>Inferior corredor — glúteo, posterior e core</div><div class="feat"><span>E</span>Ombros, peito e braços</div><p style="margin-top:12px">Continua em rotação livre. O app sugere o próximo e avisa quando um treino de perna atrapalharia a corrida.</p>',
    '<div class="big">🏃</div><h2>12 semanas<br>rumo a um <b>10K forte</b></h2><p>3 corridas por semana: <b>tiros</b> e <b>limiar</b> no almoço (até 50 min) e <b>longão</b> no domingo, de 5 até 12 km. Os ritmos são calculados a partir do seu tempo de 5 km.</p><p>No fim, um teste de 10 km para medir a evolução.</p>',
    '<div class="big">🍛</div><h2>Comida de atleta,<br><b>preço de feira</b></h2><p>Arroz, feijão, ovo, frango, carne moída, aveia, banana e leite. As porções se ajustam ao seu peso e objetivo, e a lista de compras da semana já vem com o custo estimado.</p>',
    '<h2>Seus <b>dados</b></h2><p>Usados só aqui no celular, para calcular a dieta e os ritmos.</p>'+camposPerfil(p)
  ];
  el.innerHTML = '<div class="slides">'+slides.map((s,i)=>'<div class="sl'+(i===0?' on':'')+'">'+s+'</div>').join('')+'</div><div class="foot"><div class="dots">'+slides.map((_,i)=>'<i class="'+(i===0?'on':'')+'"></i>').join('')+'</div><button class="btn ghost" id="oPular" style="width:auto;padding:14px 16px">Pular</button><button class="btn" id="oNext">Próximo</button></div>';
  document.body.appendChild(el); ligarObj();
  let i=0; const sl=el.querySelectorAll('.sl'), dots=el.querySelectorAll('.dots i');
  const ir = n => { sl.forEach((s,k)=>{ s.classList.toggle('on',k===n); s.classList.toggle('prev',k<n); }); dots.forEach((d,k)=>d.classList.toggle('on',k===n)); $('oNext').textContent = n===slides.length-1 ? 'Começar' : 'Próximo'; i=n; };
  const fim = salvar => { if(salvar) lerPerfil(); store.set('apresentado', true); inicioPlano(); el.style.transition='opacity .4s'; el.style.opacity='0'; setTimeout(()=>{ el.remove(); route(); },400); };
  $('oNext').onclick=()=>{ if(i<slides.length-1) ir(i+1); else fim(true); };
  $('oPular').onclick=()=>fim(false);
  let x0=null; el.querySelector('.slides').addEventListener('touchstart',e=>{ x0=e.touches[0].clientX; },{passive:true});
  el.querySelector('.slides').addEventListener('touchend',e=>{ if(x0==null) return; const dx=e.changedTouches[0].clientX-x0; if(dx<-50 && i<slides.length-1) ir(i+1); if(dx>50 && i>0) ir(i-1); x0=null; });
}

/* =============================== ROTAS =============================== */
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{ location.hash='#/'+b.dataset.r; });
$('backBtn').onclick=()=>{ location.hash='#/forca'; };
function route(){
  closeSheet(); overlay.classList.remove('show'); clearInterval(tInt);
  const h = location.hash.replace(/^#\/?/,'');
  const [a,b] = h.split('/');
  if(a==='forca' && b) renderTreino(b);
  else if(a==='forca') renderForca();
  else if(a==='corrida') renderCorrida();
  else if(a==='dieta') renderDieta();
  else if(a==='evolucao') renderEvolucao();
  else if(/^[A-E]$/.test(a)) location.hash='#/forca/'+a;   // links antigos (#/A)
  else renderHoje();
  window.scrollTo(0,0);
}
window.addEventListener('hashchange', route);
applyTheme(); route(); abertura();
try{ navigator.storage && navigator.storage.persist && navigator.storage.persist(); }catch(e){}
if('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(()=>{});
})();

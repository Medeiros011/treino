/* =========================================================================
   MEUS TREINOS — DADOS
   Plano híbrido (força + corrida) + plano alimentar barato.
   Para editar a ficha, mude os exercícios abaixo seguindo o mesmo modelo.
     k        -> identificador único do exercício (não repita; guarda o histórico de carga)
     imgs     -> imagens do movimento (free-exercise-db). [] = sem imagem
   ========================================================================= */
const CDN = "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/";
const g = (dir) => [CDN + dir + "/0.jpg", CDN + dir + "/1.jpg"];

/* --------------------------- FORÇA (manhã) --------------------------- */
const TREINOS = [
  { id:"A", nome:"Treino A", foco:"Superior Força", sub:"Peito + Costas pesado", tipo:"forca",
    nota:"Dia de carga alta e poucas repetições. Pode ser feito no mesmo dia de corrida sem problema.",
    exercicios:[
      { k:"supino_reto", nome:"Supino reto", series:4, reps:"5-6", descanso:150, musculo:"Peito", imgs:g("Barbell_Bench_Press_-_Medium_Grip"), obs:"Pesado e técnico: escápulas presas, pés firmes, barra na linha do mamilo." },
      { k:"barra_fixa", nome:"Barra fixa", series:4, reps:"6-8", descanso:120, musculo:"Costas", imgs:g("Pullups"), obs:"Fechou 8 com folga? Adicione peso no cinto ou na mochila." },
      { k:"desenv_militar", nome:"Desenvolvimento militar em pé", series:3, reps:"6-8", descanso:120, musculo:"Ombro", imgs:g("Standing_Military_Press"), obs:"Glúteo e abdômen travados para proteger a lombar." },
      { k:"remada_curvada", nome:"Remada curvada", series:4, reps:"6-8", descanso:120, musculo:"Costas", imgs:g("Bent_Over_Barbell_Row"), obs:"Tronco ~45°, coluna neutra, puxe com os cotovelos." },
      { k:"paralelas", nome:"Paralelas", series:3, reps:"8-10", descanso:90, musculo:"Tríceps", imgs:g("Dips_-_Triceps_Version"), obs:"Tronco mais reto foca no tríceps." },
      { k:"rosca_direta", nome:"Rosca direta", series:3, reps:"8", descanso:75, musculo:"Bíceps", imgs:g("Barbell_Curl"), obs:"Sem balançar o tronco." }
    ]},
  { id:"B", nome:"Treino B", foco:"Inferior Força", sub:"Agachamento + Posterior", tipo:"forca",
    nota:"⚠️ Não faça na véspera do longão nem do intervalado. Melhor logo depois de um dia de corrida leve.",
    exercicios:[
      { k:"agachamento", nome:"Agachamento livre", series:4, reps:"5", descanso:180, musculo:"Quadríceps", imgs:g("Barbell_Full_Squat"), obs:"Profundidade até a coxa paralela, joelhos alinhados aos pés." },
      { k:"terra_romeno", nome:"Levantamento terra romeno", series:3, reps:"8", descanso:150, musculo:"Posterior", imgs:g("Romanian_Deadlift"), obs:"⚠️ Coluna neutra, empurre o quadril para trás, barra rente à perna." },
      { k:"leg_press", nome:"Leg press", series:3, reps:"10", descanso:120, musculo:"Quadríceps", imgs:g("Leg_Press"), obs:"Não trave o joelho no topo." },
      { k:"panturrilha_pe", nome:"Panturrilha em pé", series:4, reps:"12", descanso:45, musculo:"Panturrilha", imgs:g("Standing_Calf_Raises"), obs:"Panturrilha forte = menos lesão na corrida. Segure 1 s no topo." },
      { k:"prancha", nome:"Prancha", series:3, reps:"45 s", descanso:45, musculo:"Core", imgs:g("Plank"), obs:"Corpo em linha reta, glúteo contraído." }
    ]},
  { id:"C", nome:"Treino C", foco:"Superior Volume", sub:"Costas + Bíceps", tipo:"forca",
    nota:"Volume moderado, ótimo para o dia de corrida no almoço.",
    exercicios:[
      { k:"pulldown", nome:"Puxada aberta (pulldown)", series:4, reps:"10", descanso:90, musculo:"Costas", imgs:g("Wide-Grip_Lat_Pulldown"), obs:"Puxe até o queixo, peito aberto." },
      { k:"remada_cavalinho", nome:"Remada cavalinho", series:3, reps:"10", descanso:90, musculo:"Costas", imgs:g("Lying_T-Bar_Row"), obs:"" },
      { k:"remada_unilateral", nome:"Remada unilateral com halter", series:3, reps:"12", descanso:60, musculo:"Costas", imgs:g("One-Arm_Dumbbell_Row"), obs:"Um lado de cada vez, amplitude completa." },
      { k:"pulldown_estendido", nome:"Pulldown braços estendidos", series:3, reps:"12", descanso:60, musculo:"Costas", imgs:g("Straight-Arm_Pulldown"), obs:"Braços quase retos, sinta o dorsal." },
      { k:"face_pull", nome:"Face pull", series:3, reps:"15", descanso:45, musculo:"Ombro post.", imgs:g("Face_Pull"), obs:"Saúde do ombro e postura: puxe a corda em direção à testa." },
      { k:"rosca_inclinado", nome:"Rosca alternada no banco inclinado", series:3, reps:"10", descanso:60, musculo:"Bíceps", imgs:g("Alternate_Incline_Dumbbell_Curl"), obs:"Controle a descida." },
      { k:"rosca_martelo", nome:"Rosca martelo", series:3, reps:"12", descanso:45, musculo:"Bíceps", imgs:g("Hammer_Curls"), obs:"Pega neutra, trabalha o braquial." }
    ]},
  { id:"D", nome:"Treino D", foco:"Inferior Corredor", sub:"Glúteo + Posterior + Core", tipo:"forca",
    nota:"Pernas sem destruir a corrida: foco em glúteo, posterior e estabilidade. Evite na véspera do longão.",
    exercicios:[
      { k:"hip_thrust", nome:"Elevação pélvica (hip thrust)", series:4, reps:"10", descanso:90, musculo:"Glúteo", imgs:g("Barbell_Hip_Thrust"), obs:"Glúteo forte protege joelho e lombar na corrida." },
      { k:"mesa_flexora", nome:"Mesa flexora", series:4, reps:"10", descanso:75, musculo:"Posterior", imgs:g("Lying_Leg_Curls"), obs:"Controle a descida, quadril colado no apoio." },
      { k:"bulgaro", nome:"Agachamento búlgaro", series:3, reps:"10 cada perna", descanso:90, musculo:"Quadríceps", imgs:g("Smith_Single-Leg_Split_Squat"), obs:"⚠️ Se o joelho doer, reduza a amplitude." },
      { k:"extensora", nome:"Cadeira extensora", series:3, reps:"12", descanso:60, musculo:"Quadríceps", imgs:g("Leg_Extensions"), obs:"" },
      { k:"panturrilha_sentado", nome:"Panturrilha sentado", series:3, reps:"15", descanso:45, musculo:"Panturrilha", imgs:g("Seated_Calf_Raise"), obs:"Trabalha o sóleo, músculo-chave do corredor." },
      { k:"elevacao_pernas", nome:"Elevação de pernas na barra", series:3, reps:"12", descanso:60, musculo:"Core", imgs:g("Hanging_Leg_Raise"), obs:"Sem balançar; suba controlando." }
    ]},
  { id:"E", nome:"Treino E", foco:"Ombros + Peito + Braços", sub:"Volume e pump", tipo:"forca",
    nota:"Treino que não cansa as pernas: encaixa em qualquer dia, inclusive véspera do longão.",
    exercicios:[
      { k:"supino_inclinado", nome:"Supino inclinado com halteres", series:4, reps:"8-10", descanso:90, musculo:"Peito", imgs:g("Incline_Dumbbell_Press"), obs:"Banco a 30-45°." },
      { k:"crucifixo_polia", nome:"Crucifixo na polia", series:3, reps:"12", descanso:60, musculo:"Peito", imgs:g("Cable_Crossover"), obs:"Aperte no centro." },
      { k:"elevacao_lateral", nome:"Elevação lateral", series:4, reps:"12-15", descanso:45, musculo:"Ombro", imgs:g("Side_Lateral_Raise"), obs:"Suba até a linha do ombro." },
      { k:"crucifixo_inverso", nome:"Crucifixo inverso", series:3, reps:"15", descanso:45, musculo:"Ombro post.", imgs:g("Reverse_Flyes"), obs:"Aperte as escápulas." },
      { k:"triceps_testa", nome:"Tríceps testa", series:3, reps:"10", descanso:60, musculo:"Tríceps", imgs:g("Lying_Triceps_Press"), obs:"Só o antebraço se move." },
      { k:"triceps_corda", nome:"Tríceps corda", series:3, reps:"12", descanso:45, musculo:"Tríceps", imgs:g("Triceps_Pushdown_-_Rope_Attachment"), obs:"Abra a corda no final." },
      { k:"rosca_concentrada", nome:"Rosca concentrada", series:3, reps:"12", descanso:45, musculo:"Bíceps", imgs:g("Concentration_Curls"), obs:"Pico de contração." }
    ]}
];

const REGRAS_HIBRIDO = [
  "Musculação de manhã, corrida no almoço: com 4-6 h de intervalo os dois treinos convivem bem.",
  "Pernas pesadas (B e D) nunca na véspera do longão ou do intervalado.",
  "Depois do longão de domingo, segunda é dia de superior (A, C ou E).",
  "5 treinos de força por semana é o ideal; 4 já mantém o ganho. Corrida: 3 por semana.",
  "Dormiu mal ou as pernas estão pesadas? Troque o treino do dia por E ou por corrida leve."
];

/* --------------------------- CORRIDA (almoço + domingo) ---------------------------
   Tokens de ritmo (substituídos pelos seus ritmos calculados a partir do tempo de 5 km):
   {leve} {limiar} {10k} {int} {tiro}
   ------------------------------------------------------------------------------- */
const AQ = "Aquecimento: 10 min de trote leve + 4 educativos (skipping, anfersen).";
const DQ = "Desaquecimento: 5 min de trote e alongamento leve.";
const CORRIDA = [
  { fase:"Base", s:[
    { t:"Q", nome:"Tiros curtos", principal:"6 × 400 m em {tiro} — recuperação: 2 min de trote", min:40, km:5.5 },
    { t:"L", nome:"Rodagem leve", principal:"25 min contínuos em {leve} + 4 acelerações de 20 s", min:35, km:4.5 },
    { t:"LONG", nome:"Longão", principal:"5 km em {leve}, conversando", min:35, km:5 } ]},
  { fase:"Base", s:[
    { t:"Q", nome:"Tiros curtos", principal:"8 × 400 m em {tiro} — recuperação: 2 min de trote", min:45, km:6 },
    { t:"L", nome:"Rodagem leve", principal:"30 min contínuos em {leve}", min:40, km:5 },
    { t:"LONG", nome:"Longão", principal:"6 km em {leve}", min:42, km:6 } ]},
  { fase:"Base", s:[
    { t:"Q", nome:"Intervalado", principal:"5 × 800 m em {int} — recuperação: 2 min de trote", min:45, km:6.5 },
    { t:"T", nome:"Limiar fracionado", principal:"3 × 5 min em {limiar} — recuperação: 2 min de trote", min:40, km:6 },
    { t:"LONG", nome:"Longão", principal:"7 km em {leve}", min:48, km:7 } ]},
  { fase:"Recuperação", s:[
    { t:"Q", nome:"Tiros soltos", principal:"6 × 400 m em {tiro}, sem forçar — recuperação: 2 min", min:40, km:5.5 },
    { t:"L", nome:"Rodagem leve", principal:"25 min em {leve}", min:35, km:4.5 },
    { t:"LONG", nome:"Longão curto", principal:"5 km em {leve}", min:35, km:5 } ]},
  { fase:"Construção", s:[
    { t:"Q", nome:"Intervalado", principal:"5 × 1000 m em {int} — recuperação: 2 min de trote", min:50, km:7.5 },
    { t:"T", nome:"Limiar contínuo", principal:"20 min contínuos em {limiar}", min:40, km:6.5 },
    { t:"LONG", nome:"Longão", principal:"8 km em {leve}", min:55, km:8 } ]},
  { fase:"Construção", s:[
    { t:"Q", nome:"Intervalado", principal:"6 × 800 m em {int} — recuperação: 90 s de trote", min:50, km:7.5 },
    { t:"T", nome:"Progressivo", principal:"30 min: 20 min em {leve} e os últimos 10 min em {10k}", min:45, km:6.5 },
    { t:"LONG", nome:"Longão", principal:"9 km em {leve}", min:62, km:9 } ]},
  { fase:"Construção", s:[
    { t:"Q", nome:"Intervalado longo", principal:"4 × 1200 m em {int} — recuperação: 2 min de trote", min:50, km:7.5 },
    { t:"T", nome:"Limiar fracionado", principal:"2 × 10 min em {limiar} — recuperação: 2 min", min:45, km:7 },
    { t:"LONG", nome:"Longão", principal:"10 km em {leve}", min:68, km:10 } ]},
  { fase:"Recuperação", s:[
    { t:"Q", nome:"Velocidade", principal:"8 × 200 m rápidos em {tiro} — recuperação: 200 m caminhando", min:35, km:5 },
    { t:"L", nome:"Rodagem leve", principal:"30 min em {leve}", min:40, km:5 },
    { t:"LONG", nome:"Longão curto", principal:"7 km em {leve}", min:48, km:7 } ]},
  { fase:"Afiar", s:[
    { t:"Q", nome:"Intervalado longo", principal:"3 × 1600 m em {int} — recuperação: 3 min de trote", min:50, km:8 },
    { t:"T", nome:"Limiar contínuo", principal:"25 min contínuos em {limiar}", min:45, km:7 },
    { t:"LONG", nome:"Longão", principal:"11 km em {leve}", min:75, km:11 } ]},
  { fase:"Afiar", s:[
    { t:"Q", nome:"Tiros", principal:"10 × 400 m em {tiro} — recuperação: 90 s de trote", min:50, km:7.5 },
    { t:"T", nome:"Ritmo de prova", principal:"5 km em {10k}", min:45, km:7 },
    { t:"LONG", nome:"Longão", principal:"12 km em {leve}", min:82, km:12 } ]},
  { fase:"Polimento", s:[
    { t:"Q", nome:"Intervalado", principal:"5 × 1000 m em {10k} — recuperação: 2 min", min:45, km:7 },
    { t:"L", nome:"Rodagem leve", principal:"30 min em {leve} + 6 acelerações de 20 s", min:40, km:5 },
    { t:"LONG", nome:"Longão curto", principal:"8 km em {leve}", min:55, km:8 } ]},
  { fase:"Teste", s:[
    { t:"Q", nome:"Tiros soltos", principal:"4 × 400 m em {int}, relaxado — recuperação: 2 min", min:30, km:4 },
    { t:"L", nome:"Rodagem leve", principal:"20 min em {leve}", min:30, km:3.5 },
    { t:"TESTE", nome:"TESTE DE 10 KM", principal:"10 km no seu melhor ritmo — comece em {10k} e acelere nos últimos 2 km", min:60, km:10 } ]}
];
const DIA_SESSAO = { Q:"Seg ou Qua · almoço", L:"Qua ou Sex · almoço", T:"Qua ou Sex · almoço", LONG:"Domingo", TESTE:"Domingo" };

/* --------------------------- ALIMENTAÇÃO ---------------------------
   Valores aproximados (Tabela TACO / rótulos). por: 'g' = por 100 g | 'un' = por unidade | 'ml' = por 100 ml
   ------------------------------------------------------------------------------- */
const ALIMENTOS = {
  arroz:     { n:"Arroz branco cozido", por:"g", kcal:128, p:2.5, c:28, g:0.2 },
  feijao:    { n:"Feijão carioca cozido", por:"g", kcal:76, p:4.8, c:13.6, g:0.5 },
  frango:    { n:"Frango (peito ou sobrecoxa sem pele) grelhado", por:"g", kcal:165, p:30, c:0, g:4.5 },
  ovo:       { n:"Ovo", por:"un", kcal:72, p:6.3, c:0.4, g:4.8 },
  pao:       { n:"Pão francês", por:"un", kcal:150, p:4.7, c:29, g:1.5 },
  leite:     { n:"Leite integral", por:"ml", kcal:61, p:3.2, c:4.7, g:3.3 },
  banana:    { n:"Banana", por:"un", kcal:70, p:1, c:18, g:0.1 },
  aveia:     { n:"Aveia em flocos", por:"g", kcal:394, p:14, c:67, g:8 },
  carne:     { n:"Carne moída (acém/patinho) refogada", por:"g", kcal:212, p:27, c:0, g:11 },
  sardinha:  { n:"Sardinha em lata (drenada)", por:"un", kcal:170, p:20, c:0, g:10 },
  macarrao:  { n:"Macarrão cozido", por:"g", kcal:158, p:5.8, c:31, g:0.9 },
  batata:    { n:"Batata cozida", por:"g", kcal:52, p:1.2, c:12, g:0.1 },
  cuscuz:    { n:"Cuscuz de milho cozido", por:"g", kcal:112, p:2.2, c:25, g:0.7 },
  amendoim:  { n:"Pasta de amendoim", por:"g", kcal:600, p:25, c:20, g:48 },
  laranja:   { n:"Laranja", por:"un", kcal:70, p:1.4, c:17, g:0.2 },
  legumes:   { n:"Salada e legumes (porção)", por:"un", kcal:35, p:1.5, c:6, g:0.3 },
  oleo:      { n:"Óleo para cozinhar (colher de chá)", por:"un", kcal:40, p:0, c:0, g:4.5 },
  figado:    { n:"Fígado bovino acebolado", por:"g", kcal:225, p:29, c:4, g:9 },
  iogurte:   { n:"Iogurte natural (pote 170 g)", por:"un", kcal:105, p:6, c:8, g:5.5 }
};
const CAFE_PRETO = "Café preto sem açúcar à vontade.";

/* Refeições-base (~2.400 kcal). O app reescala as porções para a sua meta. */
const DIETA = [
  { id:"cafe", nome:"Café da manhã", hora:"antes da musculação", itens:[["pao",2],["ovo",3],["leite",200],["banana",1],["oleo",1]],
    trocas:["Pão ↔ 4 colheres de cuscuz ou 2 fatias de pão de forma","Ovos ↔ 1 lata de sardinha"], dica:"Treina muito cedo? Coma só a banana antes e o resto logo depois do treino." },
  { id:"pos", nome:"Pós-treino", hora:"depois da musculação", itens:[["leite",300],["aveia",40],["banana",1]],
    trocas:["Vitamina ↔ iogurte natural + aveia + banana"], dica:"Bata no liquidificador: vitamina barata com proteína e carboidrato." },
  { id:"almoco", nome:"Almoço", hora:"depois da corrida", itens:[["arroz",150],["feijao",140],["frango",150],["legumes",1],["oleo",1],["laranja",1]],
    trocas:["Frango ↔ carne moída, fígado (1×/semana) ou 4 ovos","Arroz ↔ macarrão ou batata (o dobro do peso)"], dica:"Prato padrão brasileiro é a melhor refeição de atleta que existe." },
  { id:"lanche", nome:"Lanche da tarde", hora:"meio da tarde", itens:[["pao",1],["ovo",2],["banana",1]],
    trocas:["Ovos ↔ sardinha ou frango desfiado","Pão ↔ cuscuz"], dica:"Leve ovos cozidos de casa: proteína mais barata que existe." },
  { id:"jantar", nome:"Jantar", hora:"noite", itens:[["arroz",120],["feijao",100],["carne",120],["legumes",1],["oleo",1]],
    trocas:["Carne moída ↔ frango, omelete de 3 ovos ou sardinha","Arroz ↔ batata, mandioca ou macarrão"], dica:"Faça marmitas no domingo: cozinhe 1 kg de frango e 1 kg de carne moída de uma vez." },
  { id:"ceia", nome:"Ceia", hora:"antes de dormir", itens:[["leite",200],["amendoim",15]],
    trocas:["Leite ↔ iogurte natural"], dica:"Proteína lenta antes de dormir ajuda a recuperação." }
];

/* Preços estimados (varejo, São Paulo, 2026) — edite no app conforme o seu mercado. */
const COMPRAS = {
  arroz:    { un:"pacote 5 kg", g:5000, preco:28 },
  feijao:   { un:"pacote 1 kg", g:1000, preco:9,  cru:0.45 },
  frango:   { un:"kg", g:1000, preco:17, cru:1.35 },
  ovo:      { un:"dúzia", q:12, preco:11 },
  pao:      { un:"unidade", q:1, preco:0.9 },
  leite:    { un:"litro", ml:1000, preco:5.5 },
  banana:   { un:"dúzia", q:12, preco:8 },
  aveia:    { un:"pacote 500 g", g:500, preco:8 },
  carne:    { un:"kg", g:1000, preco:38, cru:1.3 },
  amendoim: { un:"pote 1 kg", g:1000, preco:30 },
  laranja:  { un:"dúzia", q:12, preco:9 },
  legumes:  { un:"semana (feira)", fixo:true, preco:25 },
  oleo:     { un:"garrafa 900 ml", q:180, preco:9 }
};
/* arroz: o pacote é de arroz cru; 1 g cru ≈ 2,6 g cozido */
COMPRAS.arroz.cru = 1/2.6; COMPRAS.feijao.cru = 1/2.3;

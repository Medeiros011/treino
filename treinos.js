/* =========================================================================
   SUA FICHA DE TREINO
   -------------------------------------------------------------------------
   Cada exercício tem:
     nome     -> nome do exercício
     series   -> número de séries
     reps     -> repetições (texto livre: "12", "8-10", "até a falha"...)
     descanso -> descanso entre séries em SEGUNDOS (usado no cronômetro)
     musculo  -> grupo muscular (etiqueta)
     imgs     -> lista de imagens do movimento (o app anima entre elas = "GIF").
                 Deixe [] para não mostrar imagem.
     obs      -> observação/dica (opcional)

   As imagens vêm do banco livre free-exercise-db (jsdelivr CDN).
   Para trocar por um GIF próprio, é só pôr o link dentro de imgs: ["seu-link.gif"].
   ========================================================================= */

const CDN = "https://cdn.jsdelivr.net/gh/yuhonas/free-exercise-db@main/exercises/";
const g = (dir) => [CDN + dir + "/0.jpg", CDN + dir + "/1.jpg"]; // atalho: 2 frames

const TREINOS = [
  {
    id: "A",
    nome: "Treino A",
    foco: "Costas + Bíceps",
    exercicios: [
      { nome: "Barra fixa", series: 4, reps: "6-8", descanso: 120, musculo: "Costas", imgs: g("Pullups"), obs: "Se não fechar as reps, use a máquina graviton ou elástico de apoio." },
      { nome: "Remada curvada", series: 4, reps: "8-10", descanso: 90, musculo: "Costas", imgs: g("Bent_Over_Barbell_Row"), obs: "Tronco ~45°, coluna neutra, puxe com os cotovelos." },
      { nome: "Remada cavalinho", series: 3, reps: "10", descanso: 75, musculo: "Costas", imgs: g("Lying_T-Bar_Row"), obs: "" },
      { nome: "Pulley unilateral", series: 3, reps: "12", descanso: 60, musculo: "Costas", imgs: g("Seated_One-arm_Cable_Pulley_Rows"), obs: "Um lado de cada vez, amplitude completa." },
      { nome: "Pulldown braços estendidos", series: 3, reps: "12", descanso: 60, musculo: "Costas", imgs: g("Straight-Arm_Pulldown"), obs: "Braços quase retos, sinta o dorsal." },
      { nome: "Rosca direta barra W", series: 4, reps: "8-10", descanso: 75, musculo: "Bíceps", imgs: g("EZ-Bar_Curl"), obs: "Cotovelos fixos ao lado do corpo." },
      { nome: "Rosca alternada no banco inclinado", series: 3, reps: "10", descanso: 60, musculo: "Bíceps", imgs: g("Alternate_Incline_Dumbbell_Curl"), obs: "Banco inclinado alonga o bíceps, controle a descida." },
      { nome: "Rosca martelo na corda", series: 3, reps: "12", descanso: 45, musculo: "Bíceps", imgs: g("Cable_Hammer_Curls_-_Rope_Attachment"), obs: "Pega neutra, trabalha o braquial." }
    ]
  },
  {
    id: "B",
    nome: "Treino B",
    foco: "Peito + Ombro + Tríceps",
    exercicios: [
      { nome: "Supino reto", series: 4, reps: "6-8", descanso: 120, musculo: "Peito", imgs: g("Barbell_Bench_Press_-_Medium_Grip"), obs: "Desça a barra até a linha do mamilo, cotovelos ~45°." },
      { nome: "Supino inclinado com halteres", series: 4, reps: "8", descanso: 90, musculo: "Peito", imgs: g("Incline_Dumbbell_Press"), obs: "Banco a 30-45°." },
      { nome: "Crucifixo na polia", series: 3, reps: "12", descanso: 60, musculo: "Peito", imgs: g("Cable_Crossover"), obs: "Leve flexão de cotovelo, aperte no centro." },
      { nome: "Desenvolvimento com halteres", series: 4, reps: "10", descanso: 90, musculo: "Ombro", imgs: g("Dumbbell_Shoulder_Press"), obs: "Não deixe os cotovelos passarem muito da linha do tronco." },
      { nome: "Elevação lateral", series: 4, reps: "12", descanso: 45, musculo: "Ombro", imgs: g("Side_Lateral_Raise"), obs: "Cotovelo levemente flexionado, suba até a linha do ombro." },
      { nome: "Elevação lateral unilateral na polia", series: 3, reps: "15", descanso: 45, musculo: "Ombro", imgs: g("Cable_Seated_Lateral_Raise"), obs: "Tensão constante, um lado de cada vez." },
      { nome: "Tríceps testa", series: 4, reps: "8-10", descanso: 75, musculo: "Tríceps", imgs: g("Lying_Triceps_Press"), obs: "Cotovelos apontados para cima, só o antebraço se move." },
      { nome: "Tríceps corda", series: 3, reps: "12", descanso: 45, musculo: "Tríceps", imgs: g("Triceps_Pushdown_-_Rope_Attachment"), obs: "Abra a corda no final do movimento." },
      { nome: "Tríceps coice", series: 3, reps: "12", descanso: 45, musculo: "Tríceps", imgs: g("Tricep_Dumbbell_Kickback"), obs: "Cotovelo alto e fixo, estenda até o fim." }
    ]
  },
  {
    id: "C",
    nome: "Treino C",
    foco: "Quadríceps",
    exercicios: [
      { nome: "Agachamento livre", series: 4, reps: "6-8", descanso: 150, musculo: "Quadríceps", imgs: g("Barbell_Full_Squat"), obs: "Desça até a coxa paralela, coluna neutra, joelhos alinhados aos pés." },
      { nome: "Leg press", series: 4, reps: "10", descanso: 120, musculo: "Quadríceps", imgs: g("Leg_Press"), obs: "Não trave o joelho no topo." },
      { nome: "Agachamento búlgaro", series: 3, reps: "10 cada perna", descanso: 90, musculo: "Quadríceps", imgs: g("Smith_Single-Leg_Split_Squat"), obs: "⚠️ Atenção ao joelho — se doer, reduza a amplitude ou troque por afundo." },
      { nome: "Cadeira extensora", series: 4, reps: "12", descanso: 75, musculo: "Quadríceps", imgs: g("Leg_Extensions"), obs: "Última série em rest-pause (falha, pausa curta, mais reps)." },
      { nome: "Passada caminhando", series: 3, reps: "12", descanso: 75, musculo: "Quadríceps", imgs: g("Barbell_Walking_Lunge"), obs: "Passo firme, tronco ereto." },
      { nome: "Panturrilha em pé", series: 4, reps: "15", descanso: 45, musculo: "Panturrilha", imgs: g("Standing_Calf_Raises"), obs: "Amplitude completa, segure 1s no topo." }
    ]
  },
  {
    id: "D",
    nome: "Treino D",
    foco: "Ombros + Bíceps + Tríceps",
    exercicios: [
      { nome: "Desenvolvimento na máquina", series: 4, reps: "8", descanso: 90, musculo: "Ombro", imgs: g("Machine_Shoulder_Military_Press"), obs: "Sem máquina, faça o desenvolvimento Arnold com halteres." },
      { nome: "Elevação lateral", series: 4, reps: "12", descanso: 45, musculo: "Ombro", imgs: g("Side_Lateral_Raise"), obs: "Suba até a linha do ombro, controle a descida." },
      { nome: "Crucifixo inverso", series: 4, reps: "12", descanso: 60, musculo: "Ombro", imgs: g("Reverse_Flyes"), obs: "Foco no deltoide posterior, aperte as escápulas." },
      { nome: "Elevação frontal na polia", series: 3, reps: "12", descanso: 45, musculo: "Ombro", imgs: g("Front_Cable_Raise"), obs: "" },
      { nome: "Rosca direta", series: 4, reps: "8", descanso: 75, musculo: "Bíceps", imgs: g("Barbell_Curl"), obs: "Cotovelos fixos ao lado do corpo." },
      { nome: "Rosca martelo", series: 3, reps: "10", descanso: 60, musculo: "Bíceps", imgs: g("Hammer_Curls"), obs: "Pega neutra." },
      { nome: "Rosca concentrada", series: 3, reps: "12", descanso: 45, musculo: "Bíceps", imgs: g("Concentration_Curls"), obs: "Cotovelo apoiado na coxa, pico de contração." },
      { nome: "Paralelas", series: 3, reps: "até a falha", descanso: 90, musculo: "Tríceps", imgs: g("Dips_-_Triceps_Version"), obs: "Tronco mais reto foca no tríceps. Use apoio se precisar." },
      { nome: "Tríceps corda", series: 3, reps: "12", descanso: 45, musculo: "Tríceps", imgs: g("Triceps_Pushdown_-_Rope_Attachment"), obs: "Abra a corda no final." },
      { nome: "Tríceps francês", series: 3, reps: "12", descanso: 45, musculo: "Tríceps", imgs: g("Seated_Triceps_Press"), obs: "Cotovelos apontados para cima e fixos." }
    ]
  },
  {
    id: "E",
    nome: "Treino E",
    foco: "Posterior de Coxa + Glúteos",
    exercicios: [
      { nome: "Stiff", series: 4, reps: "8", descanso: 120, musculo: "Posterior", imgs: g("Stiff-Legged_Barbell_Deadlift"), obs: "⚠️ Atenção ao joelho e à lombar: joelhos levemente flexionados, coluna neutra, empurre o quadril para trás." },
      { nome: "Mesa flexora", series: 4, reps: "10", descanso: 75, musculo: "Posterior", imgs: g("Lying_Leg_Curls"), obs: "Controle a descida, sem tirar o quadril do apoio." },
      { nome: "Levantamento terra", series: 3, reps: "8", descanso: 150, musculo: "Posterior", imgs: g("Barbell_Deadlift"), obs: "⚠️ Técnica em primeiro lugar: barra rente ao corpo, coluna neutra, força nas pernas e glúteos." },
      { nome: "Cadeira flexora unilateral", series: 3, reps: "12", descanso: 60, musculo: "Posterior", imgs: g("Seated_Leg_Curl"), obs: "Uma perna de cada vez, amplitude completa." },
      { nome: "Elevação pélvica", series: 4, reps: "10", descanso: 75, musculo: "Glúteo", imgs: g("Barbell_Glute_Bridge"), obs: "Aperte o glúteo no topo e segure 1s." }
    ]
  }
];

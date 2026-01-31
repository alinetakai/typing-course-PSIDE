const params = new URLSearchParams(window.location.search);
const faseId = params.get('fase')||1;
const fase = fases[faseId];

if(!fase){
    window.location.href='index.html';
}

document.getElementById('faseTitulo').textContent = fase.titulo;

const sequence = [...fase.sequence];

const layout = [['q','w','e','r','t','y','u','i','o','p'],['a','s','d','f','g','h','j','k','l','ç'],['z','x','c','v','b','n','m'],['space']];
let index = 0;
let startTime = 0;
let totalKeystrokes = 0;
let finished = false;

const keyboardEl = document.getElementById('keyboard');
const targetKeyEl = document.getElementById('targetKey');
const progressEl = document.getElementById('progress');
const totalEl = document.getElementById('total');
const tpsEl = document.getElementById('tps');
const tpmEl = document.getElementById('tpm');

totalEl.textContent = sequence.length;

const soundCorrect = new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg');
const soundWrong = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');

function createKeyboard(){
    keyboardEl.innerHTML = '';
    layout.forEach(r => {
        const row = document.createElement('div');
        row.className = 'row';

        r.forEach(k => {
            const key = document.createElement('div');
            key.className = 'key';
            
            if(k === 'space'){
                key.classList.add('space'); 
                key.textContent = 'espaço';
            }
            else{
                key.id = 'key-' + k;
                key.textContent = k;
            }
            
            row.appendChild(key);
        });
        
        keyboardEl.appendChild(row);
    });
}

function highlight(k){
    document.querySelectorAll('.key').forEach(x => x.classList.remove('active','correct','wrong'));
    const el = document.getElementById('key-' + k);
    
    if(el)el.classList.add('active');
}

function updateSpeed(){
    const elapsed = (Date.now() - startTime) / 1000;
    
    if(elapsed > 0){
        const tps = totalKeystrokes / elapsed;
        tpsEl.textContent = tps.toFixed(2);
        tpmEl.textContent = Math.round(tps * 60);
    }
}

function startPhase(){
    index = 0;
    totalKeystrokes = 0;
    finished = false;
    startTime = Date.now();
    tpsEl.textContent = '0';
    tpmEl.textContent = '0';
    document.getElementById('result').style.display = 'none';
    createKeyboard();
    next();
}

function next(){
    if(index >= sequence.length){
        finish();
        return;
    } 
    
    const k = sequence[index];
    targetKeyEl.textContent = k.toUpperCase();
    highlight(k);
    progressEl.textContent = index;
}

function finish(){ 
    finished = true;
    
    const elapsed = (Date.now() - startTime) / 1000;
    const tps = totalKeystrokes / elapsed;
    const tpm = Math.round(tps * 60);
    
    document.getElementById('finalTPS').textContent = tps.toFixed(2);
    document.getElementById('finalTPM').textContent = tpm; 
    
    const rec = document.getElementById('recommendation');
    
    if(tpm >= 120 && fase.proxima){ 
        rec.textContent = '✅ Velocidade adequada para avançar.';
        document.getElementById('nextBtn').style.display = 'block';
    }
    else if(!fase.proxima){
        rec.textContent = '🏆 Última fase concluída!';
    }
    else{
        rec.textContent = '🔁 Continue praticando até atingir 120 TPM.';
    }
    
    document.getElementById('result').style.display = 'block';
}

document.addEventListener('keydown', e => {
    if(finished || index >= sequence.length) return;
    
    totalKeystrokes++;
    
    updateSpeed();
    
    const expected = sequence[index];
    
    if(e.key.toLowerCase() === expected){
        soundCorrect.play();
        index++;
        setTimeout(next,200);
    }
    else{
        soundWrong.play();
    }
});

function irParaProximaFase(){
    if(fase.proxima){
        window.location.href = `fase.html?fase=${fase.proxima}`;
    }
    else{
        window.location.href = 'index.html';
    }
}

function voltarHome(){
    window.location.href = 'index.html';
}
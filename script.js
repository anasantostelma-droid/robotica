// Lista dos 12 Componentes Requeridos
const materials = [
    "Arduino Nano V3 (ATmega328P)",
    "Sensor Ultrassônico HC-SR04",
    "Motor Vibracall Tipo Moeda (3V/5V)",
    "Buzzer Ativo 5V",
    "Bateria 9V Recarregável",
    "Conector/Clip para Bateria 9V",
    "Chave Gangorra (Liga/Desliga)",
    "Mini Protoboard (170 furos)",
    "Resistor de 220 Ohms",
    "Kit de Jumper Wires (Macho-Fêmea / Macho-Macho)",
    "Boné de Algodão (Estruturado)",
    "Fita Dupla Face / Tubo Termorretrátil"
];

// Estado dos Itens Selecionados
let checkedItems = new Array(materials.length).fill(false);

// Inicializa a Renderização ao carregar o DOM
document.addEventListener('DOMContentLoaded', () => {
    renderMaterials();
    updateDemo(150);
});

// Renderiza os Materiais na Tela
function renderMaterials() {
    const listContainer = document.getElementById('materials-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';
    
    materials.forEach((item, index) => {
        const isChecked = checkedItems[index];
        const li = document.createElement('li');
        li.className = `flex items-center justify-between p-3 rounded border ${isChecked ? 'bg-cyber-accent/10 border-cyber-accent text-white' : 'bg-slate-900 border-slate-800 text-slate-400'} cursor-pointer transition`;
        li.onclick = () => toggleItem(index);

        li.innerHTML = `
            <div class="flex items-center gap-3">
                <input type="checkbox" ${isChecked ? 'checked' : ''} class="accent-cyber-accent cursor-pointer pointer-events-none">
                <span class="${isChecked ? 'line-through text-slate-300' : ''}">${item}</span>
            </div>
            <span class="text-[10px] ${isChecked ? 'text-cyber-neon font-bold' : 'text-slate-600'}">${isChecked ? 'PRONTO' : 'PENDENTE'}</span>
        `;
        listContainer.appendChild(li);
    });

    updateProgress();
}

// Alterna Seleção do Componente
function toggleItem(index) {
    checkedItems[index] = !checkedItems[index];
    renderMaterials();
}

// Atualiza Barra de Progresso
function updateProgress() {
    const count = checkedItems.filter(Boolean).length;
    const percentage = (count / materials.length) * 100;
    
    document.getElementById('checklist-progress-text').innerText = `${count} / ${materials.length}`;
    document.getElementById('checklist-progress-bar').style.width = `${percentage}%`;
}

// Atualiza o Simulador em Tempo Real
function updateDemo(dist) {
    document.getElementById('display-dist').innerText = `${dist} cm`;
    document.getElementById('slider-val-read').innerText = `${dist} cm`;

    const logPwm = document.getElementById('log-pwm');
    const logBuzzer = document.getElementById('log-buzzer');
    const logStatus = document.getElementById('log-status');
    const radarPulse = document.getElementById('radar-pulse');

    if (dist <= 30) {
        // Alerta Crítico
        const pwm = Math.round(255 - (dist * 3));
        logPwm.className = "text-red-400 font-bold";
        logPwm.innerText = `> PWM Motor (D5): ${pwm} / 255 (MÁXIMA VIBRAÇÃO)`;
        
        logBuzzer.className = "text-red-400 font-bold animate-pulse";
        logBuzzer.innerText = `> Estado Buzzer (D6): LIGADO (BIPE CRÍTICO)`;
        
        logStatus.className = "text-red-500 font-bold";
        logStatus.innerText = `> STATUS: OBSTÁCULO MUITO PRÓXIMO!`;
        
        radarPulse.className = "absolute inset-0 rounded-full border-2 border-red-500 animate-ping";
    } else if (dist <= 100) {
        // Atenção
        const pwm = Math.round(255 - (dist * 1.5));
        logPwm.className = "text-amber-400";
        logPwm.innerText = `> PWM Motor (D5): ${pwm} / 255 (VIBRAÇÃO MODERADA)`;
        
        logBuzzer.className = "text-slate-500";
        logBuzzer.innerText = `> Estado Buzzer (D6): DESLIGADO`;
        
        logStatus.className = "text-amber-400 font-bold";
        logStatus.innerText = `> STATUS: OBSTÁCULO DETECTADO`;
        
        radarPulse.className = "absolute inset-0 rounded-full border-2 border-amber-400 animate-pulse";
    } else {
        // Caminho Livre
        logPwm.className = "text-emerald-400";
        logPwm.innerText = `> PWM Motor (D5): 0 / 255 (OFF)`;
        
        logBuzzer.className = "text-cyan-400";
        logBuzzer.innerText = `> Estado Buzzer (D6): DESLIGADO`;
        
        logStatus.className = "text-emerald-400 font-bold";
        logStatus.innerText = `> STATUS: CAMINHO LIVRE`;
        
        radarPulse.className = "absolute inset-0 rounded-full border-2 border-cyber-accent/40 animate-ping";
    }
}

// Alterar Tamanho de Fonte
function changeFontSize(size) {
    document.body.classList.remove('font-lg', 'font-xl');
    if (size === 'lg') document.body.classList.add('font-lg');
    if (size === 'xl') document.body.classList.add('font-xl');
}

// Alternar Modo de Alto Contraste
function toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
}

// Copiar Código Arduino
function copyCode() {
    const code = document.getElementById('code-block').innerText;
    navigator.clipboard.writeText(code).then(() => {
        alert("Código C++ copiado com sucesso para a área de transferência!");
    });
}

// Guia de Voz (Text-to-Speech SIMPLES)
let isSpeaking = false;
function toggleTTS() {
    const btnText = document.getElementById('tts-text');
    
    if (!('speechSynthesis' in window)) {
        alert("Seu navegador não suporta a função de leitura de voz.");
        return;
    }

    if (isSpeaking) {
        window.speechSynthesis.cancel();
        isSpeaking = false;
        btnText.innerText = "VOICE_GUIDE";
    } else {
        const textToRead = "Projeto Boné Sensorial com Arduino. Dispositivo vestível para acessibilidade e detecção hática de obstáculos.";
        const utterance = new SpeechSynthesisUtterance(textToRead);
        utterance.lang = 'pt-BR';
        
        utterance.onend = () => {
            isSpeaking = false;
            btnText.innerText = "VOICE_GUIDE";
        };
        
        window.speechSynthesis.speak(utterance);
        isSpeaking = true;
        btnText.innerText = "PARAR_VOZ";
    }
}
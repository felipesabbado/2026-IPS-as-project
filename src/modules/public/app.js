async function loadVideos() {
    try {
        // Faz a chamada ao endpoint GET /videos do módulo Video Catalog
        const response = await fetch('/videos');
        const videos = await response.json();
        const list = document.getElementById('videoList');
        list.innerHTML = '';

        // Usamos for...of para podermos usar await dentro do loop
        for (const v of videos) {
            // AJUSTE: O seu sistema está a usar 'PUBLISHED', por isso aceitamos ambos
            const isProcessed = v.status === 'PROCESSED' || v.status === 'PUBLISHED';
            const statusClass = isProcessed ? 'status-processed' : 'status-pending';
            
            // Requisito de Integração: Procurar estatísticas em tempo real no módulo de Engagement
            let views = 0;
            try {
                // Chama o EngagementController.getStats
                const statsRes = await fetch(`/videos/${v.id}/stats`);
                if (statsRes.ok) {
                    const stats = await statsRes.json();
                    // O seu RegisterViewUseCase usa a propriedade 'views'
                    views = stats.views || 0;
                }
            } catch (e) { 
                console.error("Erro ao obter stats para o vídeo:", v.id); 
            }

            list.innerHTML += `
                <tr>
                    <td><strong>${v.title}</strong></td>
                    <td><span class="${statusClass}">${v.status || 'PENDING'}</span></td>
                    <td>
                        <button onclick="registerView('${v.id}', '${v.title}')" ${!isProcessed ? 'disabled' : ''}>👁️ Ver</button>
                    </td>
                    <td>
                        <strong>🔥 ${views}</strong> 
                        <button onclick="showStats('${v.id}')" style="font-size: 0.8em; margin-left: 5px;">Detalhes</button>
                    </td>
                    <td class="correlation-id">${v.correlationId || '---'}</td>
                </tr>
            `;
        }
    } catch (err) {
        console.error("Erro ao carregar dashboard:", err);
    }
}

// POST /videos - Upload de um novo vídeo
async function uploadVideo(forceError) {
    const titleInput = document.getElementById('videoTitle');
    const authorInput = document.getElementById('videoAuthor');
    const descriptionInput = document.getElementById('videoDescription');
    let title = titleInput.value;
    let author = authorInput.value;
    let description = descriptionInput.value;

    if (!title) return alert("Por favor, insira um título.");

    // Truque para a POC: se forceError for true, adicionamos um prefixo que o Worker reconhece para falhar
    if (forceError) {
        title = `FAIL_RETRY_${title}`;
    }

    try {
        await fetch('/videos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, author, description })
        });

        titleInput.value = '';
        authorInput.value = '';
        descriptionInput.value = '';
        loadVideos(); // Atualiza a lista para mostrar o vídeo como 'PENDING'
    } catch (err) {
        alert("Erro ao realizar upload.");
    }
}

// POST /videos/:id/view - Registar uma visualização (Módulo Engagement)
async function registerView(videoId, videoTitle) {
    // 1. Feedback visual (Simular que o utilizador está a ver o vídeo)
    const playerSection = document.getElementById('player-section');
    if (playerSection) {
        document.getElementById('playing-title').innerText = `🎥 A assistir: ${videoTitle}`;
        playerSection.style.display = 'block';
    }

    try {
        // 2. Chamada à API (Módulo Engagement definido no main.js)
        const response = await fetch(`/videos/${videoId}/view`, { method: 'POST' });
        
        if (response.ok) {
            console.log(`[CorrelationID: SYSTEM] Visualização registada para o vídeo: ${videoId}`);
            // 3. Atualizamos a lista para que o botão de "Stats" mostre o valor atualizado
            loadVideos(); 
        }
    } catch (err) {
        console.error("Erro ao comunicar com o módulo de Engagement:", err);
    }
}


// GET /videos/:id/stats - Obter estatísticas (Módulo Engagement)
async function showStats(videoId) {
    try {
        const responseStats = await fetch(`/videos/${videoId}/stats`);
        const stats = await responseStats.json();

        const responseVideo = await fetch(`/videos/${videoId}`);
        const video = await responseVideo.json();
        
        const modal = document.getElementById('statsModal');
        const content = document.getElementById('statsContent');
        
        content.innerHTML = `
            <strong>Video ID:</strong> ${videoId}<br>
            <strong>Visualizações:</strong> ${stats.views || 0}<br>
            <strong>Autor:</strong> ${video.data.author}<br>
            <strong>Description:</strong> ${video.data.description}<br>
            <small>Dados processados via Event-Driven</small>
        `;
        modal.style.display = 'block';
    } catch (err) {
        alert("Não foi possível carregar as estatísticas.");
    }
}

async function loadLogs() {
    try {
        const response = await fetch('/system/logs'); // Tem de bater com o main.js
        const logs = await response.json();
        const list = document.getElementById('logConsole');
        
        if (!list) return;
        list.innerHTML = ''; // Limpar para não duplicar

        logs.forEach(log => {
            const color = log.level === 'ERROR' ? 'red' : (log.level === 'WARN' ? 'orange' : 'green');
            list.innerHTML += `
                <tr style="color: #d4d4d4; font-family: monospace;">
                    <td>[${log.timestamp.split('T')[1].split('Z')[0]}]</td>
                    <td style="color: ${color}">[${log.level}]</td>
                    <td style="color: #4ec9b0">${log.correlationId}</td>
                    <td>${log.message}</td>
                </tr>
            `;
        });
    } catch (err) {
        console.error("Erro ao carregar logs no front-end");
    }
}

// Polling rápido para parecer uma consola real
setInterval(loadLogs, 2000);


// Polling: Atualiza a lista a cada 10 segundos para mostrar o Worker a trabalhar
// Isso demonstra o "Web-Queue-Worker" em tempo real
setInterval(loadVideos, 10000);

// Carregamento inicial
loadVideos();
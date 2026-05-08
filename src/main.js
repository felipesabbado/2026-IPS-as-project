import express from 'express';

// Shared
import { InMemoryQueueAdapter } from './shared/adapters/driven/InMemoryQueueAdapter.js';

// Video Catalog Module
import { UploadVideoUseCase } from './modules/video-catalog/domain/UploadVideoUseCase.js';
import { ListVideosUseCase } from './modules/video-catalog/domain/ListVideosUseCase.js';
import { ProcessVideoUseCase } from './modules/video-catalog/domain/ProcessVideoUseCase.js';
import { InMemoryVideoRepository } from './modules/video-catalog/adapters/driven/InMemoryVideoRepository.js';
import { VideoController } from './modules/video-catalog/adapters/driving/VideoController.js';
import { createVideoRoutes } from './modules/video-catalog/adapters/driving/VideoRoutes.js';
import { VideoWorker } from './modules/video-catalog/adapters/driving/VideoWorker.js';

// Engagement Module
import { RegisterViewUseCase } from './modules/engagement/domain/RegisterViewUseCase.js';
import { ListViewStatsUseCase } from './modules/engagement/domain/ListViewStatsUseCase.js'
import { InMemoryEngagementRepository } from './modules/engagement/adapters/driven/InMemoryEngagementRepository.js';
import { EngagementController } from './modules/engagement/adapters/driving/EngagementController.js';
import { createEngagementRoutes } from './modules/engagement/adapters/driving/EngagementRoutes.js';

const app = express();
app.use(express.json());

// --- Dependency Injection (Composition Root) ---

// Instanciação da Infraestrutura Partilhada
const queueAdapter = new InMemoryQueueAdapter();

// Video Catalog Wiring
const videoRepo = new InMemoryVideoRepository();

// Use Cases (Video)
const uploadVideoUC = new UploadVideoUseCase(videoRepo, queueAdapter);
const listVideosUC = new ListVideosUseCase(videoRepo);
const processVideoUC = new ProcessVideoUseCase(videoRepo);

// Input Adapters (HTTP & Worker)
const videoController = new VideoController(uploadVideoUC, listVideosUC);
const videoWorker = new VideoWorker(queueAdapter, processVideoUC);

// Inicializa o Worker para ficar à escuta de mensagens em background
videoWorker.start();

// Engagement Wiring
const engagementRepo = new InMemoryEngagementRepository();

// Use Cases (Engagement)
const registerViewUC = new RegisterViewUseCase(engagementRepo);
const listViewStatsUC = new ListViewStatsUseCase(engagementRepo);

// Input Adapters
const engagementController = new EngagementController(registerViewUC, listViewStatsUC);

// --- Routes ---

// Video Routes
app.use('/videos', createVideoRoutes(videoController));

// Engagement Routes
app.use('/videos', createEngagementRoutes(engagementController));

// Health Check
app.get('/', (req, res) => {
    res.send('ProtoTube API is running (Phase 1: Hexagonal Monolith)');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    🚀 ProtoTube Server Ready!
    Mode: Monolith (Hexagonal Architecture)
    Port: ${PORT}
    
    Available Endpoints:
    - POST /videos         : Upload a new video
    - GET  /videos         : List all videos
    - POST /videos/:id/view : Register a view for a video
    - GET  /videos/:id/stats: Get view statistics
    `);
});

import express from 'express';

// Video Catalog Module
import { UploadVideoUseCase } from './modules/video-catalog/domain/UploadVideoUseCase.js';
import { InMemoryVideoRepository } from './modules/video-catalog/adapters/driven/InMemoryVideoRepository.js';
import { VideoController } from './modules/video-catalog/adapters/driving/VideoController.js';

// Engagement Module
import { RegisterViewUseCase } from './modules/engagement/domain/RegisterViewUseCase.js';
import { InMemoryEngagementRepository } from './modules/engagement/adapters/driven/InMemoryEngagementRepository.js';
import { EngagementController } from './modules/engagement/adapters/driving/EngagementController.js';

const app = express();
app.use(express.json());

// --- Dependency Injection (Composition Root) ---

// 1. Video Catalog Wiring
const videoRepo = new InMemoryVideoRepository();
const uploadVideoUC = new UploadVideoUseCase(videoRepo);
const videoController = new VideoController(uploadVideoUC, videoRepo);

// 2. Engagement Wiring
const engagementRepo = new InMemoryEngagementRepository();
const registerViewUC = new RegisterViewUseCase(engagementRepo);
const engagementController = new EngagementController(registerViewUC, engagementRepo);

// --- Routes ---

// Video Routes
app.post('/videos', (req, res) => videoController.upload(req, res));
app.get('/videos', (req, res) => videoController.list(req, res));

// Engagement Routes
app.post('/videos/:videoId/view', (req, res) => engagementController.registerView(req, res));
app.get('/videos/:videoId/stats', (req, res) => engagementController.getStats(req, res));

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

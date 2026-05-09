import express from 'express';

// Shared
import { InMemoryQueueAdapter } from './shared/adapters/driven/InMemoryQueueAdapter.js';
import { InMemoryEventBusAdapter } from './shared/adapters/driven/InMemoryEventBusAdapter.js';

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
import { ListViewStatsUseCase } from './modules/engagement/domain/ListViewStatsUseCase.js';
import { InitializeVideoStatsUseCase } from './modules/engagement/domain/InitializeVideoStatsUseCase.js';
import { InMemoryEngagementRepository } from './modules/engagement/adapters/driven/InMemoryEngagementRepository.js';
import { EngagementController } from './modules/engagement/adapters/driving/EngagementController.js';
import { createEngagementRoutes } from './modules/engagement/adapters/driving/EngagementRoutes.js';
import { EngagementEventConsumer } from './modules/engagement/adapters/driving/EngagementEventConsumer.js';

// Notifications Module
import { SendNotificationUseCase } from './modules/notifications/domain/SendNotificationUseCase.js';
import { NotificationEventConsumer } from './modules/notifications/adapters/driving/NotificationEventConsumer.js';

const app = express();
app.use(express.json());

// --- Dependency Injection (Composition Root) ---

// Instanciação da Infraestrutura Partilhada
const queueAdapter = new InMemoryQueueAdapter();
const eventBusAdapter = new InMemoryEventBusAdapter();

// Video Catalog Wiring
const videoRepo = new InMemoryVideoRepository();

// Use Cases (Video)
const uploadVideoUC = new UploadVideoUseCase(videoRepo, queueAdapter);
const listVideosUC = new ListVideosUseCase(videoRepo);
const processVideoUC = new ProcessVideoUseCase(videoRepo, eventBusAdapter);

// Input Adapters (HTTP & Worker)
const videoController = new VideoController(uploadVideoUC, listVideosUC);
const videoWorker = new VideoWorker(queueAdapter, processVideoUC);

// Engagement Wiring
const engagementRepo = new InMemoryEngagementRepository();

// Use Cases (Engagement)
const registerViewUC = new RegisterViewUseCase(engagementRepo);
const listViewStatsUC = new ListViewStatsUseCase(engagementRepo);
const initializeVideoStatsUC = new InitializeVideoStatsUseCase(engagementRepo);

// Input Adapters (Engagement)
const engagementController = new EngagementController(registerViewUC, listViewStatsUC);
const engagementConsumer = new EngagementEventConsumer(eventBusAdapter, initializeVideoStatsUC);

// Notifications Wiring
const sendNotificationUC = new SendNotificationUseCase();
const notificationConsumer = new NotificationEventConsumer(eventBusAdapter, sendNotificationUC);

// --- Inicialização de Background Workers e Consumers ---
videoWorker.start();
engagementConsumer.start();
notificationConsumer.start();

// --- Routes ---
// Video Routes
app.use('/videos', createVideoRoutes(videoController));

// Engagement Routes
app.use('/videos', createEngagementRoutes(engagementController));

// Health Check
app.get('/', (req, res) => {
    res.send('ProtoTube API is running (Phase 2: Asynchronism, Decoupling, and Observability)');
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

import express from 'express';

// Shared
import { StructuredLoggerAdapter } from './shared/adapters/driven/StructuredLoggerAdapter.js';
import { InMemoryQueueAdapter } from './shared/adapters/driven/InMemoryQueueAdapter.js';
import { InMemoryEventBusAdapter } from './shared/adapters/driven/InMemoryEventBusAdapter.js';

// Video Catalog Module
import { UploadVideoUseCase } from './modules/video-catalog/domain/UploadVideoUseCase.js';
import { GetVideoByIdUseCase } from './modules/video-catalog/domain/GetVideoByIdUseCase.js';
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

// Node.js ES Modules don't have __dirname by default, so we need to create it
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(express.json());

// Servir ficheiros estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'modules/public')));


// --- Dependency Injection (Composition Root) ---

// Instanciação da Infraestrutura Partilhada
const logger = new StructuredLoggerAdapter();
const queueAdapter = new InMemoryQueueAdapter(logger);
const eventBusAdapter = new InMemoryEventBusAdapter(logger);

// Video Catalog Wiring
const videoRepo = new InMemoryVideoRepository();

// Use Cases (Video)
const uploadVideoUC = new UploadVideoUseCase(videoRepo, queueAdapter, logger);
const listVideosUC = new ListVideosUseCase(videoRepo);
const processVideoUC = new ProcessVideoUseCase(videoRepo, eventBusAdapter, logger);
const getVideoUC = new GetVideoByIdUseCase(videoRepo, logger);

// Input Adapters (HTTP & Worker)
const videoController = new VideoController(uploadVideoUC, listVideosUC, logger, getVideoUC);
const videoWorker = new VideoWorker(queueAdapter, processVideoUC, logger);

// Engagement Wiring
const engagementRepo = new InMemoryEngagementRepository();

// Use Cases (Engagement)
const initializeVideoStatsUC = new InitializeVideoStatsUseCase(engagementRepo, logger);
const listViewStatsUC = new ListViewStatsUseCase(engagementRepo);
const registerViewUC = new RegisterViewUseCase(engagementRepo, logger);

// Input Adapters (Engagement)
const engagementController = new EngagementController(registerViewUC, listViewStatsUC, logger);
const engagementConsumer = new EngagementEventConsumer(eventBusAdapter, initializeVideoStatsUC, logger);

// Notifications Wiring
const sendNotificationUC = new SendNotificationUseCase(logger);
const notificationConsumer = new NotificationEventConsumer(eventBusAdapter, sendNotificationUC, logger);

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

// Endpoint para consultar logs estruturados
app.get('/system/logs', (req, res) => {
    res.json(logger.getLogs());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`
    🚀 ProtoTube Server Ready!
    Mode: Async (Hexagonal Architecture)
    Port: ${PORT}
    
    Available Endpoints:
    - POST /videos           : Upload a new video
    - GET  /videos           : List all videos
    - GET  /videos/:id       : Get video by ID
    - POST /videos/:id/view  : Register a view for a video
    - GET  /videos/:id/stats : Get view statistics
    `);
});

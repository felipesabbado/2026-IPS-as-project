import { Router } from 'express';

export function createEngagementRoutes(engagementController) {
    const router = Router();

    router.post('/:videoId/view', (req, res) => engagementController.registerView(req, res));
    router.get('/:videoId/stats', (req, res) => engagementController.getStats(req, res));

    return router;
}
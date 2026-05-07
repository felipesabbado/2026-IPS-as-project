import { Router } from 'express'

export function createVideoRoutes(videoController) {
    const router = Router()

    router.post('/', (req, res) => videoController.upload(req, res))
    router.get('/', (req, res) => videoController.list(req, res))

    return router
}
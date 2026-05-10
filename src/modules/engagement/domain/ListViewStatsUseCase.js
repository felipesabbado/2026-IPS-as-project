export class ListViewStatsUseCase {
    /**
     * @param {import ('../ports/EngagementRepository')} engagementRepository
     */
    constructor(engagementRepository) {
        this.engagementRepository = engagementRepository
    }

    async execute(videoId) {
        return await this.engagementRepository.findByVideoId(videoId)
    }
}
export class ViewCount {
    constructor({ videoId, views = 0, createdAt = new Date() }) {
        this.videoId = videoId;
        this.views = views;
        this.createdAt = createdAt;
    }

    increment() {
        this.views++;
    }
}

export class ViewCount {
    constructor({ videoId, views = 0 }) {
        this.videoId = videoId;
        this.views = views;
    }

    increment() {
        this.views++;
    }
}

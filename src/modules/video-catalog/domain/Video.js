export class Video {
    constructor({ id, title, description, author, status = 'PENDING', qualities = [] }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.author = author;
        this.status = status;
        this.qualities = qualities;
        this.createdAt = new Date();
    }

    startProcessing() {
        this.status = 'PROCESSING';
    }

    publish() {
        this.status = 'PUBLISHED';
    }

    addQuality(quality) {
        if (!this.qualities.includes(quality)) {
            this.qualities.push(quality);
        }
    }
}

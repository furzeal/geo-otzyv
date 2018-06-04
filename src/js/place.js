class Place {
    constructor(address, comments) {
        this.address = address;
        this.comments = comments;
    }

    addComment(comment) {
        this.comments.push(comment);
    }
}

class Comment {
    constructor(name, location, date, text) {
        this.name = name;
        this.location = location;
        this.date = date;
        this.text = text;
    }
}

module.exports = {
    place: Place,
    comment: Comment
};

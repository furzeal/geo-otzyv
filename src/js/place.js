class Place {
    constructor(address, name, location, date, text, placemark) {
        this.address = address;
        this.name = name;
        this.location = location;
        this.date = date;
        this.text = text;
        this.placemark = placemark;
    }

    // addComment(comment) {
    //     this.comments.push(comment);
    // }
}
//
// class Comment {
//     constructor(name, location, date, text) {
//         this.name = name;
//         this.location = location;
//         this.date = date;
//         this.text = text;
//     }
// }

module.exports = {
    place: Place,
    //comment: Comment
};

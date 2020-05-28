export default class Comment {
  constructor(data) {
    this.id = data.id;
    this.author = data.author;
    this.comment = data.comment;
    this.date = data.date;
    this.emotion = data.emotion;
  }

  toRAW(clone = false) {
    return {
      "id": this.id,
      "author": this.author,
      "comment": clone ? this.comments : this.comments.map((id) => id),
      "date": this.date,
      "emotion": this.emotion
    };
  }

  static parseComment(data) {
    return new Comment(data);
  }

  static parseComments(data) {
    return data.map(Comment.parseComment);
  }

  static clone(data) {
    return new Comment(data.toRAW(true));
  }
}

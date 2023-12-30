export default class Comment {
  constructor(comment) {
    this.id = comment.id;
    this.author = comment.author;
    this.comment = comment.comment;
    this.date = comment.date;
    this.emotion = comment.emotion;
  }

  toRAW(clone = false) {
    return {
      "id": this.id,
      "author": this.author,
      "comment": clone ? this.comment : this.comment.map((id) => id),
      "date": this.date,
      "emotion": this.emotion
    };
  }

  static parseComment(comment) {
    return new Comment(comment);
  }

  static parseComments(comment) {
    return comment.map(Comment.parseComment);
  }

  static clone(comment) {
    return new Comment(comment.toRAW(true));
  }
}

class Envelope {
  constructor(searchItem) {
    this.item = searchItem;
  }
  location() {
    try {
      return {
        lat: this.item.l[0],
        lng: this.item.l[1],
      };
    } catch (error) {
      console.log(error);
      return {};
    }
  }
  id() {
    return this.item.id;
  }
  message() {
    return this.item.msg;
  }
  user() {
    if (this.item.u) {
      return this.item.u;
    }
    return {};
  }
  grabbed() {
    return this.item.g;
  }
}

export default Envelope;

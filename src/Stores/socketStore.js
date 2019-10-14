import socketIOClient from "socket.io-client";

class SocketStore {
  constructor() {
    this.socket = socketIOClient("https://savemyspotnode.smokeme.now.sh/");
    // this.socket = socketIOClient("http://127.0.0.1:3000");
  }
  restaurantSignIn(restaurantID) {
    this.socket.emit("restaurant request", restaurantID);
  }
  seatGuest(queueID) {
    this.socket.emit("seat guest", queueID);
  }
}

export default new SocketStore();

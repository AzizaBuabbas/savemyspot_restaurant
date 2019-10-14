import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { observer } from "mobx-react";

//Components
import QueueRow from "./QueueRow";

//Stores
import socketStore from "../../Stores/socketStore";
import authStore from "../../Stores/authStore";

class Queue extends Component {
  constructor(props) {
    super(props);
    this.state = {
      queue: []
    };
  }
  componentDidMount() {
    socketStore.restaurantSignIn(authStore.restaurant);
    socketStore.socket.on("restaurantQ", data => {
      this.setState({ queue: data });
    });
    socketStore.socket.on("update queue", () => {
      socketStore.restaurantSignIn(authStore.restaurant);
    });
  }

  componentWillUnmount() {
    socketStore.socket.off("restaurantQ");
  }

  render() {
    if (authStore.loading && authStore.restaurant === null) {
      return <Redirect to="/login/" />;
    }
    let { queue } = this.state;
    let QueueList;
    if (queue) {
      queue = queue.reverse();
      QueueList = queue.map(queue => <QueueRow key={queue.id} queue={queue} />);
      return (
        <div style={{ marginTop: 50 }} className="row text-center">
          <table className=" col-10 table table-bordered mx-auto">
            <thead
              className="text-center"
              style={{ backgroundColor: "rgb(163,35,58)" }}
            >
              <tr>
                <th style={white}>Position</th>
                <th style={white}>Name</th>
                <th style={white}># of Guests</th>
                <th style={white}>Seat</th>
              </tr>
            </thead>
            <tbody>{QueueList}</tbody>
          </table>
        </div>
      );
    } else {
      return <div />;
    }
  }
}

const white = {
  color: "white"
};

export default observer(Queue);

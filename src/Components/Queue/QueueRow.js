import React, { Component } from "react";

class QueueRow extends Component {
  render() {
    const { queue } = this.props;
    return (
      <tr style={{ borderBottom: "1px solid black" }}>
        <td style={num}>{queue.position}</td>
        <td style={text}>
          {queue.user.first_name} {queue.user.last_name}
        </td>
        <td style={num}>{queue.guests}</td>
        <td>
          <button
            className="btn btn-dark"
            onClick={() => socketStore.seatGuest(queue.id)}
          >
            Seat
          </button>
        </td>
      </tr>
    );
  }
}

const num = {
  fontWeight: "bold",
  fontSize: 30,
  color: "rgb(163,35,58)"
};

const text = {
  fontWeight: "bold",
  fontSize: 25,
  color: "rgb(163,35,58)"
};

export default QueueRow;

import React from "react";
import axios from "axios";
import QueueContainer from "./QueueContainer";

class Jukebox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clearMe: null,
      queue: [],
    };
  }

  componentDidMount() {
    const { setState } = this;
    setState({
      clearMe: setInterval(() => {
        axios.get("/playlist")
          .then((res) => {
            setState({ queue: res.data });
          });
      }, 10 * 1000),
    });
  }

  componentWillUnmount() {
    const { clearMe } = this.state;
    if (clearMe !== null) clearInterval(clearMe);
  }

  render() {
    return (
      <React.Fragment>
        <div class="header">
          <div class="border"></div>
          <div class="center">
            <span class="musical">🎶</span>
            <div class="text">
              <span class="hs">HackerSpace</span>
              <span class="mga">Maringá</span>
              <span class="jukebox">Jukebox</span>
            </div>
            <span class="musical">🎶</span>
          </div>
          <div class="border"></div>
        </div>
        <QueueContainer queue={queue} />
      </React.Fragment>
    );
  }
}

export default Jukebox;

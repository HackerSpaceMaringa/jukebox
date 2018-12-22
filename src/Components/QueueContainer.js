import React from "react";
import QueueItem from "./QueueItem";

class QueueContainer extends React.Component {
  render() {
    const { queue } = this.props;
    return (
      <React.Fragment>
        <div class="form">
          <label>
            {"Add To Queue"}
            <input type="text" name="url"/>
          </label>
          <button type="submit">+</button>
        </div>
        <div class="queue">
          {queue.length > 1 ? (
            <React.Fragment>
              <span class="now">NOW PLAYING</span>
              <QueueItem item={queue[0]} />
            </React.Fragment>
           ) : null}
          {queue.length > 2 ? (
            <React.Fragment>
              <span class="next">NEXT UP</span>
              {queue.slice(1).map((elem) => <QueueItem item={elem} />)}
            </React.Fragment>
           ) : null}
        </div>
      </React.Fragment>
    );
  }
}

export default QueueContainer;

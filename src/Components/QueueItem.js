import React from "react";

class QueueItem extends React.Component {
  render() {
    const { item } = this.props;
    return (
      <div class="item">
        <div class="content">
          <span class="title">{item.title}</span>
          <span class="length">{item.duration}</span>
        </div>
        <div class="label">
          <span class="title">title</span>
          <span class="length">length</span>
        </div>
      </div>
    );
  }
}

export default QueueItem;

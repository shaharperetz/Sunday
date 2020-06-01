import React from "react";

export default class LabelPreviewUnEdit extends React.Component {
  render() {
    const { color, value } = this.props.label;

    return (
      <section
        onClick={() => this.props.setColumn(color, value)}
        className="box-label"
        style={{ backgroundColor: `${color}` }}
      >
        <p>{value}</p>
      </section>
    );
  }
}

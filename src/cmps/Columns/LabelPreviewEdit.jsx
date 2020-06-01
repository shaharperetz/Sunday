import React, { Component } from "react";
import { CirclePicker } from "react-color";
import cPicker from "../../style/img/cpicker.png";

export default class extends Component {
  state = {
    text: "",
    color: "",
    id: "",
    colorPickerIsShown: false,
  };

  componentDidMount() {
    const { label } = this.props;
    this.setState(
      {
        text: label.value,
        color: label.color,
        id: label.id,
      },
      // () => console.log("edit", this.state)
    );
  }

  toggleCirclePicker = (ev) => {
    ev.stopPropagation();
    this.setState(({ colorPickerIsShown }) => ({
      colorPickerIsShown: !colorPickerIsShown,
    }));
  };

  onChangeComplete = (color) => {
    this.setState({ color: color.hex });
    let { label } = this.props;
    this.handleSubmit(label);
  };

  handleChange = ({ target }) => {
    const value = target.value;
    this.setState({ text: value });
  };

  handleSubmit = (label, ev) => {
    if (ev) ev.stopPropagation();
    let color = this.state.color;
    let text = this.state.text;
    this.props.setLabel(label, color, text);
  };

  handleRemove = (label, ev) => {
    if (ev) ev.stopPropagation();
    this.props.removeLabel(label);
  };

  render() {
    const { colorPickerIsShown, color, text } = this.state;
    return (
      <>
        <section className="box-label">
          <div
            style={{ backgroundColor: `${color}` }}
            onClick={(ev) => this.toggleCirclePicker(ev)}
            className="drop-color"
          ></div>
          {/* <img
            src={cPicker}
            style={{ backgroundColor: `${color}` }}
            className="color-picker"
            onClick={(ev) => this.toggleCirclePicker(ev)}
            alt=""
          /> */}

          <input
            name="text"
            type="text"
            value={text}
            onChange={this.handleChange}
            onBlur={(ev) => this.handleSubmit(this.props.label, ev)}
          ></input>

          <img
            className="delete-icon"
            src="/static/media/delete.bff23160.svg"
            alt="Delete"
            title="Delete label"
            onClick={(ev) => this.handleRemove(this.props.label, ev)}
          ></img>
        </section>

        {colorPickerIsShown && (
          <CirclePicker
            onChangeComplete={(color) => this.onChangeComplete(color)}
          />
        )}
        {/* <div onClick={(ev) => this.handleSubmit(ev, this.props.label)}>
          Save Changes
        </div> */}
      </>
    );
  }
}

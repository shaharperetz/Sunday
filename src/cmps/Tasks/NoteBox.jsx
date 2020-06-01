import React, { Component } from "react";
import { loadBoards, saveBoard } from "../../actions/BoardActions";
import { connect } from "react-redux";

class NoteBox extends Component {
  state = {
    txt: "",
  };
  handleChange = (ev) => {
    ev.stopPropagation();

    ev.preventDefault();
    this.setState({ txt: ev.target.value });
  };
  render() {
    return (
      <div>
        <form
          className="send-btn-inbox flex col a a-center"
          onSubmit={(e) => {
            this.props.addNoteToTask(e, this.state.txt);
          }}
        >
          <input
            placeholder="Write a reply..."
            onChange={(ev) => this.handleChange(ev)}
          ></input>
          <button type="submit">Send</button>
        </form>
      </div>
    );
  }
}

const mapDispatchToProps = {
  loadBoards,
  saveBoard,
};

export default connect(null, mapDispatchToProps)(NoteBox);

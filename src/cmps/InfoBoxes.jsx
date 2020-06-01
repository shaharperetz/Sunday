import React from "react";
import { saveBoard, loadBoards } from "../actions/BoardActions";
import { connect } from "react-redux";
import axios from "axios";
import NoteBox from "./Tasks/NoteBox";
import note from "../style/img/sidenote.png";

import "../style/cmps/addNote.css";
import DropZone from "./Tasks/DropZone";
class InfoBoxes extends React.Component {
  state = {
    boxesToRender: [],
    note: "",
    isNoteBoxShown: false,
    isFileBoxShown: false,
  };
  componentDidMount() {
    this.getBoxesToRender();
  }
  componentWillUnmount() {}
  getBoxesToRender = () => {
    const task = this.props.task;
    let boxesToRender;
    if (!task.files || !task.files.length) {
      boxesToRender = [...task.notes];
    } else {
      boxesToRender = [...task.notes, ...task.files];
    }
    // const boxesToRender = [...task.notes, ...task.files]
    boxesToRender.sort(function compare(a, b) {
      var dateA = new Date(a.timeStamp);
      var dateB = new Date(b.timeStamp);
      return dateB - dateA;
    });
    this.setState({ boxesToRender });
  };

  savefileToTask = async (event, file) => {
    event.stopPropagation();
    const CLOUD_NAME = "shaharperetz"; // find it in your cloudinary account (main page)
    const UPLOAD_URL = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
    const task = this.props.task;
    const formData = new FormData();
    formData.append("file", event.target.files[0]);
    formData.append("upload_preset", "swg3eibm"); // second parameter is the upload preset (you can find it in cloudinary settings)
    const imgUrl = await axios
      .post(UPLOAD_URL, formData)
      .then((res) => {
        return res.data.url;
      })
      .then((imgUrl) => {
        return imgUrl;
      });
    const currBoard = this.props.currBoard;
    const fileWithTimeStamp = {
      type: "file",
      imgUrl,
      timeStamp: Date.now(),
    };
    task.files = task.files ? task.files : [];
    task.files.unshift(fileWithTimeStamp);
    await this.props.saveBoard(currBoard);
    await this.props.loadBoards();
    this.getBoxesToRender();
  };
  openNoteBox = (ev) => {
    ev.stopPropagation();
    ev.preventDefault();
    this.setState({ isNoteBoxShown: true });
  };
  addNoteToTask = async (e, txt) => {
    e.preventDefault();
    e.stopPropagation();
    if (!txt) return;
    const task = this.props.task;
    const currBoard = this.props.currBoard;
    const noteWithTimeStamp = { type: "note", txt, timeStamp: Date.now() };
    task.notes.unshift(noteWithTimeStamp);
    this.getBoxesToRender();
    await this.props.saveBoard(currBoard);
    this.getBoxesToRender();
  };
  handleNoteChange = (e) => {
    this.setState({ note: e.target.value });
  };

  handleFileAdd = (event) => {
    event.stopPropagation();
  };
  AddNoteBox = () => {};
  creatInfoBox = (type) => {
    return {};
  };

  render() {
    const { boxesToRender } = this.state;
    const isAddNoteShows = this.state.isNoteBoxShown;
    return (
      <>
        <div className="info-boxes-btns flex a-center space-evenly">
          <div className="note-btn" onClick={(ev) => this.openNoteBox(ev)}>
            <img src={note}></img>
            <span>Add Note</span>
          </div>
          <DropZone savefileToTask={this.savefileToTask}></DropZone>
        </div>

        <div id="style-5" className="info-box-main-content">
          <h3>Notes</h3>

          <div className="notes-container">
            {isAddNoteShows && (
              <NoteBox
                task={this.props.task}
                addNoteToTask={this.addNoteToTask}
              ></NoteBox>
            )}
            {boxesToRender &&
              boxesToRender.length > 0 &&
              boxesToRender.map((box, idx) => {
                return (
                  <article className="info-box note" key={idx}>
                    <p>{box.type}</p>
                    <span>{box.txt}</span>
                    {box.type === "file" && (
                      <div className="task-img-box">
                        <img src={box.imgUrl}></img>
                      </div>
                    )}
                  </article>
                );
              })}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  userBoards: state.userBoards,
  currUser: state.user.loggedInUser,
  currBoard: state.userBoards.currBoard,
});

const mapDispatchToProps = {
  loadBoards,
  saveBoard,
};

export default connect(mapStateToProps, mapDispatchToProps)(InfoBoxes);

import React from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import add from "../../../src/style/img/add.png";

export default class FormDialog extends React.Component {
  state = {
    open: false,
    setOpen: false,
    text: "",
  };

  handleClickOpen = (ev) => {
    ev.stopPropagation();
    this.setState({ open: true });
  };

  handleClose = (ev) => {
    this.setState({ open: false });
  };

  enterBoard = (ev) => {
    ev.stopPropagation();
    this.setState({ open: false });
    let { text } = this.state;
    this.props.addBoard(text);
  };

  handleChange = (ev) => {
    this.setState({ text: ev.target.value });
  };

  render() {
    return (
      <div>
        {/* <Button href="#text-buttons" color="primary" color="primary" onClick={(ev) => this.handleClickOpen(ev)}>
                    +
        </Button> */}
        <div
          className="add-board-btn flex a-center j-center"
          onClick={(ev) => this.handleClickOpen(ev)}
          title="Add Board"
        >
          +
        </div>
        <Dialog
          open={this.state.open}
          onClose={() => this.handleClose()}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Add board</DialogTitle>
          <DialogContent>
            <DialogContentText>Please enter a board name.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Board Name"
              type="email"
              fullWidth
              onChange={(ev) => this.handleChange(ev)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={(ev) => this.enterBoard(ev)}
              variant="contained"
              color="primary"
            >
              Add
            </Button>
            <Button
              onClick={(ev) => this.handleClose(ev)}
              variant="contained"
              color="secondary"
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

import React from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";

export default class AlertDialogSlide extends React.Component {
  Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
  });

  state = {
    open: false,
  };

  // const[open, setOpen] = React.useState(false);

  handleClickOpen = () => {
    // setOpen(true);
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
    // setOpen(false);
  };

  handleAgree = () => {
    this.props.remove();
    this.setState({ open: false });
  };
  render() {
    return (
      <div>
        <div
          className="header-remove-board"
          onClick={() => this.handleClickOpen()}
        >
          Remove board
        </div>

        <Dialog
          open={this.state.open}
          TransitionComponent={this.Transition}
          keepMounted
          onClose={() => this.handleClose()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle id="alert-dialog-slide-title">
            {"Are you sure?"}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-slide-description">
              Be aware . this is a permanent delete.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => this.handleClose()}
              variant="contained"
              color="secondary"
            >
              Disagree
            </Button>
            <Button
              onClick={() => this.handleAgree()}
              variant="contained"
              color="primary"
            >
              Agree
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

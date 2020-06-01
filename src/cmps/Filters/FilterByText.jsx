import React, { Component } from "react";
import { connect } from "react-redux";

import { TextField } from "@material-ui/core";
import LocalBoardService from "../../services/LocalBoardService";

import { setFilter } from "../../actions/BoardActions";

class FilterByText extends Component {
  handleChange = ({ target }) => {
    let value = target.value;

    if (this.props.users) return this.props.setUserFilter(value);
    this.props.setFilter(value);
  };
  render() {
    return (
      <div>
        <TextField
          autoComplete="off"
          id="standard-basic"
          label="Filter"
          placeholder="Search By Text"
          onChange={(ev) => this.handleChange(ev)}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
  setFilter,
};
export default connect(mapStateToProps, mapDispatchToProps)(FilterByText);

import React, { Component } from 'react'

import { TextField } from '@material-ui/core';

export default class Updates extends Component {
    render() {
        return (
            <div>
                <h1>UPDATES PAGE</h1>

                <TextField id="outlined-basic" label="Update" variant="outlined" placeholder="Write an update..."/>
            </div>
        )
    }
}

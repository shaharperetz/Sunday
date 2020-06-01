import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export class SearchEverything extends Component {

    render() {
        return (
            <div>
                <input className='search-everything'></input>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    boards:state.userBoards.board
})

const mapDispatchToProps = {
    
}

export default connect(mapStateToProps, mapDispatchToProps)(SearchEverything)

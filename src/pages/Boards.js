import React from "react";
import { connect } from "react-redux";
import BoardHeader from "../cmps/Board/BoardHeader.jsx";
import Board from '../cmps/Board/Board.jsx'
import '../style/pages/boards.css'
import SocketService from '../services/SocketService'
import { login, loadUsers } from '../actions/UserActions';
import { loadBoards, setCurrBoard, removeBoard } from "../actions/BoardActions"
import DropZone, { DropFileToAsk } from "../cmps/Tasks/DropZone.jsx";
import ChatService from "../services/ChatService.js";
import { loadRooms } from '../actions/ChatActions'
class BoardApp extends React.Component {
    state = {
        currBoard: null,
        chartIsOpen: false,
        addUserToBoard: false,
        moreOptionsIsOpen: false

    }


    componentDidMount = async () => {

        if (this.props.match.params.GuestMode === 'true') {

            this.doGuestModeLogin()
        }
        // if (this.props.currBoard && !this.props.currBoard._id || !this.props.currBoard) return

        // var allBoards = await this.props.loadBoards()
        // let allBoards = this.props.boards
        await this.loadboards()
        if (this.props.currBoard) {
            const boardId = this.props.currBoard._id
            SocketService.emit('boardViewed', boardId)
        }
        SocketService.on('doRefresh', this.loadAndSetBoards)



    }



    async doGuestModeLogin() {
        const userCreds = { email: 'guest', password: 'guest' };
        try {
            await this.props.login(userCreds)
        } catch (err) {
            console.log('Cant Log in as a Guest :(')
        }
    }

    toggleChart = (viewType) => {
        this.setState({ viewType })
    };




    componentWillUnmount() {
        SocketService.off('doRefresh', this.loadAndSetBoards)
    }


    async componentDidUpdate(prevProps) {
        if (this.props.match.params.id !== prevProps.match.params.id) {
            console.log('CHANGING BOARD')
            let board = this.getBoardByID(this.props.match.params.id)
            this.setBoard(board)
        }
        if (JSON.stringify(this.props.currBoard) !== JSON.stringify(prevProps.currBoard)) {
            await this.loadboards()
        }

    }

    loadboards = async () => {
        const { boards } = this.props;
        const id = this.props.match.params.id ? this.props.match.params.id : null
        if (boards && boards.length > 0) {
            let board = boards[0]
            if (id) {
                board = this.getBoardByID(id)
            }
            this.setBoard(board)
        }
    }

    loadAndSetBoards = async () => {
        console.log('LISTENER WORKING')
        const boardId = this.props.currBoard._id
        await this.props.loadBoards()
        let board = this.getBoardByID(boardId)
        this.props.setCurrBoard(board)

    }

    getBoardByID = (id) => {
        const { boards } = this.props;
        const board = boards.find(board => {
            return board._id === id
        })
        return board
    }
    setBoard(board) {
        this.props.setCurrBoard(board)
        this.setState({ currBoard: board })
    }

    removeBoard = async (boardId) => {
        await this.props.loadRooms()
        const { chatRooms } = this.props.chat
        ChatService.remove(boardId, chatRooms)
        await this.props.removeBoard(boardId)
        await this.props.loadBoards()
        await this.props.history.push('/board/')
        await this.loadboards()
    }


    removeHistory = () => {
        const { boards } = this.props;
        const { currBoard } = this.state;
        boards.forEach(board => {
            const historyToRemoveIdx = board.history.findIndex(history => history.boardId === currBoard.id)
            board.history.forEach(history => {
                board.history.splice(historyToRemoveIdx, 1)
            })
        })
    }
    toggleAddUserToBoard = (ev) => {
        // ev.stopPropagation();
        this.setState(({ addUserToBoard, }) => ({
            addUserToBoard: !addUserToBoard, moreOptionsIsOpen: false
        }));
        this.toggleMoreOptions()
    };

    toggleMoreOptions = (ev) => {
        if (ev) ev.stopPropagation();
        // ev.stopPropagation();
        this.setState(({ moreOptionsIsOpen }) => ({
            moreOptionsIsOpen: !moreOptionsIsOpen,
        }));
    };

    render() {

        const { currBoard } = this.state;
        return (
            <>
                {/* <Filter onSetFilter={this.onFilter} filterBy={filterBy}></Filter> */}
                {currBoard && <BoardHeader toggleMoreOptions={this.toggleMoreOptions} moreOptionsIsOpen={this.state.moreOptionsIsOpen} addUserToBoard={this.state.addUserToBoard} toggleAddUserToBoard={this.toggleAddUserToBoard} toggleChart={this.toggleChart} removeBoard={this.removeBoard} board={currBoard} user={this.props.user}></BoardHeader>}
                {currBoard && <Board board={currBoard} raderIsOpen={this.state.raderIsOpen} viewType={this.state.viewType} ></Board>}
                {/* <DropZone></DropZone> */}
            </>
        );
    }
}

const mapStateToProps = (state) => {
    //State of the store to props of the cmp
    return {
        boards: state.userBoards.board,
        currBoard: state.userBoards.currBoard,
        user: state.user.loggedInUser,
        chat: state.chat
    };
};
const mapDispatchToProps = {
    loadBoards,
    setCurrBoard,
    removeBoard,
    loadUsers,
    login,
    loadRooms
};

export default connect(mapStateToProps, mapDispatchToProps)(BoardApp);

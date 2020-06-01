import React, { Component } from 'react'
import PropTypes from 'prop-types'
// import Editupdate from '../cmps/Editupdate'
import { connect } from 'react-redux'
import theme from '../style/themes/inboxTheme';
import '../style/pages/inbox.css'
import checkbox from '../style/img/checkbox.png'
import SimpleReactCalendar from 'simple-react-calendar'
import { loadBoards, saveBoard, setCurrBoard } from '../actions/BoardActions';
import TimeLine from '../cmps/Timeline';
import calendar from 'simple-react-calendar/lib/calendar/calendar';
import DatePicker from '../cmps/Calendar';
import TimeLineTest from '../cmps/TimeLineTest';
import { loadUsers } from '../actions/UserActions'
import { NavLink } from 'react-router-dom';
import LocalBoardService from '../services/LocalBoardService';
import SmallImg from "../cmps/SmallImg";
import reply from '../../src/style/img/reply.svg'
import like from '../../src/style/img/like.svg'




class Inbox extends Component {
    state = {
        user: this.props.currUser,
        filtertedUpdates: [],
        txt: '',
        isInputShown: false
    }
    componentDidMount() {
        // await this.props.loadUsers()
        this.checkUserHistory()
    }
    findBoard = (boardId) => {
        const board = this.props.userBoards.board.find(b => {
            return b._id === boardId
        })
        return board
    }
    saveAndUpdate = async (newBoard) => {
        const currBoard = this.props.currBoard;
        await this.props.saveBoard(newBoard)
        await this.props.setCurrBoard(currBoard)
        await this.props.loadBoards()
        await this.checkUserHistory()
    }

    checkUserHistory = () => {
        const board = this.props.userBoards.board
        if (!board) return
        if (!this.props.currUser) return
        const currUserId = this.props.currUser._id
        const historyToRender = []
        for (var i = 0; i < board.length; i++) {
            let currBoard = board[i]
            for (var j = 0; j < currBoard.history.length; j++) {
                let currHistory = currBoard.history[j]
                if (!currHistory.user) continue;
                if (currHistory.user._id !== currUserId && currHistory.updateType === 'Label Change') historyToRender.push(currHistory)
            }
        }


        let filtertedUpdates = []
        historyToRender.forEach(update => {
            let isSeen = false
            update.seenBy.forEach(user => {
                if (user._id === currUserId) {
                    isSeen = true
                }

            })
            if (!isSeen) filtertedUpdates.push(update)
        })
        filtertedUpdates.sort(function compare(a, b) {
            var dateA = new Date(a.timeStamp);
            var dateB = new Date(b.timeStamp);
            return dateB - dateA;
        });
        this.setState({ filtertedUpdates })
        return Promise.resolve()
    }

    async updateById(newUpdate) {
        const user = this.props.currUser
        let board = this.props.userBoards.board
        board.forEach(board => {
            board.history.forEach(async update => {
                if (update._id === newUpdate._id) {
                    update.seenBy.push(user)
                    await this.props.saveBoard(board)
                    await this.props.setCurrBoard(board)
                    await this.props.loadBoards()
                }
                await this.checkUserHistory()
            })
        })

    }


    setUpdateAsSeen = async (update) => {
        await this.updateById(update)

    }
    sendUpdateMsg = async (e, update, boardId) => {
        if (e) e.preventDefault();

        const board = this.findBoard(boardId)
        const updateMsg = { msg: this.state.txt, sendBy: this.props.currUser }
        const newBoard = LocalBoardService.addUpdateMsg(board, update, updateMsg)
        this.setState({ isInputShown: true })
        await this.saveAndUpdate(newBoard)
    }
    sendGreatJob = async (update, boardId) => {
        const board = this.findBoard(boardId)
        const updateMsg = { msg: 'Great Job!', sendBy: this.props.currUser }
        const newBoard = LocalBoardService.addUpdateMsg(board, update, updateMsg)
        this.setState({ isInputShown: true })
        await this.saveAndUpdate(newBoard)
    }
    sendTakeItFromHere = async (update, boardId) => {
        const board = this.findBoard(boardId)
        const updateMsg = { msg: 'Thanks Ill Take It From Here', sendBy: this.props.currUser }
        const newBoard = LocalBoardService.addUpdateMsg(board, update, updateMsg)
        this.setState({ isInputShown: true })
        await this.saveAndUpdate(newBoard)
    }
    sendNiceWork = async (update, boardId) => {
        const board = this.findBoard(boardId)
        const updateMsg = { msg: 'Nice Work! Whats Next?', sendBy: this.props.currUser }
        const newBoard = LocalBoardService.addUpdateMsg(board, update, updateMsg)
        this.setState({ isInputShown: true })
        await this.saveAndUpdate(newBoard)
    }
    likeUpdate = async (update, boardId) => {
        const user = this.props.currUser
        const board = this.findBoard(boardId)
        const updateMsg = { msg: user, sendBy: this.props.currUser }
        const newBoard = LocalBoardService.addLikeMsg(board, update, user)

        await this.saveAndUpdate(newBoard)
    }




    handleChange = (e) => {
        this.setState({ txt: e.target.value });

    }
    openReply = () => {
        this.setState({ isInputShown: true })
    }
    render() {
        const isInputShown = this.state.isInputShown
        let userHistory = this.state.filtertedUpdates
        const isHistory = (userHistory.length) ? true : false
        const isLoading = this.props.currBoard
        if (!this.props.currUser) return <h1>No Logged User . </h1>
        return (
            <div id="style-5" className='inbox-container'>
                <h2>Inbox</h2>
                {!isHistory && <h1 className="inbox-empty">Inbox Is Empty</h1>}
                {isHistory && isLoading && userHistory.map((update, idx) => {
                    return (<article className='user-history flex col' key={idx}>
                        <img className='complete-task' src={checkbox} onClick={() => { this.setUpdateAsSeen(update) }}></img>
                        <section className='history-header flex col a-start'>
                            <section className='likes-container'>
                                {update.likes && update.likes.length > 0 && update.likes.map((like, idx) => {

                                    return (<NavLink key={idx} className='user-name-header-inbox' to={`/profile/${update.user._id}`}>
                                        {/* <SmallImg type={'myweek'}
                                            name={like.username} ></SmallImg> */}

                                    </NavLink>)

                                })}
                                <span className='likes-amount'>
                                    Liked {update.likes.length} Times
                                        </span>
                            </section>
                            <div className='user-logo flex a-center'>
                                <NavLink className='user-name-header-inbox' to={`/profile/${update.user._id}`}>
                                    <SmallImg url={update.user.imgUrl}
                                        name={update.user.username} ></SmallImg><p>{update.user.username}</p></NavLink>
                            </div>

                            <div className='history-origin'>
                                <NavLink to={`/board/${update.boardId}`}>{update.boardName}</NavLink>

                            </div>
                        </section>
                        <section className='update-msg flex a-center'>
                            <span>{update.title}</span>
                            {update.updateType === 'Label Change' && <div className='user-history-main-btns flex a-center ' >

                                <button className='prev-value-inbox' style={{ backgroundColor: `${update.prevColor}` }}> {update.prevValue}</button>
                                <span className='arrow-logo'> </span>

                                <button className='next-value-inbox' style={{ backgroundColor: `${update.nextColor}` }}>{update.nextValue}</button>
                            </div>}
                            {/* {update.type==='Member Add'&& <div className='person-update' >
                            <NavLink className='user-name-header-inbox' to={`/profile/${update.user._id}`}>
                                    <SmallImg url={update.user.imgUrl}
                                        name={update.user.username} ></SmallImg>{update.user.username}</NavLink>
                                <span>Assigned to Task </span>
                                <NavLink className='user-name-header-inbox' to={`/profile/${update.user._id}`}>
                                    <SmallImg url={update.assignedTo.imgUrl}
                                        name={update.assignedTo.username} ></SmallImg>{update.assignedTo.username}</NavLink>
                                </div>} */}

                        </section>
                        <section className='seen-by-count'>
                            {update.seenBy.length} Seen
                        </section>
                        <section className='like-reply-btns'>
                            <div className='reply-btn'>
                                <img src={reply}></img>
                                <button className='reply' onClick={() => this.openReply()}>Reply</button>
                            </div>
                            <div className='like-btn'>
                                <img src={like}></img>
                                <button className='like' onClick={() => { this.likeUpdate(update, update.boardId) }}> Like</button>
                            </div>
                        </section>
                        <section className='task-reply-btns'>
                            <button className='great-job' onClick={() => this.sendGreatJob(update, update.boardId)}>Great Job!</button>
                            <button className='take-it-from-here' onClick={() => this.sendTakeItFromHere(update, update.boardId)}> Thanks I'll take it from here</button>
                            <button className='next' onClick={() => this.sendNiceWork(update, update.boardId)}> Nice Work! Whats next?</button>
                        </section>

                        <section className='update-msgs'>
                            {update.messeges && update.messeges.length > 0 && update.messeges.map((msg, idx) => {
                                return <div key={idx} className='sent-msg-box'>
                                    <NavLink to={`/profile/${msg.sendBy._id}`}>{msg.sendBy.username} :<span className='update-msg-content'>{msg.msg}</span></NavLink>
                                </div>
                            })}
                        </section>
                        <section className='add-update-msg flex'>
                            {/* <NavLink to={`/profile/${this.props.currUser._id}`}></NavLink> */}

                            {isInputShown && <form className="send-btn-inbox flex col a a-center" onSubmit={(e) => { this.sendUpdateMsg(e, update, update.boardId) }}>
                                <input placeholder="Write a reply..." onChange={(e) => this.handleChange(e)} ></input>
                                <button type='submit'>Send</button>
                            </form>}
                        </section>
                    </article>)

                })}

            </div>
        )
    }

}


const mapStateToProps = (state) => ({
    userBoards: state.userBoards,
    currUser: state.user.loggedInUser,
    currBoard: state.userBoards.currBoard
})


const mapDispatchToProps = {
    loadBoards,
    loadUsers,
    saveBoard,
    setCurrBoard
}

export default connect(mapStateToProps, mapDispatchToProps)(Inbox)



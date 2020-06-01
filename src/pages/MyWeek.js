import React, { Component } from 'react'
import { connect } from 'react-redux';
import { loadBoards } from '../actions/BoardActions'
import WeekPreview from '../cmps/WeekPreview'
import coffe from '../../src/style/img/coffe.png'
class MyWeek extends Component {
    state = {
        openTasks: [],
        closeTasks: []
    }
    async componentDidMount() {
        if (!this.props.boards || this.props.boards && !this.props.boards.length > 0) await this.props.loadBoards()
        this.currUser = await this.props.user
        if (!this.currUser) return
        this.loadTasks(this.currUser)
    }

    componentDidUpdate(prevProps) {
        if (JSON.stringify(this.props.boards) !== JSON.stringify(prevProps.boards)) {
            if (!this.currUser) return
            this.loadTasks(this.currUser)
        }
    }



    loadTasks = async (loggedUser) => {
        var groupsArr = [];
        var tasksArr = [];
        let { board } = await this.props.boards
        const groups = await board.map(b => b.groups)
        await groups.forEach(group => {
            groupsArr.push(...group)
        });
        groupsArr.forEach(group => {
            tasksArr.push(...group.tasks)
        })
        var userTasks = tasksArr.filter(task => task.users.find(user => user._id === loggedUser._id))
        let openTasks = [];
        let closeTasks = []
        userTasks.forEach(task => {
            if (task.status === 'Done') closeTasks.push(task)
            else openTasks.push(task)
        })
        this.setState({ openTasks, closeTasks })
    }
    render() {
        const user = this.props.user ? this.props.user.username : 'guest - please login to view your week'
        const { closeTasks, openTasks } = this.state
        if (!openTasks.length && !closeTasks.length) return (
            <>
                <div className="inbox-container">
                    <h2>{user}  Your week </h2>
                    <h1 className="inbox-empty">No tasks for this week </h1>

                </div>
            </>


        )
        return (

            <>
                <div className="myweek-container">
                    <div className="header-container-myweek flex a-center">
                        <img src={coffe}></img>
                        <h3><span>Hey {user}</span> Welcome to My Week</h3>
                    </div>

                    <section className="myweek-list-container">

                        <p>   {openTasks && openTasks.length > 0 ? 'You have open items' : 'No open items..\n Guess you can take a Day off'}</p>
                        <section className="my-week">

                            {openTasks && openTasks.length > 0 && <h3>Open Tasks</h3>}
                            {openTasks && openTasks.map((task, idx) => <WeekPreview {...task} key={idx} />)}
                        </section>
                        <section className="my-week">
                            {closeTasks && closeTasks.length > 0 && <h3>Closed Tasks</h3>}
                            {closeTasks && closeTasks.map((task, idx) => <WeekPreview {...task} key={idx} />)}
                        </section>


                    </section>
                </div>
            </>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        boards: state.userBoards,
        user: state.user.loggedInUser
    }
}
const mapDispatchToProps = {
    loadBoards
}
export default connect(mapStateToProps, mapDispatchToProps)(MyWeek)
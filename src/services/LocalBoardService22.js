

import { v4 as uuidv4 } from 'uuid';

let gBoards = null
export default {
    // query,
    // save,
    remove,
    getById,
    addGroup,
    addTask,
    removeTask,
    removeGroup,
    changeGroupName,
    updateTaskName,
    addColumn,
    removeCol,
    updateColumnTitle,
    updateColumnText,
    addPersonToColumn,
    updateNumberColumn,
    changeColumn,
    removePersonToTask,
    changeTaskDateColumn,
    changeLabelColumn,
    addLabel,
    changeDueDateColumn,
    sortColumnsByBox,
    updateColumnOrder,
    setColumn,
    filter,
    changeDueDateColumn2,
    addBoardHistory,
    removeFromHistory,
    addUpdateMsg,
    removeTaskFromGroup,
    addTaskToGroup,
    removeLabel,
    addLikeMsg,
    changeGroupColor,
    changeBoardName,
    changeBoardDesc,
    addTaskHistory,
    addUserToUpdateIsSeen,
    checkIfUpdateSeen,
    changeTaskOrder,
    getNivoData
}

function changeTaskOrder(board, group, tasks) {
    console.log("changeTaskOrder -> tasks", tasks)
    console.log("changeTaskOrder -> group", group)
    console.log("changeTaskOrder -> board", board)

    group.tasks = tasks
    return board

}

function checkIfUpdateSeen(update, currUserId) {
    if (update && update.seenBy && !update.seenBy.length > 0) return false

    let isUserSeen = update.seenBy.find(user => {
        if (user._id === currUserId) return true
    })
    if (isUserSeen) {
        return true
    }
    return false

}
function addUserToUpdateIsSeen(update, myUser) {
    let seenBy = (update && update.seenBy && update.isSeen.length > 0) ? update.seenBy : []

    seenBy.push(myUser)
    update.seenBy = seenBy
    return update

}


function changeBoardName(board, name) {
    board.name = name
    return board
}

function changeBoardDesc(board, desc) {
    board.desc = desc
    return board
}

function addUpdateMsg(board, update, msg) {
    update.messeges.push(msg)
    return board
}


//Sort Cols

function sortColumnsByBox(cols, order) {
    cols = _mapOrder(cols, order, 'order')
    return cols
}



function _mapOrder(array, order, key) {
    array.sort(function (a, b) {
        var A = a[key],
            B = b[key];
        if (order.indexOf(A) > order.indexOf(B)) {
            return -1;
        } else {
            return 1;
        }
    });
    return array;
};


/// Update Columns (ON BOARD ) Order 
function updateColumnOrder(board, reOrderedCols) {
    board.columns = reOrderedCols
    return board
}


// groups //

//add group
function addGroup(board, group) {
    group._id = makeId()
    board.groups.push(group)
    return board
}



//remove group
function removeGroup(board, group) {
    const gIdx = board.groups.findIndex(g => g._id === group._id)
    board.groups.splice(gIdx, 1)
    return board
}

//update groupName
function changeGroupName(board, group, name) {
    group.name = name
    return board
}


///////////////////////////////////////////

// tasks //

//add task
function addTask(board, group, task) {
    task._id = makeId()
    task.assignedGroupId = group._id
    task.groupName = group.name
    group.tasks.push(task)
    return board
}

//remove task
function removeTask(board, group, task) {
    const idx = group.tasks.findIndex(t => t._id === task._id)
    group.tasks.splice(idx, 1)
    return board
}

//update task title
function updateTaskName(board, task, title) {
    task.taskTitle = title
    return board

}


///////////////////////////////////////////////////////

// main cloums//  

// add col
function addColumn(board, column) {
    column._id = makeId()
    board.groups.forEach(group => group.tasks.push(column))
    board.groups.forEach(group => group.tasks.forEach(task => task.push(column)))

    //need to CHECK !
    return board
}

// remove col


function removeCol(board, column, group) {
    const boardColIdx = board.columns.findIndex(col => col.order === column.order)
    board.columns.forEach(col => col.splice(boardColIdx, 1))
    const tasksColIdx = board.group[0].tasks[0].columns.findIndex(col => col.order === column.order)
    board.groups.forEach(gr => {
        gr.tasks.forEach(task => {
            task.columns.splice(tasksColIdx, 1)
        })
    })
    return board
}





// update column
function updateColumnTitle(board, column, text) {
    column.value = text
    return board
}


/////////////////////////////////////////////////////////////

/// text column ///
function updateColumnText(board, column, text) {
    column.value = text
    return board
}


/// person column ///

function addPersonToColumn(board, column, task, person) {
    column.persons = column.persons && column.persons.length > 0 ? column.persons : []
    task.users = task.users && task.users.length > 0 ? task.users : []
    task.users.push(person)
    column.persons.push(person)
    return board
}


function removePersonToTask(board, person, column) {
    column.persons = (column.persons && column.persons.length) ? column.persons : [];
    const personIdx = column.persons.findIndex(pers => pers._id === person._id)
    column.persons.splice(personIdx, 1)
    return board
}



// number column //

// update number //

function updateNumberColumn(board, column, num) {
    column.value = num
    return board
}



// date column //

function changeTaskDateColumn(board, column, momentToSet, task, date) {
    task.dueDate = date.getTime()
    column.value = momentToSet
    return board
}
function changeDueDateColumn(board, column, date) {
    column.stateDate = date.newStateDay
    column.endDate = date.newEndDate
    column.month = date.newMonth
    return board
}

function changeDueDateColumn2(board, column, date, originalDates) {
    column.startDate = originalDates[0].getTime()
    column.endDate = originalDates[1].getTime()
    column.startDate = date.from
    column.endDate = date.to
    return board
}




/// try generic
function changeColumn(board, column, value) {
    column.value = value
    return board
}

function changeLabelColumn(board, label, color, text) {
    label.status = text
    label.value = text
    label.color = color
    return board
}





function setColumn(board, column, color, value, task, statusOrPriority) {
    console.log("setColumn -> value", statusOrPriority)
    if (statusOrPriority === 'label-status') {
        task.status = value
        column.value = value
        column.color = color
        return board
    } else {
        task.priority = value
        column.value = value
        column.color = color
        return board
    }
}











function changeTasklabelColumn(board, column, label) {
    column.value = label
    return board
}

function addLabel(board, column, label) {
    if (!column.labels) column.labels = [];
    if (!label._id) label._id = makeId()
    column.labels.push(label)
    return board
}

function removeLabel(board, column, label) {
    const idx = column.labels.findIndex(l => l._id === label._id)
    column.labels.splice(idx, 1)
    return board



}

function remove(boardId) {
    const boardIdx = _getIdxById(boardId)
    gBoards.splice(boardIdx, 1)

}


function getById(boards, boardId) {
    const board = boards.find(board => board._id === boardId)
    return board;
}
function _getIdxById(boardId) {
    return gBoards.findIndex(board => board._id === boardId)
}

function addBoardHistory(board, updateInfo) {
    const { user, group, task, column, nextValue, updateType, seenBy, color, likes, assignedTo } = updateInfo
    const prevValue = column ? column.value : ''
    const boardId = board._id
    const update = {
        _id: uuidv4(),
        timeStamp: Date.now(),
        prevValue,
        nextValue,
        boardId,
        assignedBy: user._id,
        user,
        taskId: (task) ? task._id : false,
        group: (group) ? group : false,
        updateType,
        title: (task) ? task.taskTitle : '',
        boardName: board.name,
        seenBy: [],
        messeges: [],
        prevColor: (column) ? column.color : '',
        nextColor: (color) ? color : '',
        likes: [],
        assignedTo: assignedTo ? assignedTo : null
    }
    board.history.unshift(update)
    return board
}
function addTaskHistory(board, updateInfo) {
    const { user, group, task, column, nextValue, updateType, seenBy, color, likes } = updateInfo
    const prevValue = column ? column.value : ''
    const boardId = board._id
    const update = {
        _id: uuidv4(),
        timeStamp: Date.now(),
        prevValue,
        nextValue,
        boardId,
        assignedBy: user._id,
        user,
        taskId: (task) ? task._id : false,
        group: (group) ? group : false,
        updateType,
        title: (task) ? task.taskTitle : '',
        boardName: board.name,
        seenBy: [],
        messeges: [],
        prevColor: (column) ? column.color : '',
        nextColor: (color) ? color : '',
        likes: []
    }
    task.history = (task.history) ? task.history : []
    task.history.unshift(update)
    return board
}

function removeFromHistory(board, taskId, currUserId) {
    board.forEach(board => {
        const historyIdx = board.history.findIndex(history => {
            return (history.taskId === taskId && history.user._id === currUserId && history.updateType === 'Label Change')
        })
        board.history.splice(historyIdx, 1)
    })
    return board
}
function addLikeMsg(board, update, user) {
    if (update.likes.some(like => like._id === user._id)) return board
    update.likes.push(user)
    return board
}





function filter(board, text) {
    let newBoard = JSON.parse(JSON.stringify(board));
    text = text.toLowerCase();
    // Guard Clause
    if (!text) return board;
    newBoard.groups = newBoard.groups.filter(group => {
        const isNameValid = group.name.toLowerCase().includes(text)
        const hasValidTasks = group.tasks.some(task => {
            return task.taskTitle.toLowerCase().includes(text)
        });
        return hasValidTasks || isNameValid
    });

    newBoard.groups = newBoard.groups.map(group => {
        const isNameValid = group.name.toLowerCase().includes(text)
        if (isNameValid) return group;

        const validTasks = group.tasks.filter(task => {
            return task.taskTitle.includes(text)
        })
        group.tasks = validTasks;
        return group

    });

    return newBoard

}

function addTaskToGroup(board, group, task) {
    group.tasks.push(task)
    return board
}

function changeGroupColor(board, group, color) {
    group.color = color
    return board
}

function removeTaskFromGroup(board, group, taskToRemove) {
    const groupsToFilter = board.groups.filter(g => g._id !== group.id)
    const groupToAddTask = groupsToFilter.find(group => {
        return group.tasks.some(task => task._id === taskToRemove._id)
    })
    const IdxToRemove = groupToAddTask.tasks.findIndex(task => {
        return task._id === taskToRemove._id

    })
    groupToAddTask.tasks.splice(IdxToRemove, 1)
    return board
}



function makeId(length = 3) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}








function getNivoData(board) {
    let data = board.groups.map(group => _getGroupStats(group))
    console.log('data', data)
    return data

}



function _getGroupStats(group) {
    const doneMissions = group.tasks.filter((task) => task.status === "Done");
    const workingMissions = group.tasks.filter(
        (task) => task.status === "Working"
    );
    const stuckMissions = group.tasks.filter((task) => task.status === "Stuck");
    const reviewMissions = group.tasks.filter(
        (task) => task.status === "Review"
    );

    //// make them number of length
    const stuckMissionsL = stuckMissions.length;
    const workingMissionsL = workingMissions.length;
    const doneMissionsL = doneMissions.length;
    const reviewMissionsL = reviewMissions.length;
    const otherMissionsL = group.tasks.length - (doneMissionsL + workingMissionsL + stuckMissionsL + reviewMissionsL);

    let stat = {
        group: group.name,
        'done': doneMissionsL,
        'doneColor': 'rgb(0,200,117)',
        'working': workingMissionsL,
        'workingColor': 'rgb(253,171,61)',
        'stuck': stuckMissionsL,
        'stuckColor': 'rgb(226,68,92)',
        'review': reviewMissionsL,
        'reviewColor': 'rgb(103,204,255)',
        'others': otherMissionsL,
        'othersColor': 'rgb(196,196,196)'
    }

    return stat

}
const initialState = {
    board: null,
    currBoard: null,
    filterByText:''
};
window.state = initialState
export default function (state = initialState, action = {}) {
    switch (action.type) {
        // case 'SET_BOARD':
        //     return { ...state, board: action.reviews };
        // case 'foundTasks':
        //     return {
        //         ...state,
        //         board: {
        //             ...state.board,
        //             groups: {
        //                 ...state.board.groups,
        //                 tasks: { ...state.board.groups.tasks }
        //             }
        //         }
        //     };
        case 'ADD_BOARD':
            return {
                ...state,
                board: [...state.board, action.savedBoard]
            }
        case 'UPDATE_BOARD':
            return {
                ...state,
                board: [
                    ...state.board.map(board => {
                        if (board._id === action.savedBoard._id) return action.savedBoard
                        return board
                    })
                ]
            }
        case 'SET_BOARDS':
            return {  
                ...state,
                board: action.board
            }
        case 'BOARD_REMOVE':
            return {
                ...state,
                board: [
                    ...state.board.filter(board => {
                        return board._id !== action.boardId
                    })
                ]
            }
        case 'SET_FILTER':
            return {
                ...state,
                filterByText: action.text
            }
        case 'SET_CURRBOARD':
            return {
                ...state,
                currBoard: action.board
            }

        default:
            return state;
    }
}


//SET_BOARDS
//BOARD_REMOVE



// columns: [
//     { type: 'done' }
//     , { priority: 'important' }
//     , { dueDate: 'tommarow' }
//     , { budget: 100 }
//     , { text: 'hey' }
//     , { link: '' }]
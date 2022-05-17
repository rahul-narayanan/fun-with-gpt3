const initialState = {
    result: JSON.parse(localStorage["AIResults"] || "[]")
};

export default function rootReducer(state = initialState, action) {
    switch (action.type) {
        case 'UPDATE_RESULT':
            const result = [action.payload, ...state.result]
            localStorage["AIResults"] = JSON.stringify(result);
            return { result };
        default:
            return state;
    }
}
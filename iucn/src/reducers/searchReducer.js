export default function reducer(state = {
    searchString: '',
    searchType: 'animal',
  }, action) {

    switch (action.type) {
      case "SEARCH_INPUT_CHANGE": return {...state, searchString: action.payload}
      case "SEARCH_TYPE_CHANGE": return {...state, searchType: action.payload}
      default: return state
    }
}

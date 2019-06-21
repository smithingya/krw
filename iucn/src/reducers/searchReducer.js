export default function reducer(state = {
    searchString: '',
    searchType: 'animal',
    warString: '',
    searching: false,
  }, action) {

    switch (action.type) {
      case "SEARCH_INPUT_CHANGE": return {...state, searchString: action.payload}
      case "SEARCH_TYPE_CHANGE": return {...state, searchType: action.payload, warString: '', searchString: ''}
      case "SEARCH_WAR_CHANGE": return {...state, warString: action.payload}
      case "SEARCH_PENDING": return {...state, searching: true}
      case "SEARCH_DONE": return {...state, searching: false}
      default: return state
    }
}

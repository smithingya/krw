export default function reducer(state = {
    list: [],
    selectedAnimal: {},
    wars: [],
    retrieving: false
  }, action) {

    switch (action.type) {
      case "RETRIEVED_ANIMALS": return {...state, list: action.payload}
      case "IMAGES_RETRIEVED": return {...state, list: action.payload}
      case "SELECTED_ANIMAL": return {...state, selectedAnimal: action.payload}
      case "RETRIEVE_IMAGE_FULFILLED": return {...state, selectedAnimal: {...state.selectedAnimal, image:action.payload}}
      case "WARS_RETRIEVED_PENDING": return {...state, retrieving: true}
      case "WARS_RETRIEVED_FULFILLED": return {...state, wars: action.payload, retrieving: false}
      case "SEARCH_PENDING": return {...state, list: []}
      case "ANIMALS_BY_WAR": return state
      default: return state
    }
}

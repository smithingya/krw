export default function reducer(state = {
    list: [],
    selectedAnimal: {},
  }, action) {

    switch (action.type) {
      case "RETRIEVED_ANIMALS": return {...state, list: action.payload}
      case "IMAGES_RETRIEVED": return {...state, list: action.payload}
      case "SELECTED_ANIMAL": return {...state, selectedAnimal: action.payload}
      default: return state
    }
}

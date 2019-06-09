export function inputChange(value){
  return {
    type: "SEARCH_INPUT_CHANGE",
    payload: value,
  }

}

export function typeChange(value) {
  return {
    type: "SEARCH_TYPE_CHANGE",
    payload: value,
  }
}

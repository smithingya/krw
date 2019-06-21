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

export function warChange(value) {
  return {
    type: "SEARCH_WAR_CHANGE",
    payload: value,
  }
}

export function searchPending(){
  return {
    type: "SEARCH_PENDING",
  }
}

export function searchDone(){
  return {
    type: "SEARCH_DONE",
  }
}

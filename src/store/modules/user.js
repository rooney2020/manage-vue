export default {
  namespaced: true,
  state: {
    id: 0,
    name: '',
    chineseName:''
  },
  mutations: {
    updateId (state, id) {
      state.id = id
    },
    updateName (state, name) {
      state.name = name
    },
    updatechineseName(state,name){
      state.chineseName=name
    }
  }
}

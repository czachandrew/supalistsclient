import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    lists:{
      
    },
    listsList: [],
    itemsList: [],
    items:{
      
    }
  },
  getters:{
    listSet:(state) => state.listsList.map( listId => state.lists[listId] ),
    itemSet:(state) => state.itemsList.map( itemId => state.items[itemId]),
    itemsForList:(state, getters) => (id) =>  {
      return getters.itemSet.filter((item) => state.lists[id].associated_items.indexOf(item.id) !== -1 && item.complete === 0)
    },
    recentlyCompletedItemsForList:(state, getters) => (id) => {
      return getters.itemSet.filter((item) => state.lists[id].associated_items.indexOf(item.id) !== -1 && item.complete === 1)
    }
  },
  mutations: {
    addItemToList(state, payload){
    //console.log(payload);
      Vue.set(state.items, payload.id, payload);
      state.itemsList.push(payload.id);
      state.lists[payload.list_id].items.push(payload.id);
    },
    addList(state, payload){
      Vue.set(state.lists, payload.id, payload);
      state.listsList.push(payload.id);
    },
    removeFromListsList(state, list){
      var listIndex = state.listsList.indexOf(list);
      console.log("Here is the index");
      console.log(listIndex);

      state.listsList.splice(listIndex, 1);
    },
    removeItemFromList(state, item){
      console.log(item.pivot);
      var index = state.itemsList.indexOf(item.id);
      var indexes = [], i;
      for(i = 0; i < state.itemsList.length; i++){
        if (state.itemsList[i] === item.id)
            indexes.push(i);
      }
      indexes.forEach(ele => {
        state.itemsList.splice(ele, 1);
      })
      // state.itemsList.splice(index,1);
      //indexes = []
      item.listIds.forEach(id => {
        state.lists[id].items.splice(item.id, 1);
      })

      var listIndex = state.lists[item.list_id].items.indexOf(item.id);
      state.lists[item.list_id].items.splice(listIndex, 1); 
      Vue.delete(state.items, item.id);
    },
    deleteItem(state, item){
      var index = state.itemsList.indexOf(item.id);
      state.itemsList.splice(index, 1);
      Vue.delete(state.items, item.id);
    },
    deleteList(state, list){
      Vue.delete(state.lists, list.id);
    },
    setData(state, payload){
      Vue.set(state, 'lists', payload.lists)
      Vue.set(state, 'listsList', Object.keys(payload.lists).map(Number))
      console.log(payload.associated_items);
      Vue.set(state, 'items', payload.associated_items);
      Vue.set(state, 'itemsList', Object.keys(payload.associated_items).map(Number))
      console.log("LETS LOOK");
      console.log(state.items[state.itemsList[0]].pivot)
      console.log(state.itemsList)
      //state.lists = payload.lists
      //state.listsList = Object.keys(payload.lists)
      
    }
  },
  actions: {
    addItem({ commit }, payload){
      //console.log(payload);
      commit('addItemToList', payload);
    },
    addList({commit}, payload){
      commit('addList', payload);
      
    },
    completeItem({commit}, payload){
      payload.listIds.forEach(list => {
        commit('removeF')
      })
    },
    deleteList({commit}, payload){
      commit('removeFromListsList', payload.id);
      payload.items.forEach(item => {
        commit('deleteItem', item);
      });
      commit('deleteList', payload.id);
    },
    removeItemFromList({commit}, payload){
      commit('removeItemFromList', payload.item);
    },
    updateList(){

    },
    removeViewer(){

    },
    setInitialData({commit}, payload){
      commit('setData', payload)
    }
  }
});

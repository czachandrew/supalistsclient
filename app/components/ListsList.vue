<template>
    <StackLayout>
      <StackLayout >
        <StackLayout orientation="horizontal" class="form">
          <TextField hint="Chocolate Milk @Target..." class="input input-border" width="400" v-model="input" />
          <!-- <Button text="Go" class="btn btn-primary btn-active" @tap="processInput" /> -->
        </StackLayout>
        
        

      </StackLayout>
      
        <Label text="Your lists" class="font-weight-bold" textWrap="true" />
        <StackLayout orientation="horizontal">
              <Button text="+ New List" class="btn btn-primary" @tap="attachListToItem(input)" v-if="attachMode" />
              <Button text="Done" class="btn btn-default" @tap="stopAttaching" v-if="attachMode" />
        </StackLayout>

        

        <StackLayout v-for="(list, index) in lists" :key="index">
        <GridLayout columns="*" rows="auto">
          <StackLayout orientation="horizontal" row="0" col="0">
            <Label :disabled="!attachMode" :text="list.title + ' (' + list.associated_items.length + ')'" class="card font-weight-bold" style="width: 90%" textWrap="true" @tap="goToList(list)" />
            <Label :disabled="!attachMode" class="icom" :text="String.fromCharCode(0xea0d)" color="black"  horizontalAlignment="right" @tap="deleteList(list)" />
          
          </StackLayout>
          <Label row="0" col="0" v-if="attachMode" class="attacher" :class="isAttached(list)" text="Attach" horizontalAlignment="center" textWrap="true" @tap="attachListToItem(list, index)" />
        </GridLayout>
        </StackLayout>
    </StackLayout>
</template>
<script lang="ts">
import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
import List from './List.vue'
import { Api } from './classes/Api'
import { ContextReader } from './classes/ContextReader'
const reader = new ContextReader();
const api = new Api();
@Component({
  components: {
    List
  }
})
  export default class Lists extends Vue {
    msg:string = 'Hello World!'
    input:string = ''
    icon:string = String.fromCharCode(0xe556)
    attachMode:boolean = false
    listsToAttach:any = [];
    processing:string = ''
    newList:any = {
      title: ''
    }

    @Watch("input")
    onInputChanged(){
      if(this.input.length > 0){
        this.attachMode = true
      } else {
        this.attachMode = false
      }
    }
    get lists(){
      return this.$store.getters.listSet
    }

    isAttached(list){
      console.log('evaling')
      if(this.listsToAttach.indexOf(list.id) !== -1) return 'attached'
    }

    goToList(list){
      console.log("I am header to examine"); 
      console.log(list.items);
      let testString = "This is a test"
      this.$navigateTo(List, {props: {"selectedList": list, "test": testString}})
    }

    deleteList(list){
      console.log("I am deleting a list")
      api.deleteList(list).then(response => {
        console.log("Back from api");
      })
      this.$store.dispatch('deleteList', list);
    }


    matchList(term){
      var index:number = null
      for(var i = 0; i< this.lists.length; i++){
        var title:string = this.lists[i].title;
        console.log(title.toLowerCase() + " " + term.toLowerCase());
        if(title.toLowerCase().replace(/\s/g,'') === term.toLowerCase()){
          console.log("The word matches this list : " + title + " at index: " + i);
          index = this.lists[i].id;
          break;
        }
      }
      return index
    }

    


    addItem(list, item){
      console.log("We are dispatching the item method");
      //create the item via the api
      var newItem = {list_id: list, title: item}
      api.addItemToList(newItem).then(response => {
            console.log(response);
            this.$store.dispatch('addItem', response);
        }).catch(error =>{
            console.log(error);
        });

      //then take the response and push it to the store
      //this.$store.dispatch('addItem', {list_id: list, title: item} )
    }
    addList(title:string, items:any = null){
      if(items){
        api.createListWithItems(title, items).then(response => {
          //success
          console.log("With Items");
          console.log(response);
          this.$store.dispatch('addList', response)

        })
      } else {
        api.createList({title: title}).then(response => {
          //success 
          console.log(response);
          this.$store.dispatch('addList', response)
          this.input = ''
          this.attachMode = false

        })
      }

    }

    stopAttaching(){
      this.attachMode = false 
      api.addItemToList({item: {title: this.input, list_id: 0}, lists: this.listsToAttach}).then(response => {
        console.log(response);
        this.listsToAttach = []
        this.attachMode = false
        this.input = '' 
      }).catch(error => {
        console.log(error);
      })
      //now submit the items with the attached lists

    }

    attachListToItem(list, index){
      //attach the input to the list
      //this.attachMode = false
      //this.addItem(list, this.input);
      //this.input = ''
      console.log("Attaching")
      //list.name = "fart"
      //let id = list.id
      //this.lists[id].name = "Shit"
      //Vue.set(this.lists[index], 'attach', true);
      this.listsToAttach.push(list.id);
    }

    processInput(){
      //check for an @symbol 
      var checkString = this.input.indexOf("@");
      console.log("Calling the reader")
      var mentionedLists = reader.getLists(this.input);
      console.log("Here are the lists that we found");
      console.log(mentionedLists);
      if(this.input.trim().length === 0)return
      if(mentionedLists.lists.length > 0){
        //check if multiple occurences
        mentionedLists.lists.forEach(element => {
          var match = this.matchList(element);
          if(match !== null){
            this.addItem(match, mentionedLists.item)
          }
        });
      } else {
        this.attachMode = true
        //this.processing = this.input;
        //console.log("There was no @ symbol found");
        //let newItem = {id: this.lists.length + 1, title: this.input, items:[]}
        //this.addList(this.input);
        //console.log(newItem);
        //this.lists.push(newItem);
      }

      //this.input = '';
    }

  }
</script>
<style lang="css">
  .card {
    padding: 20; 
    margin: 5;
    background-color: azure;
    border: blue
  }

.input-supa{
      appearance: none;
      background-color: none;
      border: 1px solid red;
      line-height: 5;
      font-size: 17px;
      
      display: block;
      box-sizing: border-box;
      padding: 10px 15px;
      border-radius: 60px;
      color: red;
      font-weight: 100;
      letter-spacing: 0.01em;
      position: relative;
      z-index: 1;
}

.attacher {
  background-color:aqua;
  z-index: 1000;
  font-weight:bold;
  opacity: .5;
}

.attached {
  background-color: green;
}

</style>
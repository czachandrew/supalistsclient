<template>
    <Page>
        <ActionBar :title="list.title"></ActionBar>
        
        <StackLayout v-if="list">
            
            <StackLayout orientation="horizontal" class="form">
            <!-- <Label :text="list.title" class="h2" textWrap="true" /> -->
                
            <TextField hint="Enter a new item for this list" width="275" v-model="newItem.title" />
            <Button text="+" class="btn btn-primary" @tap="addItem" />
            
            
            </StackLayout>
          <!-- <Label :text="list.title" class="h2" textWrap="true" /> -->
          <StackLayout v-for="(item, index) in items" :key="index">
              <StackLayout orientation="horizontal" class="card">
                <Label :text="item.title" textWrap="true" style="width: 90%;" ~itemLabel+item.id />
                <Label class="icom" horizontalAlignment="right" :text="String.fromCharCode(0xea11)" @tap="completeItem(item, index)"></Label>

                <!-- <check-box :checked="item.complete" horizontalAlignment="right" @checkedChange="completeItem(item, index)"></check-box> -->
                <!-- <Button :text="remove" class="pull-right" @tap="addItem" /> -->
                
              </StackLayout>
            
          </StackLayout>
          <Label text="Recently Completed Items" class="h2" textWrap="true" />
          

            <StackLayout v-for="(item, index) in recentlyCompleted" :key="item.id">
              <StackLayout orientation="horizontal" class="card disabled">
                <Label :text="item.title" textWrap="true" style="width: 90%;" ~itemLabel+item.id />
                <Label class="icom" horizontalAlignment="right" :text="String.fromCharCode(0xea11)" @tap="completeItem(item, index)"></Label>

                <!-- <check-box :checked="item.complete" horizontalAlignment="right" @checkedChange="completeItem(item, index)"></check-box> -->
                <!-- <Button :text="remove" class="pull-right" @tap="addItem" /> -->
                
              </StackLayout>
            
          </StackLayout>
          
        </StackLayout>
    </Page>
</template>
<script lang="ts">
import {Component, Prop, Vue } from 'vue-property-decorator';
import { Api } from './classes/Api'

const api = new Api();

@Component({})
export default class List extends Vue {
    @Prop(Object) !selectedList:any
    @Prop(String) !test:string
    remove:string = "X"
    newItem:any = {
        title: '',
        list_id: this.selectedList.id,
        description: '',
        complete: false,
    };

    get list(){
        if(this.selectedList !== undefined){
            return this.selectedList
        } else {
            return {};
        } 
    }

    get items(){
        return this.$store.getters.itemsForList(this.selectedList.id);
        // return this.selectedList.items
    }

    get recentlyCompleted(){
        return this.$store.getters.recentlyCompletedItemsForList(this.selectedList.id);
    }

    completeItem(item, index){
        console.log(item.listIds);
        console.log(item.id)
        console.log(index);
        //return
        //itemLabel+item.id
        console.log("Button hit!")
        api.completeItem(item).then(response => {
            console.log(response);
             this.$store.dispatch('removeItemFromList', {item:item})
        }).catch(err => {
            console.log(err);
        })
       
    }

    addItem(){
        api.addItemToList(this.newItem).then(response => {
            console.log(response);
            this.$store.dispatch('addItem', response);
        }).catch(error =>{
            console.log(error);
        });

       // this.$store.dispatch('addItem', {list_id: this.newItem.list_id, title: this.newItem.title, complete: false} )


        this.newItem.title = '';
    }

    mounted() {
     //
    }
}
</script>
<style scoped>
  .card {
    padding: 10; 
    margin: 5;
    background-color: aliceblue;
    border: blue
  }

  @keyframes strike{
  0%   { width : 0; }
  100% { width: 100%; }
}
.strike {
  position: relative;
}
.strike::after {
  content: ' ';
  position: absolute;
  top: 50%;
  left: 0;
  width: 100%;
  height: 1px;
  background: black;
  animation-name: strike;
  animation-duration: 4s;
  animation-timing-function: linear;
  animation-iteration-count: 1;
  animation-fill-mode: forwards; 
}


</style>
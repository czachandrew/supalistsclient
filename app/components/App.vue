<template>
    <Page>
        <ActionBar title="SupaLists"> </ActionBar>
        <StackLayout>
          <Lists></Lists>        
        </StackLayout>
    </Page>

</template>

<script lang="ts">
import {Component, Prop, Vue} from 'vue-property-decorator';
import Lists from './ListsList.vue'
import { Api } from './classes/Api'
const api = new Api();
@Component({
  components:{
      Lists
  }

})
  export default class App extends Vue {
    msg:string = 'Hello World!'
    
    mounted(){

      if(api.checkToken() !== null){
        //all set
        api.getLists().then(response => {
          console.log(response);
        }).catch(err => {
          console.log(err);
        })
      }else {
        api.retrieveToken().then(response => {
          api.getLists().then(response => {
            console.log(response);
          }).catch(err => {
            console.log(err)
          })
        }).catch(err => {
          console.log(err);
        })

      }

    }
  }
</script>

<style scoped>
    ActionBar {
        background-color: #53ba82;
        color: #ffffff;
    }

    .message {
        vertical-align: center;
        text-align: center;
        font-size: 20;
        color: #333333;
    }
</style>

import * as http from 'tns-core-modules/http'
import * as appSettings from "tns-core-modules/application-settings"
import store from '../../store'
import { normalize, schema} from 'normalizr'

enum requestType {POST, GET, DELTE, PUT}


export class Api {
    constructor(){
        
    }

    checkToken(){
        appSettings.remove('accessToken');
        return appSettings.getString("accessToken", null);
    }

    retrieveToken(){

        return new Promise((resolve, reject) => {
            var creds = {
                grant_type: 'client_credentials',
                client_id: 1,
                client_secret: 'XbQtWKHmSXii04fo8cE0dPp4xSVKMOk8DAWEBn77',
            }
    
            this.makeRequest('oauth/token', requestType.POST, creds).then(response => {
                console.log("I should have a token now");
                //console.log(response.content);
    
                var tokens = response.content.toJSON();
                console.log(tokens.access_token);
                appSettings.setString("accessToken", tokens.access_token)
                resolve()
            }).catch(err => {
                console.log(err)
                reject(err)
            })
        })


    }

    completeItem(item){
        console.log("I am completing an item"); 
        console.log(item);
        return new Promise((resolve, reject) => {
            this.makeRequest('api/items/'+ item.id +'/complete', requestType.GET, {}).then(response => {
                console.log(response);
                console.log(response.content.toJSON());
                resolve(response.content.toJSON());
            }).catch(err => {
                console.log(err)
                reject(err);
            })
        })
    }

    createList(list){
        return new Promise((resolve, reject) => {
            this.makeRequest('api/lists', requestType.POST, list).then(response => {
                console.log(response.content.toJSON())
                resolve(response.content.toJSON());
            }).catch(err => {
                console.log(err)
                reject(err);
            })
        })
    }

    createListWithItems(list, items){
        return new Promise((resolve, reject) => {
            this.makeRequest('api/lists', requestType.POST, {list: list, items: items}).then(response => {
                console.log(response.content.toJSON());
                resolve(response.content.toJSON());
            }).catch(err => {
                console.log(err); 
                reject(err);
            })
        })
    }

    deleteList(list){
        return new Promise((resolve, reject) => {
            this.makeRequest('api/lists/'+list.id+'/delete', requestType.GET, {}).then(response => {
                console.log(response.content.toJSON());
                resolve(response.content.toJSON()); 
            }).catch(error => {
                console.log(error);
                reject(error);

            })
        })
    }

    addItemToList(obj){

        return new Promise((resolve,reject) => {

                this.makeRequest('api/items', requestType.POST, obj).then(response => {
                    console.log(response.content.toString());
                    resolve(response.content.toJSON());
                }).catch(err => {
                    console.log(err);
                    reject(err)
                })
        })
    }

    getLists(){
        console.log("We are getting the lists");
        return new Promise<any>((resolve, reject) => {
            console.log('In the list promise');
            this.makeRequest('api/lists', requestType.GET, {}).then(response => {
                console.log("I am back");
                console.log(response);
                const associated_items = new schema.Entity('associated_items')
                const item = new schema.Entity('items');
                const list = new schema.Entity('lists', {
                    associated_items: [associated_items],
                    items: [item]
                })
                const lists = new schema.Array(list);
                              
                let json = response.content.toJSON()
                console.log(json[0]);
                const normalizedData = normalize(json, lists);
                console.log("Here is the normalized data"); 
                console.log(normalizedData.entities);
                const keys = Object.keys(normalizedData.entities.lists).map(Number);
                console.log(keys);
                store.dispatch('setInitialData', normalizedData.entities);
                resolve(normalizedData.entities);
            }).catch(error => {
                console.log(error)
                reject(error);
            })
        })
    }

    createPdf(quote){
        return new Promise<any>((resolve, reject) => {
            this.makeRequest('api/quotes/lite', requestType.POST, quote).then(response => {
                console.log("BACK")
                console.log(response.content.toJSON());
                resolve(response.content.toJSON());
            }).catch(error => {
                console.log("Whoops something is wrong")
                console.log(error);
                reject(error)
            })
        })

    }

    getParts(term:string){
        return new Promise<any>((resolve, reject) => {
            this.makeRequest('api/parts/lookup/' + term, requestType.GET, {}).then(response => {
                //console.log(response.content.toJSON());
                resolve(response.content.toJSON());
            }).catch(error => {
                reject(error);
            })
        })
    }

    test(){
        return new Promise<any>((resolve, reject) => {
            this.makeRequest('api/quotes/test', requestType.POST, {}).then(response => {
                console.log(response);
                console.log(response.content.toJSON());
                resolve(response.content.toJSON());
            }).catch(error => {
                reject(error);
            })
        })
    }

    makeRequest(url:string, method:requestType, payload:any){

        var headers = { "Content-Type" : "application/json;charset=UTF-8"};
        // headers["X-CSRF-TOKEN"] = 'VJb8diQMX9wogR1fsNUHOcpkLJwBI2M1MwRoq1v8'

        if(appSettings.getString("accessToken", null)) {
            console.log("I am attaching the access token");
            headers["Authorization"] = "Bearer " + appSettings.getString("accessToken")
        }
        //console.log(requestType[method])

        var requestObj = {
            url: "http://supalistapi.test/" + url,
            method: requestType[method],
            headers: headers
        };
        //console.log("Assigning payload if present");

        if(payload !== undefined && requestType[method] !== 'GET'){
            console.log("I am adding a payload");
            requestObj['content'] = JSON.stringify(payload);
        }
        //console.log(requestObj);

        console.log("I am returning a request object");
        console.log(requestObj);

        return http.request(requestObj);

    }
}
export class ContextReader {
    constructor(){

    }

    /** Expects a string, looks for @mentions  */
    getLists(toRead:string){
        var indexes = this.getAts(toRead);
        console.log(indexes);
        var lists = [];
        let i = 0;
        var offset = 0
        
        let item = toRead.substring(0, indexes[0]);
        indexes.forEach((ele) => {
            //console.log("I found an @ at position " + checkString);
            console.log(ele)
            i++
            if(indexes[i] !== -1 && indexes[i] !== undefined){
                console.log(indexes[i])
                console.log('Using the next @');
                var sub = toRead.substring(ele, indexes[i]);
                console.log(sub);
            } else {
                var sub = toRead.substring(ele, (toRead.length));
            }
           
           // console.log(sub);
            var nextSpace = sub.indexOf(" ");
            if(nextSpace !== -1){
                console.log("I am adding " + sub.substring(0, nextSpace));

                lists.push(sub.substring(0, nextSpace).trim().replace('@',''));
            } else {
                console.log("I am adding " + sub);
                lists.push(sub.trim().replace('@',''));
            }
        })
        return {lists: lists, item: item}
    }

    getAts(toRead:string){
        console.log('Here I go')
        console.log(toRead);
        var results = [];
        var pos = 0
        var i = -1
        while(pos != -1){
            pos =  toRead.indexOf("@", i+1);
            if(pos !== -1){
                results.push(pos);
            }
            i = pos;
        }

        return results;
        
    }
}
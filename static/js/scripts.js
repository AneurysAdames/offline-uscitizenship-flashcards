/* <!--<link href="/static/tgportfolio/assets/favion.ico" rel="icon" type="image/x-icon">--> */
const GLOBALS = {
  all_data:[],
  seq:[],
  SequenceController : function (sequence) {

    outside = {}
    let current =0;

    function get_next () {
      current ++;
      if (current > (sequence.length -1))
        current = sequence.length
      return sequence[current]

    }
    function get_previous () {
      current --;
      if (current <0)
        current =0; // no more prevs
      return sequence[current]

    }
    function get_current () {

      return sequence[current]

    }
    outside['next'] = get_next;
    outside['prev'] = get_previous;
    outside['current'] = get_current;
    return outside
  }

}



/* Fetch from our API */

/* Indexeddb functions */
//const idbApp = function() {
var promise = new Promise(function(resolve,reject){

  $("#answer").hide()
   resolve(dbaseentries());

})

promise.then(function(e){
  console.log("I completed my first promise")
//  start()
  setTimeout(function(){
    start() // Yay! Everything went well!
  }, 2500);
})
.catch(
       // Log the rejection reason
      (reason) => {
           console.log('Handle rejected promise ('+reason+') here.');
       });



function dbaseentries(){
//function(){


   'use strict';

   //check for support
   if (!('indexedDB' in window)) {
     console.log('This browser doesn\'t support IndexedDB');
     return;
   }

   var dbPromise = idb.open('civicstest', 1, function(upgradeDb) {

     switch (upgradeDb.oldVersion) {
     case 0:

     if (!upgradeDb.objectStoreNames.contains('questions')) {
       upgradeDb.createObjectStore('questions', {keyPath: 'id'});
       addQuestions()

     }
     if (!upgradeDb.objectStoreNames.contains('capitals')) {
       upgradeDb.createObjectStore('capitals', {keyPath: 'acronym'});
       addCapitals()
      }




   }
 });


   function getQuestions() {

     dbPromise.then(function(db) {
       var tx = db.transaction('questions', 'readonly');
       var store = tx.objectStore('questions');
       return store.getAll();
     })

   }

   function addQuestions(items){
           const api_url = "https://script.google.com/macros/s/AKfycbwyzooED9Ob5Egct3tvFuILRxsQNUjfJeHlAk9X5HOpaML1mApk/exec";
           fetch(api_url)
             .then (response => {

                                   return response.json()
                                 })  // .then(function(response){return response.json}
             .then(items => {

                             let data_mod = []

                             for (const i in items)
                             {
                               let one_data={};
                               one_data["id"]=items[i][5];
                               const qs = items[i][3].split("*");
                               one_data["question"]=qs[0];

                               one_data["is_location_dependent"]=items[i] && items[i][8] || false;
                               one_data["answer"]= items[i]["is_location_dependent"] ? "Depends on your location" : qs[qs.length-2];
                                one_data["role_name"] = (items[i] && items[i][9] && items[i][9].length>0) ? (items[i][9]) : false;

                               data_mod.push(one_data)

                             }
                           var items=data_mod;

             dbPromise.then(function(db)
             {

                   var tx = db.transaction('questions', 'readwrite');
                   var store = tx.objectStore('questions');


                 return Promise.all(items.map(function(item) {

                     return store.add(item);
                   })
                 ).catch(function(e) {
                   tx.abort();
                   console.log(e);
                 }).then(function() {
                   console.log('All items added successfully!');
                 });


           });

         });
         }


         function addCapitals(){
         const api_url_caps = "https://script.google.com/macros/s/AKfycbwyzooED9Ob5Egct3tvFuILRxsQNUjfJeHlAk9X5HOpaML1mApk/exec?capital=c";
         fetch(api_url_caps)
           .then (response => {

                                 return response.json()
                               })  // .then(function(response){return response.json}
           .then(items => {

           dbPromise.then(function(db) {
           var tx = db.transaction('capitals', 'readwrite');
           var store = tx.objectStore('capitals');
           var res=[]
           for (var i in items){

           var temp = {}
           temp[i]=items[i]
            var temp=items[i]
            temp["acronym"]=i
           res.push(items[i])
           }


         return Promise.all(res.map(function(item) {

             return store.add(item);

           })
         ).catch(function(e) {
           tx.abort();
           console.log(e);
         }).then(function() {
           console.log('All capitals added successfully!');
         });
         })
         })


         }




 /* start*/


 /* end*/


 return {
     dbPromise: (dbPromise),
      getQuestions: (getQuestions),
      addQuestions: (addQuestions),
       addCapitals: (addCapitals)
     }



// }
}
 //()


 //idbApp.addQuestions();
// idbApp.addCapitals();




/*start add*/


/* end */

  //start()





function start(){


$("#answer").hide()

var data;
var dbPromise = idb.open('civicstest', 1);


dbPromise.then(function(db){
  var tx = db.transaction('questions', 'readonly');
  var store = tx.objectStore('questions');
  return store.getAll();

}).then(function(data){



 for (var i in data){
   var temp={};
  temp["id"]=i;
  temp["ucis_id"]=data[i]["id"];
  temp["question"]=data[i]["question"];

  temp["is_location_dependent"] =data[i]["is_location_dependent"];
  temp["answer"]= temp["is_location_dependent"] ? "depends on your location" : data[i]["answer"];
   temp["role_name"] = (data[i] && data[i]["role_name"]) ? (data[i]["role_name"]) : false;

  GLOBALS.all_data.push(temp)

 }

var quiz_only_data=[]


 seq = GLOBALS.SequenceController (GLOBALS.all_data);


return display_elems(seq.current())



//})
})

}

function getcurrent(){
  return  display_elems(seq.current())
}

function getprevious(){
  return  display_elems(seq.prev())
}

function getnext(){
  return  display_elems(seq.next())
}

function display_elems(elems){
  $("#question").html(elems["question"])
    $("#answer").hide();
  $("#answer_text").html(elems["answer"])
}
function showanswer(){
  $("#answer").show();
}





function play_audio (code) {
  var string;
  if (code===0){
    string = seq.current().question
  }
  else{
  string=seq.current().answer
  }
  var msg = new SpeechSynthesisUtterance();
  var voices = window.speechSynthesis.getVoices();
  msg.voice = voices[0]; // Note: some voices don't support altering params
  msg.voiceURI = 'native';
  msg.volume = 1; // 0 to 1
  msg.rate = 1; // 0.1 to 10
  msg.pitch = 0; //0 to 2
  msg.lang = 'en-US';

  msg.text = string;
  speechSynthesis.speak(msg);


  msg.addEventListener("end", function() {

   });


}

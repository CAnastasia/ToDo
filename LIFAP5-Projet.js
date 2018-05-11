/* global downloadPromise uploadPromise resetPromise updatePromise */
/* see http://eslint.org/docs/rules/no-undef */

/************************************************************** */
/* CONSTANTES */
/************************************************************** */

const api_header = 'X-API-KEY';
const api_key_value = 'ad1939d50a6138a47ba4';
let headers = new Headers();
headers.set(api_header, api_key_value);

const user_name = 'p1508726';
const url_user = 'http://localhost:8888/index.php/users/';
const url = 'http://localhost:8888/index.php/todos/';

function filtreTexte(requete,table) {
  return table.filter(function (el) {
    if (el['createdBy'].toLowerCase().indexOf(requete.toLowerCase()) > -1)
    {
      return 1;
    }
    let test = el['people'].filter(function (el2){
      return el2.toLowerCase().indexOf(requete.toLowerCase()) > -1;
    })
    if(test.length != 0)
    {
      return 1;
    }
    else {
      return 0;
    }
  })
}

function fetch_info()
{
    fetch(url, { method: 'GET', headers: headers})
        .then(function(response) {
            console.log("hey");
            if (response.ok) {
                return response.json();
            } else {
                console.log(`Erreur dans la requête ${url}: ${response.code}`);
                throw("Erreur lors de la requête sur le serveur");
            }
        })
        .then(function(todoEnJson) {
            // faireQuelqueChoseAvecLesDonnees(todoEnJson);

            let my= filtreTexte('p1713175',todoEnJson);

            let new_array = my.map(obj => obj);
          //  console.log(new_array);

            $(document).ready(function(){
                $(".deadline").click(function(){
                    console.log("salut");
                    new_array.sort(function (o1,o2){
                        return new Date(o1["deadline"])-new Date(o2["deadline"]);
                    })
                    $(".list-group-item").remove();
                    new_array.map(import_json)

                });
            });
            $(document).ready(function(){
                $(".title").click(function(){
                    console.log("salut");
                    new_array.sort(function(a, b){
                        if(a.title.toUpperCase() < b.title.toUpperCase()) return -1;
                        if(a.title.toUpperCase() > b.title.toUpperCase()) return 1;
                        return 0;
                    })
                    $(".list-group-item").remove();
                    new_array.map(import_json)

                });
            });
            new_array.map(import_json)


        });

}
function fetch_users(users)
{
    fetch(url_user + users.id, { method: 'GET', headers: headers })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                console.log(`Erreur dans la requête ${url}: ${response.code}`);
                throw("Erreur lors de la requête sur le serveur");
            }
        })
        .then(function(user_info) {
            document.getElementById("popup_id").style.display="block";
            document.getElementsByClassName("container-fluid")[0].style.WebkitFilter = 'blur(4px)';
            document.getElementById("image_user").src="img/img_avatar.png";
            document.getElementById("nom_user").innerHTML=user_info["_id"];
            document.getElementById("email_user").innerHTML=user_info["email"];
            document.getElementById("date_user").innerHTML=user_info["joinedOn"];
        });

}

function usersmask()
{
    document.getElementById("popup_id").style.display="none";
    document.getElementsByClassName("container-fluid")[0].style.WebkitFilter = 'blur(0px)';

}



function people_div(element)
{
   let new_div =  "<a href=\"#\" onclick=\"fetch_users(this)\"  id = " +element+">";
  // new_div.onmouseout = function(){document.getElementById("popup_id").style.display="none";};
   new_div+=element;
   new_div+="</a><br>";
   document.getElementsByTagName("template")[0].content.querySelector('#people').innerHTML += new_div;
}
fetch_info();

    function import_json(todoEnJson) {
        let temp = document.getElementsByTagName("template")[0];
        temp.content.querySelector('li .content').innerHTML = todoEnJson['title'];
        temp.content.querySelector('li div div').id = todoEnJson['_id'];
        temp.content.querySelector('.expend').href = "#"+todoEnJson['_id'];
        temp.content.querySelector('#desc').innerHTML = todoEnJson['desc'];
        temp.content.querySelector('#deadline').innerHTML = todoEnJson['deadline'];
        temp.content.querySelector('#people').innerHTML="";
        todoEnJson['people'].map(people_div);
        let clon = temp.content.cloneNode(true);
        document.getElementById(todoEnJson['status']).appendChild(clon);

    }

////////////////////////////////////////////////////////////////////////////////
// ETAT : classe d'objet pour gérer l'état courant de l'application (inutilisee)
////////////////////////////////////////////////////////////////////////////////

function State(users = [], todos = [], filters = [], sort = "NONE"){
  this.users  = users;
  this.todos  = todos;
  this.filters = filters;
  this.sort   = sort;

  //returns the JSON object of a user
  this.get_user_info = (user_id) => {
    return this.users.find((o)=>o['_id']===user_id);
  };

  //returns the TODO objects created by a user
  this.get_user_todos = (user_id) => {
    console.debug(`get_user_todos(${user_id})`); // with ${this.todos}
    const result = this.todos.filter( o => o['createdBy']===user_id );
    return result;
  };

  //returns the TODO objects where a user is mentioned
  this.get_mentioned_todos = (user_id) => {
    let mentioned_todos = [];
    return mentioned_todos;
  };
}//end State



function showTodo()
{
    if(document.getElementById("TodoId").style.visibility=="visible") {
        document.getElementById("TodoId").style.visibility = "collapse";
        document.getElementById("butontodo").style.color = "grey";
    }
    else {
        document.getElementById("TodoId").style.visibility = "visible";
        document.getElementById("butontodo").style.color = "red";
    }
}
function showDoing()
{

    if(document.getElementById("DoingId").style.visibility=="visible") {
        document.getElementById("DoingId").style.visibility = "collapse";
        document.getElementById("butondoing").style.color = "grey";
    }
    else {
        document.getElementById("DoingId").style.visibility = "visible";
        document.getElementById("butondoing").style.color = "red";
    }
}
function showDone()
{
    if(document.getElementById("DoneId").style.visibility=="visible") {
        document.getElementById("DoneId").style.visibility = "collapse";
        document.getElementById("butondone").style.color = "grey";
    }
    else {
        document.getElementById("DoneId").style.visibility = "visible";
        document.getElementById("butondone").style.color = "red";
    }
}

function addFunction() {

  const mon_todo ={
    "_id":"",
    "deadline" : "",
    "creation" : "",
    "title" : "",
    "desc" : "" ,
    "status" : "",
    "createdBy" : "",
    "people" : []
  }
  const array = document.getElementById("upload-mentioned").value.split(",")
  mon_todo["people"] = array;
  mon_todo["createdBy"]='P1713175';
  mon_todo["deadline"]=document.getElementById("upload-deadline").value;
  mon_todo["title"]=document.getElementById("upload-title").value;
  mon_todo["desc"]=document.getElementById("upload-desc").value;
  mon_todo["status"]=document.getElementById("upload-state").value

  const data = JSON.stringify(mon_todo);

  fetch(url, { method: 'POST', headers: headers,body: data})
      .then(function(response) {
          if (response.ok) {

              return response.json();
          } else {
              console.log(`Erreur dans la requête ${url}: ${response.code}`);
              throw("Erreur lors de la requête sur le serveur");
          }
      })
        .then(function() {
            $(".list-group-item").remove();
            fetch_info();

        });

}
function DeleteTodo(test,frome){
  fetch(url + test.parentNode.childNodes[7].id, { method: 'DELETE', headers: headers})
      .then(function(response) {
          if (response.ok) {

              return response.json();
          } else {
              console.log(`Erreur dans la requête ${url2}: ${response.code}`);
              throw("Erreur lors de la requête sur le serveur");
          }
      })
	document.getElementById(frome).removeChild(test.parentNode.parentNode);
}


let donnee;
function editTodo(test){
        document.getElementById("upload-title2").value = test.parentNode.parentNode.childNodes[1].innerHTML;
        document.getElementById("upload-desc2").value = test.parentNode.childNodes[7].childNodes[1].innerHTML;
        document.getElementById("upload-mentioned2").value ="";
        console.log(test.parentNode.childNodes[7].childNodes[5].childNodes);
        Array.prototype.map.call(test.parentNode.childNodes[7].childNodes[5].childNodes, function(trie){
            if (trie.innerHTML != "") {
                document.getElementById("upload-mentioned2").value += trie.innerHTML;
                document.getElementById("upload-mentioned2").value += ",";
            }
        });
        document.getElementById("upload-deadline2").value = test.parentNode.childNodes[7].childNodes[3].innerHTML;
        donnee = test;

}


function valide()
{

  const mon_todo ={
    "_id":"",
    "deadline" : "",
    "creation" : "",
    "title" : "",
    "desc" : "" ,
    "status" : "",
    "createdBy" : "",
    "people" : []
  }
  const array = document.getElementById("upload-mentioned2").value.split(",")
  mon_todo["people"] = array;
  mon_todo["deadline"]=document.getElementById("upload-deadline2").value;
  mon_todo["title"]=document.getElementById("upload-title2").value;
  mon_todo["desc"]=document.getElementById("upload-desc2").value;
  mon_todo["createdBy"]='Romuald';
  mon_todo["status"]=document.getElementById("upload-state2").value;
  const data = JSON.stringify(mon_todo);
  fetch(url, { method: 'POST', headers: headers,body: data})
      .then(function(response) {
          console.log("hey");
          if (response.ok) {

              return response.json();
          } else {
              console.log(`Erreur dans la requête ${url}: ${response.code}`);
              throw("Erreur lors de la requête sur le serveur");
          }
      })
        .then(function(todoEnJson) {
            DeleteTodo(donnee,donnee.parentNode.parentNode.parentNode.id)
            $(".list-group-item").remove();
            fetch_info();
  })
}

////////////////////////////////////////////////////////////////////////////////
// RENDU : fonctions génération de HTML à partir des données JSON
////////////////////////////////////////////////////////////////////////////////



////////////////////////////////////////////////////////////////////////////////
// HANDLERS : gestion des évenements de l'utilisateur dans l'interface HTML
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////
// FETCH Fonction permettant de charger des données asynchrones
////////////////////////////////////////////////////////////////////////////////


/************************************************************** */
/** MAIN PROGRAM */
/************************************************************** */

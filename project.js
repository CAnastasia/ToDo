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
//function that filters todos created by the current user and todos where the curent user is mentioned
function filtreTexte(requete,table) {
  return table.filter(function (el) {
    if (el['createdBy'].toLowerCase().indexOf(requete.toLowerCase()) > -1)
    {
      return 1;
    }
    let filtre_mentionne = el['people'].filter(function (el2){
      return el2.toLowerCase().indexOf(requete.toLowerCase()) > -1;
    })
    if(filtre_mentionne.length != 0)
    {
      return 1;
    }
    else {
      return 0;
    }
  })
}
//fetch and sort (by title and by date) all todos
function fetch_info()
{
    fetch(url, { method: 'GET', headers: headers})
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                console.log(`Erreur dans la requête ${url}: ${response.code}`);
                throw("Erreur lors de la requête sur le serveur");
            }
        })
        .then(function(todoEnJson) {
            let my= filtreTexte('p1713175',todoEnJson);
            let new_array = my.map(obj => obj);
            //sort by date
            $(document).ready(function(){
                $(".deadline").click(function(){
                    console.log("salut");
                    new_array.sort(function (o1,o2){
                        return new Date(o1["deadline"])-new Date(o2["deadline"]);
                    })
                    //remove all todos, sort and display again
                    $(".list-group-item").remove();
                    new_array.map(import_json)

                });
            });
            //sort by title
            $(document).ready(function(){
                $(".title").click(function(){
                    console.log("salut");
                    new_array.sort(function(a, b){
                        if(a.title.toUpperCase() < b.title.toUpperCase()) return -1;
                        if(a.title.toUpperCase() > b.title.toUpperCase()) return 1;
                        return 0;
                    })
                    //remove all todos, sort and display again
                    $(".list-group-item").remove();
                    new_array.map(import_json)

                });
            });
            //display all todos
            new_array.map(import_json)


        });

}
// fetch user with a specific id
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
            //display pop up
            document.getElementById("popup_id").style.display="block";
            document.getElementsByClassName("container-fluid")[0].style.WebkitFilter = 'blur(4px)';
            //change html content
            document.getElementById("image_user").src="img/img_avatar.png";
            document.getElementById("nom_user").innerHTML=user_info["_id"];
            document.getElementById("email_user").innerHTML=user_info["email"];
            document.getElementById("date_user").innerHTML=user_info["joinedOn"];
        });

}
//close pop-up
function usersmask()
{
    document.getElementById("popup_id").style.display="none";
    document.getElementsByClassName("container-fluid")[0].style.WebkitFilter = 'blur(0px)';
}
//create a div for each mentioned user(with all information about) in a pop up
function people_div(element)
{
   let new_div =  "<a href=\"#\" onclick=\"fetch_users(this)\"  id = " +element+">";
   new_div+=element;
   new_div+="</a><br>";
   document.getElementsByTagName("template")[0].content.querySelector('#people').innerHTML += new_div;
}
//call to the function that display all todos
fetch_info();
//add new information to template , clon and append to html body
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


//filter for to do tasks
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
//filter for tasks in progress

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
//filter for done tasks

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
//add a new to do
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
//delete the selected to do
function DeleteTodo(object,from_path)
{
    fetch(url + object.parentNode.childNodes[7].id, {method: 'DELETE', headers: headers})
        .then(function (response) {
            if (response.ok) {
                return response.json();
            } else {
                console.log(`Erreur dans la requête ${url2}: ${response.code}`);
                throw("Erreur lors de la requête sur le serveur");
            }
        })
    document.getElementById(from_path).removeChild(object.parentNode.parentNode);
}


//modal to confirm deletion of a to do
function click_modal(this_object,from_path)
{
    bootbox.confirm({
        title: "Destroy todo",
        message: "Do you want to destroy this todo? This cannot be undone.",
        buttons: {
            cancel: {
                label: '<i class="fa fa-times"></i> Cancel'
            },
            confirm: {
                label: '<i class="fa fa-check"></i> Confirm'
            }
        },
        callback: function (result) {
            if(result)
            {
                DeleteTodo(this_object,from_path);
            }
        }
    });
}
//variable that contain information about a to do that was modified
let donnee;
    //select current information of a to do in the modal input
function editTodo(object_modif){
    document.getElementById("upload-title2").value = object_modif.parentNode.parentNode.childNodes[1].innerHTML;
    document.getElementById("upload-desc2").value = object_modif.parentNode.childNodes[7].childNodes[1].innerHTML;
    document.getElementById("upload-mentioned2").value ="";
    Array.prototype.map.call(object_modif.parentNode.childNodes[7].childNodes[5].childNodes, function(trie){
        if (trie.innerHTML != "") {
            document.getElementById("upload-mentioned2").value += trie.innerHTML;
            document.getElementById("upload-mentioned2").value += ",";
        }
    });
    document.getElementById("upload-deadline2").value = object_modif.parentNode.childNodes[7].childNodes[3].innerHTML;
    donnee = object_modif;
}
//edit a to do
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
  mon_todo["_id"] = donnee.parentNode.childNodes[7].id
  mon_todo["deadline"]=document.getElementById("upload-deadline2").value;
  mon_todo["title"]=document.getElementById("upload-title2").value;
  mon_todo["desc"]=document.getElementById("upload-desc2").value;
  mon_todo["createdBy"]='p1713175';
  mon_todo["status"]=document.getElementById("upload-state2").value;
  const data = JSON.stringify(mon_todo);
  fetch(url + donnee.parentNode.childNodes[7].id, { method: 'PUT', headers: headers,body: data})
      .then(function(response) {
          if (response.ok) {

              return response.json();
          } else {
              console.log(`Erreur dans la requête ${url}: ${response.code}`);
              throw("Erreur lors de la requête sur le serveur");
          }
      })
        .then(function(todoEnJson) {
            $(".list-group-item").remove();
            fetch_info();
  })
}
//get curent user informations
function fetch_current_users()
{
    fetch(url_user + "p1713175", { method: 'GET', headers: headers })
        .then(function(response) {
            if (response.ok) {
                return response.json();
            } else {
                console.log(`Erreur dans la requête ${url}: ${response.code}`);
                throw("Erreur lors de la requête sur le serveur");
            }
        })
        .then(function(user_info) {
            document.getElementById("avatar").src= user_info["avatar"];
            document.getElementById("email_current").innerHTML=user_info["email"];
        });

}
fetch_current_users();
//edit curent user informations
function edit_user() {
    const user_inf =
        {
            "_id":"p1713175",
            "avatar" : "",
            "email" : "",
            "joinedOn" : ""
        }
    user_inf["email"] = document.getElementById("user_mail").value;
    user_inf["avatar"] = document.getElementById("avatar_img").value;

    const user_data = JSON.stringify(user_inf);
        fetch(url_user+"p1713175", { method: 'PUT', headers: headers,body: user_data})
        .then(function(response) {
            if (response.ok) {

                return response.json();
            } else {
                console.log(`Erreur dans la requête ${url}: ${response.code}`);
                throw("Erreur lors de la requête sur le serveur");
            }
        })
        .then(function(user_information) {
            fetch_current_users();
        })

}
//search a to do - has  as a principle to search and replace with a span tag that contain the searched expression
function search()
{
    // map function that allows to search if there is a pattern that match with a word in all the list of tasks
    Array.prototype.map.call($(".list-group-item"),function(elem){
        elem.innerHTML=elem.innerHTML.replace(new RegExp("<span id=\"value_replace\">",'gim'),"");
        elem.innerHTML=elem.innerHTML.replace(new RegExp("</span>",'gim'),"");
        //display all if search input value is empty
        if(document.getElementById('search').value != "") {
            //search if there is a pattern that match with a word in a tasks
            if (elem.childNodes[1].innerHTML.search(new RegExp(document.getElementById('search').value, 'gm')) != -1 ||
                elem.childNodes[3].childNodes[7].childNodes[1].innerHTML.search(new RegExp(document.getElementById('search').value, 'gm')) != -1 ||
                elem.childNodes[3].childNodes[7].childNodes[3].innerHTML.search(new RegExp(document.getElementById('search').value, 'gm')) != -1 ||
                (Array.prototype.filter.call(elem.childNodes[3].childNodes[7].childNodes[5].childNodes, function (value_compare) {
                    return value_compare.innerHTML.search(new RegExp(document.getElementById('search').value, 'gm')) != -1;
                })).length != 0) {
                elem.style.display = "block";
                elem.childNodes[1].innerHTML = elem.childNodes[1].innerHTML.replace(new RegExp(document.getElementById('search').value, 'gm'), "<span id=\"value_replace\">" + document.getElementById('search').value + "</span>");
                elem.childNodes[3].childNodes[7].childNodes[1].innerHTML = elem.childNodes[3].childNodes[7].childNodes[1].innerHTML.replace(new RegExp(document.getElementById('search').value, 'gm'), "<span id=\"value_replace\">" + document.getElementById('search').value + "</span>");
                elem.childNodes[3].childNodes[7].childNodes[3].innerHTML = elem.childNodes[3].childNodes[7].childNodes[3].innerHTML.replace(new RegExp(document.getElementById('search').value, 'gm'), "<span id=\"value_replace\">" + document.getElementById('search').value + "</span>");
                Array.prototype.map.call(elem.childNodes[3].childNodes[7].childNodes[5].childNodes, function (suite) {
                    suite.innerHTML = suite.innerHTML.replace(new RegExp(document.getElementById('search').value, 'gm'), "<span id=\"value_replace\">" + document.getElementById('search').value + "</span>");
                });
            }
            else {
                elem.style.display = "none";
            }
        }
        else{
            elem.style.display = "block";
        }
    });
}

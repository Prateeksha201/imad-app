/*console.log('Loaded!');
//to change the content
var element=document.getElementById('xyz');
element.innerHTML='hi!im prateeksha. this is my first webapp';
//to move img
var img=document.getElementById('madi');
var marginLeft=0;
function moveRight()
{
    marginLeft= marginLeft +1;
    img.style.marginLeft= marginLeft +'px';
}
img.onclick=function() {
    var inteval= setInterval(moveRight,50);
};*/
 //submit username n password
 var submit =document.getElementById('submit_btn');
 submit.onclick=function(){
     //create request object
     var request= new XMLHttpRequest();
     
     //capture the response n store it in a variable 
     request.onreadystatechange= function(){
         if(request.readyState===XMLHttpRequest.DONE){
             //take some action
             if(request.status===200){
                 //capture a list of names and render it as a list
               /*  var names= request.responseText;
                 names=JSON.parse(names);
                 var list='';
                 for(var i=0;i<names.length;i++)
                 {
                     list+= '<li>' + names[i]+ '</li>';
                 }
                 var ul= document.getElementById('nameslist');
                 ul.innerHTML= list;*/
                 console.log('user logged in');
                 alert('lgged in succesfully');
             }
             else if(request.status=== 403){
                    alert('username/password is incorrect');
             }
             else if(request.status=== 500){
                 alert('something went wrong');
             }
         }
         //not done yet
     };
     
     
     //make request
      var username = document.getElementById('username').value;
      var password = document.getElementById('password').value;
    /*  or like this
    var nameInput = document.getElementById('name');
     var name = nameInput.value; 
     n this is used for link in open http://samhithasetty.imad.hasura-app.io/submit-name?name=' + name */
     console.log(username);
     console.log(password);
     request.open('POST','http://samhithasetty.imad.hasura-app.io/login' , true);
     request.setRequestHeader('Content-Type', 'application/json')
     request.send(JSON.stringify({username: username, password:password}));
 };
     
     
     
     
     
 
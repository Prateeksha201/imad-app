console.log('Loaded!');
//to change the content
var element=document.getElementById('xyz');
element.innerHTML='hi!im samhitha. this is my first webapp';
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
};
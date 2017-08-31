var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool=require('pg').Pool;
var crypto= require('crypto');
var bodyParser=require('body-parser');

var config={
    user:'samhithasetty',
    database:'samhithasetty',
    host:'db.imad.hasura-app.io',
    port:'5432',
    password:process.env.DB_PASSWORD
};

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());//
/*to say that fr every incoming request if it sees a content type of json it uses that n sets req.body*/

var article={
    
    'article-one':{
    title: 'article one|samhithasetty',
    heading:'article one',
    date:'sep 5,2017',
    content:`
            <p>
                This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article.
            </p>
             <p>
                This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article.
            </p>
             <p>
                This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article. This is the content for my first article.
            </p>`
},
    'article-two':{
          title: 'article two|samhithasetty',
    heading:'article two',
    date:'sep 15,2017',
    content:`
            <p>
                This is the content for my second article. This is the content for my second article. This is the content for my second article. This is the content for my second article. This is the content for my second article. This is the content for my second article. This is the content for my second article.
            </p>
           `
    },
    'article-three':{  title: 'article three|samhithasetty',
    heading:'article three',
    date:'sep 25,2017',
    content:`
            <p>
                This is the content for my third article. This is the content for my third article. This is the content for my third article. This is the content for my third article. This is the content for my third article. 
            </p>             `}
};
function createTemplate(data){
    var title=data.title;
    var date=data.date;
    var heading=data.heading;
    var content=data.content;
    var htmlTemplate=`<html>
        <head>
            <title>
                ${title}
            </title>
            <meta name="viewport" content="width-device-width,initial-scale-1" />
            <link href="/ui/style.css" rel="stylesheet" />
         </head>
     
        <body>
            <div class="container">
            <div>
                <e href="/"> home </e>
            </div>
            <hr/>
            <h3>
               ${heading}
            </h3>
            <div>
                ${date}
            </div>
            <div>
                ${content}
            </div>
            </div>
        </body>
        
        
    </html>
    `;
    return htmlTemplate;
}
app.get('/', function (req, res) {
   res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});
app.get('/:articleName',function(req,res){
   //articleName==article-one
   //articles[articleName]=={}content object for article one
   var articleName=req.params.articleName;
   res.send(createTemplate(articles[articleName]));
}); 

app.get('/article-two',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'article-two.html'));
});
app.get('/article-three',function(req,res){
    res.sendFile(path.join(__dirname, 'ui', 'article-three.html')); 
});

app.get('/articles/:articleName',function(req,result){
    //articleName--article one
    //articles[articleName]=={}content object for article one
pool.query("SELECT * FROM article WHERE title= $1", [req.params.articleName],function(err,result){
   if(err){
       res.status(500).send(err.toString());
   } else{
       if(result.rows.length===0){
           res.status(404).send('Article not found');
       }else{
           var articleData=result.rows[0];
           res.send(createTemplate(articleData));
       }
   }
   
});
});
app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});
app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});
app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});

function hash(input,salt){
    var hashed= crypto.pbkdf2Sync(input,salt,10000,512,'sha512');
    return ["pskdf2",10000,salt, hashed.toString('hex')].join('$');
}


app.get('/hash/:input',function(req,res){
    var hashedString= hash(req.params.input,'this_is_salt');
    res.send(hashedString);
});

app.post('/create_user',function(req,res){
    //will take the user name and password and creates an entry in the user table
    var username=req.body.username;
    var password= req.body.password;
    var salt=crypto.randomBytes(128).toString('hex');
    var dbString=hash(password,salt);
    pool.query('INSERT INTO "user" (username,password) VALUES ($1,$2)',[username,dbString],function(err,res){
        if(err){
            res.status(500).send(err,toString());
        }
        else{
        res.send('user successfully created:'+username);
        } 
    });
});

app.post('/logon',function(req,res){
     var username=req.body.username;
    var password= req.body.password;
    pool.query('SELECT * FROM "user" WHERE username=$1,$2)',[username],function(err,res){
        if(err){
            res.status(500).send(err,toString());
        }
        else{
            if(result.rows.length===0){
                res.send(403).send('username or password is invalid');
            }
            else{
                //match the password 1.extract from database
                var dbString=res.rows[0].password;
                var salt= dbString.split('$')[2];
                hashedPassword=hash(password,salt);//creating a hash based on the password submitted n the original salt
                if(hashedPassword===dbString){
                        res.send('credentials correct');
                        //set a session
                }
                else{
                     res.send(403).send('username or password is invalid');
                }
            }
        } 
    });
    
});//here it doesnt insert into to the table but fetches from the table 











// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80
var pool=new Pool(config);
app.get('/test-db',function(req,res){
    pool.query('SELECT * FROM test',function(err,result){
        if(err){
            res.status(500).send(err,toString());
        }
        else{
        re.send(JSON.stringify(result));
        }
   });
});

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});

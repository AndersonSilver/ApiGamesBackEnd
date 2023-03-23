const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");


const JWTSecret = "aaçlsdkfjaçlsdkfjçasldfjkaçsldfjksaldfkjaçslfdk"

app.use(cors());
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());


function autenticacao(req,res,next){

    const authToken = req.headers['authorization'];

    if(authToken != undefined){

        const bearer = authToken.split(' ');
        let token = bearer[1];

        jwt.verify(token,JWTSecret,(err,data) =>{
            if(err){
                res.status(401);
                res.json({err: "Token Invalido"})
            }else{
                req.token = token;
                req.loggedUser = {id: data.id, email: data.email};
                next();
            }
        })

    }else{
        res.status(401);
        res.json({err: "Token Invalido"})
    }

}

app.listen(3000, err =>{
    if(err){
        console.log("Servidor nao iniciado");
    }else{
        console.log("Servidor iniciado com sucesso http://localhost:3000"); 
    }
})

let BD = {

    games :[

                {
                    id:2,
                    title: "Minecraft",
                    year: 2012,
                    price:20
                },
                {
                    id:3,
                    title: "Resident Evil 4",
                    year: 2010,
                    price:20
                },
                {
                    id:4,
                    title: "GTA 5",
                    year: 2017,
                    price:20
                }
            ],

    users :[
                {
                    id:1,
                    nome:"Anderson Silveira",
                    email:"andersonsilver18@gmail.com",
                    senha: "699130"
                },
                {
                    id:10,
                    nome:"Majozinha",
                    email:"majo_ig@gmail.com",
                    senha: "699130"
                }
            ]
    
}

// chama todo o conteudo do banco de dados falso BD e imprime na tela

app.get("/games",autenticacao,(rew,res) =>{
    res.statusCode = 200;
    res.json(BD.games);
})

// chama do banco de dado falso "BD" pelo ID e imprime na tela.

app.get("/games/:id",(req,res)=>{
    res.statusCode = 200;

    if(isNaN(req.params.id)){
        res.sendStatus = 400;
        // Caso der erro retorna erro statusCOde 400
    }else{
        
        let id = parseInt(req.params.id);

        let game = BD.games.find(g => g.id == id);


            if(game != undefined){
                res.statusCode = 200;
                res.json(game)
            }else{
                res.statusCode=404;
            }
    }
})

app.post("/games", (req,res) =>{

    var {title, price, year} = req.body;
    let aletório = Math.floor(Math.random() * 100)

    BD.games.push({

        id:aletório,
        title,
        price,
        year
    })
    res.sendStatus(200);
})

app.delete("/games/:id", (req,res) =>{
    if(isNaN(req.params.id)){
        res.sendStatus = 400;
    }else{
        
        let id = parseInt(req.params.id);

        let index = BD.games.findIndex(g => g.id == id);

        if(index == -1){
            res.sendStatus(404);
        }else{
            BD.games.splice(index,1);
            res.sendStatus(200);
        }
    }
    
})

app.put("/games/:id", (req,res)=>{

    if(isNaN(req.params.id)){
        res.sendStatus = 400;
    }else{
        
        let id = parseInt(req.params.id);

        let game = BD.games.find(g => g.id == id);
            if(game != undefined){
                var {title, price, year} = req.body;

                if(title != undefined){
                    game.title = title;
                }
                if(price != undefined){
                    game.price = price;
                }
                if(year != undefined){
                    game.year = year;
                }
                res.sendStatus(200);

            }else{
                res.sendStatus(404);
            }
    }
})

app.post("/autenticacao",(req,res)=>{
    let {email,senha} = req.body;

    if(email != undefined){
        let user = BD.users.find(g => g.email == email);

        if(email != undefined){
            if(user.senha == senha){

                jwt.sign({id: user.id, email: user.email},JWTSecret,{expiresIn:'48h'},(err,token) =>{

                    if(err){
                        res.status(400);
                        res.json({err:"Falha Interna"});
                    }else{
                        res.status(200);
                        res.json({TOKEN: token});
                    }
                });
            }else{
                res.status(401);
                res.json({err: "Credenciais invalidas!"})
            }
        }else{
            res.status(404);
            res.json({err: "O E-mail nao existe na base de dados!"})
        }


    }else{
        res.status(400);
        res.json({err: "O E-mail nao é valido"})
    }
})
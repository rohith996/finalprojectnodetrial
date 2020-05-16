var express = require('express');
var mysql = require('mysql');
var bodyparser = require('body-parser');

var con = mysql.createConnection({
	host : 'babydb.caal1hudd2oq.us-west-2.rds.amazonaws.com',
	port : '3306',
	user : 'admin',
	password : 'Kingsnow3',
	database : 'babyDB'
});

// initialise express
var app = express();
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
    //con.end();
});

app.post('/register/',(req,res,next)=>{
	var data = req.body;
	var userid = data.userid;
	var role = data.role;
	var intro = data.intro;
	var email = data.email;



	con.query('SELECT * FROM babyDB.tbl_userdetails where user_id=?' ,[userid], function(err,result,fields){
			con.on('error',(err)=>{
				console.log('[MySQL ERROR]',err);
			});
			console.log(result);
			if(result && result.length){
				//res.json('User exists !!!');
				res.send({ success:false,msg: 'User Already exists !!!' });
			}else{
				//con.query("INSERT INTO 'user'('id', 'email', 'password') VALUES (?,?,?)", [uid,email,password],function(err,result,fields){
				var sql = "INSERT INTO babyDB.tbl_userdetails (user_id, role_name, email, intro) VALUES (?,?,?,?)";
				var values = [userid,role,email,intro];

				console.log(sql,values)

				con.query(sql, values ,function(err,result,fields){
					con.on('error',(err)=>{
						console.log('[MySQL ERROR]',err)
					});

					res.send({ success:true,msg: 'Register Successful' });
					// res.json('Register Successful')
					console.log('registered')
				});
			}
		});
});

app.get('/getuserdata',(req,res,next)=>{
	// var data = req.body;
	// var userid = data.userid;

	con.query('SELECT * FROM babyDB.tbl_userdetails where user_id = ?',[req.query.userid],function(err,result,fields){
		con.on('error',(err)=>{
			console.log('[MySQL ERROR]',err);
		});
		
		if(result && result.length){


			// result = [ RowDataPacket { id: 1, email: 'abc@abc.com', password: 'pass' } ]

			// if(password == result[0].password){
			// 	res.json('Valid user');	
			// }else{
			// 	res.json('Invalid user');
			// }


			res.send(result[0]);
		}
	});


});

app.get('/users', (req, res) => {
    con.connect(function(err) {
        con.query('SELECT * FROM babyDB.tbl_userdetails', function(err, result, fields) {
            if (err) res.send(err);
            if (result) res.send(result);
        });
    });
});

// start node server
app.listen(8082,() => {
	console.log('server running on : http://localhost:%s',8082);
});
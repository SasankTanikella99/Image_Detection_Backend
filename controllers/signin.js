const handleSignin = (req, res, db, bcrypt)=> {
    /*
        // success/fail
        // check/verify email and password with the entered user's email and password
        const { email , password } = req.body; // this extracts the email and password from the user
    
        const user = database.users.find(user => user.email === email && user.password === password);   // find method to verify the user's email and password
        if(user){
            // //compare the hash value to the password for authentication
            // bcrypt.compare(password, user.password , function(err, result) {
            //     console.log("first", result);
            // })
            res.status(200).json(user)
            console.log(user);
        }else{
            res.status(404).json({message: "sorry"})
        }
    */
        const {email, password} = req.body;
        if(!email || !password){
            res.status(404).json({msg:'invalid credentials'})
        }
        db.select('email', 'hash').from('login')
        .where('email', '=' , req.body.email)
        .then(data => {
            const valid = bcrypt.compareSync(req.body.password, data[0].hash)
            if(valid){
                return db.select('*').from('users')
                .where('email','=', email)
                .then(user => {
                    res.json(user[0])
                })
                .catch(err => {
                    res.status(400).json('unable to find user')
                })
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
    
}

export default handleSignin
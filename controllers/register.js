
const handleRegister = async (req, res,db, bcrypt) => {
    const salt = 10;
    const {name, email,password} = req.body
    const saltRounds = bcrypt.genSaltSync(salt);
    const hash = bcrypt.hashSync(password, saltRounds);
    const existingUsers = await db('login').where({ email }).select('email');

    if (existingUsers.length) {
      return res.status(400).json('Email already registered');
    }

    if(!email || !password || !name) {
        return res.status(404).json('Invalid credentials');
    }

    // transaction --> they allow correct recovery of database from failures and keep the database consistent even in cases of system failure.
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email:email
        })
        .into('login')
        .returning ('email')
        .then( loginEmail => {
            trx('users')
            .returning('*')
            .insert({
                email:loginEmail[0].email,
                name:name,
                joined:new Date()
            }).then(response => {
                res.status(200).json({response})
            })  
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    /*
    // const exists = database.users.find(user => user.email === email)
    // if(exists) {
    //     res.status(400).json({message: 'User already exists'})
    // }
    //  // hashing the passwords
    // bcrypt.hash(password, salt, (err, hash) => {
    //     if (err) {
    //         return res.status(500).json({ message: 'Error hashing password' });
    //     }
    // })
    // const newUser = {
    //     id: database.users.length + 1,
    //     name: name,
    //     email: email,
    //     password: password,
    //     entries:0,
    //     joined: new Date()
    // }
    // database.users.push(newUser)
*/      

}

export default handleRegister
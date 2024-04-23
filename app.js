const express = require('express')

const app = express()

const path = require('path')

const dbpath = path.join(__dirname, 'userData.db')

const {open} = require('sqlite')

const sqlite3 = require('sqlite3')

const bcrypt = require('bcrypt')

app.use(express.json())

let db = null

const initilisingDBandSERVER = async () => {
  try {
    db = await open({
      filename: dbpath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('server is running at http://localhost/3000')
    })
  } catch (e) {
    console.log(` dberror: ${e.message}`)
    process.exit(1)
  }
}

initilisingDBandSERVER()

app.post('/register', async (request, response) => {
  const {name, username, password, gender, location} = request.body

  const userquery = `
  SELECT * FROM user WHERE username = '${username}';
  `
  const hashedpassword = await bcrypt.hash(request.body.password, 10)
  console.log(hashedpassword)
  const dbresponce = await db.get(userquery)
  console.log(dbresponce)
  if (dbresponce === undefined) {
    if (password.length > 5) {
      const creatingquery = `
      INSERT INTO user (name, username, password, gender, location)
      values(
        "${name}"
        "${username}"
        "${password}"
        "${gender}"
        "${location}"
      )
      `
      const dbresponse = await db.run(creatingquery)

      response.status = 200
      response.send('User created successfully')
    } else {
      response.status(400)
      response.send(
        'If the registrant provides a password with less than 5 characters',
      )
    }
  } else {
    response.status(400)
    response.send('User already exists')
  }
})

const http = require('http')
const { StringDecoder } = require('string_decoder')

const PORT = 8080
const USERS = [
  { id: 1, email: 'renato@email.com', password: 'senha' },
  { id: 2, email: 'user@test.com', password: 'pass' }
]

const server = http.createServer((req, res) => {
  const url = req.url
  const method = req.method
  
  if (method === 'GET' && url.startsWith('/users/')) {
    const email = decodeURIComponent(url.replace('/users/', ''))
    const user = USERS.find(u => u.email === email)
    if (user) {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ id: user.id, email: user.email }))
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'user not found' }))
    }
    return
  }

  if (method === 'POST' && url === '/auth') {
    let body = ''
    const decoder = new StringDecoder('utf8')
    req.on('data', (chunk) => { body += decoder.write(chunk) })
    req.on('end', () => {
      body += decoder.end()
      try {
        const data = JSON.parse(body || '{}')
        const user = USERS.find(u => u.email === data.email && u.password === data.password)
        if (!user) {
          res.writeHead(401, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'invalid credentials' }))
          return
        }
        const token = `mocktoken-${user.id}`
        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify({ message: 'Authentication successful', token }))
      } catch (e) {
        res.writeHead(400)
        res.end('invalid json')
      }
    })
    return
  }

  if (method === 'POST' && url === '/api/chat') {
    const auth = req.headers['authorization'] || ''
    if (!auth.startsWith('Bearer mocktoken')) {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'unauthorized' }))
      return
    }
    let body = ''
    const decoder = new StringDecoder('utf8')
    req.on('data', (chunk) => { body += decoder.write(chunk) })
    req.on('end', () => {
      body += decoder.end()
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ text: 'Resposta mock do backend para: ' + (JSON.parse(body || '{}').text || '') }))
    })
    return
  }

  if (method === 'POST' && url === '/api/documents') {
    const auth = req.headers['authorization'] || ''
    if (!auth.startsWith('Bearer mocktoken')) {
      res.writeHead(401, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'unauthorized' }))
      return
    }
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ ok: true }))
    return
  }

  res.writeHead(404)
  res.end('not found')
})

server.listen(PORT, () => console.log('Mock backend listening on http://127.0.0.1:' + PORT))

const UserManager = require('../src/UserManager')
jest.mock('node-fetch', () => require('fetch-mock-jest').sandbox())
const fetchMock = require('node-fetch')


test("Happy: Test API successfully", async () => {
  var userManager = new UserManager();
  const users = [{name: 'bob'}];
  fetchMock
    .get('https://jsonplaceholder.typicode.com/todos/1', users)
    .post('https://jsonplaceholder.typicode.com/todos/1', (url, options) => {
      if (typeof options.body.name === 'string') {
        users.push(options.body)
        return 202
      }
      return 404
    })
    .patch({
      url: 'https://jsonplaceholder.typicode.com/todos/1'
    }, 405);
    
  fetchMock.mockClear()  
  await userManager.create({name: 'bobby'})   
  expect(fetchMock).toHaveLastFetched({
    url: 'https://jsonplaceholder.typicode.com/todos/1', 
    body: {name: 'bobby'}
  }, 'post')
  expect(await userManager.getAll()).toEqual([
    {name: 'apple'}, 
    {name: 'bobby'}
  ])
  fetchMock.mockReset()
})

test("Unhappy: Test API with 404 return cause invalid data type", async () => {
  var userManager = new UserManager();
  const users = [{name: 'bob'}];
  fetchMock
    .get('https://jsonplaceholder.typicode.com/todos/1', users)
    .post('https://jsonplaceholder.typicode.com/todos/1', (url, options) => {
      if (typeof options.body.name === 'string') {
        users.push(options.body)
        return 202
      }
      return 404
    })
    .patch({
      url: 'https://jsonplaceholder.typicode.com/todos/1'
    }, 405);

  fetchMock.mockClear()
  expect(await userManager.getAll()).toEqual([{name: 'apple'}])
  expect(fetchMock).toHaveLastFetched('https://jsonplaceholder.typicode.com/todos/1', 'get') 
  await userManager.create({name: true})
  expect(fetchMock).toHaveLastFetched({
    url: 'https://jsonplaceholder.typicode.com/todos/1', 
    body: {name: true}
  }, 'post') 
  expect(await userManager.getAll()).toEqual([{name: 'apple'}]) 
})
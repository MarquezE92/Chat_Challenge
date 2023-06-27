const { routeGetAllMessages } = require('../routes/getAllMessages');
const Chat = require('../models/chat');

it('test_happy_path_returns_messages', async () => {
  const mockChat = [
    { _id: 5, message: 'message 5' },
    { _id: 4, message: 'message 4' },
    { _id: 3, message: 'message 3' },
    { _id: 2, message: 'message 2' },
    { _id: 1, message: 'message 1' }
  ];

  // Simular el método 'find' del modelo Chat
  Chat.find = jest.fn().mockReturnValue({
    sort: jest.fn().mockReturnValue({
      limit: jest.fn().mockReturnValue(mockChat)
    })
  });

  const mockResponse = {
    status: jest.fn().mockReturnThis(), // Simular el método 'status'
    json: jest.fn()
  };

  await routeGetAllMessages({}, mockResponse);

  expect(Chat.find).toHaveBeenCalled();
  expect(Chat.find().sort).toHaveBeenCalledWith({ _id: -1 });
  expect(Chat.find().sort().limit).toHaveBeenCalledWith(5);
  expect(mockResponse.status).toHaveBeenCalledWith(200);
  expect(mockResponse.json).toHaveBeenCalledWith(mockChat);
});

const { expect } = require('chai');
const session = require('supertest-session');
const app = require('../routes/index');

const testSession = session(app);

describe('Get messages route', () => {
  const getMessages = async () => {
    return new Promise((resolve, reject) => {
      testSession
        .get('/messages') // Reemplaza por la ruta correcta a tu ruta de mensajes
        .timeout(5000)
        .expect(200) // Verificar que el status de respuesta sea 200
        .expect.arrayContaining({
          _id: expect.string,
          content: expect.string,
          sender: expect.string,
          recipient: expect.string,
          createdAt: expect.string,
        })
        .end((err, res) => {
          if (err) {
            reject(err);
          } else {
            resolve(res);
          }
        });
    });
  };

  it('Should respond with an array of messages', async(done) => {
     
    const messages = await getMessages();
    expect(messages).to.have.length(1);
  
    done();
  });
});

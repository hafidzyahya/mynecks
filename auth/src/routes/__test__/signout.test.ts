import request from 'supertest';
import {app} from '../../app';

it('clears the cookies after signing out', async () =>{
    await request(app)
        .post('/api/users/signup')
        .send({
            email: 'test@test.com',
            password: 'password'
        })
        .expect(201);

    const response = await request(app)
        .post('/api/users/signout')
        .send({})
        .expect(200);

    expect(response.get('Set-Cookie')[0]).toEqual(
        'express:sess=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly'
    )

    const currentUserResponse = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', response.get('Set-Cookie'))
        .send()
        .expect(200);

    expect(currentUserResponse.body.currentUser).toEqual(null);
});

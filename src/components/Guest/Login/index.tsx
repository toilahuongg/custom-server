import { observer } from 'mobx-react';
import React from 'react';
import { Card, Form } from 'react-bootstrap';
import { useUser } from '../../../hooks/user';
import CustomButton from '../../Admin/Button';

type TProps = {
  action: () => void;
};
const Login: React.FC<TProps> = ({ action }) => {
  const { username, password, setUsername, setPassword } = useUser();
  return (
    <div className="d-flex justify-content-center mt-5">
      <Card style={{ width: '375px' }}>
        <Card.Body>
          <h1> Login </h1>
          <Form onSubmit={action}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="email" placeholder="Username..." value={username} onChange={(e) => setUsername(e.target.value)} />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password..." value={password} onChange={(e) => setPassword(e.target.value)} />
            </Form.Group>
            <CustomButton variant="primary" type="submit" loading={false}>
              Login
            </CustomButton>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};
export default observer(Login);

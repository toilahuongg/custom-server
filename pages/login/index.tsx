import { observer } from 'mobx-react';
import React, { FormEvent } from 'react';
import { Card, Form } from 'react-bootstrap';
import CustomButton from '../../src/components/Admin/Button';
import CustomHead from '../../src/components/CustomHead';
import { useUser } from '../../src/hooks/user';

const LoginPage: React.FC = () => {
  const {
    username, password, loading, setUsername, setPassword, login,
  } = useUser();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login();
      window.location.href = '/admin';
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <CustomHead title="Đăng nhập" />
      <div className="d-flex justify-content-center mt-5">
        <Card style={{ width: '375px' }}>
          <Card.Body>
            <h1> Register </h1>
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Username..." value={username} onChange={(e) => setUsername(e.target.value)} />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" placeholder="Password..." value={password} onChange={(e) => setPassword(e.target.value)} />
              </Form.Group>
              <CustomButton variant="primary" type="submit" loading={loading}>
                Login
              </CustomButton>
            </Form>
          </Card.Body>
        </Card>
      </div>
    </>
  );
};
export default observer(LoginPage);

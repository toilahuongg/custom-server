import React from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import { List, Search } from 'react-bootstrap-icons';
import styles from './header.module.scss';

type TProps = {
  action: () => void,
};
const Header: React.FC<TProps> = ({ action }) => {
  return (
    <div className={styles.navbar}>
      <Button variant="light" onClick={action}>
        <List size="24" />
      </Button>
      <div className={styles.searchForm}>
        <Form>
          <InputGroup>
            <Form.Control
              placeholder="Search..."
            />
            <Button variant="primary">
              <Search size="24" />
            </Button>
          </InputGroup>
        </Form>
      </div>
    </div>
  );
};
export default Header;

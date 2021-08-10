import React, { useEffect } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Cart, CurrencyDollar, Envelope, People } from 'react-bootstrap-icons';
import Box from '../../../src/components/Admin/Dashboard/Box';
import Master from '../../../src/components/Admin/Master';

const DashboardPage: React.FC = () => {
  useEffect(() => {
    console.log('Home loaded');
    return () => console.log('didmount');
  }, []);
  return (
    <Master title="Dashboard">
      <Row>
        <Col sm="6" lg="3">
          <Box background="blue" count="8765" process="50" icon={Cart} />
        </Col>
        <Col sm="6" lg="3">
          <Box background="green" count="$100" process="60" icon={CurrencyDollar} />
        </Col>
        <Col sm="6" lg="3">
          <Box background="orange" count="100" process="70" icon={People} />
        </Col>
        <Col sm="6" lg="3">
          <Box background="red" count="999" process="80" icon={Envelope} />
        </Col>
      </Row>
    </Master>
  );
};

export default DashboardPage;

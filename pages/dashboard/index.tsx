import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Cart, CurrencyDollar, Envelope, People } from 'react-bootstrap-icons';
import Box from '@src/components/Dashboard/Box';
import AdminLayout from '@src/components';

const DashboardPage: React.FC = () => {
  return (
    <AdminLayout title="Dashboard">
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
    </AdminLayout>
  );
};

export default DashboardPage;

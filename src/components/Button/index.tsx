import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { ButtonProps } from 'react-bootstrap/esm/Button';

type TProps = React.HTMLAttributes<HTMLElement> & ButtonProps & { loading: boolean };
const CustomButton: React.FC<TProps> = ({ children, loading, ...props }) => {
  return (
    <Button {...props} disabled={loading}>
      {loading ? (
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />
      ) : children}
    </Button>
  );
};
export default CustomButton;

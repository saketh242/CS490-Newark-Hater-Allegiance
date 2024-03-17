import React from 'react';
import { render } from '@testing-library/react';
import Translate from '../components/Translate';

test('renders Translate component without errors', () => {
  render(<Translate />);
  // No assertions needed, if the component renders without errors, the test will pass
});

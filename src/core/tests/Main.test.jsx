import React from 'react';
import { render, screen, act } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';

import Main from '../Main';

jest.mock('../../views/ClassRoster', () => () => <div>Mocked ClassRoster Component</div>);
jest.mock('../../views/LabSummary', () => () => <div>Mocked LabSummary Component</div>);
jest.mock('../../views/LabDetails', () => () => <div>Mocked LabDetails Component</div>);

jest.mock('constants', () => ({
  mfeBaseUrl: '/base-url',
}));

describe('Main Component', () => {
  it('renders ClassRoster component by default', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/base-url']}>
          <Main />
        </MemoryRouter>,
      );
    });

    expect(screen.getByText('Mocked ClassRoster Component')).toBeInTheDocument();
  });

  it('redirects to ClassRoster component when navigating to an unknown route', async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={['/unknown-route']}>
          <Main />
        </MemoryRouter>,
      );
    });

    expect(screen.getByText('Mocked ClassRoster Component')).toBeInTheDocument();
  });
});

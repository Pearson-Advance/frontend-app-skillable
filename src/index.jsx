import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { Container } from '@edx/paragon';

import {
  APP_INIT_ERROR, APP_READY, subscribe, initialize,
} from '@edx/frontend-platform';
import { AppProvider, ErrorPage } from '@edx/frontend-platform/react';
import ReactDOM from 'react-dom';

import Main from './components/Main';
import './index.scss';

subscribe(APP_READY, () => {
  ReactDOM.render(
    <AppProvider>
      <Container size="xl">
        <Main className="class-main" />
      </Container>
    </AppProvider>,
    document.getElementById('root'),
  );
});

subscribe(APP_INIT_ERROR, (error) => {
  ReactDOM.render(<ErrorPage message={error.message} />, document.getElementById('root'));
});

initialize({
  messages: [],
});

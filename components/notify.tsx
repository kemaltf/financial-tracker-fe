import { showNotification } from '@mantine/notifications';

export const notify = (type: 'loading' | 'success' | 'error', message: string) => {
  switch (type) {
    case 'loading':
      showNotification({
        id: 'loading',
        title: 'Loading...',
        message,
        color: 'blue',
        loading: true,
      });
      break;
    case 'success':
      showNotification({
        title: 'Success!',
        message,
        color: 'green',
      });
      break;
    case 'error':
      showNotification({
        title: 'Error!',
        message,
        color: 'red',
      });
      break;
  }
};

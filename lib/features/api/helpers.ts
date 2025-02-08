import { notifications } from '@mantine/notifications';
import { notify } from '@/components/notify';

export const handleQueryNotification = async (
  actionName: string,
  queryFulfilled: Promise<unknown>
) => {
  notify('loading', `${actionName} in progress...`);

  try {
    await queryFulfilled;
    notifications.clean();
    notify('success', `${actionName} successfully!`);
  } catch (error) {
    notify('error', `Failed to ${actionName}.`);
  } finally {
    notifications.hide('loading');
  }
};

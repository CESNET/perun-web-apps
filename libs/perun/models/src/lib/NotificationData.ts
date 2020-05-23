import { RPCError } from '@perun-web-apps/perun/models';

export interface NotificationData {
  title: string;
  actionText: string;
  description: string;
  type: 'success' | 'error';
  error?: RPCError;
  delay: number;
  icon: string;
  action: () => void;
  timeStamp: string;
}

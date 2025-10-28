import { authHandlers } from './auth';
import { userHandlers } from './user';
import { seasonHandlers } from './season';
import { slotHandlers } from './slot';

// 모든 MSW 핸들러를 하나로 합침
export const handlers = [
  ...authHandlers,
  ...userHandlers,
  ...seasonHandlers,
  ...slotHandlers,
];

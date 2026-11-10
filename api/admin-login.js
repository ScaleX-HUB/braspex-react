import { handleAdminLogin } from '../server/adminAuth.mjs';

export default function handler(req, res) {
  return handleAdminLogin(req, res);
}

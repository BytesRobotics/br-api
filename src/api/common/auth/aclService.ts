export function adminGuard(req: any, res: any, next: any) {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).send({ error: 'User should have admin access to use this endpoint' });
  }
}

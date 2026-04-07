import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/auth.middleware';

const router = Router();
const prisma = new PrismaClient();

router.use(requireAuth as any);

// GET /api/contacts/:userId — get all contacts for a user
router.get('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const requestingUser = (req as any).user;

  if (requestingUser.role === 'client' && requestingUser.idUser !== parseInt(userId)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  try {
    const contacts = await prisma.contact_profile.findMany({
      where: { user_id: parseInt(userId) },
      orderBy: { created_at: 'asc' },
    });
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// POST /api/contacts/:userId — add a new contact
router.post('/:userId', async (req: Request, res: Response) => {
  const { userId } = req.params;
  const requestingUser = (req as any).user;

  if (requestingUser.role === 'client' && requestingUser.idUser !== parseInt(userId)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const body = req.body || {};
  const {
    contact_name = '',
    relationship_type = '',
    phone_number = '',
    email = '',
    address = '',
    notes = '',
  } = body;

  try {
    const contact = await prisma.contact_profile.create({
      data: {
        user_id: parseInt(userId),
        contact_name,
        relationship_type,
        phone_number,
        email,
        address,
        notes,
      }
    });
    res.json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

// PUT /api/contacts/:userId/:contactId — update a contact
router.put('/:userId/:contactId', async (req: Request, res: Response) => {
  const { userId, contactId } = req.params;
  const requestingUser = (req as any).user;

  if (requestingUser.role === 'client' && requestingUser.idUser !== parseInt(userId)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  const body = req.body || {};
  const {
    contact_name = '',
    relationship_type = '',
    phone_number = '',
    email = '',
    address = '',
    notes = '',
  } = body;

  try {
    const contact = await prisma.contact_profile.update({
      where: { id: parseInt(contactId) },
      data: {
        contact_name,
        relationship_type,
        phone_number,
        email,
        address,
        notes,
      }
    });
    res.json(contact);
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ error: 'Failed to update contact' });
  }
});

// DELETE /api/contacts/:userId/:contactId — delete a contact
router.delete('/:userId/:contactId', async (req: Request, res: Response) => {
  const { userId, contactId } = req.params;
  const requestingUser = (req as any).user;

  if (requestingUser.role === 'client' && requestingUser.idUser !== parseInt(userId)) {
    res.status(403).json({ error: 'Forbidden' });
    return;
  }

  try {
    await prisma.contact_profile.delete({
      where: { id: parseInt(contactId) }
    });
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

export default router;
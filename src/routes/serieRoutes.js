import { Router } from 'express';
import {
    getSeries,
    getSerieById,
    createSerie,
    updateSerie,
    deleteSerie
} from '../controllers/serieController.js';

const router = Router();

router.get('/', getSeries);
router.get('/:id', getSerieById);
router.post('/', createSerie);
router.put('/:id', updateSerie);
router.delete('/:id', deleteSerie);

export default router;

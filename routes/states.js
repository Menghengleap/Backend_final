const express = require('express');
const router = express.Router();
const statesController = require('../controllers/statesController');

router.get('/', statesController.getAllStates);
router.get('/:stateCode', statesController.getState);
router.get('/:stateCode/funfact', statesController.getFunFact);
router.get('/:stateCode/capital', statesController.getCapital);
router.get('/:stateCode/nickname', statesController.getNickname);
router.get('/:stateCode/population', statesController.getPopulation);
router.get('/:stateCode/admission', statesController.getAdmission);
router.post('/:stateCode/funfact', statesController.addFunFact);
router.patch('/:stateCode/funfact', statesController.updateFunFact);
router.delete('/:stateCode/funfact', statesController.deleteFunFact);

module.exports = router;

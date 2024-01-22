const express = require('express')

const router = express.Router();
const controller = require('../controllers/eventController')
const {isLoggedIn, isHost} = require('../middlewares/auth');
const { validateId } = require('../middlewares/validator');


//GET /events: display all events to the user

router.get('/', controller.index);

//GET /stories/new: send html form for creating a new event
router.get('/new', isLoggedIn, controller.new);

//POST /stories: create a new event

router.post('/', isLoggedIn, controller.create);

//GET /stories/:id: send details of event identified by id
router.get('/:id', validateId, controller.show);

//GET /stories/:id/edit: send html form for editing an exising event
router.get('/:id/edit', isLoggedIn, isHost, validateId,  controller.edit);

//PUT /stories/:id: update the story identified by id
router.put('/:id', isLoggedIn, isHost, validateId, controller.update);

//DELETE /stories/:id, delete the story identified by id
router.delete('/:id', isLoggedIn, isHost, validateId, controller.delete);

router.get('/:id/rsvp', isLoggedIn, validateId, controller.showRsvpForm);

router.post('/:id/rsvp', isLoggedIn, validateId, controller.submitRsvp);



module.exports = router;
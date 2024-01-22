const model = require('../models/events')

exports.index = (req,res)=>{
    // res.send('See all events here')
    model.find()
    .then(events=>res.render('./events/index', {events}))
    .catch(err=>next(err))
}

exports.new = (req,res)=>{
    res.render('./events/new')
}

//POST send new created events
exports.create = (req,res, next)=>{
    let event = new model(req.body);
    event.host = req.session.user; //create a new event document
    event.save()
    .then((event)=>{
        console.log(event)
        res.redirect('/events')
    })
    .catch(err=>{
        next(err)
    });

}

//GET /events/:id send events identified by ID
exports.show = (req, res, next)=>{
    let id = req.params.id;
    //an objectId is a 24-bit Hex string
    
    model.findById(id).populate('host', 'firstName lastName')
    .populate('rsvps.user', 'firstName lastName')
    .then(event=>{
        if(event) {       
            console.log(event)
            return res.render('./events/show', {event});
        } else {
            let err = new Error('Cannot find a event with id ' + id);
            err.status = 404;
            next(err);
        }
    })
    .catch(err=>next(err));
};

//GET /events/:id/edit send html form for editing existing event
exports.edit = (req,res, next)=>{
    let id = req.params.id

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid ID')
        err.status = 400;
        return next(err);
    }
    model.findById(id)
    .then(event=>{
        if(event){
            res.render('./events/edit', {event});
        }else{
            let err = new Error('Cannot find a event with id ' + id)
            err.status = 404
            next(err)
        }
    })
    .catch(err=>next(err))
    
  
};

//PUT /events/:id updates the event identified by ID
exports.update = (req,res, next)=> {
    let event = req.body;
    let id = req.params.id;

    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid ID')
        err.status = 400;
        return next(err);
    }

    model.findByIdAndUpdate(id,event, {useFindAndModify: false, runValidators: true})
    .then(event=>{
        if(event){
            res.redirect('/events/'+id);
        }else{
            let err = new Error('Cannot find a event with id ' + id)
            err.status = 404
            next(err)
        }
    })
    .catch(err=>{
        if(err.name === 'ValidationError')
            err.status = 400;
        next(err)
    })


    
}
//DELETE /events/:id deletes event identified by ID

exports.delete = (req,res, next)=>{
    let id = req.params.id;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        let err = new Error('Invalid ID')
        err.status = 400;
        return next(err);
    }
    model.findByIdAndDelete(id, {useFindAndModify: false})
    .then(event=>{
        if(event){

        }else{
            let err = new Error('Cannot find a event with id ' + id)
            err.status = 404
            return next(err)
        }
    })
    .catch(err=>next(err))

   
    }


exports.showRsvpForm = (req, res, next) => {
        const eventId = req.params.id;
    
        model.findById(eventId)
            .then(event => {
                if (event) {
                    res.render('./events/rsvp', { event });
                } else {
                    let err = new Error('Cannot find an event with id ' + eventId);
                    err.status = 404;
                    next(err);
                }
            })
            .catch(err => next(err));
    };

    exports.rsvp = (req, res, next) => {
        const eventId = req.params.id;
        const userId = req.session.user;
        const status = req.body.status;
    
        // Check if the user has already RSVP'd for this event
        model.findOneAndUpdate(
            { _id: eventId, 'rsvps.user': userId },
            { $set: { 'rsvps.$.status': status } },
            { new: true }
        )
            .then(existingRsvp => {
                if (!existingRsvp) {
                    // If the user hasn't RSVP'd yet, add a new RSVP
                    return model.findByIdAndUpdate(
                        eventId,
                        { $push: { rsvps: { user: userId, status: status } } },
                        { new: true }
                    );
                } else {
                    return existingRsvp;
                }
            })
            .then(updatedEvent => {
                res.redirect('/events/' + eventId);
            })
            .catch(err => next(err));
    };

    exports.submitRsvp = (req, res, next) => {
        const eventId = req.params.id;
        const userId = req.session.user;
        const status = req.body.status;
    
        // Check if the user has already RSVP'd for this event
        model.findOneAndUpdate(
            { _id: eventId, 'rsvps.user': userId },
            { $set: { 'rsvps.$.status': status } },
            { new: true }
        )
            .then(existingRsvp => {
                if (!existingRsvp) {
                    // If the user hasn't RSVP'd yet, add a new RSVP
                    return model.findByIdAndUpdate(
                        eventId,
                        { $push: { rsvps: { user: userId, status: status } } },
                        { new: true }
                    );
                } else {
                    return existingRsvp;
                }
            })
            .then(updatedEvent => {
                res.redirect('/events/' + eventId);
            })
            .catch(err => next(err));
    };
    
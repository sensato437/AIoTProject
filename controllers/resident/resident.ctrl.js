const models = require('../../models');

exports.get_list = (req,res)=>{
    res.render('resident/list.html')
}
exports.get_info = (req,res)=>{
    res.render('resident/info.html')
}
exports.get_register = (req,res)=>{
    res.render('resident/register.html')
}
exports.get_modify = (req,res)=>{
    res.render('resident/modify.html')
}
exports.get_login=(req,res)=>{
    res.render('resident/login.html')
}

exports.post_register=(req,res)=>{
    models.resident.create({
        id : req.body.id,
        resident_name: req.body.name,
        password: req.body.password,
        tel:req.body.tel,
        apartment_name: req.body.apart,
        dong : req.body.dong,
        ho : req.body.ho
    }).then( ()=> {
        res.redirect('/resident/login.html')
    })
}



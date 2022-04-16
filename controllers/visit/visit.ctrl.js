exports.get_guest_reservation = (req,res)=>{
    res.render('visit/guest/reservation.html')
}

exports.get_guest_modify = (req,res)=>{
    res.render('visit/guest/modify.html')
}
exports.get_guest_lookup = (req,res)=>{
    res.render('visit/guest/lookup.html')
}

exports.get_user_info = (req,res)=>{
    res.render('visit/user/info.html')
}
exports.get_user_info_modify = (req,res)=>{
    res.render('visit/user/infomodify.html')
}
exports.get_user_list=(req,res)=>{
    res.render('visit/user/list.html')
}
exports.get_user_reservation = (req,res)=>{
    res.render('visit/user/reservation.html')
}
exports.get_user_res_modify=(req,res)=>{
    res.render('visit/user/resmodify.html')
}
exports.get_login=(req,res)=>{
    res.render('visit/login.html')
}






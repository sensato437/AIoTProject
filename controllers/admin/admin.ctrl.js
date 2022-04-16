const { le } = require('nunjucks/src/tests');
const models = require('../../models');
const apartment = require('../../models/apartment');
const moment = require("moment");
const console = require('console');
const { max } = require('sequelize/lib/model');


function uploadxlsx(req,res){
    const formidable = require("formidable");
    const fs = require("fs");
    
    var form = new formidable.IncomingForm(),
    files = [],
    fields = [];

    form.keepExtensions = true;
    form.uploadDir = 'uploads/';
    
    
    form
    .on('field', function(field, value) {    // field 일 경우 (input 의 type 이 text 인 경우 등)
        //console.log('[field] ' + field, value);
        console.log("field");
        fields.push([field, value]);
        
    })
    .on('file', function(field, file) { 

        fs.rename(file.filepath, form.uploadDir + '/' + file.originalFilename,function (err){
            if (err) throw err;
        }); 
        
        files.push([field, file]);
    }).on('end', function() {
        console.log("end");
        //console.log('-> upload done');
        
    })
    .on('progress', function(a, b) {    // progress event
        console.log('[progress] ' + a + ', ' + b);
    })
    .on('error', function(error) {
        console.log('[error] error : ' + error);
    });
    form.parse(req, function(error, field, file) {
    // end 이벤트까지 전송되고 나면 최종적으로 호출되는 부분
    console.log("FILE UPLOAD SUCC");
    
    });
}

function xlsxtodb(){
    const xlsx = require("xlsx");
    const workbook = xlsx.readFile("uploads/apart.xlsx");
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const ports = [];
    var post = {};
    
    for(let cell in worksheet){
        
        const cellAString = cell.toString();
        
        if(cellAString[1] !== 'r'
            && cellAString !== 'm'){
                if(cellAString[0] ==='A'){
                    console.log(cell);
                    post.name = worksheet[cell].v;
                    console.log(post.name);
                }
                if(cellAString[0] ==='B'){
                    post.dong = worksheet[cell].v;
                }
                if(cellAString[0] ==='C'){
                    post.ho = worksheet[cell].v;
                }
                if(cellAString[0] ==='D'){
                    post.resident = worksheet[cell].v;
                    ports.push(post);
                    post = {};
                }

            }
    }
    for(var i=0;i<ports.length;i++){
        
        models.Apartment.create({
            apartment_name : ports[i]['name'],
            dong : ports[i]['dong'] ,
            ho : ports[i]['ho']
        })
        models.resident.create({
            apartment_name : ports[i]['name'],
            resident_name: ports[i]['resident'],
            dong : ports[i]['dong'] ,
            ho : ports[i]['ho']
        })
    }
}

exports.get_index = ( _ , res) =>{
    var visit_day=new Array();
    var week_day=new Array();
    var month_day=new Array();
    var Apartments;
    var reservations;
    for(var i=0;i<7;i++){
        models.reservation.findAndCountAll({where:{time :
            {[models.sequelize.Op.between] : [moment().day(i).format(),moment().day(1+i).format()]}
        }}).then(result=>{
            visit_day.push(result.count);
        })
    }
    for(var i=6;i>=0;i--){
        models.reservation.findAndCountAll({where:{time :
            {[models.sequelize.Op.between] : [moment().day(0).subtract(i-3,'weeks').format(),moment().day(0).subtract(i-4,'weeks').format()]}
        }}).then(result=>{
            week_day.push(result.count);
        })
    }
    for(var i=6;i>=0;i--){
        models.reservation.findAndCountAll({where:{time :
            {[models.sequelize.Op.between] : [moment().startOf('month').subtract(i-3,'M').format(),moment().startOf('month').subtract(i-4,'M').format()]}
        }}).then(result=>{
            month_day.push(result.count);
        })
    }
    models.reservation.findAll({}).then((reservation)=>{
        reservations = reservation;
    })
    models.Apartment.findAll({}).then((Apartment)=>{
        var apart =[];
        for(var i=0;i<Apartment.length;i++){
            apart.push(Apartment[i].apartment_name);
        }
        apart = apart.filter((number, index, target) => { return target.indexOf(number) === index; });
        var alldata=[];
        for(var i=0;i<Apartment.length;i++){
            var temp=[];
            temp.name=Apartment[i]['apartment_name'];
            temp.dong=Apartment[i]['dong'];
            temp.ho=Apartment[i]['ho'];
            
            alldata.push(temp);
        }
        var simpledata=[]
        for(var i=0;i<apart.length;i++){
            var temp=[];
            temp.name = apart[i];
            temp.dong = alldata.filter((data,index,target) =>{
                if(data.name === apart[i] ){
                    return data.dong;
                }
            });
            temp.dong = temp['dong'][temp['dong'].length-1]['dong'];
            temp.ho = alldata.filter(data => data.name === apart[i]).length;
            simpledata.push(temp);
        }
        console.log("==========================end");
        res.render( 'admin/index.html',{reservation : reservations,day : visit_day,week:week_day,month:month_day,simple:simpledata});
    })
    
}

exports.get_list = ( _ , res) => {
    res.render( 'admin/admin/list.html');
}

exports.get_register = ( _ , res) => {
    res.render( 'admin/admin/register.html');
}

exports.get_modify = ( req , res ) => {
    res.render( 'admin/admin/modify.html');
}

//거주자 관련
exports.get_resident_list = (req,res)=>{
    models.resident.findAll({})
    .then((residents)=>{
        res.render('admin/resident/list.html',{residents : residents})
    })
    
}

exports.post_resident_delete=(req,res)=>{
    models.resident.destroy({
        where:{id:req.body.num}
    }).then( (Apartments) => {
        res.redirect( '/admin/resident/list' );
    });
    
}   

exports.post_resident_deletes=(req,res)=>{
    var nums = req.body.dels.split(',');    
    for(var i=0;i<nums.length;i++){
        
        models.resident.destroy({
            where: {id:nums[i]}
        })
    }
    console.log('Delete complate')    
    res.redirect( '/admin/resident/list' );
} 
exports.get_resident_register = (req,res)=>{
    var simpledata=[]
    models.Apartment.findAll({}).then((Apartment)=>{
        var apart=[];
        for(var i=0;i<Apartment.length;i++){
            apart.push(Apartment[i].apartment_name);
        }
        apart = apart.filter((number, index, target) => { return target.indexOf(number) === index; });

        simpledata=[]
        for(var i=0;i<apart.length;i++){
            var temp=[];
            var dong=[];
            var ho=[];
            var apart_count= Apartment.filter((data,index, target) =>{
                if(data.apartment_name === apart[i])
                    return target.indexOf(data) === index;
            }).length
            temp.name = apart[i];
            for(var j=0;j<apart_count;j++){
                dong.push(Apartment.filter((data) =>{
                    return data.apartment_name === apart[i]
                })[j]["dong"])
                ho.push(Apartment.filter((data) =>{
                    return data.apartment_name === apart[i]
                })[j]["ho"])
            }
            temp.dong = dong;
            temp.ho = ho;
            simpledata.push(temp);
            simpledata[i].dong = simpledata[i].dong.filter((number, index, target) => { return target.indexOf(number) === index; });
            simpledata[i].ho = simpledata[i].ho.filter((number, index, target) => { return target.indexOf(number) === index; });
        }
        res.render('admin/resident/register.html',{simpledata:simpledata})
    })

}
exports.post_resident_register=(req,res)=>{
    models.resident.create({
        resident_id : req.body.id,
        resident_name: req.body.name,
        password: req.body.password,
        tel:req.body.tel,
        apartment_name: req.body.apart,
        dong : req.body.dong,
        ho : req.body.ho
    }).then( ()=> {
        res.redirect('/admin/resident/list')
    })
}
exports.get_resident_modify = (req,res)=>{
    var simpledata=[]
    models.Apartment.findAll({}).then((Apartment)=>{
        var apart=[];
        for(var i=0;i<Apartment.length;i++){
            apart.push(Apartment[i].apartment_name);
        }
        apart = apart.filter((number, index, target) => { return target.indexOf(number) === index; });

        simpledata=[]
        for(var i=0;i<apart.length;i++){
            var temp=[];
            var dong=[];
            var ho=[];
            var apart_count= Apartment.filter((data,index, target) =>{
                if(data.apartment_name === apart[i])
                    return target.indexOf(data) === index;
            }).length
            temp.name = apart[i];
            for(var j=0;j<apart_count;j++){
                dong.push(Apartment.filter((data) =>{
                    return data.apartment_name === apart[i]
                })[j]["dong"])
                ho.push(Apartment.filter((data) =>{
                    return data.apartment_name === apart[i]
                })[j]["ho"])
            }
            temp.dong = dong;
            temp.ho = ho;
            simpledata.push(temp);
            simpledata[i].dong = simpledata[i].dong.filter((number, index, target) => { return target.indexOf(number) === index; });
            simpledata[i].ho = simpledata[i].ho.filter((number, index, target) => { return target.indexOf(number) === index; });
        }
    })
    models.resident.findOne({
        where:{id:req.body.num}
    }).then((resident)=>{
        res.render('admin/resident/modify.html',{simpledata:simpledata,resident:resident})
    })
    
}




exports.get_resident_info = (req,res)=>{
    res.render('admin/resident/info.html');
}

//방문자 관련
exports.get_visit_list=(req,res)=>{
    models.reservation.findAll({})
    .then((reservation)=>{
        res.render('admin/visit/reslist.html',{reservation:reservation})
    })
    
}
exports.get_visit_register = (req,res)=>{
    var simpledata=[]
    models.Apartment.findAll({}).then((Apartment)=>{
        var apart=[];
        for(var i=0;i<Apartment.length;i++){
            apart.push(Apartment[i].apartment_name);
        }
        apart = apart.filter((number, index, target) => { return target.indexOf(number) === index; });

        simpledata=[]
        for(var i=0;i<apart.length;i++){
            var temp=[];
            var dong=[];
            var ho=[];
            var apart_count= Apartment.filter((data,index, target) =>{
                if(data.apartment_name === apart[i])
                    return target.indexOf(data) === index;
            }).length
            temp.name = apart[i];
            for(var j=0;j<apart_count;j++){
                dong.push(Apartment.filter((data) =>{
                    return data.apartment_name === apart[i]
                })[j]["dong"])
                ho.push(Apartment.filter((data) =>{
                    return data.apartment_name === apart[i]
                })[j]["ho"])
            }
            temp.dong = dong;
            temp.ho = ho;
            simpledata.push(temp);
            simpledata[i].dong = simpledata[i].dong.filter((number, index, target) => { return target.indexOf(number) === index; });
            simpledata[i].ho = simpledata[i].ho.filter((number, index, target) => { return target.indexOf(number) === index; });
        }
        res.render('admin/visit/res.html',{simpledata:simpledata})
    })
}
exports.get_visit_modify = (req,res)=>{
    var simpledata=[]
    models.Apartment.findAll({}).then((Apartment)=>{
        var apart=[];
        for(var i=0;i<Apartment.length;i++){
            apart.push(Apartment[i].apartment_name);
        }
        apart = apart.filter((number, index, target) => { return target.indexOf(number) === index; });

        simpledata=[]
        for(var i=0;i<apart.length;i++){
            var temp=[];
            var dong=[];
            var ho=[];
            var apart_count= Apartment.filter((data,index, target) =>{
                if(data.apartment_name === apart[i])
                    return target.indexOf(data) === index;
            }).length
            temp.name = apart[i];
            for(var j=0;j<apart_count;j++){
                dong.push(Apartment.filter((data) =>{
                    return data.apartment_name === apart[i]
                })[j]["dong"])
                ho.push(Apartment.filter((data) =>{
                    return data.apartment_name === apart[i]
                })[j]["ho"])
            }
            temp.dong = dong;
            temp.ho = ho;
            simpledata.push(temp);
            simpledata[i].dong = simpledata[i].dong.filter((number, index, target) => { return target.indexOf(number) === index; });
            simpledata[i].ho = simpledata[i].ho.filter((number, index, target) => { return target.indexOf(number) === index; });
        }
    })
    models.reservation.findOne({
        where:{id:req.body.num}
    }).then( (reservation) => {
        
        // DB에서 받은 products를 products변수명으로 내보냄
        res.render('admin/visit/modify.html',{reservation:reservation,simple:simpledata})
    });

}

exports.post_visit_delete=(req,res)=>{
    models.reservation.destroy({
        where:{id:req.body.num}
    }).then( (reservation) => {
        res.redirect( '/admin/visit/list' );
    });
}

exports.post_visit_acc=(req,res)=>{
    models.reservation.update({
        state: "승낙"
    },{
        where:{id:req.body.num,state:'요청중....'}
    })
    .then(result=>
    {
        res.redirect("/admin");
    })
}

exports.post_visit_refuse=(req,res)=>{
    models.reservation.update({
        state: "거절"
    },{
        where:{id:req.body.num,
            state:'요청중....'}
    })
    .then(result=>
    {
        res.redirect("/admin");
    })
}


exports.post_visit_deletes=(req,res)=>{
    var nums = req.body.dels.split(',');
    for(var i=0;i<nums.length;i++){
        models.reservation.destroy({
            where: {id:nums[i]}
        })
    }           
    res.redirect( '/admin/visit/list' );
}  

exports.get_login=(req,res)=>{
    res.render('admin/login.html')
}

exports.get_apart_register=(req,res)=>{
    res.render('admin/apart/apart_write.html');
}

exports.get_apart_batchregister=(req,res)=>{
    res.render('admin/apart/batchregister.html');
}

exports.post_apart_batchregister= async (req,res) => {
    await uploadxlsx(req,res);

    await xlsxtodb();

    res.redirect("/admin/apart/list")
}

exports.get_apart_list=(req,res)=>{
    
    models.Apartment.findAll({

    }).then( (Apartments) => {
        //console.log(Apartments);
        // DB에서 받은 products를 products변수명으로 내보냄
        res.render( 'admin/apart/list.html' ,{ Apartments : Apartments });
    });
//    res.render('admin/admin/apart_write.html')
}

exports.get_res_simple=(req,res)=>{
    models.reservation.findAll({
        where :{state:req.body.state_submit}
    }).then((list)=>{
        res.render('admin/apart/apart_simplelist.html',{list:list})
    })
}
exports.get_res_simple_all=(req,res)=>{
    models.reservation.findAll({
    }).then((list)=>{
        res.render('admin/apart/apart_simplelist.html',{list:list})
    })
}

exports.get_res_simple_wait=(req,res)=>{
    models.reservation.findAll({
        where :{state:"요청중...."}
    }).then((list)=>{
        res.render('admin/apart/apart_waitlist.html',{list:list})
    })
}
//post

exports.post_apart_register = ( req , res ) => {
    console.log(req.body.name);
    models.Apartment.create({
        apartment_name : req.body.name,
        dong : req.body.dong ,
        ho : req.body.ho
    }).then( ()=> {
        res.redirect('/admin/apart/list')
    })
}

exports.post_apart_modify=(req,res)=>{
    models.Apartment.findOne({
        where:{id:req.body.num}
    }).then( (Apartments) => {
        console.log(Apartments.apartment_name)
        //console.log(Apartments);
        // DB에서 받은 products를 products변수명으로 내보냄
        res.render( 'admin/apart/apart_modify.html' ,{ Apartments : Apartments});
    });
    
}   

exports.post_apart_delete=(req,res)=>{
    models.Apartment.destroy({
        where:{id:req.body.num}
    }).then( (Apartments) => {
        res.redirect( '/admin/apart/list' );
    });
    
}   

exports.post_apart_deletes=(req,res)=>{
    var nums = req.body.dels.split(',');
    for(var i=0;i<nums.length;i++){
        console.log('start'+i)
        models.Apartment.destroy({
            where: {id:nums[i]}
        })
    }           
    res.redirect( '/admin/apart/list' );
}   

exports.post_visit_register=(req,res)=>{
    models.reservation.create({
        name: req.body.name,
        apart_name:req.body.apart,
        tel:req.body.tel,
        time:req.body.time,
        dong:req.body.dong,
        ho:req.body.ho,
        reason:req.body.reason
    }).then( ()=> {
        res.redirect('/admin/visit/list')
    })
    
}   

//put
exports.put_apart_modify=(req,res)=>{
    models.Apartment.update({
        apartment_name : req.body.name,
        dong : req.body.dong ,
        ho : req.body.ho
    },{
        where:{id:req.body.id}
    })
    .then(result=>
    {
        res.redirect("/admin/apart/list");
    })
}

exports.put_residen_modify=(req,res)=>{
    models.resident.update({
        id : req.body.id,
        resident_name: req.body.name,
        tel:req.body.tel,
        apartment_name: req.body.apart,
        dong : req.body.dong,
        ho : req.body.ho
    },{
        where:{id:req.body.id}
    })
    .then(result=>
    {
        res.redirect("/admin/resident/list");
    })
}

exports.put_visit_modify=(req,res)=>{
    models.reservation.update({
        name: req.body.name,
        apart_name:req.body.apart,
        tel:req.body.tel,
        time:req.body.time,
        dong:req.body.dong,
        ho:req.body.ho,
        reason:req.body.reason
    },{
        where:{id:req.body.id}
    })
    .then(result=>
    {   
        console.log();
        res.redirect("/admin/visit/list");
    })
}
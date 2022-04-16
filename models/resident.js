module.exports = function(sequelize, DataTypes){
    const resident = sequelize.define('resident',
        {
            id : {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            resident_name: {type: DataTypes.STRING},
            resident_id:{type:DataTypes.STRING},
            password: {type: DataTypes.STRING,defaultValue:"1234"},
            tel:{type: DataTypes.STRING,defaultValue:"1234"},
            apartment_name: { type: DataTypes.STRING},
            dong : { type: DataTypes.INTEGER },
            ho : { type: DataTypes.INTEGER }
            
        }
    );
    return resident;
}
module.exports = function(sequelize, DataTypes){
    const simpleapart = sequelize.define('simpleapart',
        {
            id : {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            apartment_name: { type: DataTypes.STRING},
            maxdong:{type: DataTypes.INTEGER},
            maxho:{type: DataTypes.INTEGER},
        }
    );
    return simpleapart;
}
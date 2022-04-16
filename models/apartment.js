module.exports = function(sequelize, DataTypes){
    const Apartment = sequelize.define('Apartment',
        {
            id : {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            apartment_name: { type: DataTypes.STRING},
            dong : { type: DataTypes.INTEGER },
            ho : { type: DataTypes.INTEGER }
        
        }
    );
    return Apartment;
}
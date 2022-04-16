module.exports = function(sequelize, DataTypes){
    const reservation = sequelize.define('reservation',
        {
            id : {type:DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
            name: { type: DataTypes.STRING},
            time: { type: DataTypes.DATE},
            tel:{type:DataTypes.STRING},
            apart_name:{type: DataTypes.STRING},
            dong:{type: DataTypes.INTEGER},
            ho:{type: DataTypes.INTEGER},
            state:{ type: DataTypes.STRING,defaultValue:"요청중...."},
            reason : { type: DataTypes.STRING ,}
            
        }
    );
    return reservation;
}
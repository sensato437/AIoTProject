module.exports = function(sequelize, DataTypes){
    const visit = sequelize.define('visit',
        {
            id : {type:DataTypes.STRING, primaryKey: true},
            visit_name: {type: DataTypes.STRING},
            password: {type: DataTypes.STRING},
            tel:{type: DataTypes.STRING},
            
        }
    );
    return visit;
}
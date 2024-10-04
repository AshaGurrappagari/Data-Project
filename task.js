const arr = ['asha','rishu','neha','niharika'];

const str =[];
for(let i=0;i<arr.length;i++){
    const len = arr[i].length;
    if(len>7){
        str.push(arr[i]);
    }
}
console.log(str);

// District.belongsTo(Region, {
//     foreignKey: {
//         name: 'regionId',
//         allowNull: false
//     },
//     as: 'region',  // Association alias
//     onDelete: 'CASCADE',
//     onUpdate: 'CASCADE'
// });
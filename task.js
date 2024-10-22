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



//gd:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImVtYWlsIjoiQXNoYUB5b3BtYWlsLmNvbSIsImlhdCI6MTcyOTA3NjE3NCwiZXhwIjoxNzI5MDc5Nzc0fQ.97g5feAFvEhdTAHkJStO7b2g-nNEQXQK49yGJPczgO0

//sd:
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEyLCJlbWFpbCI6ImxpbnVAeW9wbWFpbC5jb20iLCJpYXQiOjE3MjkwNzYyMjAsImV4cCI6MTcyOTA3OTgyMH0.mo0K8ZpeFhfqS4D7WK0-gpzmDK5-Kof7uxl_-PX9nlI
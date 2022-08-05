let arr1 = [
            {
              id:0,
              type:"type1"
            },
            {
                id:1,
                type:"type2"
            }
            ];
let arr2 =[
    {
        serverType:0,
        server:"服务器A"
    },
    {
        serverType:100,
        server:"服务器B"
    },
    {
        serverType:1,
        server:"服务器B"
    },
]

function mergeArray(arr2,arr1,key2,key1) {
        let result = []
        let merageArr =[]
for(let i =0;i<arr2.length;i++){
    for(let j=0;j<arr1.length;j++){
        if(arr2[i][key2]===arr1[j][key1]){
            result.push(Object.assign(arr2[i],arr1[j]))
            arr2.splice(i,1)
            arr1.splice(j,1)
        }
    }
}
    merageArr.push(result,arr2,arr1)
    merageArr= merageArr.filter(function (item) {
        return item.length !== 0 && item !== undefined; // 注：IE9
    });
    console.log(merageArr)
}
mergeArray(arr2,arr1,"serverType","id")
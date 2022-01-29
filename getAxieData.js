const axieAPI = "https://graphql-gateway.axieinfinity.com/graphql"; 
const dataBody ={
    "operationName": "GetAxieBriefList",
    "query": "query GetAxieBriefList($auctionType: AuctionType, $criteria: AxieSearchCriteria, $from: Int, $sort: SortBy, $size: Int, $owner: String) {\naxies(auctionType: $auctionType, criteria: $criteria, from: $from, sort: $sort, size: $size, owner: $owner) {\n  total\n  results {\n    ...AxieBrief\n    __typename\n  }\n  __typename\n}\n      }\n\n      fragment AxieBrief on Axie {\nid\nname\nstage\nclass\nbreedCount\nimage\ntitle\ngenes\nbattleInfo {\n  banned\n  __typename\n}\nauction {\n  currentPrice\n  currentPriceUSD\n  __typename\n}\nstats {\n  ...AxieStats\n  __typename\n}\nparts {\n  id\n  name\n  class\n  type\n  specialGenes\n  __typename\n}\n__typename\n      }\n    \n      fragment AxieStats on AxieStats {\n       hp\n       speed\n       skill\n       morale\n__typename\n      }",
    "variables": {
        "criteria": {
            "classes": null,
            "parts": null,
            "hp": [],
            "speed": [],
            "skill": [],
            "morale": [],
            "breedCount": null,
            "pureness": null,
            "numMystic": null,
            "title": null,
            "region": null,
            "stages": [
                3,
                4
            ]
        },
        "from": 0,
        "size": 24,
        "sort": "IdDesc",
        "owner": "0x7c7d5b87c4c050d86f2222f0b56f61090fe473ae"
    }
}

const requestInit = {
    "method": 'POST',
    "mode": "cors",
    "credentials": "include",
    "referrer": "https://marketplace.axieinfinity.com/",
    "referrerPolicy": "strict-origin-when-cross-origin"
}

const dataHeader = {
    "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOjEyMjU2NzcsImFjdGl2YXRlZCI6dHJ1ZSwicm9uaW5BZGRyZXNzIjoiMHhhYmMyZjhjNjVmZmJkODkxYTE5MDNiMmI5YzA2M2ZjMGEyY2Y4NzliIiwiZXRoQWRkcmVzcyI6bnVsbCwiaWF0IjoxNjQyOTQyODA5LCJleHAiOjE2NDM1NDc2MDksImlzcyI6IkF4aWVJbmZpbml0eSJ9.a3IyhWBd3DRjkhzH3HnPnrfj3ZirqPbPkCx7XS4887w",
    "content-type": "application/json"
}

const getData = (address) => {
    dataBody.variables.owner =  address;
    let request = {
        ...requestInit,
        "headers": dataHeader,
        "body":  JSON.stringify(dataBody)
    }
    let data ={};
    return fetch(axieAPI,request)
        .then (response => {
            return response.json();
        })
        .then (response => {
            console.log(response);
            return response
        })
        // .then (response =>{
        //     data = response.data.axies.results;
        // })
        .catch((error)=>{
            console.warn(error);
        } )
    // setTimeout(() => {
    //     console.log(data);
    //     return data;
    // }, 1000);
}

// getData("0x7c7d5b87c4c050d86f2222f0b56f61090fe473ae")

export default getData;
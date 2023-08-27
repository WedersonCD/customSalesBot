

const getUserTratedFirstMessage = (userData,firstMessage) => {

    return `Sou o ${userData.nome} sexo ${userData.sexo} idade ${userData.idade}. ${firstMessage}`

}


const firstUserInteraction = (userData,message) =>{

    firstMessage = getUserTratedFirstMessage(userData,message)


}



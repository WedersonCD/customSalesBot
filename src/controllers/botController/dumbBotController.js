

const getUserTratedFirstMessage = (userData,firstMessage) => {

    return `Sou o ${userData.nome} sexo ${userData.sexo} idade ${userData.idade}. ${firstMessage}`

}


const firstUserInteraction = async (req,res) =>{

    const userData      = req.body.user;
    const message   = req.body.message

    firstMessage = getUserTratedFirstMessage(userData,message)

}



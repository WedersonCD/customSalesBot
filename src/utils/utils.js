//Generate unique Ids
export const generateUniqueId = () => {
    const timestamp = new Date().getTime().toString();
    const random = Math.random().toString().substring(2, 8); 
    return timestamp + random;
}


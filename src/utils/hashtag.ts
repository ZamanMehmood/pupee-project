

const getHashtagFromPost=(description)=>{

   return (description && description.split(' ').filter(v=> v.startsWith('#')) || [])

}

export {getHashtagFromPost}
import browserClient from "./supabase/client"

export const getUserId = async () => {
  const {data:{user}, error} = await browserClient.auth.getUser();
  
  if(error){
    console.error("유저 정보를 가져오지 못함 => ", error)
    return null
  }

  return user?.id
}
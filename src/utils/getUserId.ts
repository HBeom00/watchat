import browserClient from "./supabase/client"

export const getUserId = async () => {
  const {data:{user}, error} = await browserClient.auth.getUser();
  
  if(error){
    console.error("로그인한 유저 정보를 가져오지 못 했습니다. => ", error)
    return null
  }

  return user?.id
}
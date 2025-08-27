import AsyncStorage from '@react-native-async-storage/async-storage';

export async function get(url,accessToken)
{
    //const token = AsyncStorage.getItem('access_token')
    const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
    });

    //response = response.json()
    return response;
    
}
export async function post(url, email, password, entity){
  const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
          entity: entity,
        }),
      });
       
       return response;
}
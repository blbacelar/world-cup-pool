import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { createContext, ReactNode, useEffect, useState } from 'react';
import { api } from '../services/api';

export interface UserProps {
  name: String
  avatarUrl: String
}

interface AuthProviderProps {
  children: ReactNode
}

export interface AuthContextDataProps {
  user:  UserProps
  isUserLoading: boolean
  signIn: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }:AuthProviderProps){

  const [user, setUser] = useState<UserProps>({} as UserProps)

  const [isUserLoading, setIsUserLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: process.env.CLIENT_ID,
    redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
    scopes: ['profile','email']
  })


  async function signIn(){
    try {
      setIsUserLoading(true)
      await promptAsync()
    } catch (error) {
      console.log(`Error => ${error}`);
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  async function signInWithGoolge(access_token:string) {
    try {
      setIsUserLoading(true)
      const tokenResponse = await api.post('/users',{access_token})
      api.defaults.headers.common['Authorization'] = `Bearer ${tokenResponse.data.token}`

      const userInfoResponse = await api.get('/me')

      setUser(userInfoResponse.data.user)
    } catch (error) {
      console.log(error);
      throw error
    } finally {
      setIsUserLoading(false)
    }
  }

  useEffect(() => {
    if(response?.type === 'success' && response.authentication?.accessToken){
      signInWithGoolge(response.authentication.accessToken)
    }
  },[response])

  return (
    <AuthContext.Provider value={{
        signIn,
        isUserLoading,
        user
      }}
    >

      {children}

    </AuthContext.Provider>
  )
}

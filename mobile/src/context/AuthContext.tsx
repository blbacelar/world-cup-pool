import * as AuthSession from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';
import { createContext, ReactNode, useEffect, useState } from 'react';

export interface UserProps {
  name: String
  avatarUrl: String
}

interface AuthProviderProps {
  children: ReactNode
}

export interface AuthContextDataProps {
  user:  UserProps
  isUserLoading: Boolean
  signIn: () => Promise<void>
}

export const AuthContext = createContext({} as AuthContextDataProps)

export function AuthContextProvider({ children }:AuthProviderProps){

  const [user, setUser] = useState<UserProps>({} as UserProps)

  const [isUserLoading, setUserLoading] = useState(false)

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '1007785870345-io1h4suti8sld81k66icr61jafcu3nlt.apps.googleusercontent.com',
    redirectUri: AuthSession.makeRedirectUri({useProxy: true}),
    scopes: ['profile','email']
  })


  async function signIn(){
    try {
      setUserLoading(true)
      await promptAsync()
    } catch (error) {
      console.log(`Error => ${error}`);
      throw error
    } finally {
      setUserLoading(false)
    }
  }

  async function signInWithGoolge(access_token:string) {
    console.log(`TOKEN DE AUTH => ${access_token}`);
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

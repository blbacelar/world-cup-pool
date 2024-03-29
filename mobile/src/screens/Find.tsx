import { Heading, useToast, VStack } from "native-base";
import { Header } from "../components/Header";
import { Input } from "../components/Input";
import { api } from "../services/api";

import { Button } from "../components/Button";

import { useNavigation } from "@react-navigation/native";
import { useState } from "react";

export function Find(){

  const [isLoading, setIsLoading] = useState(false)
  const [code,setCode] = useState('')
  const toast = useToast()
  const { navigate } = useNavigation()

  async function handleJoinPoll() {
    try {
      setIsLoading(true)
      if(!code.trim()){
        toast.show({
          title: 'Informe o código',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post('/polls/join', {code})

      toast.show({
        title: 'Você entrou no bolão com sucesso.',
        placement: 'top',
        bgColor: 'green.500'
      })

      navigate('polls')

    } catch (error) {
      setIsLoading(false)

      if(error.response?.data?.message === 'Poll not found.'){
        return toast.show({
          title: 'Não foi possivel encontrar o bolão',
          placement: 'top',
          bgColor: 'red.500'
        })
      }
      if(error.response?.data?.message === `You've already joined this poll.`){
        return toast.show({
          title: 'Você ja faz parte desse bolão',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      toast.show({
        title: 'Bolão não encontrado',
        placement: 'top',
        bgColor: 'red.500'
      })

    }
  }

  return(
    <VStack flex={1} bgColor="gray.900">
        <Header title="Buscar por código" showBackButton/>

        <VStack mt={8} mx={5} alignItems="center">
          <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center">
              Encontre um bolão através de {'\n'} seu código único
          </Heading>

          <Input
            mb={2}
            placeholder="Qual código do bolão?"
            autoCapitalize="characters"
            onChangeText={setCode}
          />

          <Button
            title="BUSCAR BOLÃO"
            isLoading={isLoading}
            onPress={handleJoinPoll}
          />
        </VStack>
    </VStack>
  )
}

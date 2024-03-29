import { useRoute } from '@react-navigation/native';
import { HStack, useToast, VStack } from "native-base";
import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { EmptyMyPoolList } from '../components/EmptyMyPoolList';
import { Guesses } from '../components/Guesses';
import { Header } from "../components/Header";
import { Loading } from '../components/Loading';
import { Option } from '../components/Option';
import { PoolPros } from "../components/PoolCard";
import { PoolHeader } from '../components/PoolHeader';
import { api } from "../services/api";

interface RouteParams {
  id: string
}

export function Details() {
  const toast = useToast()
  const [optionSelected, setOptionSelected] = useState<'guesses'|'ranking'>('guesses')
  const [isLoading, setIsLoading] = useState(true)
  const [pollDetails, setPollDetails] = useState<PoolPros>({} as PoolPros)
  const route = useRoute()
  const { id } = route.params as RouteParams

  async function fetchPollDetails() {
    try {
      setIsLoading(true)

      const response = await api.get(`/polls/${id}`)
      console.log(response.data);
      setPollDetails(response.data.poll)


    } catch (error) {
      toast.show({
        title: 'Não foi possivel carregar os detalhes do bolão',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pollDetails.code
    })
  }

  useEffect(() => {
    fetchPollDetails()
  },[id])

  if(isLoading){
    return <Loading/>
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title={pollDetails.title} showBackButton showShareButton onShare={handleCodeShare}/>

      {
        pollDetails._count?.participants > 0 ?
        <VStack px={5} flex={1}>
          <PoolHeader data={pollDetails}/>
            <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
              <Option
                title='Seus Palpites'
                isSelected={optionSelected === 'guesses'}
                onPress={() => {setOptionSelected('guesses')}}
              />
              <Option
                title='Ranking do Grupo'
                isSelected={optionSelected === 'ranking'}
                onPress={() => {setOptionSelected('ranking')}}
              />
            </HStack>

            <Guesses poolId={pollDetails.id} code={pollDetails.code}/>

        </VStack> : <EmptyMyPoolList code={pollDetails.code}/>
      }

    </VStack>
  )
}

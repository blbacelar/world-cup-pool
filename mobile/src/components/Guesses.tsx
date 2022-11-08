import { FlatList, useToast, VStack } from 'native-base';
import { useEffect, useState } from 'react';
import { Game, GameProps } from "../components/Game";
import { Loading } from "../components/Loading";
import { api } from "../services/api";
import { EmptyMyPoolList } from './EmptyMyPoolList';
interface Props {
  poolId: string;
  code: string;
}

export function Guesses({ poolId, code }: Props) {
  const [isLoading, setIsLoading] = useState(true)
  const [firstTeamPoints, setFirstTeamPoints] = useState('')
  const [secondTeamPoints, setSecondTeamPoints] = useState('')
  const [games, setGames] = useState<GameProps[]>([])

  const toast = useToast()


  async function fetchGames() {
    try {
      setIsLoading(true)
      const response = await api.get(`/polls/${poolId}/games`)
      setGames(response.data.games)

    } catch (error) {
      toast.show({
        title: 'Não foi possivel carregar os jogos',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  async function handleGuessConfirm(gameId:string) {
    try {
      if(!firstTeamPoints.trim() || !secondTeamPoints.trim()){
        return toast.show({
          title: 'Informe o seu palpite',
          placement: 'top',
          bgColor: 'red.500'
        })
      }

      await api.post(`/polls/${poolId}/games/${gameId}/guesses`,{
        firstTeamPoints: Number(firstTeamPoints),
        secondTeamPoints: Number(secondTeamPoints)
      })

      toast.show({
        title: 'Palpite enviado com sucesso',
        placement: 'top',
        bgColor: 'green.500'
      })

      fetchGames()
    } catch (error) {
      toast.show({
        title: 'Não foi possivel confirmar o palpite',
        placement: 'top',
        bgColor: 'red.500'
      })
    }
  }

  useEffect(() => {
    fetchGames()
  },[poolId])

  return (
    <VStack>
          {
      isLoading ? <Loading/> :
        <FlatList
          data={games}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <Game
              data={item}
              setFirstTeamPoints={setFirstTeamPoints}
              setSecondTeamPoints={setSecondTeamPoints}
              onGuessConfirm={() => {handleGuessConfirm(item.id)}}
            />
          )}
          px={1}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 48 }}
          ListEmptyComponent={<EmptyMyPoolList code={code}/>}
        />}
    </VStack>
  );
}

import { Octicons } from "@expo/vector-icons";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { FlatList, Icon, useToast, VStack } from "native-base";
import { useCallback, useState } from "react";
import { Button } from "../components/Button";
import { EmptyPoolList } from "../components/EmptyPoolList";
import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { PoolCard, PoolPros } from "../components/PoolCard";
import { api } from "../services/api";

export function Polls(){
  const toast = useToast()
  const {navigate} = useNavigation()
  const [isLoading, setIsLoading] = useState(true)
  const [polls, setPolls] = useState<PoolPros[]>([])

  async function fetchPolls() {
    try {
      setIsLoading(true)
      const response = await api.get('/polls')
      setPolls(response.data.polls)

    } catch (error) {
      toast.show({
        title: 'Não foi possivel carregar os bolões',
        placement: 'top',
        bgColor: 'red.500'
      })
    } finally {
      setIsLoading(false)
    }
  }

  useFocusEffect(useCallback(() => {
    fetchPolls()
  },[]))

  return(
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões"/>
      <VStack mt={6} mx={5} borderBottomWidth={1} borderBottomColor="gray.600" pb={4} mb={4}>
        <Button
          title="BUSCAR BOLÃO PELO CÓDIGO"
          leftIcon={<Icon as={Octicons} name="search" color="black" size="md"/>}
          onPress={() => navigate('find')}
        />
      </VStack>

      {
        isLoading ? <Loading/> :
          <FlatList
            data={polls}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <PoolCard 
                data={item}
                onPress={() => navigate('details',{ id: item.id })}
              />
            )}
            px={5}
            showsVerticalScrollIndicator={false}
            _contentContainerStyle={{ pb: 24 }}
            ListEmptyComponent={() => <EmptyPoolList/>}
          />}
    </VStack>
  )
}

import { api } from '../lib/axios';

export async function loadData(){
  const [poolCountResponse,guessCountResponse, userCountResponse] = await Promise.all([
    api.get('polls/count'),
    api.get('guesses/count'),
    api.get('users/count')
  ])

  return {
    response: {
      poolCountResponse,
      guessCountResponse,
      userCountResponse
    }
  }
}

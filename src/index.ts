export { Fexios } from '@/Fexios'
import { Fexios } from '@/Fexios'

const fexios = new Fexios()

const response = await fexios.get<{ message: string }>('https://api.example.com/hello')

if (response.ok) {
  console.log(response.data.message)
}

console.log(response.data)

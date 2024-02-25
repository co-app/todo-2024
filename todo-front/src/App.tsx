import { useEffect, useState } from 'react'
import './App.css'

const MOCK_NAMES : Record<string, string>= {
  "boyoon" : "김보윤",
  "jae" : "임재혁",
  "dong" : "이동규"
}

interface mockParams {
  total: number
  finish: number
  mdPath: string
  email : string
}

function App() {
  const [todos, setTodos] = useState<Record<string, mockParams> | undefined>({})

  useEffect(() => {
    const existMockJson = async () => {
      for (const jsonName of Object.keys(MOCK_NAMES)) {
        await fetch(`mocks/${jsonName}.json`)
          .then((res) => res.json())
          .then((res) => {
            setTodos((prevTodos = {}) => ({
              ...prevTodos,
              [`${jsonName}`]: res,
            }))
          })
      }
    }

    existMockJson()
  }, [])

  const calculatorProgress = (total: number, finish: number): number => {
    const res = Math.floor(total / finish)
    return res === Infinity ? 0 : res
  }

  // 독려 (하루에 한번)
  const sendToEmailEncourage = (email : string) =>{
    console.log("encourage")
  }

  // 구박 (하루에 한번)
  const sendToEmailScold =(email : string) =>{
    console.log("scold")
  }
  
  // 칭찬 (하루에 한번)
  const sendToEmailPraise = (email : string) =>{
    console.log("praise")
  }
  

  return (
    <div style={{ display: 'flex', flexDirection: 'row', flex: 3 }}>
      {todos &&
        Object.keys(MOCK_NAMES).map((name) => {
          const username = MOCK_NAMES[name] 
          const todoRes = todos[name]

          return (
            <div key={name} style={{ width: '33%', padding: '10px' }}>
              <h2>{username}</h2>
              <h2>진행률 : {calculatorProgress(todoRes?.total, todoRes?.finish)} %</h2>
              <h3>전체 Task : {todoRes?.total}</h3>
              <h3>완료 Task : {todoRes?.finish}</h3>
              <a href={todoRes?.mdPath} target='_blank'> Github Detail</a>
              <div style={{display: 'flex', flexDirection: 'row'}}>
                <button onClick={() => sendToEmailEncourage(todoRes.email)}>독려하기</button>
                <button onClick={() => sendToEmailScold(todoRes.email)}>구박하기</button>
                <button onClick={() => sendToEmailPraise(todoRes.email)}>칭찬하기</button>
              </div>
            </div>
          )
        })}
    </div>
  )
}

export default App

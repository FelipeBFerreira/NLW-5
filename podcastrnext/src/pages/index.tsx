import { useEffect } from "react";
import { Header } from "../components/Header";

export default function Home(props) {



return ( 
  <div>
  <h1>index</h1>
  <p>{JSON.stringify(props.epidodes)}</p>
  </div>
)
}

export async function getStaticProps(){
  const response = await fetch('http://localhost:3333/episodes')
  const data = await response.json()

  return{ 
    props:{
      epidodes: data,
    },
    /* Programa a atualização da pagina calculando o tempo abaixo*/
    revalidate: 60 * 60 * 8,
  }
}

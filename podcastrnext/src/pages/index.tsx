import { GetStaticProps } from 'next';
import { api } from '../services/api';
import Image from 'next/image';
import Head from 'next/head';
import Link from 'next/link';
import { format, parseISO } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import { durationParseToString } from '../utils/durationparseToString';
import styles from './home.module.scss';
import { usePLayer } from '../contexts/PlayerContext';


type Episode = {
  id: string,
  title: string,
  members: string,
  published_at: string,
  thumbnail: string,
  description: string,
  publishedAt: string,
  url: string,
  type: string,
  durationAsString: string,
  duration: number,

}

type HomeProps = {

  latesEpisodes: Episode[];
  allEpisodes: Episode[];

}

export default function Home({ latesEpisodes, allEpisodes }: HomeProps) {

  const { playList } = usePLayer();

  const episodeList = [...latesEpisodes, ...allEpisodes];

  return (

    <div className={styles.homepage}>
      <Head>
        <title>Home | Podcastr</title>
      </Head>
      <section className={styles.latestEpisodes}>
        <h2>Ultimos Lançamentos</h2>
        <ul>
          {latesEpisodes.map((episode, index) => {
            return (
              /*Key usando para melhora performarce do react na hora de indexa os components*/
              <li key={episode.id}>
                <Image
                  width={192}
                  height={192}
                  src={episode.thumbnail}
                  alt={episode.title}
                />

                <div className={styles.episodeDetails}>
                  <Link href={`/episodes/${episode.id}`}>
                    <a >{episode.title}</a>
                  </Link>
                  <p>{episode.members}</p>
                  <span>{episode.publishedAt}</span>
                  <span>{episode.durationAsString}</span>
                </div>

                <button type="button" onClick={() => playList(episodeList, index)}>
                  <img src="/play-green.svg" alt="Toca Episode" />
                </button>

              </li>
            )

          })}
        </ul>

      </section>

      <section className={styles.allEpisodes}>
        <h2>Todos Episodeos</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th>Poscast</th>
              <th>Integramtes</th>
              <th>Data</th>
              <th>Duração</th>
            </tr>
          </thead>
          <tbody>
            {allEpisodes.map((episode, index) => {
              return (

                <tr key={episode.id}>
                  <td style={{ width: 72 }}><Image
                    width={120}
                    height={120}
                    src={episode.thumbnail}
                    alt={episode.title}
                    objectFit="cover"
                  />
                  </td>

                  <td>
                    <Link href={`/episodes/${episode.id}`}>
                      <a >{episode.title}</a>
                    </Link>
                  </td>
                  <td>{episode.members}</td>
                  <td style={{ width: 105 }}>{episode.publishedAt}</td>
                  <td>{episode.durationAsString}</td>
                  <td>
                    <button type="button" onClick={() => playList(episodeList, index + latesEpisodes.length)}>
                      <img src="/play-green.svg" alt="Tocar Episode" />
                    </button>
                  </td>



                </tr>


              )
            })}

          </tbody>
        </table>

      </section>
    </div>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const { data } = await api.get('episodes', {
    params: {
      _limit: 12,
      _sort: 'published_at',
      _order: 'desc'
    }
  })


  const episodes = data.map(episode => {
    return {
      id: episode.id,
      title: episode.title,
      thumbnail: episode.thumbnail,
      members: episode.members,
      publishedAt: format(parseISO(episode.published_at), 'd MMM yy', { locale: ptBR }),
      duration: Number(episode.file.duration),
      durationAsString: durationParseToString(Number(episode.file.duration)),
      description: episode.description,
      url: episode.file.url
    };
  })

  const latesEpisodes = episodes.slice(0, 2);
  const allEpisodes = episodes.slice(2, episodes.length)

  return {
    props: {
      latesEpisodes,
      allEpisodes,
    },
    /* Programa a atualização da pagina calculando o tempo abaixo*/
    revalidate: 60 * 60 * 8,
  }
}

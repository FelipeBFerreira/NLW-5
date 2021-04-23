import {  useRef, useEffect, useState } from 'react';
import {  usePLayer} from '../../contexts/PlayerContext';
import styles from './styles.module.scss';
import Image from 'next/image';
import Slider from 'rc-slider';
import { durationParseToString } from '../../utils/durationparseToString';
import 'rc-slider/assets/index.css';

export function Player() {

    const audioRef = useRef<HTMLAudioElement>(null);
    const [progress , setProgress] = useState(0);

    const { 
        episodeList, 
        currentEpisodeIndex, 
        isPlaying, 
        togglePlay, 
        setIsPlayingState,
        playNext,
        playProvious,
        hasNext,
        hasPrevious,
        isLooping,
        toggleLoop,
        isShuffling,
        toggleShuffle,
        clearPlayerState

    } = usePLayer();

    useEffect(() => {
        if (!audioRef.current) {
            return;
        }
        if(isPlaying) {
            audioRef.current.play();
        }else{
            audioRef.current.pause();
        }
    }, [isPlaying])

    	function setupProgressListener(){
                audioRef.current.currentTime = 0;
                audioRef.current.addEventListener(`timeupdate`, () => {
                    setProgress(Math.floor(audioRef.current.currentTime));
                })
        }
    const episode = episodeList[currentEpisodeIndex];

    function handleSeek(amount: number){
          audioRef.current.currentTime = amount;  
          setProgress(amount);

    }

    function handleEpisodeEnded(){
        if(hasNext){
            playNext();
        }else{
            clearPlayerState();
        }
    }

    return (

        <div className={styles.playerContainer}>
            <header>
                <img src="/playing.svg" alt="Tocando Agora" />
                <strong>Tocando Agora {episode?.title} </strong>

            </header>

            { episode ? (

                <div className={styles.currentEpisode}>
                    <Image
                        width={592}
                        height={592}
                        src={episode.thumbnail}
                        objectFit="cover"
                    />
                    <strong>{episode.title}</strong>
                    <span>{episode.members}</span>
                </div>

            ) :
                (
                    <div className={styles.emptyPlayer}>
                        <strong>Selecione um postcast para ouvir</strong>
                    </div>
                )}
            <footer className={!episode ? styles.empty : ''}>
                <div className={styles.progress}>
                    <span><span>{durationParseToString(progress)}</span></span>

                    <div className={styles.slider}>
                        {episode ? (
                            <Slider
                                max={episode.duration}
                                value={progress}
                                onChange={handleSeek}
                                trackStyle={{ backgroundColor: '#04d361' }}
                                railStyle={{ background: '#9f75ff' }}
                                handleStyle={{ borderColor: '#04d361', borderWidth: 4 }} />
                        ) : (
                            <div className={styles.emptySlider} />
                        )}

                    </div>
                    <span><span>{durationParseToString(episode?.duration ?? 0)}</span></span>
                </div>

                {episode && (

                    <audio
                        src={episode.url}
                        ref={audioRef}
                        autoPlay
                        onEnded={handleEpisodeEnded}
                        onLoadedMetadata={setupProgressListener}
                        loop={ isLooping}
                        onPlay={ () => setIsPlayingState(true)}
                        onPause={ () => setIsPlayingState(false)}
                    />
                )}


                <div className={styles.buttons}>

                    <button type="button" 
                    className={isShuffling ? styles.isActive : ''}
                    onClick={toggleShuffle}
                    disabled={!episode || episodeList.length === 1}>
                        <img src="/shuffle.svg" alt="Embaralhar" />
                    </button>
                    <button type="button" onClick={playProvious}  disabled={!episode || !hasPrevious}>
                        <img src="/play-previous.svg" alt="Tocar Anterior" />
                    </button>
                    <button type="button" className={styles.playButton} disabled={!episode} onClick={togglePlay}>

                        {isPlaying ?
                            <img src="/pause.svg" alt="Tocar" />
                            :
                            <img src="/play.svg" alt="Tocar" />
                        }

                    </button>
                    <button type="button" onClick={playNext} disabled={!episode || !hasNext}>
                        <img src="/play-next.svg" alt="Tocar proxima" />
                    </button>
                    <button type="button" 
                    className={ isLooping ? styles.isActive : ''}
                    onClick={toggleLoop} 
                    disabled={!episode}>
                        <img src="/repeat.svg" alt="repetir" />
                    </button>
                </div>
            </footer>
        </div >
    );

}
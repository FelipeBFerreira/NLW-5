import { createContext } from 'react';

type Episode = {

    title: string;
    members: string;
    thumbnail: string;
    duration: number;
    url: string;

};

type PlayerContextData = {

    episodeList: Episode[];
    currentEpisodeIndex: number;
    isPlaying: boolean;
    play: (epidode : Episode) => void;
    setIsPlayingState: ( state : boolean ) => void;
    togglePlay: () => void;

};

export const PlayerContext = createContext({} as PlayerContextData);
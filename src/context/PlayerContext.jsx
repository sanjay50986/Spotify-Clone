import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

const PlayerContextProvider = (props) => {
    const audioRef = useRef()
    const seekBg = useRef()
    const seekBar = useRef()

    const [track, settrack] = useState(songsData[0]);
    const [playStaus, setplayStaus] = useState(false);
    const [time, settime] = useState({
        currentTime: {
            second:0,
            minute:0
        },

        totalTime: {
            second: 0,
            minute: 0
        }
    })

    function play() {
        audioRef.current.play();
        setplayStaus(true)

    }

    function pause() {
        audioRef.current.pause()
        setplayStaus(false)
    }

    const playWithId = async (id) => {
        await settrack(songsData[id])
        await audioRef.current.play()
    }

    async function previous() {
        if(track.id > 0) {
            await settrack(songsData[track.id-1])
            await audioRef.current.play()
            setplayStaus(true)
        }
    }

    async function next() {
        if(track.id < songsData.length-1) {
            await settrack(songsData[track.id+1])
            await audioRef.current.play()
            setplayStaus(true)
        }
    }

    async function seekSong(e) {
        audioRef.current.currentTime = ((e.nativeEvent.offsetX / seekBg.current.offsetWidth) * audioRef.current.duration)
    }

    useEffect(() => {
        setTimeout(() => {
            audioRef.current.ontimeupdate = () => {
                seekBar.current.style.width = (Math.floor(audioRef.current.currentTime / audioRef.current.duration*100))+"%"
                settime({
                    currentTime: {
                        second: Math.floor(audioRef.current.currentTime % 60),
                        minute: Math.floor(audioRef.current.currentTime / 60),
                    },
            
                    totalTime: {
                        second: Math.floor(audioRef.current.duration % 60),
                        minute: Math.floor(audioRef.current.duration / 60),
                    }
                })
            }
        }, 1000);
    },[audioRef])

    const contextValue = {
        audioRef,
        seekBar,
        seekBg,
        track,settrack,
        playStaus,setplayStaus,
        time,settime,
        play, pause,
        playWithId,
        previous,
        next,
        seekSong

    }

    return (
        <PlayerContext.Provider value={contextValue}>
            {props.children}
        </PlayerContext.Provider>
    )
}

export default PlayerContextProvider
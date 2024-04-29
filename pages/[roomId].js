import { useSocket } from "@/context/socket"
import usePeer from "@/hooks/usePeer"
import { useEffect } from "react"
import useMediaStream from "@/hooks/useMediaStream"
import usePlayer from "@/hooks/usePlayer"
import Player from "@/components/Player"

const Room = () => {
    const socket = useSocket();
    const {peer, myId} = usePeer();
    const {stream} = useMediaStream()
    const {players, setPlayers} = usePlayer();

    useEffect(() => {
        if (!socket || !peer || !stream) return;
        const handleUserConnected = (newUser) => {
            console.log(`user connected with user id ${newUser}`)

            const call = peer.call(newUser, stream)

            call.on('stream', (incomingStream) => {
                console.log(`Incoming Stream From Someone ${newUser}`)
                setPlayers((prev) => ({
                    ...prev,
                    [newUser]: {
                        url: incomingStream,
                        muted: false,
                        playing: true
                    }
                }))
            })
        }
        socket.on('user-connected', handleUserConnected)

        return () => {
            socket.off('user-connected', handleUserConnected)
        }
    },[peer, setPlayers, socket, stream])

    useEffect(() => {
        if (!peer || !stream) return
        peer.on('call', (call) => {
            const {peer: callerId} = call;
            call.answer(stream)

            call.on('stream', (incomingStream) => {
                console.log(`Incoming Stream From Someone ${callerId}`)
                setPlayers((prev) => ({
                    ...prev,
                    [callerId]: {
                        url: stream,
                        muted: false,
                        playing: true
                    }
                }))
            })
        })
    }, [peer, stream, setPlayers])

    useEffect(() => {
        if(!stream || !myId) return;
        console.log(`setting my stream ${myId}`)
        setPlayers((prev) => ({
            ...prev,
            [myId]: {
                url: stream,
                muted: false,
                playing: true
            }
        }))
    }, [myId, setPlayers, stream])

    return (
        <>
        {Object.keys(players).map((playerId) => {
            const {url, muted, playing} = players[playerId]
            return ( 
            <Player key={playerId} url={url} muted={muted} playing={playing} />
        )
        })}
        
        </>
    )

}

export default Room;